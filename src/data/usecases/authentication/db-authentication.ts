import {
  Authentication,
  authenticationModel,
} from "../../../domain/usecases/authentication";
import { LoadAccountByEmailRepository } from "../../protocols/database/load-account-by-email-repository";

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository;

  constructor(loadAccountByEmailRepository: LoadAccountByEmailRepository) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
  }
  async auth(authentication: authenticationModel): Promise<string> {
    await this.loadAccountByEmailRepository.load(authentication.email);
    return new Promise((resolve) => resolve("any_email@email.com"));
  }
}
