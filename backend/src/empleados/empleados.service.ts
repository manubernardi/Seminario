import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { Repository } from 'typeorm';
import { EmpleadoEntity } from '../entities/empleado.entity';

@Injectable()
export class EmpleadosService {
    constructor(
    @InjectRepository(EmpleadoEntity)
    private readonly empleadoRepository: Repository<EmpleadoEntity>,
  ) {}

  async findAll(): Promise<EmpleadoEntity[]> {
    return await this.empleadoRepository.find({
      relations: ['rol', 'ventas']
    });
  }
}
