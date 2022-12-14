import App from './app';
import AttendanceController from './controllers/attendance.controller';
import AuthController from './controllers/auth.controller';

const app = new App(
    [
        new AttendanceController(),
        new AuthController(),
    ],
);

app.listen();