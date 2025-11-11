import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { PrendaEntity } from '../entities/prenda.entity';
import { CreatePrendaDto } from '../dto/createPrenda.dto';
import { CreatePrendaXTalleDto } from '../dto/createPrendaXTalle.dto';
import { PrendaXTalleEntity } from '../entities/prendaXTalleEntity';
import { TalleEntity } from '../entities/talle.entity';
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
  const prenda = this.prendaRepository.create({
    codigo: dto.codigo,
    descripcion: dto.descripcion,
    precio: dto.precio,
  });

  if (dto.prendasXTalles && dto.prendasXTalles.length > 0) {
    prenda.prendasXTalles = [];

    for (const item of dto.prendasXTalles) {
      const talle = await this.TalleRepository.findOneBy({ codigo: item.talle_id });
      if (!talle) {
        throw new NotFoundException(`Talle ID ${item.talle_id} no encontrado`);
      }

      const rel = new PrendaXTalleEntity();
      rel.talle = talle;
      rel.cantidad = item.cantidad;

      prenda.prendasXTalles.push(rel);
    }
  }

  return await this.prendaRepository.save(prenda);
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
    let totalPrendas = 0;
    for (const prenda of await this.prendaRepository.find()) {
        totalPrendas += await this.getTotalStock(prenda.codigo);
    }

    let stockBajo = 0;
    for (const prenda of await this.prendaRepository.find()) {
        if (await this.getTotalStock(prenda.codigo) < 5 && await this.getTotalStock(prenda.codigo) > 0) stockBajo++;
    }


    let sinStock = 0;
    for (const prenda of await this.prendaRepository.find()) {
        if (await this.getTotalStock(prenda.codigo) === 0) sinStock++;
    }

        /*const valorTotalInventario = await this.prendaRepository
            .createQueryBuilder('prenda')
            .select('SUM(prenda.precio * prenda.cantidad)', 'total')
            .getRawOne();*/

        return {
            totalPrendas,
            stockBajo,
            sinStock,
           //    valorTotalInventario: parseFloat(valorTotalInventario.total) || 0,
            fechaActualizacion: new Date().toISOString()
        };
    }
    async getTotalStock(prenda_codigo: string): Promise<number> {
        let stock = 0;
        for (const talle of await this.TalleRepository.find()) {
            const prendaXTalle = await this.prendaXTalleRepository.findOneBy({ prenda_codigo, talle_id: talle.codigo });
            if (prendaXTalle) {
                stock += prendaXTalle.cantidad;
            }
        }
        return stock;
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