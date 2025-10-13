// create-empleado.dto.ts
import { IsString, IsNotEmpty, IsNumber, IsPhoneNumber } from 'class-validator';

export class CreateEmpleadoDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsString()
  @IsNotEmpty()
  apellido!: string;

  @IsString()
  @IsNotEmpty()
  dni!: string;

  @IsNotEmpty()
  telefono: string;

  @IsNumber()
  @IsNotEmpty()
  rolId!: number; 
}