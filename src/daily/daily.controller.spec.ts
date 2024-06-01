import { Test, TestingModule } from '@nestjs/testing';
import { DailyController } from './daily.controller';
import { DailyService } from './daily.service';
import { REQUEST } from '@nestjs/core';
import { CreateDailyDto } from './dto/create-daily.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CanActivate } from '@nestjs/common';

describe('DailyController', () => {
  let controller: DailyController;
  let service: DailyService;

  const mockDailyService = {
    create: jest.fn((dto) => dto),
  };

  const mock_ForceFailGuard: CanActivate = { canActivate: jest.fn(() => true) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DailyController],
      providers: [DailyService],
    })
      .overrideProvider(DailyService)
      .useValue(mockDailyService)
      .overrideGuard(AuthGuard)
      .useValue(mock_ForceFailGuard)
      .compile();

    controller = module.get<DailyController>(DailyController);
    service = module.get<DailyService>(DailyService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call dailyService.create with correct parameters', async () => {
    const req = { user: { id: 1, name: 'Test User' } } as unknown as Request;
    const createDailyDto: CreateDailyDto = {
      content: 'this is a test !',
      orderId: 1,
    } as CreateDailyDto;

    const result = {};

    jest.spyOn(service, 'create').mockResolvedValue(result);

    expect(await controller.create(req, createDailyDto)).toBe(result);
    expect(service.create).toHaveBeenCalledWith(createDailyDto, req['user']);
  });
});
