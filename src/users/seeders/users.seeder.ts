import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "../entities/user.schema";
import { Seeder, DataFactory } from "nestjs-seeder";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersSeeder implements Seeder {
  constructor(@InjectModel(User.name) private readonly user: Model<User>) {}

  async seed(): Promise<any> {
    // Generate 10 users.
    const users = DataFactory.createForClass(User).generate(1);

    const hashedPass = bcrypt.hashSync('123456789', 10);
    const testUser = new User();
    testUser.name = 'Ahmet';
    testUser.email = 'test@gmail.com'
    testUser.password = hashedPass

    // Insert into the database.
    await this.user.insertMany(users);
    await this.user.create(testUser);
  }

  async drop(): Promise<any> {
    return this.user.deleteMany({});
  }
}