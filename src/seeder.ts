import { seeder } from "nestjs-seeder";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./users/entities/user.schema";
import { UsersSeeder } from "./users/seeders/users.seeder";

seeder({  
    imports: [
    MongooseModule.forRoot("mongodb://127.0.0.1:27017/ai-feedback-project"),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],}).run([UsersSeeder]);