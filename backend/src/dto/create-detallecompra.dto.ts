import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateDetalleCompraDto {
  @IsString()
  @IsNotEmpty({ message: 'El código de la prenda es obligatorio' })
  codigoPrenda: string;

  @IsNumber()
  @IsNotEmpty({ message: 'El ID del talle es obligatorio' })
  talleId: number;

  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @Min(1, { message: 'La cantidad debe ser al menos 1' })
  cantidad: number;

  @IsNumber({}, { message: 'El precio unitario debe ser un número' })
  @Min(0, { message: 'El precio debe ser positivo' })
  precioUnitario: number;
}