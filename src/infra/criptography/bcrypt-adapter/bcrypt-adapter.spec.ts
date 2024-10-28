import { BcryptAdapter } from "./bcrypt-adapter";
import bcrypt from "bcrypt";

jest.mock("bcrypt", () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve("hash"));
  },

  async compare(): Promise<boolean> {
    return new Promise((resolve) => resolve(true));
  },
}));

interface SutTypes {
  sut: BcryptAdapter;
  salt: number;
}

const makeSut = (): SutTypes => {
  const salt = 12;
  const sut = new BcryptAdapter(salt);
  return {
    sut,
    salt,
  };
};
describe("Bcrypt Adapter", () => {
  test("Should call bcrypt.hash with correct values", async () => {
    const { sut, salt } = makeSut();
    const hashSpy = jest.spyOn(bcrypt, "hash");

    await sut.hash("any_value");
    expect(hashSpy).toHaveBeenCalledWith("any_value", salt);
  });

  test("Should return a hash on success", async () => {
    const { sut } = makeSut();

    const hash = await sut.hash("any_value");
    expect(hash).toBe("hash");
  });

  test("Should throw if hash throws", async () => {
    const { sut } = makeSut();

    jest.spyOn(bcrypt, "hash").mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.hash("any_value");
    await expect(promise).rejects.toThrow();
  });

  test("Should call bcrypt.comparer with correct values", async () => {
    const { sut } = makeSut();
    const compareSpy = jest.spyOn(bcrypt, "compare");

    await sut.compare("any_value", "any_hash");
    expect(compareSpy).toHaveBeenCalledWith("any_value", "any_hash");
  });

  test("Should return true a bcrypt.comparer on success", async () => {
    const { sut } = makeSut();

    const response = await sut.compare("any_value", "any_hash");
    expect(response).toBe(true);
  });

  test("Should throw if compare throws", async () => {
    const { sut } = makeSut();

    jest.spyOn(bcrypt, "compare").mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.compare("any_value", "any_hash");
    await expect(promise).rejects.toThrow();
  });
});
