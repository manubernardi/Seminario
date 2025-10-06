import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

// DTO para crear empleado
export class CreateEmpleadoDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsString()
  @IsNotEmpty()
  apellido!: string;

  @IsString()
  @IsNotEmpty()
  legajo!: string;

  @IsString()
  @IsNotEmpty()
  dni!: string;

  @IsNumber()
  @IsNotEmpty()
  rolId!: number;
}