import Service from "../interfaces/service.interface";
import UserRepository from "../repositories/user.repository";
import DatasourceRepository from "../repositories/datasource.repository";
import UserDataSourceRepository from "../repositories/userDataSource.repository";

export default class UserDataSourceService implements Service {
    private userDataSourceRepository = new UserDataSourceRepository();

    public async getAllByUserId(canvasUserId: number) {
        return this.userDataSourceRepository.getAllByUserId(canvasUserId);
    }

    public async getById(canvasUserId: number, datasourceId: number) {
        return this.userDataSourceRepository.getById(canvasUserId, datasourceId);
    }

    public async create(canvasUserId: number, datasourceId: number, token: string) {
        return this.userDataSourceRepository.createUsedDataSource(canvasUserId, datasourceId, token);
    }
}