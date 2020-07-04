import * as dotenv from 'dotenv';

const config = dotenv.config();

export const CONFIG = {
  PORT: config.parsed.PORT || 3000,
  SECRET: config.parsed.SECRET || 'SECRET123321',
  DB_USER: config.parsed.DB_USER || 'admin',
  DB_PASS: config.parsed.DB_PASS || 'admin',
  DB_PORT: +config.parsed.DB_PORT || 5432,
  DB_HOST: config.parsed.DB_HOST || 'localhost',
  DB_NAME: config.parsed.DB_NAME || 'taskmanager',
};
