import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';

export class CreatePrendaDto {
  @IsString()
  @IsNotEmpty()
  codigo: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsNumber()
  @Min(0)
  precio: number;

  @IsNumber()
  @Min(0)
  cantidad: number;

  @IsNumber()
  @IsNotEmpty()
  talle_id: number;
}