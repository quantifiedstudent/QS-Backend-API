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
        this.router.get(`${this.path}/user/:userId`, this.getAllUserDataSources);
        this.router.post(`${this.path}/`, this.createUserDataSource);

        this.router.get(`${this.path}/shared/:userId/:dataSourceId`, this.getSharedDataSource);
    }

    private getAllDataSources = async (request: Request, response: Response) => {
        try {
            return this.dataSourceService.getAllDataSources().then((result) => {
                if(response) {
                    return response.status(200)
                        .json(result);
                } else {
                    return response.status(404).send("No data sources found");
                }

            }).catch((error) => {
                return response.status(400)
                    .json({"error": error});
            });
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
                return response.status(404)
                    .json({"error":"Missing required parameters in params: userId"});
            }
            return this.userDatasourceService.getAllUserDataSources(userId).then((result) => {
                if(response) {
                    return response.status(200)
                        .json(result);
                } else {
                    return response.status(404).send("No data sources found");
                }

            }).catch((error) => {
                return response.status(400)
                    .json({"error": error});
            });
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
            if(!canvasUserId) {
                return response.status(404)
                    .json({"error":"Missing required parameters in params: canvasUserId"});
            }
            if(!dataSourceId) {
                return response.status(404)
                    .json({"error":"Missing required parameters in params: dataSourceId"});
            }
            if(!token) {
                return response.status(404)
                    .json({"error":"Missing required parameters in params: token"});
            }
            return this.userDatasourceService.create(canvasUserId, dataSourceId, token).then((result) => {
                if(response) {
                    return response.status(200).send("Data source created");
                } else {
                    return response.status(500).send("No data sources found");
                }

            }).catch((error) => {
                return response.status(400)
                    .json({"error": error});
            });
        } catch (err) {
            console.log(err)
            return response.status(400)
                .json(err.errors);
        }

    }

    private getSharedDataSource = async (request: Request, response: Response) => {
        const {userId, dataSourceId} = request.params;
        const {canvasUserId} = request.body;
        try {
            if(!userId) {
                return response.status(404)
                    .json({"error":"Missing required parameters in params: userId"});
            }
            if(!dataSourceId) {
                return response.status(404)
                    .json({"error":"Missing required parameters in params: dataSourceId"});
            }
            if(!canvasUserId) {
                return response.status(404)
                    .json({"error":"Missing required parameters in body: canvasUserId"});
            }
            return this.sharedDataSourceService.getSharedDataSource(+userId, +canvasUserId, +dataSourceId).then((result) => {
                if(response) {
                    return response.status(200)
                        .json(result);
                } else {
                    return response.status(404).send("No data sources found");
                }

            }).catch((error) => {
                return response.status(400)
                    .json({"error": error});
            });
        }
        catch (err) {
            console.log(err)
            return response.status(400)
                .json(err.errors);
        }
    }

    private createSharedDataSource = async (request: Request, response: Response) => {

    }
}

export default DataSourceController;