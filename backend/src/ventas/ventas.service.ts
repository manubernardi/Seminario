import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Equal, Repository } from 'typeorm';
import { VentaEntity } from '../entities/venta.entity';
import { DetalleVentaEntity } from '../entities/detalle.venta.entity';
import { EmpleadoEntity } from '../entities/empleado.entity';
import { ClienteEntity } from '../entities/cliente.entity';
import { PrendaEntity } from '../entities/prenda.entity';
import { CreateVentaDto} from '../dto/create-venta.dto';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(VentaEntity)
    private ventaRepository: Repository<VentaEntity>,
    @InjectRepository(DetalleVentaEntity)
    private detalleVentaRepository: Repository<DetalleVentaEntity>,
    @InjectRepository(EmpleadoEntity)
    private empleadoRepository: Repository<EmpleadoEntity>,
    @InjectRepository(ClienteEntity)
    private clienteRepository: Repository<ClienteEntity>,
    @InjectRepository(PrendaEntity)
    private prendaRepository: Repository<PrendaEntity>,
  ) {}

  async create(createVentaDto: CreateVentaDto): Promise<VentaEntity> {
    // Validar empleado
    const empleado = await this.empleadoRepository.findOneBy({ id: createVentaDto.empleadoId });
    if (!empleado) {
      throw new NotFoundException(`Empleado con ID ${createVentaDto.empleadoId} no encontrado`);
    }

    // Validar cliente
    const cliente = await this.clienteRepository.findOneBy({ id: createVentaDto.clienteId });
    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${createVentaDto.clienteId} no encontrado`);
    }

    // Validar y calcular detalles
    let total = 0;
    const detalles: DetalleVentaEntity[] = [];

    for (const detalleDto of createVentaDto.detalles) {
      const prenda = await this.prendaRepository.findOne({
        where: { codigo: detalleDto.codigoPrenda }
      });

      if (!prenda) {
        throw new NotFoundException(`Prenda con código ${detalleDto.codigoPrenda} no encontrada`);
      }

      /*if (prenda.cantidad < detalleDto.cantidad) {
        throw new BadRequestException(
          `Stock insuficiente para la prenda ${prenda.descripcion}. Disponible: ${prenda.cantidad}`
        );
      }*/

      // Actualizar stock
      /*prenda.cantidad -= detalleDto.cantidad;
      await this.prendaRepository.save(prenda);*/

      // Crear detalle
      const subtotal = prenda.precio * detalleDto.cantidad;
      const detalle = this.detalleVentaRepository.create({
        cantidad: detalleDto.cantidad,
        subtotal: subtotal,
        prenda: prenda
      });

      detalles.push(detalle);
      total += subtotal;
    }

    // Crear venta
    const venta = this.ventaRepository.create({
      fecha: new Date(),
      total: total,
      empleadoId: createVentaDto.empleadoId,
      empleado: empleado,
      cliente: cliente,
      detalles: detalles as any
    });

    return await this.ventaRepository.save(venta);
  }

  async findAll(): Promise<VentaEntity[]> {
    return await this.ventaRepository.find({relations: ['detalles','detalles.prenda', 'cliente', 'empleado']});
  }

  async findOne(numVenta: number): Promise<VentaEntity> {
    const venta = await this.ventaRepository.findOneBy({ numVenta });

    if (!venta) {
      throw new NotFoundException(`Venta con número ${numVenta} no encontrada`);
    }

    return venta;
  }

  async findByEmpleado(empleadoId: number): Promise<VentaEntity[]> {
    const empleado = await this.empleadoRepository.findOne({
      where: { id: empleadoId }
    });

    if (!empleado) {
      throw new NotFoundException(`Empleado con ID ${empleadoId} no encontrado`);
    }

    return await this.ventaRepository.find({
      where: { empleadoId },
    });
  }

  async findByCliente(clienteId: number): Promise<VentaEntity[]> {
    return await this.ventaRepository.find({ where: { cliente: { id: clienteId } } as any });
  }


  async findByFecha(fechaInicio: Date, fechaFin: Date): Promise<VentaEntity[]> {
    return await this.ventaRepository.find({
      where: {
        fecha: Between(fechaInicio, fechaFin)
      }
    });
  }

  async getTotalVentas(): Promise<{ total: number; cantidad: number }> {
    const ventas = await this.ventaRepository.find();

    const total = ventas.reduce((acc, venta) => acc + venta.total, 0);
    const cantidad = ventas.length;
    return { total, cantidad };
  }

  async remove(numVenta: number): Promise<void> {
    const venta = await this.findOne(numVenta);

    // Restaurar stock de las prendas
    for (const detalle of venta.detalles as any) {
      const prenda = await this.prendaRepository.findOne({
        where: { codigo: detalle.prenda.codigo }
      });
      
      /*if (prenda) {
        prenda.cantidad += detalle.cantidad;
        await this.prendaRepository.save(prenda);
      }*/
    }

    await this.ventaRepository.remove(venta);
  }
}