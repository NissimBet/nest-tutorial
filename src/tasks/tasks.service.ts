import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';

import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilteredDto } from './dto/get-tasks-filtered.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

/**
 * El servicio de tasks, se encarga de hacer la logica que el controlador no necesita hacer y llama donde sea necesario al repositorio de tasks
 */
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository) private taskRepository: TaskRepository, // inyectar el taskrepo cuando se inicializa este servicio para su uso
  ) {}

  /**
   * Funcion que realiza la busqueda de un task para un usuario
   *
   * @param id id del task que se quiere buscar
   * @param user usuario que hace la busqueda
   */
  async getTaskById(id: number, user: User): Promise<Task> {
    // busqueda donde el id del taskk y del usuario son los presentados
    const found = await this.taskRepository.findOne({
      where: { id, userId: user.id },
    });

    // si no se encuentra, levantar un 404
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return found;
  }

  /**
   * funcion que realiza la creacion de un task para un usuario, la logica la lleva a cabo el repositorio, ya que el la logica es mayormente de la db
   *
   * @param createTaskDto datos de creacion de un task
   * @param user usuario que realiza la creacion
   */
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  /**
   * esta funcion realiza el update del estado del task de un usuario
   *
   * @param id id del task a modificar
   * @param status status nuevo del task
   * @param user usuario que realiza la modificacion+
   */
  async updateStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    // busca un task, si no lo encuentra lanza un 404
    const task = await this.getTaskById(id, user);

    // modifica el status y lo guarda
    task.status = status;
    await task.save();

    // regresa el nuevo task
    return task;
  }

  /**
   * funcion que realiza la busqueda y filtrado de los tasks de un usuario
   *
   * @param filterDto estructura de almacenamiento de los filtros del usuario
   * @param user usuario que realiza la busqueda
   */
  async getTasks(filterDto: GetTaskFilteredDto, user: User): Promise<Task[]> {
    return await this.taskRepository.getTasks(filterDto, user);
  }

  /**
   * funcion que elimina un task de un usuario
   *
   * @param id id del task a eliminar
   * @param user usuario que elimina un task
   */
  async deleteTask(id: number, user: User): Promise<void> {
    // eliminar el task del usuario en 1 solo query
    const affected = await this.taskRepository.delete({ id, userId: user.id });

    // si la cantidad de filas afectadas es 0, no se pudo eliminar, lanzar 404
    if (affected.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }
}
