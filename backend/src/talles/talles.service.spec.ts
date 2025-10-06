import { Test, TestingModule } from '@nestjs/testing';
import { TallesService } from './talles.service';

describe('TalleService', () => {
  let service: TallesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TallesService],
    }).compile();

    service = module.get<TallesService>(TallesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
