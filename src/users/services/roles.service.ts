import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { Roles } from '../entities/roles.schema';
import { UserAndRoles } from '../entities/userRoles';
import { User, UserDocument } from '../entities/user.schema';
import { transaction } from 'src/helpers/transaction.helper';

@Injectable()
export class RolesService {
    constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(Roles.name)
    private readonly roleModel: Model<Roles>,
    @InjectModel(UserAndRoles.name)
    private readonly userAndRolesModel: Model<UserAndRoles>,
    @InjectModel(User.name)
    private UserModel: Model<UserDocument>,
    ) {}

    findById(id: string) {
        return transaction(this.connection, (session) =>
          this.roleModel.findById(id),
        );
      }

    async findByName(name: string) {
        return await this.roleModel.findOne({ name }).exec();
    }

    async getUserRoles(id: Types.ObjectId) {
        const user = await this.UserModel.findById(id);
        if (!user) {
            return [];
        }
    
        const userRoles = await this.userAndRolesModel.find({ userId: user._id }).populate("roleId");

        return userRoles;

    }

    removeUserRoles(userId: Types.ObjectId){
        return this.userAndRolesModel.deleteMany({userId: userId})
    }
}
