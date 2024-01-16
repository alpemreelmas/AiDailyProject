import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { Factory } from "nestjs-seeder";

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
  @Factory((faker) => faker.internet.password())
  @Prop({ required: true })
  password: string;
  @Prop({ required: true, default: Date.now() })
  createdAt: Date;
  @Prop({ required: true, default: Date.now() })
  updatedAt: Date;
}
export const UserSchema = SchemaFactory.createForClass(User);
