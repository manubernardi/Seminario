import { InjectRepository } from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ProveedorEntity } from '../entities/proveedor.entity';
import { CreateProveedorDto } from '../dto/create-proveedor.dto';

@Injectable()
export class ProveedoresService {
    constructor(
        @InjectRepository(ProveedorEntity)
        private readonly proveedoresRepository: Repository<ProveedorEntity>,
    ) {}

    async findAll() {
        return this.proveedoresRepository.find();
    }

    async create(createProveedorDto: CreateProveedorDto): Promise<ProveedorEntity> {
        const proveedor = this.proveedoresRepository.create(createProveedorDto);
        return this.proveedoresRepository.save(proveedor);
    }
    async remove(id: number): Promise<void> {
        await this.proveedoresRepository.delete(id);
    }
    async update(id: number, updateProveedorDto: Partial<CreateProveedorDto>): Promise<ProveedorEntity | null> {
        await this.proveedoresRepository.update(id, updateProveedorDto);
        return this.proveedoresRepository.findOneBy({ id });
    }
}   