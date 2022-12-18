import { Request, Response, Router } from 'express';
import Controller from '../interfaces/controller.interface';
import DatasourceService from "../services/datasource.service";
import UserDataSourceService from "../services/userDataSource.service";
import SharedDataSourceRepository from "../repositories/sharedDataSource.repository";
import SharedDataSourceService from "../services/sharedDataSource.service";

class DataSourceController implements Controller {
    public path = '/datasource';

    public router = Router();

    private dataSourceService = new DatasourceService();
    private userDatasourceService = new UserDataSourceService();
    private sharedDataSourceService = new SharedDataSourceService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/`, this.getAllDataSources);
        this.router.post(`${this.path}/`, this.createUserDataSource);

        this.router.get(`${this.path}/user/:userId`, this.getAllUserDataSources);
        this.router.get(`${this.path}/user/:userId/:dataSourceId`, this.getUserDataSourceById);


        this.router.get(`${this.path}/share/:userId/:dataSourceId`, this.getSharedDataSource);
        this.router.post(`${this.path}/share/:userId/:dataSourceId`, this.createUserDataSource);
    }

    private getAllDataSources = async (request: Request, response: Response) => {
        try {
            return this.dataSourceService.getAll().then((result) => {
                if(!result) {
                    return response.status(404).send("No data sources found");
                }
                return response.status(200)
                    .json(result);
            })
        }
        catch (err) {
            console.log(err)
            return response.status(400)
                .json(err.errors);
        }
    }

    private getAllUserDataSources = async (request: Request, response: Response) => {
        const {userId} = request.params;
        try {
            if(!userId) {
                return response.status(400)
                    .json({"error":`Missing required parameter: ${userId != null ? "" : "userId"}`});
            }

            return this.userDatasourceService.getAllByUserId(+userId).then((result) => {
                if(!result) {
                    return response.status(404).send("No data sources found");
                }
                return response.status(200)
                    .json(result);
            })
        }
        catch (err) {
            console.log(err)
            return response.status(400)
                .json(err.errors);
        }
    }

    private getUserDataSourceById = async (request: Request, response: Response) => {
        const {userId, dataSourceId} = request.params;

        if(!userId || !dataSourceId) {
            return response.status(400)
                .json({"error":`Missing required parameter: ${userId != null ? "" : "userId"}${dataSourceId != null ? "" : "dataSourceId"}`});
        }

        try {
            return this.userDatasourceService.getById(+userId, +dataSourceId).then((result) => {
                if(!result) {
                    return response.status(404).send("No data sources found");
                }
                return response.status(200)
                    .json(result);
            })
        }
        catch (err) {
            console.log(err)
            return response.status(400)
                .json(err.errors);
        }
    }

    private createUserDataSource = async (request: Request, response: Response) => {
        const {canvasUserId, dataSourceId, token} = request.body;
        try {
            if(!(canvasUserId && dataSourceId && token)) {
                return response.status(400)
                    .json({"error":`Missing required parameters in body: ${canvasUserId != null ? "" : "canvasId,"}${dataSourceId != null ? "" : "dataSourceId,"}${token != null ? "" : "token,"}`});
            }

            return this.userDatasourceService.create(canvasUserId, dataSourceId, token).then((result) => {
                if(result) {
                    return response.status(200).send("Data source created");
                }
                return response.status(500).send("No data sources found");
            })

        } catch (err) {
            console.log(err)
            return response.status(400)
                .json(err.errors);
        }

    }

    private getSharedDataSource = async (request: Request, response: Response) => {
        const {userId, dataSourceId} = request.params; // user and Data source that is requested, so the opposite side
        const {canvasUserId} = request.body; // User that is requesting the data source
        try {
            if(!canvasUserId) {
                return response.status(404)
                    .json({"error":`Missing parameters in body: ${canvasUserId != null ? "" : "canvasUserId"}`});
            }
            return this.sharedDataSourceService.getSharedDataSource(+userId, +canvasUserId, +dataSourceId).then((result) => {
                if(!result) {
                    return response.status(404).send("No data sources found, or not shared");
                }

                // We know the datasource is shared now.
                this.userDatasourceService.getById(+userId, +dataSourceId).then((result) => {
                    if (!result) {
                        return response.status(404).send("No data sources found");
                    }
                    return response.status(200)
                        .json(result);
                })
            })
        }
        catch (err) {
            console.log(err)
            return response.status(400)
                .json(err.errors);
        }
    }

    private createSharedDataSource = async (request: Request, response: Response) => {
        const {userId, dataSourceId} = request.params; // user and Data source that is requested, so the opposite side
        const {canvasUserId} = request.body; // User that is requesting to share the data source

        if(!userId || !dataSourceId) {
            return response.status(400)
                .json({"error":`Missing parameters in params: ${userId != null ? "" : "userId,"}${dataSourceId != null ? "" : "dataSourceId,"}${canvasUserId != null ? "" : "canvasUserId,"}`});
        }

        if(!canvasUserId) {
            return response.status(400)
                .json({"error":`Missing parameters in body: ${canvasUserId != null ? "" : "canvasUserId"}`});
        }

        try {
            return this.sharedDataSourceService.createSharedDataSource(+userId, +canvasUserId, +dataSourceId).then((result) => {
                if(!result) {
                    return response.status(404).send("User or data source not found");
                }

                return response.status(201)
                    .send("Data source was shared");
            })
        }
        catch (err) {
            console.log(err)
            return response.status(400)
                .json(err.errors);
        }
    }
}

export default DataSourceController;
