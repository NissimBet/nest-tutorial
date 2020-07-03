import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { typeORMConfig } from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

/**
 * Es el modulo de entrada del servidor
 */
@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig), // inicializas el typeORM (conexion a la base de datos) y la haces la raiz del sistema
    TasksModule, // inicializa el modulo de tasks
    AuthModule, // inicializa el modulo de auth
  ],
})
export class AppModule {}
