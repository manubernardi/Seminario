import { IsNotEmpty, IsNumber } from 'class-validator';
//Dto de la factura
export class CreateInvoiceDto {
  @IsNumber()
  @IsNotEmpty()  
  puntoVenta: number

  @IsNumber()
  @IsNotEmpty()
  tipoCbte: number

  @IsNumber()
  @IsNotEmpty()  
  docTipo: number

  @IsNumber()
  @IsNotEmpty()    
  docNro: number

  @IsNumber()
  @IsNotEmpty()
  neto: number

  @IsNumber()
  @IsNotEmpty()  
  iva: number

  @IsNumber()
  @IsNotEmpty()  
  total: number

}