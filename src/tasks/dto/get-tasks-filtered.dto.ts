import { TaskStatus } from '../task.model';

export class GetTaskFilteredDto {
  status: TaskStatus;
  search: string;
}
