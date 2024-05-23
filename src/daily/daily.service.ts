import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDailyDto } from './dto/create-daily.dto';
import { UpdateDailyDto } from './dto/update-daily.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../users/entities/user.schema';
import { Model } from 'mongoose';
import { Daily, DailyDocument } from './entities/daily.entity';
import { NotFoundError } from 'rxjs';
import { OrderDailyDto } from './dto/order-daily.dto';

@Injectable()
export class DailyService {
  constructor(@InjectModel(Daily.name) private DailyModel: typeof Model) {}
  async create(createDailyDto: CreateDailyDto, user: any) {
    return await this.DailyModel.create({
      ...createDailyDto,
      user: user.sub,
    });
  }

  async findAll(user: any) {
    return this.DailyModel.find({ user: user.sub }).sort({ orderId: 1 }).exec();
  }

  async findOne(id: string, user: any) {
    const res = await this.DailyModel.findOne({ user: user.sub, _id: id });
    if (!res) throw new NotFoundException("We couldn't find this daily.");
    return res;
  }

  async order(orderDailyDtos: OrderDailyDto[], user: any) {
    orderDailyDtos.forEach(async (order) => {
      await this.DailyModel.findOneAndUpdate(
        { user: user.sub, _id: order.id },
        { orderId: order.orderId },
      );
    });
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
