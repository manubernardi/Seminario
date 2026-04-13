import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpleadoService } from '../empleados/empleados.service';
import { EmpleadoController } from '../empleados/empleados.controller';
import { EmpleadoEntity } from '../entities/empleado.entity';
import { RoleEntity } from '../entities/roles.entity';
import { JwtService } from '../jwt/jwt.service';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([EmpleadoEntity, RoleEntity])],
  controllers: [EmpleadoController],
  providers: [EmpleadoService, JwtService, AuthService],
  exports: [EmpleadoService] // Por si lo necesitás en otros módulos
})
export class EmpleadoModule {}