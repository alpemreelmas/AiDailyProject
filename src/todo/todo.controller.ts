import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards, Req
} from "@nestjs/common";
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Types } from 'mongoose';
import { AuthGuard } from '../auth/auth.guard';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Req() req, @Body() createTodoDto: CreateTodoDto) {
    return this.todoService.create(createTodoDto, req.user);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Req() req) {
    return this.todoService.findAll(req.user);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Req() req, @Param('id') id: Types.ObjectId) {
    return this.todoService.findOne(id, req.user);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Req() req,
    @Param('id') id: Types.ObjectId,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return this.todoService.update(id, updateTodoDto, req.user);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Req() req, @Param('id') id: Types.ObjectId) {
    return this.todoService.remove(id, req.user);
  }
}
