import { Injectable } from '@nestjs/common';
import { VentaEntity } from 'src/entities/venta.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VentasService {
    constructor(private readonly ventasRepository: Repository<VentaEntity>){}
    async findAll(): Promise<VentaEntity[]> {
        return this.ventasRepository.find();
    }
    
    async create(createData: Partial<VentaEntity>): Promise<VentaEntity> {
        const newVenta = this.ventasRepository.create(createData);
        return this.ventasRepository.save(newVenta);
    }

    async update(numVenta: string, updateData: Partial<VentaEntity>): Promise<VentaEntity | null> {
        await this.ventasRepository.update(numVenta, updateData);
        return this.ventasRepository.findOne({ where: { numVenta: parseInt(numVenta, 10) } });
    }
}
