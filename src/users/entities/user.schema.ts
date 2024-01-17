import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { Factory } from "nestjs-seeder";
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  _id: Types.ObjectId;
  @Factory((faker) => faker.person.fullName())
  @Prop({ required: true })
  name: string;
  @Factory((faker) => faker.internet.email())
  @Prop({ required: true })
  email: string;
  @Factory(bcrypt.hashSync('123456789', 10))
  @Prop({ required: true })
  password: string;
  @Prop({ required: true, default: Date.now() })
  createdAt: Date;
  @Prop({ required: true, default: Date.now() })
  updatedAt: Date;
}
export const UserSchema = SchemaFactory.createForClass(User);
