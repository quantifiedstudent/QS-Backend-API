import helmet from "helmet";
import Controller from './interfaces/controller.interface';
import errorMiddleware from './middlewares/error.middleware';
import DatabaseConnection from "./repositories/database_connection";
import authMiddleware from './middlewares/auth.middleware';

require('dotenv').config();
const cors = require('cors');
const express = require('express');

const allowedOrigins = ['https://qsfront.testenvi.nl'];

class App {
    public app;
    public db = new DatabaseConnection();

    constructor(controllers: Controller[]) {
        this.app = express();
        try {
            this.db.getPool();
            console.log("info", "Database Connected")
        } catch (e) {
            console.error("Can't connect to db: ", e)
        }
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    }

    public listen() {
        let port = process.env.PORT || 8000;
        this.app.listen(port, () => {
            console.log('info', `Server listening on port ${port}`)
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
        this.app.use(authMiddleware);
    }

    private initializeControllers(controllers: Controller[]) {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }
}

export default App;