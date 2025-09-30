// create-empleado.dto.ts
import { IsString, IsNotEmpty, IsPhoneNumber, IsNumber } from 'class-validator';

export class CreateEmpleadoDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsString()
  @IsNotEmpty()
  apellido!: string;

  @IsString()
  @IsNotEmpty()
  legajo: string;

  @IsString()
  @IsNotEmpty()
  telefono!: string;

  @IsNumber()
  @IsNotEmpty()
  rolId!: number; // ID del rol
}