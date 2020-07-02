import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';

import { v4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { getHeapSpaceStatistics } from 'v8';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskById(id: string): Task {
    return this.tasks.find(task => task.id === id);
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

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }

  removeTaskById(id: string): void {
    this.tasks = this.tasks.filter(task => task.id !== id);
  }
}