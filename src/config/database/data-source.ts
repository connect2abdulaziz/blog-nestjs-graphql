import * as dotenv from "dotenv";
import { DataSource, DataSourceOptions } from "typeorm";

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  synchronize: true,
  dropSchema: false,
  logging: true,
  logger: 'file',

  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/**/*.migrations/*.js'],
  subscribers: ['dist/**/*.subscriber.js'],
  migrationsTableName: 'migrations_table',
}

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;