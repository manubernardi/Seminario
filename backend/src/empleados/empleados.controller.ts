import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  HttpStatus,
  HttpCode
} from '@nestjs/common';
import { EmpleadoService } from './empleados.service';
import { CreateEmpleadoDto } from '../dto/create-empleado.dto';
import { UpdateEmpleadoDto } from '../dto/update-empleado.dto';
import { EmpleadoEntity } from '../entities/empleado.entity';

@Controller('empleados')
export class EmpleadoController {
  constructor(private readonly empleadoService: EmpleadoService) {}

  @Post()
  async create(@Body() createEmpleadoDto: CreateEmpleadoDto): Promise<EmpleadoEntity> {
    return await this.empleadoService.create(createEmpleadoDto);
  }

  @Get()
  async findAll(): Promise<EmpleadoEntity[]> {
    return await this.empleadoService.findAll();
  }

  @Get('con-ventas')
  async getEmpleadosConVentas(): Promise<EmpleadoEntity[]> {
    return await this.empleadoService.getEmpleadosConVentas();
  }

  @Get('legajo/:legajo')
  async findByLegajo(@Param('legajo') legajo: string): Promise<EmpleadoEntity> {
    return await this.empleadoService.findByLegajo(legajo);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<EmpleadoEntity> {
    return await this.empleadoService.findOne(id);
  }

  @Get(':id/ventas')
  async getVentasPorEmpleado(
    @Param('id', ParseIntPipe) id: number,
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string
  ) {
    const inicio = fechaInicio ? new Date(fechaInicio) : undefined;
    const fin = fechaFin ? new Date(fechaFin) : undefined;
    
    return await this.empleadoService.getVentasPorEmpleado(id, inicio, fin);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmpleadoDto: UpdateEmpleadoDto
  ): Promise<EmpleadoEntity> {
    return await this.empleadoService.update(id, updateEmpleadoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.empleadoService.remove(id);
  }
}