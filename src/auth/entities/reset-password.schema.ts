import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export type resetPasswordDocument = ResetPassword & Document;

@Schema()
export class ResetPassword{
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  resetToken: string;

  @Prop({ required: true })
  resetTokenExpiresAt: Date;

  @Prop({ required: true, default: Date.now() })
  createdAt: Date;

  @Prop({ required: true, default: Date.now() })
  updatedAt: Date;
  };

  export const ResetPasswordSchema = SchemaFactory.createForClass(ResetPassword);