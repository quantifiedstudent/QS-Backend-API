import { Request, Response, Router } from 'express';

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

        if (!attendance) return response.status(404).send('No records found');

        return response.status(200).json(attendance);
      }
      return response.status(401).json({ error: 'unauthenticated' });
    } catch (err) {
      return response
        .status(404)
        .json({ error: 'Could not retrieve attendance' });
    }
  };

  private addAttendance = async (request: Request, response: Response) => {
    const { atLocation } = request.body;

    if (!atLocation)
      return response.status(400).json({
        error: `Missing required parameter in body: ${
          atLocation != null ? '' : 'atLocation'
        }`,
      });

    try {
      if (response.locals.userInfo) {
        const addedAttendance = await this.attendanceService.addAttendance(
          response.locals.userInfo.id,
          atLocation,
        );

        if (!addedAttendance)
          return response.status(500).send('Could not add attendance');

        return response.status(201).json({ success: 'true' });
      }

      return response.status(401).json({ error: 'unauthenticated' });
    } catch (err) {
      console.log('error', err);
      return response.status(404).json({ success: 'false' });
    }
  };
}

export default AttendanceController;
