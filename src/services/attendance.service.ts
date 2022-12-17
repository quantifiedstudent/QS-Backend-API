import Service from "../interfaces/service.interface";
import AttendanceRepository from "../repositories/attendance.repository";

export default class AttendanceService implements Service {
    private attendanceRepository = new AttendanceRepository();

    public async getAttendanceForUser(userId: number) {
        return this.attendanceRepository.getAllForUser(userId)
    }

    public async addAttendance(userId: number) {
        return this.attendanceRepository.addAttendance(userId);
    }
}