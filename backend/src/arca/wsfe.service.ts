import { Injectable } from '@nestjs/common'
import Afip from '@afipsdk/afip.js'
import { CreateInvoiceDto, TipoComprobante } from './dto/create-invoice.dto'

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
    const round2 = (n: number) => Math.round(n * 100) / 100;
    const wsfe = this.afip.ElectronicBilling

    const last = await wsfe.getLastVoucher(
      data.puntoVenta,
      data.tipoCbte
    )
    const esFacturaA = data.tipoCbte === TipoComprobante.FACTURA_A;
    const total = round2(data.total);
    const neto = esFacturaA ? round2(total / 1.21) : total;
    const iva = esFacturaA ? round2(total - neto) : 0;
    
    const voucher = {
      CantReg: 1,
      PtoVta: data.puntoVenta,
      CbteTipo: data.tipoCbte,
    
      Concepto: 1,
      DocTipo: data.docTipo,
      DocNro: data.docNro,
    
      CondicionIVAReceptorId: data.condicionIVAReceptorId,
    
      CbteDesde: last + 1,
      CbteHasta: last + 1,
    
      CbteFch: parseInt(new Date().toISOString().slice(0,10).replace(/-/g,'')),
    
      ImpTotal: data.total,
      ImpTotConc: 0,
      ImpNeto: neto,
      ImpOpEx: 0,
      ImpIVA: iva,
      ImpTrib: 0,
    
      MonId: 'PES',
      MonCotiz: 1,
    
      ...(esFacturaA && {
        Iva: [
          {
            Id: 5,        // 5 = alícuota 21%
            BaseImp: neto,
            Importe: iva
          }
        ]
      })
    }
    console.log('WSFE Voucher: ', voucher)
    const res = await wsfe.createVoucher(voucher)
    console.log('WSFE Res: ',res)
    return res
    
  }

}