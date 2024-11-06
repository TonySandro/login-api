import env from "../../config/env";
import { makeLoginValidation } from "./login-validation-factory";
import {
  AccountMongoRepository,
  BcryptAdapter,
  Controller,
  DbAuthentication,
  JwtAdapter,
  LogControllerDecorator,
  LoginController,
  LogMongoRepository,
} from "./login-factory-protocols";

export const makeLoginController = (): Controller => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  const accountMongoRepository = new AccountMongoRepository();
  const dbAuthentication = new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository
  );
  const loginController = new LoginController(
    dbAuthentication,
    makeLoginValidation()
  );

  const logMongoRepository = new LogMongoRepository();
  return new LogControllerDecorator(loginController, logMongoRepository);
};
