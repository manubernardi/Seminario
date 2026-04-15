import { Injectable } from '@nestjs/common'
import * as soap from 'soap'
import { WsaaService } from './wsaa.service'
import { CreateInvoiceDto } from './dto/create-invoice.dto'

@Injectable()
export class WsfeService {

  constructor(private wsaa: WsaaService) {}

  private CUIT = 20301234567

  async client() {
    return soap.createClientAsync(
      'https://wswhomo.afip.gov.ar/wsfev1/service.asmx?WSDL'
    )
  }

  //Obtiene el ultimo comprobante
  async ultimoCbte(pv: number, tipo: number) {

    const { token, sign } = await this.wsaa.login()
    const client = await this.client()

    const args = {
      Auth: { Token: token, Sign: sign, Cuit: this.CUIT },
      PtoVta: pv,
      CbteTipo: tipo
    }
    //Llama al metodo de afip
    const [res] = await client.FECompUltimoAutorizadoAsync(args)

    return res.FECompUltimoAutorizadoResult.CbteNro
  }

  async crearFactura(data: CreateInvoiceDto) {

    const { token, sign } = await this.wsaa.login()
    const client = await this.client()

    const ultimo = await this.ultimoCbte(data.puntoVenta, data.tipoCbte)
    const nro = ultimo + 1

    const args = {
      Auth: { Token: token, Sign: sign, Cuit: this.CUIT },
      //Cabecera de factura
      FeCAEReq: {
        FeCabReq: {
          CantReg: 1,
          PtoVta: data.puntoVenta,
          CbteTipo: data.tipoCbte
        },

        //Detalle de factura
        FeDetReq: {
          FECAEDetRequest: {

            Concepto: 1, //Productos
            DocTipo: data.docTipo,
            DocNro: data.docNro,

            CbteDesde: nro,
            CbteHasta: nro,

            CbteFch: Number(new Date().toISOString().slice(0,10).replace(/-/g,'')),

            //Importes
            ImpTotal: data.total,
            ImpTotConc: 0,
            ImpNeto: data.neto,
            ImpOpEx: 0,
            ImpIVA: data.iva,
            ImpTrib: 0,

            MonId: 'PES',
            MonCotiz: 1,

            //Iva
            Iva: {
              AlicIva: {
                Id: 5, //5 - 21%  | 4 - 10,5% | 6 - 27%
                BaseImp: data.neto,
                Importe: data.iva
              }
            }

          }
        }
      }
    }

    const [res] = await client.FECAESolicitarAsync(args)

    return res.FECAESolicitarResult
  }
}