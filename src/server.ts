import App from './app';
import UserController from './controllers/user.controller';
import DatasourceController from "./controllers/datasource.controller";
import AttendanceController from './controllers/attendance.controller';

const app = new App(
    [
        new AttendanceController(),
        new UserController(),
        new DatasourceController()
    ],
);

app.listen();
