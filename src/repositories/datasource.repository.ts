import BaseCrudRepository from "../repositories/base/BaseCrudRepository";
import {UserDto} from "DataTransferObjects/user.dto";
import {DatasourceDto} from "../DataTransferObjects/datasource.dto";

export default class DatasourceRepository extends BaseCrudRepository {
    constructor() {
        super('ds');
    }

    // Get all datasources
    async getAll() : Promise<DatasourceDto> | undefined {
        return new Promise((resolve, reject) => {
            this.db.getPool().getConnection((err, connection) => {
                connection.query(
                    `SELECT * FROM ${this.tableName}`,
                    (err: any, res: any) => {
                        if (err) reject(err)
                        else resolve(res);
                });
            })
        });
    }
}