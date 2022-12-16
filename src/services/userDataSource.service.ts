import Service from "../interfaces/service.interface";
import UserRepository from "../repositories/user.repository";
import DatasourceRepository from "../repositories/datasource.repository";
import UserDataSourceRepository from "../repositories/userDataSource.repository";

export default class UserDataSourceService implements Service {
    private userDataSourceRepository = new UserDataSourceRepository();

    public async getAllUserDataSources(canvasUserId: string) {
        return this.userDataSourceRepository.getAllByUserId(canvasUserId);
    }

    public async getByDataSourceId(canvasUserId: string, datasourceId: string) {
        return this.userDataSourceRepository.getById(canvasUserId, datasourceId);
    }

    public async create(canvasUserId: string, datasourceId: string, token: string) {
        return this.userDataSourceRepository.createUsedDataSource(canvasUserId, datasourceId, token);
    }
}