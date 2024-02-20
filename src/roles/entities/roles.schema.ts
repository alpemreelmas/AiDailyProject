import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export type rolesDocument = Roles & Document;

@Schema()
export class Roles{
  @Prop({ required: true })
  userName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true, default: "user" })
  role: string;

  @Prop({ required: true, default: Date.now() })
  createdAt: Date;

  @Prop({ required: true, default: Date.now() })
  updatedAt: Date;
  };

  export const RolesSchema = SchemaFactory.createForClass(Roles);