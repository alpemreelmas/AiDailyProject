import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export type rolesDocument = Roles & Document;

@Schema()
export class Roles{
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, default: Date.now() })
  createdAt: Date;

  @Prop({ required: true, default: Date.now() })
  updatedAt: Date;
  };

  export const RolesSchema = SchemaFactory.createForClass(Roles);