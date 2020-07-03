import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
} from 'typeorm';
import { hash } from 'bcrypt';
import { Task } from './../tasks/task.entity';

/**
 * El user entity es una entidad que representa a un usuario para typeorm.
 * se le define que el parametro de username es unico para que se haga la validacion internamente por la base de datos
 */
@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  // almacena la contrasena hasheada
  @Column()
  password: string;

  // almacena el salt usado para el hash de la contrasena
  @Column()
  salt: string;

  // se define una relacion entre tablas, esta es entre un usuario con varios tasks
  // esta no es una columna, solamente es la relacion.
  @OneToMany(
    // el tipo del target de la relacion
    type => Task,
    // el valor por el cual se hace la relacion
    task => task.user,
    // eager solo se puede setear de 1 lado de la relacion, si es eager, al hacer un find, el valor que es eager tambien es regresado
    { eager: true },
  )
  tasks: Task[];

  // esta funcion hace la validacino de un password no encriptado con el del usuario
  async validatePassword(password: string): Promise<boolean> {
    const hashPassword = await hash(password, this.salt);
    return hashPassword === this.password;
  }
}
