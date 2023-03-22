import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from '../src/entity/TodoEntity';
import { TodoController } from '../src/todo/todo.controller';
import { TodoDto } from '../src/todo/todoDto';
import { AppModule } from '../src/app/app.module';
import { TodoService } from '../src/todo/todo.service';

describe('TodoController (e2e)', () => {
  let app: INestApplication;
  let todoService: TodoService;
  let todoRepository: Repository<Todo>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      imports: [AppModule],
      providers: [
        TodoService,
        {
          provide: getRepositoryToken(Todo),
          useClass: class MockRepository extends Repository<Todo> {},
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    todoService = moduleFixture.get<TodoService>(TodoService);
    todoRepository = moduleFixture.get<Repository<Todo>>(
      getRepositoryToken(Todo),
    );
  });

  afterEach(async () => {
    await todoRepository.clear();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/todos (GET)', () => {
    it('should return an empty array', () => {
      return request(app.getHttpServer())
        .get('/api/todos')
        .expect(200)
        .expect([]);
    });

    it('should return an array of Todo objects', async () => {
      const todo1: Todo = { id: 1, task: 'Todo 1', highlight: false };
      const todo2: Todo = { id: 2, task: 'Todo 2', highlight: true };
      await todoRepository.save([todo1, todo2]);

      return request(app.getHttpServer())
        .get('/api/todos')
        .expect(200)
        .expect([todo1, todo2]);
    });
  });

  describe('/api/todos (POST)', () => {
    it('should create a new Todo object', async () => {
      const todoDto: TodoDto = { task: 'New Todo', highlight: true };
      const response = await request(app.getHttpServer())
        .post('/api/todos')
        .send(todoDto)
        .expect(201);

      const createdTodo: Todo = await todoRepository.findOne(response.body.id);
      expect(createdTodo).toEqual({ id: response.body.id, ...todoDto });
    });
  });

  describe('/api/todos/:id (DELETE)', () => {
    it('should delete an existing Todo object', async () => {
      const todo: Todo = { id: 1, task: 'Todo 1', highlight: false };
      await todoRepository.save(todo);

      await request(app.getHttpServer()).delete('/api/todos/1').expect(204);

      const deletedTodo: Todo = await todoRepository.findOneBy({ id: 1 });
      expect(deletedTodo).toBeUndefined();
    });
  });
  describe('/api/todos/:id (PUT)', () => {
    it('should update an existing Todo object', async () => {
      const todo: Todo = { id: 1, task: 'Todo 1', highlight: false };
      const updatedTodo: TodoDto = { task: 'Updated Todo', highlight: true };
      await todoRepository.save(todo);

      await request(app.getHttpServer())
        .put(`/api/todos/${todo.id}`)
        .send(updatedTodo)
        .expect(200);

      const foundTodo: Todo = await todoRepository.findOneBy({ id: 1 });
      expect(foundTodo.task).toEqual(updatedTodo.task);
      expect(foundTodo.highlight).toEqual(updatedTodo.highlight);
    });
  });
});
