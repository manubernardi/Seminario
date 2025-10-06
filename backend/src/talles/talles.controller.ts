import { Controller, Get } from '@nestjs/common';
import { TallesService } from './talles.service';
import { TalleEntity } from '../entities/talle.entity';

@Controller('talles')
export class TallesController {
  constructor(private readonly tallesService: TallesService) {}

  @Get()
  async findAll(): Promise<TalleEntity[]> {
    return await this.tallesService.findAll();
  }
}