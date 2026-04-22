import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VentasService } from './ventas.service';
import { VentasController } from './ventas.controller';
import { VentaEntity } from '../entities/venta.entity';
import { DetalleVentaEntity } from '../entities/detalle.venta.entity';
import { EmpleadoEntity } from '../entities/empleado.entity';
import { ClienteEntity } from '../entities/cliente.entity';
import { PrendaEntity } from '../entities/prenda.entity';
import { PrendaXTalleEntity } from '../entities/prendaXTalleEntity';
import { TalleEntity } from '../entities/talle.entity';
import { StockService } from '../stock/stock.service';
import { TipoPrendaEntity } from '../entities/tipoPrenda.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VentaEntity,
      DetalleVentaEntity,
      EmpleadoEntity,
      ClienteEntity,
      PrendaEntity, 
      PrendaXTalleEntity,
      TalleEntity,
      TipoPrendaEntity
    ])
  ],
  controllers: [VentasController],
  providers: [VentasService, StockService],
  exports: [VentasService]
})
export class VentasModule {}