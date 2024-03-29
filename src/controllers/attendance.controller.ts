import { Request, Response, Router } from 'express';
import QuantifiedStudentException from '../helpers/exceptions/quantifiedStudentExceptions';

import Controller from '../interfaces/controller.interface';
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
      if (response.locals.userInfo) {
        const attendance = await this.attendanceService.getAttendanceForUser(
          response.locals.userInfo.id,
        );

        if (!attendance) return QuantifiedStudentException.NotFound(response);

        return response.status(200).json(attendance);
      }
      return QuantifiedStudentException.Unauthenticated(response);
    } catch (err) {
      return QuantifiedStudentException.ServerError(response);
    }
  };

  private addAttendance = async (request: Request, response: Response) => {
    const { atLocation } = request.body;

    try {
      if (response.locals.userInfo) {
        await this.attendanceService.addAttendance(
          response.locals.userInfo.id,
          atLocation,
        );

        return response.status(201).json({ success: 'true' });
      }
      return QuantifiedStudentException.Unauthenticated(response);
    } catch (err) {
      return QuantifiedStudentException.ServerError(
        response,
        'Could not add attendance'
      );
    }
  };
}

export default AttendanceController;
