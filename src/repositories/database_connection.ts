import { Pool } from 'mysql';

const mysql = require('mysql')

export default class DatabaseConnection {
  private pool: Pool;

  public getPool() {
    if (this.pool) return this.pool;
    this.pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DATABASE,
    });
    return this.pool;
  }
}
