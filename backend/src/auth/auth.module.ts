import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmpleadoEntity } from '../entities/empleado.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmpleadoEntity])],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}