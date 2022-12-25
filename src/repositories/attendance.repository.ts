import { MysqlError } from 'mysql';

import BaseCrudRepository from './base/BaseCrudRepository';
import AttendanceDto from '../DataTransferObjects/attendance.dto';

export default class AttendanceRepository extends BaseCrudRepository {
  constructor() {
    super('ds_attendance');
  }

  async getAllForUser(userId: number): Promise<AttendanceDto> | undefined {
    return new Promise((resolve, reject) => {
      this.db.getPool().getConnection((_, connection) => {
        connection.query(
          `SELECT * FROM ${this.tableName} WHERE FK_CanvasId = ?`,
          [userId],
          (err: MysqlError, res: AttendanceDto) => {
            if (err) reject(err);
            else resolve(res);
          },
        );
      });
    });
  }

  async addAttendance(
    userId: number,
    atLocation: boolean,
  ): Promise<AttendanceDto> | undefined {
    return new Promise((resolve, reject) => {
      this.db.getPool().getConnection((_, connection) => {
        connection.query(
          `INSERT INTO ${this.tableName} (FK_CanvasId, AtLocation) VALUES(?, ?)`,
          [userId, atLocation],
          (err: MysqlError, res: Array<AttendanceDto>) => {
            if (err) reject(err);
            else resolve(res[0]);
          },
        );
      });
    });
  }
}
