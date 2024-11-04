import { DbAuthentication } from "../../../data/usecases/authentication/db-authentication";
import { LoginController } from "../../../presentation/controllers/login/login";
import { Controller } from "../../../presentation/protocols";
import { LogControllerDecorator } from "../../decorators/log-controller";

export const makeLoginController = (): Controller => {
    const validation = new ()
  const dbAuthentication = new DbAuthentication();
  const loginController = new LoginController(dbAuthentication);
  return new LogControllerDecorator(loginController);
};
