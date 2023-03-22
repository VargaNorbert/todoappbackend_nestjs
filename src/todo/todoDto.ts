import { IsString, IsNotEmpty } from 'class-validator';

export class TodoDto {
  @IsString()
  @IsNotEmpty()
  task: string;
  highlight: boolean;
}
