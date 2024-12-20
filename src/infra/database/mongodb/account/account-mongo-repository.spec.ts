import { Collection } from "mongodb";
import { MongoHelper } from "../helpers/mongo-helper";
import { AccountMongoRepository } from "./account-mongo-repository";

const makeSut = (): AccountMongoRepository => {
  const sut = new AccountMongoRepository();
  return sut;
};

let accountCollection: Collection;

describe("Account Mongodb Repository", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  });

  test("Should return an account on add success", async () => {
    const sut = makeSut();

    const account = await sut.add({
      name: "any_name",
      email: "any_email@email.com",
      password: "any_password",
    });

    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe("any_name");
    expect(account.email).toBe("any_email@email.com");
    expect(account.password).toBe("any_password");
  });

  test("Should return an account on loadByEmail success", async () => {
    const sut = makeSut();
    await accountCollection.insertOne({
      name: "any_name",
      email: "any_email@email.com",
      password: "any_password",
    });
    const account = await sut.loadByEmail("any_email@email.com");

    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe("any_name");
    expect(account.email).toBe("any_email@email.com");
    expect(account.password).toBe("any_password");
  });

  test("Should return null if loadByEmail fails", async () => {
    const sut = makeSut();
    const account = await sut.loadByEmail("any_email@email.com");

    expect(account).toBeFalsy();
  });

  test("Should update the accountToken on updateAccessToken success", async () => {
    const sut = makeSut();
    const result = await accountCollection.insertOne({
      name: "any_name",
      email: "any_email@email.com",
      password: "any_password",
    });

    const accountResult = result[0];

    expect(accountResult?.accessToken).toBeFalsy();

    await sut.updateAccessToken(accountResult?.__id, "any_token");
    const account = await accountCollection.findOne({
      __id: accountResult?.id,
    });

    expect(account).toBeTruthy();
    expect(account.accessToken).toBe("any_token");
  });
});
