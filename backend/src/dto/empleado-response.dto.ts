import { ApiProperty } from '@nestjs/swagger';

export class RolResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  nombre: string;

  @ApiProperty()
  descripcion: string;

  @ApiProperty()
  permissions?: PermissionResponseDto[];
}

export class PermissionResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}

export class VentaResponseDto {
  @ApiProperty()
  numVenta: number;

  @ApiProperty()
  fecha: Date;

  @ApiProperty()
  total: number;

  @ApiProperty()
  empleadoId: number;
}

export class EmpleadoResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  nombre: string;

  @ApiProperty()
  apellido: string;

  @ApiProperty()
  legajo: string;

  @ApiProperty()
  telefono: string;

  @ApiProperty({ type: RolResponseDto })
  rol: RolResponseDto;

  @ApiProperty({ type: [VentaResponseDto], required: false })
  ventas?: VentaResponseDto[];
}