import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { User } from '../../users/entities/user.schema';

export type AuthTokenDocument = AuthToken & Document;

@Schema({ timestamps: true })
export class AuthToken {
  _id: Types.ObjectId;

  @Prop({ required: true })
  refreshToken: string;

  @Prop({ required: true })
  validUntil: Date;

  @Prop({ required: true })
  isValid: boolean;

  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  user: User;
}
export const AuthTokenSchema = SchemaFactory.createForClass(AuthToken);
