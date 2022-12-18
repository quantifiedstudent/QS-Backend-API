import Service from "../interfaces/service.interface";
import UserRepository from "../repositories/user.repository";
import DatasourceRepository from "../repositories/datasource.repository";

export default class DatasourceService implements Service {
    private datasourceRepository = new DatasourceRepository();

    public async getAll() {
        return this.datasourceRepository.getAll();
    }
}