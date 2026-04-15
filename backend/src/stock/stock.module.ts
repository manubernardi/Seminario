import { Module } from '@nestjs/common';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrendaEntity } from '../entities/prenda.entity';
import { TalleEntity } from '../entities/talle.entity';
import { TipoPrendaEntity } from '../entities/tipoPrenda.entity';
import { PrendaXTalleEntity } from '../entities/prendaXTalleEntity';
@Module({
  imports: [TypeOrmModule.forFeature([PrendaEntity, PrendaXTalleEntity, TalleEntity, TipoPrendaEntity ])],
  controllers: [StockController],
  providers: [StockService]
})
export class StockModule {}
