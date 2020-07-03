import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';

import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilteredDto } from './dto/get-tasks-filtered.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TasksModule } from './tasks.module';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository) private taskRepository: TaskRepository,
  ) {}

  async getTaskById(id: number): Promise<Task> {
    const found = await this.taskRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return found;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }

  async updateStatus(id: number, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);

    task.status = status;
    await task.save();

    return task;
  }

  async getTasks(filterDto: GetTaskFilteredDto): Promise<Task[]> {
    return await this.taskRepository.getTasks(filterDto);
  }

  async deleteTask(id: number): Promise<void> {
    const affected = await this.taskRepository.delete(id);

    if (affected.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }
}
