import { Request, Response, Router } from 'express';
import Controller from '../interfaces/controller.interface';
import UserService from "../services/user.service";

class UserController implements Controller {
    public path = '/users';

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
        const {canvasId, canvasAccessToken, userName, acceptedTerms} = request.body;

        if(!(canvasId && canvasAccessToken && acceptedTerms && userName)) {
            return response.status(400)
                .json({"error":`Missing required parameter: ${canvasId != null ? "" : "canvasId"}, ${canvasAccessToken != null ? "" : "canvasAccessToken"}, ${acceptedTerms != null ? "" : "acceptedTerms"}, ${userName != null ? "" : "userName"}`});
        }

        try {
            return this.userService.registerUser(canvasId, userName, acceptedTerms).then((result) => {
                return response.status(201)
                    .json(result);
            })
        }
        catch (err) {
            return response.status(400)
                .json(err.errors);
        }
    }

    private getUserById = async (request: Request, response: Response) => {
        const {canvasId} = request.params;

        if(!canvasId) {
            return response.status(404)
                .json({"error":`Missing required parameter: ${canvasId != null ? "" : "canvasId"}`});
        }

        try {
            return this.userService.getById(canvasId).then((result) => {
                if(result) {
                    return response.status(200)
                        .json(result);
                } else {
                    return response.status(404).send(`User with ID: "${canvasId}" not found`);
                }
            })
        }
        catch (err) {
            return response.status(400)
                .json(err.errors);
        }
    }
}

export default UserController;