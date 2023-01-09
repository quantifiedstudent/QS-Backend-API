import { Request, Response, Router } from 'express';
import QuantifiedStudentException from '../helpers/exceptions/quantifiedStudentExceptions';
import Controller from '../interfaces/controller.interface';
import UserService from '../services/user.service';

class UserController implements Controller {
  public path = '/users';

  public router = Router();

  private userService = new UserService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, this.registerUser);
    this.router.get(`${this.path}/:canvasId`, this.getUserById);
  }

  private registerUser = async (request: Request, response: Response) => {
    const { canvasId, canvasAccessToken, userName, acceptedTerms } =
      request.body;

    if (!(canvasId && canvasAccessToken && acceptedTerms && userName))
      return QuantifiedStudentException.MissingParameters(response, [
        !canvasId && 'canvasId',
        !canvasAccessToken && canvasAccessToken,
        !acceptedTerms && 'acceptedTerms',
        !userName && 'userName',
      ]);

    try {
      const userCreated = await this.userService.registerUser(
        canvasId,
        userName,
        acceptedTerms,
      );

      if (!userCreated) return QuantifiedStudentException.ServerError(response);

      return response.status(201).json(userCreated);
    } catch (err) {
      return response.status(400).json(err.errors);
    }
  };

  private getUserById = async (request: Request, response: Response) => {
    const { canvasId } = request.params;

    if (!canvasId)
      return QuantifiedStudentException.MissingParameters(response, [
        'canvasId',
      ]);

    try {
      const user = await this.userService.getById(canvasId);

      if (!user)
        return QuantifiedStudentException.NotFound(
          response,
          `User with ID: "${canvasId}" not found`,
        );

      return response.status(200).json(user);
    } catch (err) {
      return QuantifiedStudentException.ServerError(response);
    }
  };
}

export default UserController;
