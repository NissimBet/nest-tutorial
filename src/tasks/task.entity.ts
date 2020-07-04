import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { TaskStatus } from './task-status.enum';
import { User } from './../auth/user.entity';

/**
 * Task de la entidad de un task como va a ser representado en la DB
 */
@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;

  /**
   * Se describe una relacion con el usuario, cada usuario tiene 0+ de tasks. NO GENERA UNA COLUMNA
   * La DB si genera la columna, pero TypeORM no lo hace automaticamente, es necesario indicar que si existe la columna
   */
  @ManyToOne(
    type => User, // la relacion es con la ENTIDAD de usuario
    user => user.tasks, // la relacion se hace por medio del arreglo de tasks
    { eager: false }, // este lado de la relacion no es eager, al hacer un find, esta relacion no se ve reflejada
  )
  user: User;

  // se usa una columna para almacenar el id del usuario del task
  @Column()
  userId: number;
}
