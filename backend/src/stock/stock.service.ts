import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrendaEntity } from '../entities/prenda.entity';
import { CreatePrendaDto } from '../dto/createPrenda.dto';
import { PrendaXTalleEntity } from '../entities/prendaXTalleEntity';
import {TipoPrendaEntity} from '../entities/tipoPrenda.entity'

@Injectable()
export class StockService {
    constructor(
    @InjectRepository(PrendaEntity)
    private readonly prendaRepository: Repository<PrendaEntity>,
    @InjectRepository(PrendaXTalleEntity)
    private readonly prendaXTalleRepository: Repository<PrendaXTalleEntity>,
    @InjectRepository(TipoPrendaEntity)
    private readonly tipoPrendaRepository: Repository<TipoPrendaEntity>
    ) {}

    async findAll(): Promise<PrendaEntity[]> {
        const prendas = await this.prendaRepository.find({
            where: { activo: true },
            relations: {
                prendasXTalles: true
            }
        });

        return prendas.map((prenda) => ({
            ...prenda,
            cantidadTotal: prenda.prendasXTalles?.reduce(
            (total, item) => total + (item.cantidad || 0),
            0
            ) || 0,
        }));
    }

    // Obtener prenda por código
    async getPrendaByCodigo(codigo: string): Promise<PrendaEntity> {
        const prenda = await this.prendaRepository.findOne({
            where: { codigo, activo: true },
            relations: { prendasXTalles: true }
        });
        if (!prenda) {
            throw new NotFoundException(`Prenda con código ${codigo} no encontrada`);
        }
        return prenda;
    }

    // Crear nueva prenda
    async create(dto: CreatePrendaDto): Promise<PrendaEntity> {
        // 1. Verificar que el tipo existe y está activo
        const tipo = await this.tipoPrendaRepository.findOne({ 
            where: { id: dto.tipoPrendaId } 
        });
        if (!tipo) throw new NotFoundException(`Tipo de prenda con id ${dto.tipoPrendaId} no encontrado`);
        if (!tipo.activo) throw new BadRequestException(`El tipo "${tipo.nombre}" está inactivo`);
        if (!tipo.talles || tipo.talles.length === 0) {
            throw new BadRequestException(`El tipo "${tipo.nombre}" no tiene talles configurados`);
        }

        // 2. Crear la prenda
        const prenda = this.prendaRepository.create({
            codigo: dto.codigo,
            descripcion: dto.descripcion,
            precio: dto.precio,
            tipo_prenda_id: dto.tipoPrendaId,
        });

        // 3. Generar un PrendaXTalle por cada talle del tipo (cantidad inicial = 0)
        prenda.prendasXTalles = tipo.talles.map(talle => {
            const pxt = new PrendaXTalleEntity();
            pxt.prenda_codigo = dto.codigo;
            pxt.talle_id = talle.codigo;
            pxt.cantidad = 0;
            return pxt;
        });

        return await this.prendaRepository.save(prenda); // cascade:true guarda los PrendaXTalle solos
    }

    // Actualizar prenda
    async updatePrenda(codigo: string, prendaData: Partial<PrendaEntity>): Promise<PrendaEntity> {
        const prenda = await this.getPrendaByCodigo(codigo);
        // Actualizar campos
        Object.assign(prenda, prendaData);
        return await this.prendaRepository.save(prenda);
    }

    // Eliminar prenda
    async deletePrenda(codigo: string): Promise<{ mensaje: string }> {
        const prenda = await this.getPrendaByCodigo(codigo);
        
        prenda.activo = false;
        await this.prendaRepository.save(prenda);
        
        return { mensaje: `Prenda ${codigo} dada de baja correctamente` };
    }

    // Ajustar stock
    async ajustarStock(codigo: string, ajuste: number, talle_id: number): Promise<void> {
        const result = await this.prendaXTalleRepository
            .createQueryBuilder()
            .update(PrendaXTalleEntity)
            .set({
                cantidad: () => "cantidad + :ajuste"
            })
            .where("prenda_codigo = :codigo", { codigo })
            .andWhere("talle_id = :talle_id", { talle_id })
            .andWhere("cantidad + :ajuste >= 0", { ajuste })
            .execute();

        if (result.affected === 0) {
            throw new BadRequestException(
                `Stock insuficiente para la prenda ${codigo} y talle ${talle_id}`
            );
        }
    }

    // Estadísticas para dashboard
   async getDashboardStats(): Promise<any> {
    const prendas = await this.prendaRepository.find({
        where: { activo: true },
        relations: { prendasXTalles: true }
    });

    let totalPrendas = 0;
    let stockBajo = 0;
    let sinStock = 0;
    const prendasStockBajo: { codigo: string, descripcion: string, stock: number }[] = [];
    const prendasSinStock: { codigo: string, descripcion: string }[] = [];

    for (const prenda of prendas) {
        const stock = prenda.prendasXTalles?.reduce((sum, pt) => sum + (pt.cantidad || 0), 0) ?? 0;
        totalPrendas += stock;
        if (stock === 0) {
            sinStock++;
            prendasSinStock.push({ codigo: prenda.codigo, descripcion: prenda.descripcion });
        } else if (stock < 5) {
            stockBajo++;
            prendasStockBajo.push({ codigo: prenda.codigo, descripcion: prenda.descripcion, stock });
        }
    }

    return {
        totalPrendas,
        stockBajo,
        sinStock,
        prendasStockBajo,   // ← lista de prendas con stock bajo
        prendasSinStock,    // ← lista de prendas sin stock
        fechaActualizacion: new Date().toISOString()
    };
}


     // Buscar prendas por descripción
    async buscarPrendas(termino: string): Promise<PrendaEntity[]> {
        return await this.prendaRepository
            .createQueryBuilder('prenda')
            .leftJoinAndSelect('prenda.talle', 'talle')
            .where('prenda.descripcion ILIKE :termino', { termino: `%${termino}%` })
            .orWhere('prenda.codigo ILIKE :termino', { termino: `%${termino}%` })
            .orderBy('prenda.descripcion', 'ASC')
            .getMany();
    }
}