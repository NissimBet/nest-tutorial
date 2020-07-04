import { Repository, EntityRepository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTaskFilteredDto } from './dto/get-tasks-filtered.dto';
import { User } from 'src/auth/user.entity';
import { Logger, InternalServerErrorException } from '@nestjs/common';

/**
 * Repositorio de Tasks, esta clase se encarga de manejar la logica de la DB con respecto a los tasks
 */
@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('TaskRepository');

  /**
   * funcion que crea un task a un usuario
   *
   * @param createTaskDto DTO para la creacion de un task. Almacena la estructura y asegura que sea correcta
   * @param user usuario a quien se le va agregar un task
   */
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { description, title } = createTaskDto; // destructurar los valores del dto

    // crear un nuevo task para la db y  asignar los valores
    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user; // usuario que recibe el task

    try {
      // intentar almacenar el task nuevo
      await task.save();
    } catch (error) {
      this.logger.error(
        `Failed creating new task for user "${user.username}", Data: ${createTaskDto}`,
        error.stack,
      );
      // tirar error 500
      throw new InternalServerErrorException();
    }

    // se va a regresar el nuevo task, pero la info de usuario es sensitiva y no importante, se elimina.
    // el task ya se guardo, eliminar aca no lo elimina de la db
    delete task.user;
    return task;
  }

  /**
   * la funcion que hace la busqueda y lleva a cabo los filtros que el usuario indica
   *
   * @param filterDto DTO de los filtros posibles que se pasaron por el request
   * @param user el usuario que esta haciendo la busqueda
   */
  async getTasks(filterDto: GetTaskFilteredDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    // crear un querybuilder para dinamicamente aplicar clausulas de where
    // la instancia del query se aplica para el entity de 'task'
    const query = this.createQueryBuilder('task');

    // buscar los tasks del usuario. esta columna userId (task.userId) es la que la db genera pero que TypeORM no lo hace, por eso es importante definir la columna en el entity por separado
    query.where('task.userId = :userId', { userId: user.id });

    // si se paso un estatus para la busqueda, agregar el where de status
    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    // si se paso un estatus para la busqueda, agregar la busqueda por nombre
    if (search) {
      query.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    try {
      // realizar la busqueda con los queries definidos y regresar el resultado
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      // si hubo un error, mostrar el logger y levantar un error 500, que nest finaliza
      this.logger.error(
        `Failed to get tasks for user "${user.username}", DTO: ${JSON.stringify(
          filterDto,
        )}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
