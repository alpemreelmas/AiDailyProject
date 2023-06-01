import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Todo, TodoDocument } from './entities/todo.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class TodoService {
  constructor(@InjectModel(Todo.name) private TodoModel: Model<TodoDocument>) {}

  create(createTodoDto: CreateTodoDto, user: any) {
    return this.TodoModel.create({ ...createTodoDto, user: user.sub });
  }

  findAll(user: any) {
    return this.TodoModel.find({ user: user.sub });
  }

  findOne(id: Types.ObjectId, user: any) {
    return this.TodoModel.find({ id: id, user: user.sub });
  }

  update(id: Types.ObjectId, updateTodoDto: UpdateTodoDto, user: any) {
    return this.TodoModel.findByIdAndUpdate(
      id,
      { ...updateTodoDto, user: user.sub },
      {
        returnDocument: 'after',
      },
    );
  }

  remove(id: Types.ObjectId, user: any) {
    return this.TodoModel.findOneAndDelete({ id: id, user: user.sub });
  }
}
