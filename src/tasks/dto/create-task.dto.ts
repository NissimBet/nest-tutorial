import { IsNotEmpty } from 'class-validator';

/**
 * Este DTO (Data Transfer Object) estructrura los datos para la creacion de tasks y provee los decoradores para revisar que los datos sean correctos al ser parseados por Nest
 */
export class CreateTaskDto {
  // asegurar que el titulo no este vacio
  @IsNotEmpty()
  title: string;

  // asegurar que la descripcion no sea vacia
  @IsNotEmpty()
  description: string;
}
