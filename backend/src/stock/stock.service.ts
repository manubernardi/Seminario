import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { PrendaEntity } from '../entities/prenda.entity';
import { CreatePrendaDto } from '../dto/createPrenda.dto';

@Injectable()
export class StockService {
    constructor(
    @InjectRepository(PrendaEntity)
    private readonly prendaRepository: Repository<PrendaEntity>,
    ) {}

    async findAll(): Promise<PrendaEntity[]> {
        return this.prendaRepository.find();
    }

    async create(createPrendaDto: CreatePrendaDto): Promise<PrendaEntity> {
                // Validar que el código no exista
        const existente = await this.prendaRepository.findOne({
            where: { codigo: createPrendaDto.codigo }
        });

        if (existente) {
            throw new BadRequestException(`Ya existe una prenda con código ${createPrendaDto.codigo}`);
        }
        const newPrenda = this.prendaRepository.create(createPrendaDto);
        return this.prendaRepository.save(newPrenda);
    }

    async update(codigo: string, updateData: Partial<PrendaEntity>): Promise<PrendaEntity | null> {
        await this.prendaRepository.update(codigo, updateData);
        return this.prendaRepository.findOne({ where: { codigo } });
    }


    // Obtener prenda por código
    async getPrendaByCodigo(codigo: string): Promise<PrendaEntity> {
        const prenda = await this.prendaRepository
            .createQueryBuilder('prenda')
            .leftJoinAndSelect('prenda.talle', 'talle')
            .where('prenda.codigo = :codigo', { codigo })
            .getOne();

        if (!prenda) {
            throw new NotFoundException(`Prenda con código ${codigo} no encontrada`);
        }

        return prenda;
    }

    // Crear nueva prenda
    async createPrenda(prendaData: Partial<PrendaEntity>): Promise<PrendaEntity> {
        // Validar que el código no exista
        const existente = await this.prendaRepository.findOne({
            where: { codigo: prendaData.codigo }
        });

        if (existente) {
            throw new BadRequestException(`Ya existe una prenda con código ${prendaData.codigo}`);
        }

        // Validar datos requeridos
        if (!prendaData.codigo || !prendaData.descripcion || !prendaData.precio) {
            throw new BadRequestException('Código, descripción y precio son requeridos');
        }

        const nuevaPrenda = this.prendaRepository.create({
            ...prendaData,
            cantidad: prendaData.cantidad || 0
        });

        return await this.prendaRepository.save(nuevaPrenda);
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
        
        await this.prendaRepository.remove(prenda);
        
        return { mensaje: `Prenda ${codigo} eliminada correctamente` };
    }

    // Prendas con stock bajo
    async getPrendasBajoStock(cantidadMinima: number): Promise<PrendaEntity[]> {
        return await this.prendaRepository
            .createQueryBuilder('prenda')
            .leftJoinAndSelect('prenda.talle', 'talle')
            .where('prenda.cantidad <= :cantidad', { cantidad: cantidadMinima })
            .orderBy('prenda.cantidad', 'ASC')
            .getMany();
    }

    // Ajustar stock
    async ajustarStock(codigo: string, ajuste: number, motivo: string): Promise<PrendaEntity> {
        const prenda = await this.getPrendaByCodigo(codigo);
        
        const nuevaCantidad = prenda.cantidad + ajuste;
        
        if (nuevaCantidad < 0) {
            throw new BadRequestException('La cantidad resultante no puede ser negativa');
        }

        prenda.cantidad = nuevaCantidad;
        
        // Aquí podrías agregar un log de movimientos de stock
        console.log(`Stock ajustado - Código: ${codigo}, Ajuste: ${ajuste}, Motivo: ${motivo}, Nueva cantidad: ${nuevaCantidad}`);
        
        return await this.prendaRepository.save(prenda);
    }

    // Estadísticas para dashboard
    async getDashboardStats(): Promise<any> {
        const totalPrendas = await this.prendaRepository.count();
        
        const stockBajo = await this.prendaRepository.count({
            where: { cantidad: 5 } // Menos de 5 unidades
        });

        const sinStock = await this.prendaRepository.count({
            where: { cantidad: 0 }
        });

        const valorTotalInventario = await this.prendaRepository
            .createQueryBuilder('prenda')
            .select('SUM(prenda.precio * prenda.cantidad)', 'total')
            .getRawOne();

        return {
            totalPrendas,
            stockBajo,
            sinStock,
            valorTotalInventario: parseFloat(valorTotalInventario.total) || 0,
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

    // Reducir stock (para cuando se hace una venta)
    async reducirStock(codigo: string, cantidad: number): Promise<PrendaEntity> {
        const prenda = await this.getPrendaByCodigo(codigo);
        
        if (prenda.cantidad < cantidad) {
            throw new BadRequestException(`Stock insuficiente. Disponible: ${prenda.cantidad}, Solicitado: ${cantidad}`);
        }

        prenda.cantidad -= cantidad;
        return await this.prendaRepository.save(prenda);
    }
}