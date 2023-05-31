import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.schema';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}
  async create(createUserDto: CreateUserDto) {
    if (
      (await this.UserModel.find({ email: createUserDto.email }).count()) > 0
    ) {
      throw new BadRequestException('Already this user exist.');
    }
    const createdUser = new this.UserModel(createUserDto);
    createdUser.password = bcrypt.hashSync(createUserDto.password, 10);
    return createdUser.save();
  }

  findAll() {
    return this.UserModel.find();
  }

  findOne(id: string) {
    const objectId = new ObjectId(id);
    return this.UserModel.findOne({ _id: objectId });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const objectId = new ObjectId(id);
    if (updateUserDto.password) {
      updateUserDto.password = bcrypt.hashSync(updateUserDto.password, 10);
    }
    return this.UserModel.findOneAndUpdate({ _id: objectId }, updateUserDto);
  }

  remove(id: string) {
    const objectId = new ObjectId(id);
    return this.UserModel.findOneAndDelete({ _id: objectId });
  }

  findByQuery(obj: any): Promise<any> {
    return this.UserModel.findOne(obj);
  }
}
