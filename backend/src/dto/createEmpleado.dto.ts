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
  password?: string;
}

export class LoginDTO {
  @IsString()
  @IsNotEmpty()
  dni: string;

  @IsString()
  @IsOptional()
  password?: string;
}