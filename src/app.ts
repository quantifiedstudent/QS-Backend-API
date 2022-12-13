import helmet from "helmet";
import Controller from './interfaces/controller.interface';
import errorMiddleware from './middlewares/error.middleware';

require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mysql = require('mysql');

const allowedOrigins = ['https://qsfront.testenvi.nl'];
const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE
});

class App {
    public app;

    constructor(controllers: Controller[]) {
        this.app = express();
        App.connectDatabase()
            .then(() => console.log('info', 'Database Connected'))
            .catch((err: Error) => console.log('error', err))
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    }

    public listen() {
        this.app.listen(process.env.PORT || 5000, () => {
            console.log('info', `Server listening on port ${process.env.PORT || 5000}`)
        });
    }

    public getServer() {
        return this.app;
    }

    private initializeMiddlewares() {
        this.app.use(express.json());
        this.app.use(helmet());
        this.app.use(
            cors({
                origin: allowedOrigins,
            }),
        );
    }

    private initializeControllers(controllers: Controller[]) {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }

    private static async connectDatabase() {
        return con.connect(function(err: Error) {
            if (err) throw err; 
        });
    }

    public getDatabase() {
        return con;
    }
}

export default App;