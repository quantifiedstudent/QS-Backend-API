import { Request, Response, Router } from 'express';
import Controller from "@interfaces/controller.interface";

class AttendanceController implements Controller {
    public path = '/attendance';

    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}`, this.getAttendance);
    }

    private getAttendance = async (request: Request, response: Response) => {
        const { token } = request.body;
        try {
            if (token) {
                return response.status(200)
                    .json(null); // use Service
            }
            return response.status(404)
                .json({"error":"Missing required parameters in body: token"});
        } catch (err) {
            return response.status(404)
                .json(err.errors);
        }
    }
}

export default AttendanceController;