import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TallesService } from './talles.service';
import { TallesController } from './talles.controller';
import { TalleEntity } from '../entities/talle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TalleEntity])],
  controllers: [TallesController],
  providers: [TallesService],
  exports: [TallesService]
})
export class TallesModule {}