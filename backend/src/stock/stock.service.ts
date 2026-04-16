import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { PrendaEntity } from '../entities/prenda.entity';
import { CreatePrendaDto } from '../dto/createPrenda.dto';
import { CreatePrendaXTalleDto } from '../dto/createPrendaXTalle.dto';
import { PrendaXTalleEntity } from '../entities/prendaXTalleEntity';
import { TalleEntity } from '../entities/talle.entity';
import {TipoPrendaEntity} from '../entities/tipoPrenda.entity'
import { error } from 'console';

@Injectable()
export class StockService {
    constructor(
    @InjectRepository(PrendaEntity)
    private readonly prendaRepository: Repository<PrendaEntity>,
    @InjectRepository(PrendaXTalleEntity)
    private readonly prendaXTalleRepository: Repository<PrendaXTalleEntity>,
    @InjectRepository(TalleEntity)
    private readonly TalleRepository: Repository<TalleEntity>,
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

    // Prendas con stock bajo
   /*async getPrendasBajoStock(cantidadMinima: number): Promise<PrendaEntity[]> {
        return await this.prendaRepository
            .createQueryBuilder('prenda')
            .leftJoinAndSelect('prenda.talle', 'talle')
            .where('prenda.cantidad <= :cantidad', { cantidad: cantidadMinima })
            .orderBy('prenda.cantidad', 'ASC')
            .getMany();
    }
*/
    // Ajustar stock
async ajustarStock(codigo: string, ajuste: number, talle_id: number): Promise<PrendaXTalleEntity> {
    const prenda = await this.getPrendaByCodigo(codigo);
    const prendaXTalle = await this.prendaXTalleRepository.findOneBy({ prenda_codigo: codigo, talle_id });
    if (!prendaXTalle) {
        throw new NotFoundException(`La prenda ${codigo} no tiene stock para el talle ID ${talle_id}`);
    }

    const nuevaCantidad = prendaXTalle.cantidad + ajuste;

    if (nuevaCantidad < 0) {
        throw new BadRequestException('La cantidad resultante no puede ser negativa');
    }

    prendaXTalle.cantidad = nuevaCantidad;
    return await this.prendaXTalleRepository.save(prendaXTalle);
}

    // Estadísticas para dashboard
    async getDashboardStats(): Promise<any> {
        // Subconsulta: una fila por prenda con su stock total
        const stockPorPrenda = this.prendaRepository.manager
            .createQueryBuilder()
            .select('p.codigo', 'codigo')
            .addSelect('COALESCE(SUM(pxt.cantidad), 0)', 'total')
            .from(PrendaEntity, 'p')
            .leftJoin(PrendaXTalleEntity, 'pxt', 'pxt.prenda_codigo = p.codigo')
            .groupBy('p.codigo');
        
        const result = await this.prendaRepository.manager
        .createQueryBuilder()
        .select('SUM(stock.total)', 'totalPrendas')
        .addSelect(`
            SUM(CASE 
                WHEN stock.total < 5 AND stock.total > 0 
                THEN 1 ELSE 0 
            END)
        `, 'stockBajo')
        .addSelect(`
            SUM(CASE 
                WHEN stock.total = 0 
                THEN 1 ELSE 0 
            END)
        `, 'sinStock')
        .from('(' + stockPorPrenda.getQuery() + ')', 'stock')
        .setParameters(stockPorPrenda.getParameters())
        .getRawOne();

        return {
            totalPrendas: Number(result.totalPrendas) || 0,
            stockBajo: Number(result.stockBajo) || 0,
            sinStock: Number(result.sinStock) || 0,
            fechaActualizacion: new Date().toISOString()
        };
    }

    async getTotalStock(prenda_codigo: string): Promise<number> {
        const result = await this.prendaXTalleRepository
            .createQueryBuilder('pxt')
            .select('SUM(pxt.cantidad)', 'total')
            .where('pxt.prenda_codigo = :codigo', { codigo: prenda_codigo })
            .getRawOne();
        
        return parseInt(result.total) || 0;
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

    // Reducir stock (para cuando se hace una venta)
    async reducirStock(codigo: string, talle_id: number, cantidad: number): Promise<PrendaXTalleEntity> {
        const prenda = await this.prendaRepository.findOne({
            where: { codigo },
            relations: { prendasXTalles: true }
        });
        const prendaXTalle = await this.prendaXTalleRepository.findOneBy({ prenda_codigo: codigo, talle_id });
        if (!prendaXTalle) {
            throw new NotFoundException(`La prenda ${codigo} no tiene stock para el talle ID ${talle_id}`);
        }
        if (prendaXTalle.cantidad < cantidad) {
            throw new BadRequestException(`Stock insuficiente. Disponible: ${prendaXTalle.cantidad}, Solicitado: ${cantidad}`);
        }

        prendaXTalle.cantidad -= cantidad;
        return await this.prendaXTalleRepository.save(prendaXTalle);
    }
}