import helmet from 'helmet';

import Controller from './interfaces/controller.interface';
import errorMiddleware from './middlewares/error.middleware';
import DatabaseConnection from './repositories/database_connection';
import authMiddleware from './middlewares/auth.middleware';

const cors = require('cors')
const express = require('express')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger/swagger.json');

require('dotenv').config();

const allowedOrigins = ['https://qsfront.testenvi.nl', 'https://qsapi.azurewebsites.net'];

class App {
  public app;

  public db = new DatabaseConnection();

  constructor(controllers: Controller[]) {
    this.app = express();
    try {
      this.db.getPool();
      console.log('info', 'Database Connected');
    } catch (e) {
      console.error("Can't connect to db: ", e);
    }
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  public listen() {
    const port = process.env.PORT || 8000;
    this.app.listen(port, () => {
      console.log('info', `Server listening on port ${port}`);
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
    this.app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
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
