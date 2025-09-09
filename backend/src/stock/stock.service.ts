import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PrendaEntity } from '../entities/prenda.entity';
import { Repository } from 'typeorm';
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
        const newPrenda = this.prendaRepository.create(createPrendaDto);
        return this.prendaRepository.save(newPrenda);
    }

    async update(codigo: string, updateData: Partial<PrendaEntity>): Promise<PrendaEntity | null> {
        await this.prendaRepository.update(codigo, updateData);
        return this.prendaRepository.findOne({ where: { codigo } });
    }
}