import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CONFIG } from './env.config';

/**
 * Es la configuracion de conexion para TypeORM
 */
export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'postgres', // tipo de base de datos (postgres, mongo, mysql, etc)
  host: CONFIG.DB_HOST,
  port: CONFIG.DB_PORT,
  username: CONFIG.DB_USER,
  password: CONFIG.DB_PASS,
  database: CONFIG.DB_NAME,
  // archivos donde estan definidas las entidades. __dirname es el directorio actual. Esto busca en src a cualquier archivo que termine en entiti.js/ts
  entities: [
    __dirname + '/../**/*.entity.ts',
    __dirname + '/../**/*.entity.js',
  ],
  synchronize: true,
};
