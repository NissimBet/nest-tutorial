import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';

import { v4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilteredDto } from './dto/get-tasks-filtered.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithfilter(filterDto: GetTaskFilteredDto): Task[] {
    const { status, search } = filterDto;
    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter(task => task.status === status);
    }

    if (search) {
      tasks = tasks.filter(
        task =>
          task.title.includes(search) || task.description.includes(search),
      );
    }

    return tasks;
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
