import { AccountModel } from "../../../domain/models/account";
import { LoadAccountByEmailRepository } from "../../protocols/database/load-account-by-email-repository";
import { DbAuthentication } from "./db-authentication";

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository
  {
    async load(email: string): Promise<AccountModel> {
      const account: AccountModel = {
        id: "any_id",
        name: "any_name",
        email: "any_email@email.com",
        password: "any_password",
      };
      return new Promise((resolve) => resolve(account));
    }
  }

  return new LoadAccountByEmailRepositoryStub();
};

const fakeAccount = {
  email: "any_email@email.com",
  password: "any_password",
};

interface SutType {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
}

const makeSut = (): SutType => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub);

  return {
    sut,
    loadAccountByEmailRepositoryStub,
  };
};

describe("DbAuthentication UseCase", () => {
  test("Should call LoadAccountByEmailRepository with correct email", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, "load");
    await sut.auth(fakeAccount);

    expect(loadSpy).toHaveBeenCalledWith("any_email@email.com");
  });

  test("Should throw if LoadAccountByEmailRepository throws", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, "load")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.auth(fakeAccount);

    await expect(promise).rejects.toThrow();
  });

  test("Should return null if LoadAccountByEmailRepository returns null", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, "load")
      .mockReturnValueOnce(null);
    const accessToken = await sut.auth(fakeAccount);

    expect(accessToken).toBeNull();
  });
});
