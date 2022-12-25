import { MysqlError, PoolConnection } from 'mysql';

import BaseCrudRepository from './base/BaseCrudRepository';
import DatasourceDto from '../DataTransferObjects/datasource.dto';

export default class DatasourceRepository extends BaseCrudRepository {
  constructor() {
    super('ds');
  }

  // Get all datasources
  async getAll(): Promise<DatasourceDto> | undefined {
    return new Promise((resolve, reject) => {
      this.db
        .getPool()
        .getConnection((error: MysqlError, connection: PoolConnection) => {
          connection.query(
            `SELECT * FROM ${this.tableName}`,
            (err: MysqlError, res: DatasourceDto) => {
              if (err) reject(err);
              else resolve(res);
            },
          );
        });
    });
  }
}
