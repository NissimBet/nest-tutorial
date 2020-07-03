import { PipeTransform, BadRequestException } from '@nestjs/common';
import { TaskStatus } from '../task.model';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
  ];

  private isStatusValid(status: any): boolean {
    return this.allowedStatuses.indexOf(status) !== -1;
  }
  transform(value: any) {
    if (!this.isStatusValid(value.toUpperCase())) {
      throw new BadRequestException(`"${value}" is an invalid status`);
    }

    return value;
  }
}
