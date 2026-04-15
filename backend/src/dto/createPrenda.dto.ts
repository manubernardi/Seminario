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

  @IsNumber()
    tipoPrendaId: number;
}
