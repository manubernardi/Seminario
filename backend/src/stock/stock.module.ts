import { Module } from '@nestjs/common';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrendaEntity } from '../entities/prenda.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PrendaEntity])],
  controllers: [StockController],
  providers: [StockService]
})
export class StockModule {}
