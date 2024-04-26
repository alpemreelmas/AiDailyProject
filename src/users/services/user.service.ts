import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/users/entities/user.schema';
import { Model, Types, Connection } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { transaction } from 'src/helpers/transaction.helper';
import {
  UserAndRoles,
  userAndRolesDocument,
} from 'src/users/entities/userRoles';

@Injectable()
export class UserService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    @InjectModel(UserAndRoles.name)
    private UserAndRolesModel: Model<userAndRolesDocument>,
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

  findAllWithRoles() {
    return this.UserAndRolesModel.find().populate(['userId', 'roleId']);
  }

  findById(id: string) {
    return transaction(this.connection, (session) =>
      this.UserModel.findById(id),
    );
  }

  findByIdWithRole(id: string) {
    return transaction(this.connection, (session) =>
      this.UserAndRolesModel.find({ userId: id }).populate('roleId'),
    );
  }

  async findByEmail(email: string): Promise<User> {
    return await this.UserModel.findOne({ email }).exec();
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return transaction(this.connection, (session) => {
      if (updateUserDto.password) {
        updateUserDto.password = bcrypt.hashSync(updateUserDto.password, 10);
      }
      return this.UserModel.findByIdAndUpdate(id, updateUserDto);
    });
  }

  async updateResetToken(
    userId: string,
    resetToken: string,
    resetTokenExpiresAt: Date,
  ): Promise<void> {
    await this.UserModel.findByIdAndUpdate(userId, {
      resetToken,
      resetTokenExpiresAt,
    });
  }

  remove(id: string) {
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
