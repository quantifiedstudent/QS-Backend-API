import mysql, {Connection} from "mysql";

export default class DatabaseConnection {
    private connection: Connection;

    public getConnection() {
        if (this.connection) return this.connection;
        this.connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DATABASE
        });
        return this.connection;
    }
}