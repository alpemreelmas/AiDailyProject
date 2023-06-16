import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Todo, TodoDocument } from './entities/todo.schema';
import { Connection, Model, Types } from 'mongoose';
import { transaction } from '../helpers/transaction.helper';

@Injectable()
export class TodoService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(Todo.name) private TodoModel: Model<TodoDocument>,
  ) {}

  create(createTodoDto: CreateTodoDto, user: any) {
    return transaction(this.connection, (session) =>
      this.TodoModel.create({ ...createTodoDto, user: user.sub }),
    );
  }

  findAll(user: any) {
    return transaction(this.connection, (session) =>
      this.TodoModel.find({ user: user.sub }),
    );
  }

  findOne(id: Types.ObjectId, user: any) {
    return transaction(this.connection, (session) =>
      this.TodoModel.find({ id: id, user: user.sub }),
    );
  }

  update(id: Types.ObjectId, updateTodoDto: UpdateTodoDto, user: any) {
    return transaction(this.connection, async (session) => {
      await this.TodoModel.findByIdAndUpdate(
        id,
        { ...updateTodoDto, user: user.sub },
        {
          returnDocument: 'after',
        },
      );
    });
  }

  remove(id: Types.ObjectId, user: any) {
    return transaction(this.connection, (session) =>
      this.TodoModel.findOneAndDelete({ id: id, user: user.sub }),
    );
  }
}
