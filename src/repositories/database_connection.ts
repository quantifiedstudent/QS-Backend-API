import {Connection, Pool} from "mysql";

var mysql = require('mysql');

export default class DatabaseConnection {
    private connection: Connection;

    public getConnection() {
        if (this.connection) return this.connection;
        const pool: Pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DATABASE
        });
        pool.getConnection((err: any, connection: Connection) => {
            if (err) {
                console.error("Can't connect to db: ", err)
            }
            this.connection = connection;
        });
        return this.connection;
    }
}