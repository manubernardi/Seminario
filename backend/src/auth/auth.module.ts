import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesGuard } from './roles.guard';
import { AuthService } from './auth.service';
import { EmpleadoEntity } from '../entities/empleado.entity';
import { AuthController } from './auth.controller';
import { EmpleadoService } from '../empleados/empleados.service';
import { JwtService } from '../jwt/jwt.service';
import { RoleEntity } from '../entities/roles.entity';
import { AuthGuard } from './auth.guard';


@Module({
  imports: [TypeOrmModule.forFeature([EmpleadoEntity, RoleEntity])],
  controllers: [AuthController],
  providers: [RolesGuard, JwtService, EmpleadoService, AuthService, AuthGuard],
  exports: [RolesGuard, AuthService, AuthGuard]
})
export class AuthModule {}