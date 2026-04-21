import { IsNumber, IsOptional, IsEnum } from 'class-validator'

export enum TipoComprobante {
  FACTURA_A = 1,
  FACTURA_B = 6,
  FACTURA_C = 11
}

export enum TipoDocumento {
  CUIT = 80,
  DNI = 96,
  CONSUMIDOR_FINAL = 99
}

export enum CondicionIVAReceptor {
  RESPONSABLE_INSCRIPTO = 1,
  EXENTO = 4,
  CONSUMIDOR_FINAL = 5,
  MONOTRIBUTO = 6
}

export class CreateInvoiceDto {

  @IsNumber()
  puntoVenta: number

  @IsEnum(TipoComprobante)
  tipoCbte: TipoComprobante

  @IsEnum(TipoDocumento)
  docTipo: TipoDocumento

  @IsNumber()
  docNro: number

  @IsEnum(CondicionIVAReceptor)
  condicionIVAReceptorId: CondicionIVAReceptor

  @IsNumber()
  neto: number

  @IsNumber()
  @IsOptional()
  iva?: number

  @IsNumber()
  total: number

}