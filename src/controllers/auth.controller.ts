import { Request, Response, Router } from 'express';
import Controller from '../interfaces/controller.interface';
import AuthService from "../services/auth.service";

class AuthController implements Controller {
    public path = '/auth';

    public router = Router();

    private authService = new AuthService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/register`, this.registerUser);
    }

    private registerUser = async (request: Request, response: Response) => {
        const {userId, canvasToken, acceptedTerms} = request.body;
        try {
            if(!userId) {
                return response.status(404)
                    .json({"error":"Missing required parameters in body: userId"});
            }

            if(!canvasToken) {
                return response.status(404)
                    .json({"error":"Missing required parameters in body: canvasToken"});
            }

            if(!acceptedTerms) {
                return response.status(404)
                    .json({"error":"Missing required parameters in body: acceptedTerms"});
            }

            return this.authService.registerUser(userId, canvasToken, acceptedTerms).then((result) => {
                return response.status(200)
                    .json({"success": result});
            });

        }
        catch (err) {
            return response.status(400)
                .json(err.errors);
        }
    }

}

export default AuthController;