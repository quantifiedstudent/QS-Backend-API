import App from './app';
import AttendanceController from './controllers/attendance.controller';

const app = new App(
    [
        new AttendanceController(),
    ],
);

app.listen();