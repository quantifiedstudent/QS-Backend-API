import { MysqlError } from 'mysql';

import BaseCrudRepository from './base/BaseCrudRepository';
import UserDataSourceDto from '../DataTransferObjects/userDataSource.dto';

export default class UserDataSourceRepository extends BaseCrudRepository {
  constructor() {
    super('used_ds');
  }

  // Get all data sources that belong to a user
  async getAllByUserId(
    canvasUserId: number,
  ): Promise<UserDataSourceDto> | undefined {
    return new Promise((resolve, reject) => {
      this.db.getPool().getConnection((error: MysqlError, connection) => {
        connection.query(
          `SELECT * FROM ${this.tableName} WHERE FK_CanvasId = ?`,
          [canvasUserId],
          (err: MysqlError, res: UserDataSourceDto) => {
            if (err) reject(err);
            else resolve(res);
          },
        );
      });
    });
  }

  // Get specific data source that belongs to a user
  async getById(
    canvasUserId: number,
    datasourceId: number,
  ): Promise<UserDataSourceDto> | undefined {
    return new Promise((resolve, reject) => {
      this.db.getPool().getConnection((error: MysqlError, connection) => {
        connection.query(
          `SELECT * FROM ${this.tableName} WHERE FK_CanvasId = ? AND FK_DsId = ?`,
          [canvasUserId, datasourceId],
          (err: MysqlError, res: Array<UserDataSourceDto>) => {
            if (err) reject(err);
            else resolve(res[0]);
          },
        );
      });
    });
  }

  async createUsedDataSource(
    canvasUserId: number,
    datasourceId: number,
    token: string,
  ): Promise<UserDataSourceDto> | undefined {
    return new Promise((resolve, reject) => {
      this.db.getPool().getConnection((error: MysqlError, connection) => {
        if (error) reject(error.message);
        connection.query(
          `INSERT INTO ${this.tableName} (FK_CanvasId, FK_DsId, token) VALUES (?, ?, ?)`,
          [canvasUserId, datasourceId, token],
          (err: MysqlError, res: UserDataSourceDto) => {
            if (err) reject(err);
            else resolve(res);
          },
        );
        connection.release();
      });
    });
  }
}
