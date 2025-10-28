import { IsNumber, IsNotEmpty, IsArray, ArrayMinSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateDetalleCompraDto } from './create-detallecompra.dto'

export class CreateCompraDto {
  @IsNumber({}, { message: 'El legajo del empleado debe ser un número' })
  @IsNotEmpty({ message: 'El empleado es obligatorio' })
  empleadoLegajo: number;

  @IsNumber({}, { message: 'El ID del proveedor debe ser un número' })
  @IsNotEmpty({ message: 'El proveedor es obligatorio' })
  proveedorId: number;

  @IsArray({ message: 'Los detalles deben ser un array' })
  @ArrayMinSize(1, { message: 'Debe haber al menos un detalle de compra' })
  @ValidateNested({ each: true })
  @Type(() => CreateDetalleCompraDto)
  detalles: CreateDetalleCompraDto[];
}