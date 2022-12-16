import BaseCrudRepository from "../repositories/base/BaseCrudRepository";
import {UserDto} from "DataTransferObjects/user.dto";

export default class UserRepository extends BaseCrudRepository {
    constructor() {
        super('user');
    }

    // Get user by id
    async getById(userId: string) : Promise<UserDto> | undefined {
        return new Promise((resolve, reject) => {
            this.db.getPool().query(
            `SELECT * FROM ${this.tableName} WHERE PK_CanvasId = ?`, [userId],
            (err: any, res: any) => {
                if (err) reject(err)
                else resolve(res[0]);
            });
        });
    }

    // Create new user
    async registerUser(canvasId: string, AcceptedTerms: boolean) : Promise<UserDto> | undefined {
        return new Promise((resolve, reject) => {
            this.db.getPool().getConnection((err, connection) => {
                if (err) reject(err);
                connection.query(
                    `INSERT INTO ${this.tableName} (PK_CanvasId, AcceptedTerms) VALUES (?, ?)`,
                    [canvasId, AcceptedTerms],
                    (err: any, res: any) => {
                        if (err) reject(err)
                        else {
                            this.getById(canvasId)
                                .then((user) => resolve(user!))
                                .catch((err) => reject);
                        }
                    });
                connection.release();
            })
        });
    }

    // get AllUsers
    async getAllUsers() : Promise<UserDto[]> | undefined {
        return new Promise((resolve, reject) => {
            this.db.getPool().query(
                `SELECT * FROM ${this.tableName}`,
                (err: any, res: { rows: UserDto[] | PromiseLike<UserDto[]>; }) => {
                    if (err) reject(err)
                    else resolve(res.rows);
                });
        });
    }
}