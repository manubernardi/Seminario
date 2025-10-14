import { IsNotEmpty, IsNumber, IsArray, ValidateNested, ArrayMinSize, Min, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDetalleVentaDto {
  @IsNotEmpty({ message: 'El código de la prenda es obligatorio' })
  codigoPrenda: string;
  
  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @Min(1, { message: 'La cantidad debe ser al menos 1' })
  cantidad: number;

  @IsNotEmpty({ message: 'El talle de la prenda es obligatorio'})
  talleId: number;
}

export class CreateVentaDto {
  @IsNumber() 
  @IsNotEmpty({ message: 'El empleado es obligatorio' })
  empleadoLegajo: number;  //
  
  @IsNumber({}, { message: 'El ID del cliente debe ser un número' })
  @IsOptional()
  clienteId?: number;
  
  @IsArray({ message: 'Los detalles deben ser un array' })
  @ArrayMinSize(1, { message: 'Debe haber al menos un detalle de venta' })
  @ValidateNested({ each: true })
  @Type(() => CreateDetalleVentaDto)
  detalles: CreateDetalleVentaDto[];
}