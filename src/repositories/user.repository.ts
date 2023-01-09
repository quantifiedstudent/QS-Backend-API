import { MysqlError } from 'mysql';
import UserDto from '../DataTransferObjects/user.dto';
import BaseCrudRepository from './base/BaseCrudRepository';

export default class UserRepository extends BaseCrudRepository {
  constructor() {
    super('user');
  }

  // Get user by id
  async getById(userId: string): Promise<UserDto> | undefined {
    return new Promise((resolve, reject) => {
      this.db.getPool().getConnection((_error: MysqlError, connection) => {
        connection.query(
          `SELECT * FROM ${this.tableName} WHERE PK_CanvasId = ?`,
          [userId],
          (err: MysqlError, res: Array<UserDto>) => {
            if (err) reject(err);
            else resolve(res[0]);
          },
        );
      });
    });
  }

  // Create new user
  async registerUser(
    canvasId: string,
    userName: string,
    AcceptedTerms: boolean,
  ): Promise<UserDto> | undefined {
    return new Promise((resolve, reject) => {
      this.db.getPool().getConnection((error: MysqlError, connection) => {
        if (error) reject(error.message);
        connection.query(
          `INSERT INTO ${this.tableName} (PK_CanvasId, UserName, AcceptedTerms) VALUES (?, ?, ?)`,
          [canvasId, userName, AcceptedTerms],
          (err: MysqlError) => {
            if (err) reject(err);
            else {
              this.getById(canvasId)
                .then((user) => resolve(user!))
                .catch(() => reject);
            }
          },
        );
        connection.release();
      });
    });
  }

  // get AllUsers
  async getAllUsers(): Promise<UserDto[]> | undefined {
    return new Promise((resolve, reject) => {
      this.db
        .getPool()
        .query(
          `SELECT * FROM ${this.tableName}`,
          (err: any, res: { rows: UserDto[] | PromiseLike<UserDto[]> }) => {
            if (err) reject(err);
            else resolve(res.rows);
          },
        );
    });
  }
}
