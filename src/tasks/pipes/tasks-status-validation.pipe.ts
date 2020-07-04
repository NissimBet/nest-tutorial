import { PipeTransform, BadRequestException } from '@nestjs/common';
import { TaskStatus } from '../task-status.enum';

/**
 * Pipe de validacion para parseo de los datos de del body del request cuando sea necesario.
 * Asegura que los valores que se van a pasar sean uno de los status validos
 */
export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
  ];

  // funcion privada para la validacion
  private isStatusValid(status: any): boolean {
    return this.allowedStatuses.indexOf(status) !== -1;
  }
  // funcion requerida por el pipe de transformacion
  transform(value: any) {
    // si el valor no es valido, lanzar un error, que nest se encarga de reenviarlo correctamente
    if (!this.isStatusValid(value.toUpperCase())) {
      throw new BadRequestException(`"${value}" is an invalid status`);
    }

    // regresar el valo luego de ser validado
    return value;
  }
}
