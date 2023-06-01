import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { User } from '../../users/entities/user.schema';

export type TodoDocument = Todo & Document;

@Schema({ timestamps: true })
export class Todo {
  _id: Types.ObjectId;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, default: false })
  completed: boolean;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ required: true, default: Date.now() })
  createdAt: Date;

  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  user: User;
}
export const TodoSchema = SchemaFactory.createForClass(Todo);
