import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Todo, TodoDocument } from "./todo/entities/todo.schema";
import { Model } from "mongoose";

@Injectable()
export class AppService {
  constructor(@InjectModel(Todo.name) private TodoModel: Model<TodoDocument>) {}

  getHello() {
    return this.TodoModel.create({});
  }
}
