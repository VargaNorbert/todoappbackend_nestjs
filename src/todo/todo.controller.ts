import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoDto } from './todoDTO';
import { Todo } from '../entity/TodoEntity';

@Controller('/api/todos')
export class TodoController {
  constructor(private readonly todoservice: TodoService) {}
  @Get('')
  getTodos(): Promise<Todo[]> {
    return this.todoservice.getTodos();
  }
  @Post('')
  createTodo(@Body() todo: TodoDto): Promise<void> {
    return this.todoservice.createTodo(todo);
  }

  @Delete(':id')
  deleteTodo(@Param() params): Promise<void> {
    return this.todoservice.deleteTodo(params.id);
  }

  @Put(':id')
  updateTodo(@Param() params, @Body() body: TodoDto) {
    return this.todoservice.updateTodo(Number(params.id), body);
  }
}
