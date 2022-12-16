import Service from "../interfaces/service.interface";
import AuthRepository from "../repositories/auth.repository";

export default class AuthService implements Service {
    private authRepository = new AuthRepository();

    public async registerUser(userId: string, canvasToken: string, acceptedTerms: boolean) {
        // TODO: Create datasource for user
        return this.authRepository.registerUser(userId, canvasToken, acceptedTerms);
    }
}