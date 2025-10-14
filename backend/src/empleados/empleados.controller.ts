import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpCode
} from '@nestjs/common';
import { EmpleadoService } from './empleados.service';
import { CreateEmpleadoDto } from '../dto/createEmpleado.dto';
import { UpdateEmpleadoDto } from '../dto/update-empleado.dto';
import { EmpleadoEntity } from '../entities/empleado.entity';

@Controller('empleados')
export class EmpleadoController {
  constructor(private readonly empleadoService: EmpleadoService) {}

  @Post()
  async create(@Body() createEmpleadoDto: CreateEmpleadoDto): Promise<EmpleadoEntity> {
    console.log("Controller", createEmpleadoDto)
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
  async findByLegajo(@Param('legajo') legajo: number): Promise<EmpleadoEntity> {
    return await this.empleadoService.findByLegajo(legajo);
  }

  @Get(':dni')
  async findOne(@Param('dni') dni: string): Promise<EmpleadoEntity> {
    return await this.empleadoService.findOne(dni);
  }

  @Get(':dni/ventas')
  async getVentasPorEmpleado(
    @Param('dni') dni: string,
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string
  ) {
    const inicio = fechaInicio ? new Date(fechaInicio) : undefined;
    const fin = fechaFin ? new Date(fechaFin) : undefined;
    
    return await this.empleadoService.getVentasPorEmpleado(dni, inicio, fin);
  }

  @Patch(':dni')
  async update(
    @Param('dni') dni: string,
    @Body() updateEmpleadoDto: UpdateEmpleadoDto
  ): Promise<EmpleadoEntity> {
    return await this.empleadoService.update(dni, updateEmpleadoDto);
  }

  @Delete(':dni')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('dni') dni: string): Promise<void> {
    return await this.empleadoService.remove(dni);
  }
}