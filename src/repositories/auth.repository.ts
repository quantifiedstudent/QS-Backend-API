import BaseCrudRepository from "../repositories/base/BaseCrudRepository";
import {UserDto} from "DataTransferObjects/user.dto";

export default class AuthRepository extends BaseCrudRepository {
    constructor() {
        super('auth');
    }

    // Get user by id
    async getById(userId: string) : Promise<UserDto> | undefined {
        return new Promise((resolve, reject) => {
            this.db.getConnection().query(
            `SELECT * FROM ${this.tableName} WHERE user_id = $1`, [userId],
            (err: any, res: { rows: (UserDto | PromiseLike<UserDto>)[]; }) => {
                if (err) reject(err)
                else resolve(res.rows[0]);
            });
        });
    }

    // Create new user
    async registerUser(canvasId: string, canvasToken: string, AcceptedTerms: boolean) : Promise<UserDto> | undefined {
        return new Promise((resolve, reject) => {
            this.db.getConnection().query(
                `INSERT
                        INTO ${this.tableName}  
                        (canvasId, canvasToken, AcceptedTerms)
                        VALUES ($1, $2, $3)`, [canvasId, canvasToken, AcceptedTerms],
                (err: any, res: any) => {
                            if (err) reject(err)
                            else {
                                console.log(res);
                                this.getById(canvasId)
                                    .then((user) => resolve(user!))
                                    .catch((err) => reject);
                            }
                        });
        });
    }

    // get AllUsers
    async getAllUsers() : Promise<UserDto[]> | undefined {
        return new Promise((resolve, reject) => {
            this.db.getConnection().query(
                `SELECT * FROM ${this.tableName}`,
                (err: any, res: { rows: UserDto[] | PromiseLike<UserDto[]>; }) => {
                    if (err) reject(err)
                    else resolve(res.rows);
                });
        });
    }
}