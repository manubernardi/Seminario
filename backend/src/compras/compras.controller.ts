// compras.controller.ts
import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Query,
  ParseIntPipe,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { ComprasService } from './compras.service';
import { CreateCompraDto } from '../dto/create-compra.dto';

@Controller('compras')
export class ComprasController {
  constructor(private readonly comprasService: ComprasService) {}

  @Post()
  async create(@Body() createCompraDto: CreateCompraDto) {
    try {
      const compra = await this.comprasService.create(createCompraDto);
      return {
        success: true,
        message: 'Compra registrada exitosamente',
        data: compra
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al registrar la compra',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get()
  async findAll() {
    try {
      const compras = await this.comprasService.findAll();
      return {
        success: true,
        data: compras
      };
    } catch (error) {
      throw new HttpException(
        'Error al obtener las compras',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':numCompra')
  async findOne(@Param('numCompra', ParseIntPipe) numCompra: number) {
    try {
      const compra = await this.comprasService.findOne(numCompra);
      return {
        success: true,
        data: compra
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al obtener la compra',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('empleado/:legajo')
  async findByEmpleado(@Param('legajo', ParseIntPipe) legajo: number) {
    try {
      const compras = await this.comprasService.findByEmpleado(legajo);
      return {
        success: true,
        data: compras
      };
    } catch (error) {
      throw new HttpException(
        'Error al obtener las compras del empleado',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('fecha/rango')
  async findByFecha(
    @Query('inicio') fechaInicio: string,
    @Query('fin') fechaFin: string
  ) {
    try {
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);

      if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
        throw new HttpException(
          'Formato de fecha inválido',
          HttpStatus.BAD_REQUEST
        );
      }

      const compras = await this.comprasService.findByFecha(inicio, fin);
      return {
        success: true,
        data: compras
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al obtener las compras por fecha',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}