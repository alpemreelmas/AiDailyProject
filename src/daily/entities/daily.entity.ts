import { Document, SchemaTypes, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../users/entities/user.schema';

export type DailyDocument = Daily & Document;

@Schema({ timestamps: true })
export class Daily {
  _id: Types.ObjectId;
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  user: User;
  @Prop({ required: true })
  content: string;
  @Prop({ required: true })
  orderId: number;
  @Prop({ required: true, default: Date.now() })
  createdAt: Date;
  @Prop({ required: true, default: Date.now() })
  updatedAt: Date;
}
export const DailyDocument = SchemaFactory.createForClass(Daily);
