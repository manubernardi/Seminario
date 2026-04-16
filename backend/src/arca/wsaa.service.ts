import { Injectable } from '@nestjs/common'
import * as fs from 'fs'
import * as soap from 'soap'
import * as forge from 'node-forge'

@Injectable()
export class WsaaService {

  private token: string | null = null
  private sign: string | null = null
  private expiration: Date | null = null
  private token: string | null = null
  private sign: string | null = null
  private expiration: Date | null = null

  async login() {

    if (this.token && new Date() < this.expiration) {
      return { token: this.token, sign: this.sign }
    }

    //Ticket Request Authentication
    const tra = `
    <loginTicketRequest>
      <header>
        <uniqueId>${Date.now()}</uniqueId>
        <generationTime>${new Date().toISOString()}</generationTime>
        <expirationTime>${new Date(Date.now()+600000).toISOString()}</expirationTime>
      </header>
      <service>wsfe</service>
    </loginTicketRequest>`

    const cert = fs.readFileSync('./src/afip/certs/cert.crt')
    const key = fs.readFileSync('./src/afip/certs/private.key')

    const p7 = forge.pkcs7.createSignedData()
    p7.content = forge.util.createBuffer(tra, 'utf8')

    p7.addCertificate(cert.toString())

    p7.addSigner({
      key: forge.pki.privateKeyFromPem(key.toString()),
      certificate: forge.pki.certificateFromPem(cert.toString()),
      digestAlgorithm: forge.pki.oids.sha256
    })

    p7.sign()

    const cms = forge.util.encode64(
      forge.asn1.toDer(p7.toAsn1()).getBytes()
    )
    //Conecta con el servicio de login
    const client = await soap.createClientAsync(
      'https://wsaahomo.afip.gov.ar/ws/services/LoginCms?WSDL'
    )
    //Hacemos el login
    const [res] = await client.loginCmsAsync({ in0: cms })

    //respuesta arca
    const xml = res.loginCmsReturn

    //Extraer el token y el sign de la respuesta
    const token = xml.match(/<token>(.*?)<\/token>/)[1]
    const sign = xml.match(/<sign>(.*?)<\/sign>/)[1]

    this.token = token
    this.sign = sign
    this.expiration = new Date(Date.now() + 11 * 60 * 60 * 1000)

    return { token, sign }
  }
}