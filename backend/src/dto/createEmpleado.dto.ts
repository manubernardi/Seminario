import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateEmpleadoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  apellido: string;

  @IsString()
  @IsNotEmpty()
  dni: string;


  @IsNumber()
  @IsNotEmpty()
  rol_id: number; 

  @IsString()
  @IsOptional()
  contraseña: string;
}