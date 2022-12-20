import BaseCrudRepository from "../repositories/base/BaseCrudRepository";
import {UserDto} from "DataTransferObjects/user.dto";
import {DatasourceDto} from "../DataTransferObjects/datasource.dto";
import {SharedDataSourceDto} from "../DataTransferObjects/sharedDataSource.dto";

export default class SharedDataSourceRepository extends BaseCrudRepository {
    constructor() {
        super('share');
    }

    async getSharedDataSource(userId1: number, userId2: number, dataSourceId: number) : Promise<SharedDataSourceDto> | undefined {
        return new Promise((resolve, reject) => {
            this.db.getPool().getConnection((err, connection) => {
                connection.query(
                    // Checking 2 times because we don't know which user is the owner of the datasource
                    `SELECT * FROM ${this.tableName} 
                    WHERE ? IN (FK_CanvasId1, FK_CanvasId2) AND ? IN (FK_CanvasId1, FK_CanvasId2) AND FK_ShareDs = ?`, [userId1, userId2, dataSourceId],
                    (err: any, res: any) => {
                        if (err) reject(err)
                        else resolve(res[0]);
                    });
            })
        });
    }

    async createSharedDataSource(userId1: number, userId2: number, dataSourceId: number) : Promise<SharedDataSourceDto> | undefined {
        return new Promise((resolve, reject) => {
            this.db.getPool().getConnection((err, connection) => {
                connection.query(
                    `INSERT INTO ${this.tableName} (FK_CanvasId1, FK_CanvasId2, FK_ShareDs) VALUES (?, ?, ?)`, [userId1, userId2, dataSourceId],
                    (err: any, res: any) => {
                        if (err) reject(err)
                        else resolve(res[0]);
                    });
            })
        });
    }
}