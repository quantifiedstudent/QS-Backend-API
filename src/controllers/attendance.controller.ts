import { Request, Response, Router } from 'express';
import Controller from "../interfaces/controller.interface";
import AttendanceService from '../services/attendance.service';

class AttendanceController implements Controller {
    public path = '/attendance';

    public router = Router();

    private attendanceService = new AttendanceService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}`, this.getAttendance);
        this.router.post(`${this.path}`, this.addAttendance);
    }

    private getAttendance = async (request: Request, response: Response) => {
        try {
            if(response.locals.userInfo) {
                return this.attendanceService.getAttendanceForUser(response.locals.userInfo.id).then((result) => {
                    if (result) return response.status(200).json(result);
                    return response.status(404).send("No records found")
                })
            }
            return response.status(401)
                .json({"error": "unauthenticated"})
        } catch (err) {
            return response.status(404)
                .json(err.errors);
        }
    }

    private addAttendance = async (request: Request, response: Response) => {
        try {
            if (response.locals.userInfo) {
                return this.attendanceService.addAttendance(response.locals.userInfo.id).then((result) => {
                    return response.status(200).json({"success":"true"})
                })
            }
            return response.status(401)
                .json({"error": "unauthenticated"})
        } catch (err) {
            return response.status(404)
                .json(err.errors);
        }
    }
}

export default AttendanceController;