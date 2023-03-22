import { Injectable } from '@nestjs/common';
import { TodoDto } from './todoDTO';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from '../entity/TodoEntity';
import { Repository } from 'typeorm';
@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
  ) {}
  getTodos(): Promise<Todo[]> {
    return this.todoRepository.find();
  }
  async createTodo(todo: TodoDto): Promise<void> {
    await this.todoRepository.save(todo);
  }

  async deleteTodo(id: number): Promise<void> {
    await this.todoRepository.delete(id);
  }
  // async updateTodo(id: number, update: TodoDto): Promise<void> {
  //   await this.todoRepository.update(
  //     await this.todoRepository.findOneBy({ id: id }),
  //     update,
  //   );
  // }

  async updateTodo(id: number, update: TodoDto): Promise<void> {
    await this.todoRepository.update(id, update);
  }
}
