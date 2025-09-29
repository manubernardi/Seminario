import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpleadoService } from '../empleados/empleados.service';
import { EmpleadoController } from '../empleados/empleados.controller';
import { EmpleadoEntity } from '../entities/empleado.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmpleadoEntity])],
  controllers: [EmpleadoController],
  providers: [EmpleadoService],
  exports: [EmpleadoService] // Por si lo necesitás en otros módulos
})
export class EmpleadoModule {}