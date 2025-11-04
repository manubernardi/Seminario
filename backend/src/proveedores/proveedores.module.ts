import { Module } from '@nestjs/common';
import { ProveedoresService } from './proveedores.service';
import { ProveedoresController } from './proveedores.controller';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { ProveedorEntity } from '../entities/proveedor.entity';
@Module({
  imports: [TypeOrmModule.forFeature([ProveedorEntity])],
  providers: [ProveedoresService],
  controllers: [ProveedoresController]
})
export class ProveedoresModule {}
