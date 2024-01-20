import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export type resetPasswordDocument = ResetPassword & Document;

@Schema()
export class ResetPassword{
  @Prop({ required: false })
  email: string;

  @Prop({ required: false })
  resetToken: string;

  @Prop({ required: false, default: null })
  resetTokenExpiresAt: Date;

  @Prop({ required: true, default: Date.now() })
  createdAt: Date;

  @Prop({ required: true, default: Date.now() })
  updatedAt: Date;
  };

  export const ResetPasswordSchema = SchemaFactory.createForClass(ResetPassword);