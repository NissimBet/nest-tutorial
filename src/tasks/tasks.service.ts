import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';

import { v4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

    const newTask = <Task>{
      title,
      description,
      status: TaskStatus.OPEN,
      id: v4(),
    };

    this.tasks.push(newTask);
    return newTask;
  }
}
