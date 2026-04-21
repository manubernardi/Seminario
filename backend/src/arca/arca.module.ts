import { Module } from '@nestjs/common'
import { ArcaController } from './arca.controller'
import { WsaaService } from './wsaa.service'
import { WsfeService } from './wsfe.service'

@Module({
  controllers: [ArcaController],
  providers: [WsaaService, WsfeService],
  exports: [ WsfeService, WsaaService]
})
export class ArcaModule {}