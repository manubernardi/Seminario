import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
    Query,
    ParseIntPipe,
    HttpStatus,
    HttpCode
} from '@nestjs/common';
import { EmpleadosService } from './empleados.service';
import { CreateEmpleadoDto } from '../dto/createEmpleado.dto';
import { UpdateEmpleadoDto } from '../dto/updateEmpleado.dto';
import { EmpleadoEntity } from '../entities/empleado.entity';

@Controller('empleados')
export class EmpleadosController {
constructor(private readonly empleadoService: EmpleadosService) {}

@Get()
async findAll(): Promise<EmpleadoEntity[]> {
return await this.empleadoService.findAll();
    }
}