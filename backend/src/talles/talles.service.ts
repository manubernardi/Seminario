import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TalleEntity } from '../entities/talle.entity';

@Injectable()
export class TallesService {
  constructor(
    @InjectRepository(TalleEntity)
    private talleRepository: Repository<TalleEntity>,
  ) {}

  async findAll(): Promise<TalleEntity[]> {
    return await this.talleRepository.find();
  }
}