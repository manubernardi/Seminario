import { Injectable } from '@nestjs/common'
import { WsfeService } from './wsfe.service'
import { CreateInvoiceDto } from './dto/create-invoice.dto'

@Injectable()
export class ArcaService {

  constructor(private wsfe: WsfeService) {}

  async facturar(data: CreateInvoiceDto) {
    return this.wsfe.crearFactura(data)
  }

}