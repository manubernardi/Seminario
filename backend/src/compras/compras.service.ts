// compras.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompraEntity } from '../entities/compra.entity';
import { DetalleCompraEntity } from '../entities/detalle.compra.entity';
import { EmpleadoEntity } from '../entities/empleado.entity';
import { ProveedorEntity } from '../entities/proveedor.entity';
import { PrendaEntity } from '../entities/prenda.entity';
import { PrendaXTalleEntity } from '../entities/prendaXTalleEntity';
import { CreateCompraDto } from '../dto/create-compra.dto';

@Injectable()
export class ComprasService {
  constructor(
    @InjectRepository(CompraEntity)
    private compraRepository: Repository<CompraEntity>,
    
    @InjectRepository(DetalleCompraEntity)
    private detalleCompraRepository: Repository<DetalleCompraEntity>,
    
    @InjectRepository(EmpleadoEntity)
    private empleadoRepository: Repository<EmpleadoEntity>,
    
    @InjectRepository(ProveedorEntity)
    private proveedorRepository: Repository<ProveedorEntity>,
    
    @InjectRepository(PrendaEntity)
    private prendaRepository: Repository<PrendaEntity>,
    
    @InjectRepository(PrendaXTalleEntity)
    private prendaXTalleRepository: Repository<PrendaXTalleEntity>,
  ) {}

  async create(createCompraDto: CreateCompraDto): Promise<CompraEntity> {
    // Validar empleado
    const empleado = await this.empleadoRepository.findOneBy({ 
      legajo: createCompraDto.empleadoLegajo 
    });
    
    if (!empleado) {
      throw new NotFoundException(
        `Empleado con legajo ${createCompraDto.empleadoLegajo} no encontrado`
      );
    }

    // Validar proveedor
    const proveedor = await this.proveedorRepository.findOneBy({ 
      id: createCompraDto.proveedorId 
    });
    
    if (!proveedor) {
      throw new NotFoundException(
        `Proveedor con ID ${createCompraDto.proveedorId} no encontrado`
      );
    }

    // Validar y calcular detalles
    let montoTotal = 0;
    const detalles: DetalleCompraEntity[] = [];

    for (const detalleDto of createCompraDto.detalles) {
      // Buscar la prenda
      const prenda = await this.prendaRepository.findOne({
        where: { codigo: detalleDto.codigoPrenda, activo: true }
      });

      if (!prenda) {
        throw new NotFoundException(
          `Prenda con código ${detalleDto.codigoPrenda} no encontrada o inactiva`
        );
      }

      // Buscar o crear PrendaXTalle
      let prendaXTalle = await this.prendaXTalleRepository.findOne({
        where: {
          prenda_codigo: detalleDto.codigoPrenda,
          talle_id: detalleDto.talleId
        }
      });

      if (!prendaXTalle) {
        // Si no existe, crear nueva relación con cantidad 0
        prendaXTalle = this.prendaXTalleRepository.create({
          prenda_codigo: detalleDto.codigoPrenda,
          talle_id: detalleDto.talleId,
          cantidad: 0
        });
      }

      // Actualizar stock (sumar porque es una compra)
      prendaXTalle.cantidad += detalleDto.cantidad;
      await this.prendaXTalleRepository.save(prendaXTalle);

      // Crear detalle
      const subtotal = detalleDto.precioUnitario * detalleDto.cantidad;
      const detalle = this.detalleCompraRepository.create({
        cantidad: detalleDto.cantidad,
        subtotal: subtotal,
        prenda: prenda
      });

      detalles.push(detalle);
      montoTotal += subtotal;
    }

    // Crear compra
    const nuevaCompra = this.compraRepository.create({
      fecha: new Date(),
      montoTotal: montoTotal,
      empleado: empleado,
      detalles: detalles
    });

    // Guardar todo junto (cascade hace el resto)
    const compraGuardada = await this.compraRepository.save(nuevaCompra);
    return compraGuardada;
  }

  async findAll(): Promise<CompraEntity[]> {
    return await this.compraRepository.find({
      relations: ['empleado', 'detalles', 'detalles.prenda']
    });
  }

  async findOne(numCompra: number): Promise<CompraEntity> {
    const compra = await this.compraRepository.findOne({
      where: { NumCompra: numCompra },
      relations: ['empleado', 'detalles', 'detalles.prenda']
    });

    if (!compra) {
      throw new NotFoundException(`Compra con número ${numCompra} no encontrada`);
    }

    return compra;
  }

  async findByEmpleado(legajo: number): Promise<CompraEntity[]> {
    return await this.compraRepository.find({
      where: { empleado: { legajo } },
      relations: ['empleado', 'detalles', 'detalles.prenda']
    });
  }

  async findByFecha(fechaInicio: Date, fechaFin: Date): Promise<CompraEntity[]> {
    return await this.compraRepository
      .createQueryBuilder('compra')
      .where('compra.fecha BETWEEN :inicio AND :fin', {
        inicio: fechaInicio,
        fin: fechaFin
      })
      .leftJoinAndSelect('compra.empleado', 'empleado')
      .leftJoinAndSelect('compra.detalles', 'detalles')
      .leftJoinAndSelect('detalles.prenda', 'prenda')
      .getMany();
  }
}