import { Test, TestingModule } from '@nestjs/testing';
import { RlsService } from './rls.service';

describe('RlsService', () => {
  let service: RlsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RlsService],
    }).compile();

    service = module.get<RlsService>(RlsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
