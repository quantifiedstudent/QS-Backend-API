import Service from '../interfaces/service.interface';
import UserRepository from '../repositories/user.repository';

export default class UserService implements Service {
  private authRepository = new UserRepository();

  public async registerUser(
    userId: string,
    userName: string,
    acceptedTerms: boolean,
  ) {
    // TODO: Create datasource for user
    return this.authRepository.registerUser(userId, userName, acceptedTerms);
  }

  public async getById(canvasId: string) {
    return this.authRepository.getById(canvasId);
  }
}
