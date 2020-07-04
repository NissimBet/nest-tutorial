import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Patch,
  Query,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilteredDto } from './dto/get-tasks-filtered.dto';
import { TaskStatusValidationPipe } from './pipes/tasks-status-validation.pipe';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';

/**
 * Controlador de tasks, su ruta es '/tasks'.
 * Este controlador utiliza el guard, que por default fue definido como el 'jwt',
 * si el jwt no es correcto, nest directamente envia un 401,
 */
@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  // inyectar el servicio de tasks
  constructor(private tasksService: TasksService) {}
  private logger = new Logger('TaskController');

  /**
   * Handler de la ruta 'tasks/' que busca los tasks de un usuario
   *
   * @param filterDto dto que define los filtros que pueden estar en el query del request
   * @param user usuario que va a hacer el request, se parsea por el @GetUser definido que extrae los datos del usuario del request
   */
  @Get()
  async getTasks(
    @Query(ValidationPipe) filterDto: GetTaskFilteredDto, // regresa los datos presentes en el query y revisa que sean correctos por los decoradores del DTO
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(
      `User "${user.username}" retreiving all tasks. Filters ${JSON.stringify(
        filterDto,
      )}`,
    );
    return await this.tasksService.getTasks(filterDto, user);
  }

  /**
   * Handler de la ruta Get en 'tasks/:id'. el id se pasa por parametro de la ruta y se puede acceder con el decorador de @Param con el nombre 'id'
   *
   * @param id id del task que se quiere busscar
   * @param user usuario que va a hacer la busqueda
   */
  @Get('/:id')
  async getTaskById(
    @Param('id', ParseIntPipe) id: number, // toma el param y asegura que sea entero
    @GetUser() user: User,
  ): Promise<Task> {
    return await this.tasksService.getTaskById(id, user);
  }

  /**
   * Handler de la ruta 'tasks/' por POST que le crea un task a un usuario.
   *
   * @param createTaskDto DTO de creacion de un task
   * @param user usuario que crea el task
   */
  @Post()
  @UsePipes(ValidationPipe)
  async createTask(
    @Body(ValidationPipe) createTaskDto: CreateTaskDto, // valida que la informacion de createtask esta en el body y conforma con los decoradores proveidos
    @GetUser() user: User, // extrae los datos de usuario del request
  ): Promise<Task> {
    this.logger.verbose(
      `User ${user.username} creating a new task. Data: ${JSON.stringify(
        createTaskDto,
      )}`,
    );
    return this.tasksService.createTask(createTaskDto, user);
  }

  /**
   * Handler de la ruta (DELETE) 'tasks/:id', el id se pasa por parametro de la ruta y se puede acceder con el decorador de @Param con el nombre 'id'
   *
   * @param id id del task a eliminar
   * @param user usuario que hace la eliminacion
   */
  @Delete('/:id')
  async deleteTask(
    @Param('id', ParseIntPipe) id: number, // revisar que el param es un int y tomarlo
    @GetUser() user: User, // extraer datos de usuario de request, usando el decorador
  ): Promise<void> {
    this.logger.verbose(`User ${user.username} deleting task of ID ${id}`);
    await this.tasksService.deleteTask(id, user);
  }

  /**
   * Handler de la ruta (PATCH) 'tasks/:id/status', el id se pasa por parametro de la ruta y se puede acceder con el decorador de @Param con el nombre 'id'
   *
   * @param id id de task a modificar
   * @param status nuevo status del task
   * @param user usuario que realiza el update
   */
  @Patch('/:id/status')
  async updateTaskStatus(
    @Param('id', ParseIntPipe) id: number, // el id es extraido de params y convertido a int
    @Body('status', TaskStatusValidationPipe) status: TaskStatus, // el status es tomado del body y validado contra el pipe de validacion personalizado @TaskStatusValidationPipe
    @GetUser() user: User, // el usuario es extraido del request
  ): Promise<Task> {
    return await this.tasksService.updateStatus(id, status, user);
  }
}
