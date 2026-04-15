import { Module } from '@nestjs/common'
import { ArcaService } from './arca.service'
import { WsaaService } from './wsaa.service'
import { WsfeService } from './wsfe.service'

@Module({
  providers: [ArcaService, WsaaService, WsfeService],
  exports: [ArcaService]
})
export class ArcaModule {}