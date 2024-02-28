import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, SchemaTypes, Types } from 'mongoose';

export type userAndRolesDocument = UserAndRoles & Document;

@Schema()
export class UserAndRoles{

    @Prop({ type: 'ObjectId', ref: 'User' })
    userId: string;

    @Prop({ type: 'ObjectId', ref: 'Roles' })
    roleId: string;

    @Prop({ required: true, default: Date.now() })
    createdAt: Date;

    @Prop({ required: true, default: Date.now() })
    updatedAt: Date;
};

  export const UserAndRolesSchema = SchemaFactory.createForClass(UserAndRoles);