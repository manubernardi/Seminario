import { Injectable } from '@nestjs/common'
import Afip from '@afipsdk/afip.js'
import { CreateInvoiceDto } from './dto/create-invoice.dto'

@Injectable()
export class WsfeService {

  private afip: any

  constructor() {
    // Usar el token asignado por AfipSDK (ambiente de homologación)
    this.afip = new Afip({
      CUIT: 20409378472,
      access_token: 'kYCKbwyqCF1J6Gx20w2B8PhrbDX4e92o72BiTgeLZS8h3hoszbRu0oVwb5Rzf1mn'
    })
  }

  async crearFactura(data: CreateInvoiceDto) {
    const wsfe = this.afip.ElectronicBilling

    const last = await wsfe.getLastVoucher(
      data.puntoVenta,
      data.tipoCbte
    )

    const voucher = {
      CantReg: 1,
      PtoVta: data.puntoVenta,
      CbteTipo: data.tipoCbte,

      Concepto: 1,
      DocTipo: data.docTipo,
      DocNro: data.docNro,

      CbteDesde: last + 1,
      CbteHasta: last + 1,

      CbteFch: parseInt(new Date().toISOString().slice(0,10).replace(/-/g,'')),

      ImpTotal: data.total,
      ImpTotConc: 0,
      ImpNeto: data.neto,
      ImpOpEx: 0,
      ImpIVA: data.iva,
      ImpTrib: 0,

      MonId: 'PES',
      MonCotiz: 1,

      Iva: [
        {
          Id: 5,
          BaseImp: data.neto,
          Importe: data.iva
        }
      ]
    }

    const res = await wsfe.createVoucher(voucher)
    console.log(res)
    return res
    
  }

}