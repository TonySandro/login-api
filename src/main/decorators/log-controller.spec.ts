import { LogErrorRepository } from "../../data/protocols/database";
import { AccountModel } from "../../domain/models/account";
import {
  serverError,
  success,
} from "../../presentation/helpers/http/http-helper";
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "../../presentation/protocols";
import { LogControllerDecorator } from "./log-controller";

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      return new Promise((resolve) => resolve(success(makeFakeAccount())));
    }
  }

  return new ControllerStub();
};

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError(stack: string): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }

  return new LogErrorRepositoryStub();
};

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: "valid_name",
    email: "valid_email",
    password: "valid_password",
    passwordConfirmation: "valid_passwordConfirmation",
  },
});

const makeFakeAccount = (): AccountModel => ({
  id: "valid_id",
  name: "valid_name",
  email: "valid_email@email.com",
  password: "valid_password",
});

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error();
  fakeError.stack = "any_stack";
  return serverError(fakeError);
};

interface SutType {
  sut: LogControllerDecorator;
  controllerStub: Controller;
  logErrorRepositoryStub: LogErrorRepository;
}

const makeSut = (): SutType => {
  const logErrorRepositoryStub = makeLogErrorRepository();
  const controllerStub = makeController();
  const sut = new LogControllerDecorator(
    controllerStub,
    logErrorRepositoryStub
  );

  return {
    sut,
    controllerStub,
    logErrorRepositoryStub,
  };
};

describe("Log Controller Decorator", () => {
  test("Should call controller handle", async () => {
    const { sut, controllerStub } = makeSut();

    const handleSpy = jest.spyOn(controllerStub, "handle");

    await sut.handle(makeFakeRequest());
    expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest());
  });

  test("Should return the same result of the controller", async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(success(makeFakeAccount()));
  });

  test("Should call LogErrorRepository with correct error if controller returns a sever error", async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
    const logSpy = jest.spyOn(logErrorRepositoryStub, "logError");

    jest
      .spyOn(controllerStub, "handle")
      .mockReturnValueOnce(
        new Promise((resolve) => resolve(makeFakeServerError()))
      );

    await sut.handle(makeFakeRequest());
    expect(logSpy).toHaveBeenCalledWith("any_stack");
  });
});
