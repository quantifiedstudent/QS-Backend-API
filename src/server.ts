import App from './app';
import AttendanceController from './controllers/attendance.controller';
import UserController from './controllers/user.controller';

const app = new App(
    [
        new AttendanceController(),
        new UserController(),
    ],
);

app.listen();