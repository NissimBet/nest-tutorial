import { TaskStatus } from '../task-status.enum';
import { IsOptional, IsIn, IsNotEmpty } from 'class-validator';

/**
 * DTO (Data Transfer Object) que determina la estructura para el request de filtro y busqueda de tasks por la ruta 'tasks/'
 */
export class GetTaskFilteredDto {
  // indica que es opcional y que es uno de los valores posibles de TaskStatus
  @IsOptional()
  @IsIn([TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
  status: TaskStatus;

  // indica que es opcional y que no debe estar vacio
  @IsOptional()
  @IsNotEmpty()
  search: string;
}
