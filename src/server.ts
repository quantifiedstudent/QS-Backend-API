import App from './app';
import AttendanceController from './controllers/attendance.controller';
import UserController from './controllers/user.controller';
import DatasourceController from "./controllers/datasource.controller";

const app = new App(
    [
        new UserController(),
        new DatasourceController()
    ],
);

app.listen();
