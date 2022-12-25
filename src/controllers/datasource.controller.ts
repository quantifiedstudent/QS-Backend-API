import { Request, Response, Router } from 'express';
import Controller from '../interfaces/controller.interface';
import DatasourceService from '../services/datasource.service';
import UserDataSourceService from '../services/userDataSource.service';
import SharedDataSourceService from '../services/sharedDataSource.service';

class DataSourceController implements Controller {
  public path = '/datasources';

  public router = Router();

  private dataSourceService = new DatasourceService();
  private userDatasourceService = new UserDataSourceService();
  private sharedDataSourceService = new SharedDataSourceService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/`, this.getAllDataSources);

    this.router.get(`${this.path}/user/:userId`, this.getAllUserDataSources);
    this.router.post(
      `${this.path}/user/:userId/:dataSourceId`,
      this.createUserDataSource,
    );
    this.router.get(
      `${this.path}/user/:userId/:dataSourceId`,
      this.getUserDataSourceById,
    );

    this.router.get(
      `${this.path}/share/:userId/:dataSourceId`,
      this.getSharedDataSource,
    );
    this.router.post(
      `${this.path}/share/:userId/:dataSourceId`,
      this.createSharedDataSource,
    );
  }

  private getAllDataSources = async (request: Request, response: Response) => {
    try {
      const dataSources = await this.dataSourceService.getAll();

      if (!dataSources)
        return response.status(404).send('No data sources found');

      return response.status(200).json(dataSources);
    } catch (err) {
      return response.status(400).json(err.errors);
    }
  };

  private getAllUserDataSources = async (
    request: Request,
    response: Response,
  ) => {
    const { userId } = request.params;

    if (!userId)
      return response.status(400).json({
        error: `Missing required parameter: ${userId != null ? '' : 'userId'}`,
      });

    try {
      const dataSources = await this.userDatasourceService.getAllByUserId(
        Number(userId),
      );

      if (!dataSources)
        return response.status(404).send('No data sources found');

      return response.status(200).json(dataSources);
    } catch (err) {
      return response.status(400).json(err.errors);
    }
  };

  private getUserDataSourceById = async (
    request: Request,
    response: Response,
  ) => {
    const { userId, dataSourceId } = request.params;

    if (!userId || !dataSourceId)
      return response.status(400).json({
        error: `Missing required parameter: ${userId != null ? '' : 'userId'}${
          dataSourceId != null ? '' : 'dataSourceId'
        }`,
      });

    try {
      const dataSource = await this.userDatasourceService.getById(
        Number(userId),
        Number(dataSourceId),
      );

      if (!dataSource)
        return response.status(404).send('No data sources found');

      return response.status(200).json(dataSource);
    } catch (err) {
      return response.status(400).json(err.errors);
    }
  };

  private createUserDataSource = async (
    request: Request,
    response: Response,
  ) => {
    const { userId, dataSourceId } = request.params;
    const { token } = request.body;

    if (!(userId && dataSourceId && token))
      return response.status(400).json({
        error: `Missing required parameters in body: ${
          userId != null ? '' : 'canvasId,'
        }${dataSourceId != null ? '' : 'dataSourceId,'}${
          token != null ? '' : 'token,'
        }`,
      });

    try {
      const dataSourceCreated = await this.userDatasourceService.create(
        Number(userId),
        Number(dataSourceId),
        token,
      );

      if (!dataSourceCreated)
        return response.status(500).send('Data source could not be created');

      return response.status(200).send('Data source created');
    } catch (err) {
      return response.status(400).json(err.errors);
    }
  };

  private getSharedDataSource = async (
    request: Request,
    response: Response,
  ) => {
    const { userId, dataSourceId } = request.params; // user and Data source that is requested, so the opposite side
    const { canvasUserId } = request.body; // User that is requesting the data source

    if (!canvasUserId)
      return response.status(404).json({
        error: `Missing parameters in body: ${
          canvasUserId != null ? '' : 'canvasUserId'
        }`,
      });

    try {
      const datasource = await this.sharedDataSourceService.getSharedDataSource(
        Number(userId),
        Number(canvasUserId),
        Number(dataSourceId),
      );

      if (!datasource)
        return response
          .status(404)
          .send('No data sources found, or not shared');

      // We know the datasource is shared now.
      const sharedDatasource = await this.userDatasourceService.getById(
        Number(userId),
        Number(dataSourceId),
      );
      if (!sharedDatasource)
        return response.status(404).send('No data sources found');

      return response.status(200).json(sharedDatasource);
    } catch (err) {
      return response.status(400).json(err.errors);
    }
  };

  private createSharedDataSource = async (
    request: Request,
    response: Response,
  ) => {
    const { userId, dataSourceId } = request.params; // user and Data source that is requested, so the opposite side
    const { canvasUserId } = request.body; // User that is requesting to share the data source

    if (!userId || !dataSourceId)
      return response.status(400).json({
        error: `Missing parameters in params: ${
          userId != null ? '' : 'userId,'
        }${dataSourceId != null ? '' : 'dataSourceId,'}${
          canvasUserId != null ? '' : 'canvasUserId,'
        }`,
      });

    if (!canvasUserId)
      return response.status(400).json({
        error: `Missing parameters in body: ${
          canvasUserId != null ? '' : 'canvasUserId'
        }`,
      });

    try {
      const shardedDatasourceCreated =
        await this.sharedDataSourceService.createSharedDataSource(
          Number(userId),
          Number(canvasUserId),
          Number(dataSourceId),
        );

      if (!shardedDatasourceCreated)
        return response.status(404).send('User or data source not found');

      return response.status(201).send('Data source was shared');
    } catch (err) {
      return response.status(400).json(err.errors);
    }
  };
}

export default DataSourceController;
