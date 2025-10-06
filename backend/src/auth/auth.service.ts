import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmpleadoEntity } from '../entities/empleado.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(EmpleadoEntity)
    private empleadoRepository: Repository<EmpleadoEntity>,
  ) {}

  async validateEmpleado(dni: string): Promise<EmpleadoEntity | null> {
    const empleado = await this.empleadoRepository.findOne({
      where: { dni },
      relations: ['rol'],
    });

    return empleado;
  }
}