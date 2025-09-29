import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Not, Repository } from 'typeorm';
import { EmpleadoEntity } from '../entities/empleado.entity';
import { CreateEmpleadoDto } from '../dto/create-empleado.dto';
import { UpdateEmpleadoDto } from '../dto/update-empleado.dto';

@Injectable()
export class EmpleadoService {
  constructor(
    @InjectRepository(EmpleadoEntity)
    private readonly empleadoRepository: Repository<EmpleadoEntity>,
  ) {}

  async create(createEmpleadoDto: CreateEmpleadoDto): Promise<EmpleadoEntity> {
    try {
      const empleado = this.empleadoRepository.create(createEmpleadoDto);
      return await this.empleadoRepository.save(empleado);
    } catch (error) {
      if (error.code === '23505') { // Unique constraint violation
        throw new ConflictException('El legajo ya existe');
      }
      throw error;
    }
  }

  async findAll(): Promise<EmpleadoEntity[]> {
    return await this.empleadoRepository.find({
      relations: {
        rol: {
          permissions: true
        },
        ventas: true
      }
    });
  }

  async findOne(id: number): Promise<EmpleadoEntity> {
    const empleado = await this.empleadoRepository.findOne({
      where: { id },
      relations: {
        rol: {
          permissions: true
        },
        ventas: {
          detalles: {
            prenda: true
          },
          cliente: true
        }
      }
    });

    if (!empleado) {
      throw new NotFoundException(`Empleado con ID ${id} no encontrado`);
    }

    return empleado;
  }

  async findByLegajo(legajo: string): Promise<EmpleadoEntity> {
    const empleado = await this.empleadoRepository.findOne({
      where: { legajo },
      relations: {
        rol: {
          permissions: true
        }
      }
    });

    if (!empleado) {
      throw new NotFoundException(`Empleado con legajo ${legajo} no encontrado`);
    }

    return empleado;
  }

  async update(id: number, updateEmpleadoDto: UpdateEmpleadoDto): Promise<EmpleadoEntity> {
    const empleado = await this.findOne(id);
    
    try {
      Object.assign(empleado, updateEmpleadoDto);
      return await this.empleadoRepository.save(empleado);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El legajo ya existe');
      }
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    const empleado = await this.findOne(id);
    await this.empleadoRepository.remove(empleado);
  }

  async getEmpleadosConVentas(): Promise<EmpleadoEntity[]> {
  return await this.empleadoRepository
    .createQueryBuilder('empleado')
    .innerJoinAndSelect('empleado.ventas', 'ventas')
    .leftJoinAndSelect('empleado.rol', 'rol')
    .leftJoinAndSelect('ventas.cliente', 'cliente')
    .leftJoinAndSelect('ventas.detalles', 'detalles')
    .leftJoinAndSelect('detalles.prenda', 'prenda')
    .getMany();
}

  async getVentasPorEmpleado(empleadoId: number, fechaInicio?: Date, fechaFin?: Date) {
    const whereCondition: any = { empleado: { id: empleadoId } };
    
    if (fechaInicio && fechaFin) {
      whereCondition.fecha = Between(fechaInicio, fechaFin);
    }

    return await this.empleadoRepository.findOne({
      where: { id: empleadoId },
      relations: {
        ventas: {
          cliente: true,
          detalles: {
            prenda: true
          }
        }
      }
    });
  }
}