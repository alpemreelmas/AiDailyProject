import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDailyDto } from './dto/create-daily.dto';
import { UpdateDailyDto } from './dto/update-daily.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../users/entities/user.schema';
import { Model } from 'mongoose';
import { Daily, DailyDocument } from './entities/daily.entity';
import { NotFoundError } from 'rxjs';

@Injectable()
export class DailyService {
  constructor(
    @InjectModel(Daily.name) private DailyModel: Model<DailyDocument>,
  ) {}
  async create(createDailyDto: CreateDailyDto, user: any) {
    return await this.DailyModel.create({ ...createDailyDto, user: user.sub });
  }

  async findAll(user: any) {
    return this.DailyModel.find({ user: user.sub });
  }

  async findOne(id: string, user: any) {
    const res = await this.DailyModel.findOne({ user: user.sub, _id: id });
    if (!res) throw new NotFoundException("We couldn't find this daily.");
    return res;
  }

  async update(id: string, updateDailyDto: UpdateDailyDto, user: any) {
    const res = await this.DailyModel.findOneAndUpdate(
      { user: user.sub, _id: id },
      updateDailyDto,
      { returnDocument: 'after' },
    );
    if (!res) throw new NotFoundException("We couldn't find this daily.");
    return res;
  }

  async remove(id: string, user: any) {
    const res = await this.DailyModel.findOneAndDelete({
      user: user.sub,
      _id: id,
    });
    if (!res) throw new NotFoundException("We couldn't find this daily.");
    return res;
  }
}