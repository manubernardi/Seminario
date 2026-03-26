import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Not, Repository } from 'typeorm';
import { EmpleadoEntity } from '../entities/empleado.entity';
import { RoleEntity } from '../entities/roles.entity';
import { CreateEmpleadoDto } from '../dto/createEmpleado.dto';
import { UpdateEmpleadoDto } from '../dto/update-empleado.dto';

@Injectable()
export class EmpleadoService {
  constructor(
    @InjectRepository(EmpleadoEntity)
    private readonly empleadoRepository: Repository<EmpleadoEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async create(data: CreateEmpleadoDto): Promise<EmpleadoEntity> {
    console.log("Service", data);
    try {
      // Buscar el rol por ID
      const rol = await this.roleRepository.findOne({
        where: { id: data.rol_id }
      });

      if (!rol) {
        throw new BadRequestException(`El rol con ID ${data.rol_id} no existe`);
      }

      // Crear el empleado sin incluir rol_id en los datos
      const { rol_id, ...empleadoData } = data;
      const empleado = this.empleadoRepository.create({
        ...empleadoData,
        rol
      });

      return await this.empleadoRepository.save(empleado);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El dni ya existe');
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

  async findOne(dni: string): Promise<EmpleadoEntity> {
    const empleado = await this.empleadoRepository.findOne({
      where: { dni },
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
      throw new NotFoundException(`Empleado con DNI ${dni} no encontrado`);
    }

    return empleado;
  }

  async findByDni(dni: string): Promise<EmpleadoEntity> {
    const empleado = await this.empleadoRepository.findOne({
      where: { dni },
      relations: {
        rol: {
          permissions: true
        }
      }
    });

    if (!empleado) {
      throw new NotFoundException(`Empleado con dni ${dni} no encontrado`);
    }

    return empleado;
  }

  async update(id: string, updateEmpleadoDto: UpdateEmpleadoDto): Promise<EmpleadoEntity> {
    const empleado = await this.findOne(id);
    
    try {
      Object.assign(empleado, updateEmpleadoDto);
      return await this.empleadoRepository.save(empleado);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El dni ya existe');
      }
      throw error;
    }
  }

  async remove(dni: string): Promise<void> {
    const empleado = await this.findOne(dni);
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

  async getVentasPorEmpleado(empleadoDni: string, fechaInicio?: Date, fechaFin?: Date) {
    const whereCondition: any = { empleado: { dni: empleadoDni } };
    
    if (fechaInicio && fechaFin) {
      whereCondition.fecha = Between(fechaInicio, fechaFin);
    }

    return await this.empleadoRepository.findOne({
      where: { dni: empleadoDni },
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