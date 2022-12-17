import { Request, Response, Router } from 'express';
import Controller from '../interfaces/controller.interface';
import UserService from "../services/user.service";

class UserController implements Controller {
    public path = '/user';

    public router = Router();

    private userService = new UserService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/register`, this.registerUser);
        this.router.get(`${this.path}/:canvasId`, this.getUserById);
    }

    private registerUser = async (request: Request, response: Response) => {
        const {canvasId, canvasAccessToken, acceptedTerms} = request.body;
        try {
            if(canvasId && canvasAccessToken && acceptedTerms) {
                return this.userService.registerUser(canvasId, acceptedTerms).then((result) => {
                    return response.status(200)
                        .json({"success": result});
                }).catch((error) => {
                    return response.status(400)
                        .json({"error": error});
                });
            }
            return response.status(404)
            .json({"error":`Missing required parameters in body: ${canvasId != null ? "" : "canvasId,"}${canvasAccessToken != null ? "" : "canvasAccessToken,"}${acceptedTerms != null ? "" : "acceptedTerms,"}`});
        }
        catch (err) {
            return response.status(400)
                .json(err.errors);
        }
    }

    private getUserById = async (request: Request, response: Response) => {
        const {canvasId} = request.params;
        try {
            if(canvasId) {
                return this.userService.getById(canvasId).then((result) => {
                    if(result) {
                        return response.status(200)
                            .json(result);
                    } else {
                        return response.status(404).send(`User with ID: "${canvasId}" not found`);
                    }
                }).catch((error) => {
                    return response.status(400)
                        .json({error});
                });
            }
            return response.status(404)
            .json({"error":`Missing required parameter: ${canvasId != null ? "" : "canvasId"}`});
        }
        catch (err) {
            return response.status(400)
                .json(err.errors);
        }
    }
}

export default UserController;