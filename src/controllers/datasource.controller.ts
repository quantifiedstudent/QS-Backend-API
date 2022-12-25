import { Request, Response, Router } from 'express';

import QuantifiedStudentException from 'helpers/exceptions/quantifiedStudentExceptions';

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

      if (!dataSources) return QuantifiedStudentException.NotFound(response);

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
      return QuantifiedStudentException.MissingParameters(response, ['userId']);

    try {
      const dataSources = await this.userDatasourceService.getAllByUserId(
        Number(userId),
      );

      if (!dataSources) return QuantifiedStudentException.NotFound(response);

      return response.status(200).json(dataSources);
    } catch (err) {
      return QuantifiedStudentException.ServerError(response);
    }
  };

  private getUserDataSourceById = async (
    request: Request,
    response: Response,
  ) => {
    const { userId, dataSourceId } = request.params;

    if (!userId || !dataSourceId)
      return QuantifiedStudentException.MissingParameters(response, [
        !userId && 'userId',
        !dataSourceId && 'dataSourceId',
      ]);

    try {
      const dataSource = await this.userDatasourceService.getById(
        Number(userId),
        Number(dataSourceId),
      );

      if (!dataSource) return QuantifiedStudentException.NotFound(response);

      return response.status(200).json(dataSource);
    } catch (err) {
      return QuantifiedStudentException.ServerError(response);
    }
  };

  private createUserDataSource = async (
    request: Request,
    response: Response,
  ) => {
    const { userId, dataSourceId } = request.params;
    const { token } = request.body;

    if (!(userId && dataSourceId && token))
      return QuantifiedStudentException.MissingParameters(response, [
        !userId && 'canvasId',
        !dataSourceId && 'dataSourceId',
        !token && 'token',
      ]);

    try {
      const dataSourceCreated = await this.userDatasourceService.create(
        Number(userId),
        Number(dataSourceId),
        token,
      );

      if (!dataSourceCreated)
        return QuantifiedStudentException.ServerError(response);

      return response.status(200).send('Data source created');
    } catch (err) {
      return QuantifiedStudentException.ServerError(response);
    }
  };

  private getSharedDataSource = async (
    request: Request,
    response: Response,
  ) => {
    const { userId, dataSourceId } = request.params; // user and Data source that is requested, so the opposite side
    const { canvasUserId } = request.body; // User that is requesting the data source

    if (!canvasUserId)
      QuantifiedStudentException.MissingParameters(response, ['canvasUserId']);

    try {
      const datasource = await this.sharedDataSourceService.getSharedDataSource(
        Number(userId),
        Number(canvasUserId),
        Number(dataSourceId),
      );

      if (!datasource)
        return QuantifiedStudentException.NotFound(
          response,
          'No data sources found, or not shared',
        );

      // We know the datasource is shared now.
      const sharedDatasource = await this.userDatasourceService.getById(
        Number(userId),
        Number(dataSourceId),
      );
      if (!sharedDatasource)
        return QuantifiedStudentException.NotFound(response);

      return response.status(200).json(sharedDatasource);
    } catch (err) {
      return QuantifiedStudentException.ServerError(response);
    }
  };

  private createSharedDataSource = async (
    request: Request,
    response: Response,
  ) => {
    const { userId, dataSourceId } = request.params; // user and Data source that is requested, so the opposite side
    const { canvasUserId } = request.body; // User that is requesting to share the data source

    if (!userId || !dataSourceId || !canvasUserId)
      return QuantifiedStudentException.MissingParameters(response, [
        !userId && 'userId',
        !dataSourceId && 'dataSourceId',
        !canvasUserId && 'canvasUserId',
      ]);

    try {
      const shardedDatasourceCreated =
        await this.sharedDataSourceService.createSharedDataSource(
          Number(userId),
          Number(canvasUserId),
          Number(dataSourceId),
        );

      if (!shardedDatasourceCreated)
        return QuantifiedStudentException.NotFound(
          response,
          'User or data source not found',
        );

      return response.status(201).send('Data source was shared');
    } catch (err) {
      return QuantifiedStudentException.ServerError(response);
    }
  };
}

export default DataSourceController;
