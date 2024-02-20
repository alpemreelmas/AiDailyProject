import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Roles } from './entities/roles.schema';

@Injectable()
export class RolesService {
    constructor(@InjectModel(Roles.name) private readonly roleModel: Model<Roles>) {}

    async getUserRoles(email: string): Promise<string[]> {
        const roles = await this.roleModel.find({ email }).exec();
        return roles.map(role => role.role);
    }
}
