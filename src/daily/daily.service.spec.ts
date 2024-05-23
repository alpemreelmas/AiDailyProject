import { Test, TestingModule } from '@nestjs/testing';
import { DailyService } from './daily.service';
import { Daily } from './entities/daily.entity';
import { Model, ObjectId, Types } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { CreateDailyDto } from './dto/create-daily.dto';

describe('DailyService', () => {
  let service: DailyService;
  let model: Model<Daily>;

  const mockUser = {
    sub: new Types.ObjectId('66479e05a279293d64585979'),
    name: 'Alp Emre Elmas',
    email: 'elmasalpemre@gmail.com',
  };

  const mockDaily = {
    user: new Types.ObjectId('66479e28a279293d64585982'),
    content: 'Test #1',
    orderId: 0,
    createdAt: '2024-05-17T17:53:54.050Z',
    updatedAt: '2024-05-17T17:53:54.050Z',
    _id: new Types.ObjectId('66479e28a279293d64585982'),
    __v: 0,
  };

  const mockDailyService = {
    create: jest.fn(),
    /*findAll: jest.fn(),
    findOne: jest.fn(),
    order: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),*/
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DailyService,
        {
          provide: getModelToken(Daily.name),
          useValue: mockDailyService,
        },
      ],
    }).compile();

    service = module.get<DailyService>(DailyService);
    model = module.get<Model<Daily>>(getModelToken(Daily.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a daily', async () => {
    const newDaily = {
      content: 'This is a test content.',
      orderId: 2,
    };

    jest.fn().mockResolvedValue((mockDaily) => Promise.resolve(mockDaily));

    const result = await service.create(newDaily as CreateDailyDto, mockUser);
    expect(result).toEqual({
      _id: expect.any(Number),
      content: 'This is a test content.',
    });

    expect(model.create).toHaveBeenCalledWith(newDaily);
  });
});
