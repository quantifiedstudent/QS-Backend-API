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
                return await this.attendanceService.getAttendanceForUser(response.locals.userInfo.id).then((result) => {
                    if (result) return response.status(200).json(result);
                    return response.status(404).send("No records found")
                })
            }
            return response.status(401)
                .json({"error": "unauthenticated"})
        } catch (err) {
            console.log("error", err)
            return response.status(404)
                .json({"error": "Could not retrieve attendance"});
        }
    }

    private addAttendance = async (request: Request, response: Response) => {
        const { atLocation } = request.body;
        try {
            if (response.locals.userInfo && atLocation != null) {
                return await this.attendanceService.addAttendance(response.locals.userInfo.id, atLocation).then(() => response.status(201).json({"success":"true"}))
            } else if (atLocation == null) {
                return response.status(400).json({"error":`Missing required parameter in body: ${atLocation != null ? "" : "atLocation"}`})
            }
            return response.status(401)
                .json({"error": "unauthenticated"})
        } catch (err) {
            console.log('error', err)
            return response.status(404)
                .json({"success": "false"});
        }
    }
}

export default AttendanceController;