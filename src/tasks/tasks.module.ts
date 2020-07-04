import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskRepository]), //se importa el modulo de typeorm con extension para el task repository
    AuthModule, // se utiliza el authmodule y su configuracion para la autenticacion de las rutas
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
