import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'betesh123',
  database: 'taskmanagement',
  entities: [
    __dirname + '/../**/*.entity.ts',
    __dirname + '/../**/*.entity.js',
  ],
  synchronize: true,
};
