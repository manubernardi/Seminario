import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { VentasService } from './ventas.service';
import { CreateVentaDto } from '../dto/create-venta.dto';
import { VentaEntity } from '../entities/venta.entity';

@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: CreateVentaDto): Promise<VentaEntity> {
    console.log('Información en POST: ');
    console.log(data);
    return await this.ventasService.create(data);
  }

  @Get()
  async findAll(): Promise<VentaEntity[]> {
    return await this.ventasService.findAll();
  }

  @Get('totales')
  async getTotales(): Promise<{ total: number; cantidad: number }> {
    return await this.ventasService.getTotalVentas();
  }

  @Get('empleado/:id')
  async findByEmpleado(
    @Param('id', ParseIntPipe) empleadoId: number
  ): Promise<VentaEntity[]> {
    return await this.ventasService.findByEmpleado(empleadoId);
  }

  @Get('cliente/:id')
  async findByCliente(
    @Param('id', ParseIntPipe) clienteId: number
  ): Promise<VentaEntity[]> {
    return await this.ventasService.findByCliente(clienteId);
  }

  @Get('fecha')
  async findByFecha(
    @Query('inicio') fechaInicio: string,
    @Query('fin') fechaFin: string
  ): Promise<VentaEntity[]> {
    return await this.ventasService.findByFecha(
      new Date(fechaInicio),
      new Date(fechaFin)
    );
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<VentaEntity> {
    return await this.ventasService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.ventasService.remove(id);
  }
}