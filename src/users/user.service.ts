import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.schema';
import { Model, Types, Connection } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { transaction } from '../helpers/transaction.helper';

@Injectable()
export class UserService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return transaction(this.connection, async (session) => {
      if (
        (await this.UserModel.find({ email: createUserDto.email }).count()) > 0
      ) {
        throw new BadRequestException('Already this user exist.');
      }
      const createdUser = new this.UserModel(createUserDto);
      createdUser.password = bcrypt.hashSync(createUserDto.password, 10);
      return createdUser.save({ session });
    });
  }

  findAll() {
    return transaction(this.connection, (session) => this.UserModel.find());
  }

  findById(id: Types.ObjectId) {
    return transaction(this.connection, (session) =>
      this.UserModel.findById(id),
    );
  }

  async findByEmail(email: string): Promise<User> {
    return await this.UserModel.findOne({ email }).exec();
  }

  update(id: Types.ObjectId, updateUserDto: UpdateUserDto) {
    return transaction(this.connection, (session) => {
      if (updateUserDto.password) {
        updateUserDto.password = bcrypt.hashSync(updateUserDto.password, 10);
      }
      return this.UserModel.findByIdAndUpdate(id, updateUserDto);
    });
  }

  async updateResetToken(userId: Types.ObjectId, resetToken: string, resetTokenExpiresAt: Date): Promise<void> {
    await this.UserModel.findByIdAndUpdate(userId, {
      resetToken,
      resetTokenExpiresAt,
    });
  }

  remove(id: Types.ObjectId) {
    return transaction(this.connection, (session) =>
      this.UserModel.findByIdAndDelete(id),
    );
  }

  findByQuery(obj: any): Promise<any> {
    return transaction(this.connection, (session) =>
      this.UserModel.findOne(obj),
    );
  }
}
