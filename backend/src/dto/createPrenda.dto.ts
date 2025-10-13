import { IsString, IsNumber, IsNotEmpty, Min, IsArray, IsOptional} from 'class-validator';

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

  @IsOptional()
  @IsArray()
  prendasXTalles: { talle_id: number; cantidad: number; prenda_codigo: string }[];
}
