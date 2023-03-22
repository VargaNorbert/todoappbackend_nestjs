import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from '../entity/TodoEntity';
import { TodoModule } from '../todo/todo.module';
@Module({
  imports: [
    TodoModule,
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'todobackend',
      entities: [Todo],
      logging: 'all',
      synchronize: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
