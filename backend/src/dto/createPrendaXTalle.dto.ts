import { IsInt, IsString, Min } from 'class-validator';
export class CreatePrendaXTalleDto {
  @IsInt()
  @Min(0)
  talle_id: number;

  @IsString()
  prenda_codigo: string;

  @IsInt()
  @Min(0)
  cantidad: number;
}