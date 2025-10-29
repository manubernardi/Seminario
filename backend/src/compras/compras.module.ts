// compras.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComprasController } from './compras.controller';
import { ComprasService } from './compras.service';
import { CompraEntity } from '../entities/compra.entity';
import { DetalleCompraEntity } from '../entities/detalle.compra.entity';
import { EmpleadoEntity } from '../entities/empleado.entity';
import { ProveedorEntity } from '../entities/proveedor.entity';
import { PrendaEntity } from '../entities/prenda.entity';
import { PrendaXTalleEntity } from '../entities/prendaXTalleEntity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CompraEntity,
      DetalleCompraEntity,
      EmpleadoEntity,
      ProveedorEntity,
      PrendaEntity,
      PrendaXTalleEntity
    ])
  ],
  controllers: [ComprasController],
  providers: [ComprasService],
  exports: [ComprasService]
})
export class ComprasModule {}