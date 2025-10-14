import { PartialType } from '@nestjs/mapped-types';
import { CreateEmpleadoDto } from './createEmpleado.dto';
export class UpdateEmpleadoDto extends PartialType(CreateEmpleadoDto) {}
