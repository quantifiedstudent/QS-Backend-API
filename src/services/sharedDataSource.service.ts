import Service from "../interfaces/service.interface";
import UserRepository from "../repositories/user.repository";
import DatasourceRepository from "../repositories/datasource.repository";
import SharedDataSourceRepository from "../repositories/sharedDataSource.repository";

export default class SharedDataSourceService implements Service {
    private sharedDataSourceRepository = new SharedDataSourceRepository();

    public async getSharedDataSource(user1Id: number, user2Id: number, datasourceId: number) {
        return this.sharedDataSourceRepository.getSharedDataSource(user1Id, user2Id, datasourceId);
    }

    public async createSharedDataSource(user1Id: number, user2Id: number, datasourceId: number) {
        return this.sharedDataSourceRepository.createSharedDataSource(user1Id, user2Id, datasourceId);
    }
}