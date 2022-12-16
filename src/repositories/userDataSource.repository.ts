import BaseCrudRepository from "../repositories/base/BaseCrudRepository";
import {UserDto} from "DataTransferObjects/user.dto";
import {DatasourceDto} from "../DataTransferObjects/datasource.dto";
import {UserDataSourceDto} from "../DataTransferObjects/userDataSource.dto";
import {FieldInfo, MysqlError} from "mysql";

export default class UserDataSourceRepository extends BaseCrudRepository {
    constructor() {
        super('used_ds');
    }

    // Get all data sources that belong to a user
    async getAllByUserId(canvasUserId: string) : Promise<UserDataSourceDto> | undefined {
        return new Promise((resolve, reject) => {
            this.db.getPool().getConnection((err, connection) => {
                connection.query(
                    `SELECT * FROM ${this.tableName} WHERE FK_CanvasId = ?`, [canvasUserId],
                    (err: MysqlError, res: any, fields: FieldInfo[]) => {
                        console.log(fields)
                        if (err) reject(err)
                        else resolve(res);
                });
            })
        });
    }

    // Get specific data source that belongs to a user
    async getById(canvasUserId: string, datasourceId: string) : Promise<UserDataSourceDto> | undefined {
        return new Promise((resolve, reject) => {
            this.db.getPool().getConnection((err, connection) => {
                connection.query(
                    `SELECT * FROM ${this.tableName} WHERE FK_CanvasId = ? AND FK_DsId = ?`, [canvasUserId, datasourceId],
                    (err: any, res: any) => {
                        if (err) reject(err)
                        else resolve(res);
                });
            })
        });
    }

    async createUsedDataSource(canvasUserId: string, datasourceId: string, token: string) : Promise<UserDataSourceDto> | undefined {
        return new Promise((resolve, reject) => {
            this.db.getPool().getConnection((err, connection) => {
                if (err) reject(err);
                connection.query(
                    `INSERT INTO ${this.tableName} (FK_CanvasId, FK_DsId, token) VALUES (?, ?, ?)`,
                    [canvasUserId, datasourceId, token],
                    (err: MysqlError, res: any) => {
                        if (err) reject(err)
                        else resolve(res);
                    });
                connection.release();
            })
        });
    }
}