import { TypeOrmModuleOptions } from '@nestjs/typeorm';

/**
 * Es la configuracion de conexion para TypeORM
 */
export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'postgres', // tipo de base de datos (postgres, mongo, mysql, etc)
  host: 'localhost',
  port: 5432,
  username: 'admin',
  password: 'admin',
  database: 'taskmanagement',
  // archivos donde estan definidas las entidades. __dirname es el directorio actual. Esto busca en src a cualquier archivo que termine en entiti.js/ts
  entities: [
    __dirname + '/../**/*.entity.ts',
    __dirname + '/../**/*.entity.js',
  ],
  synchronize: true,
};
