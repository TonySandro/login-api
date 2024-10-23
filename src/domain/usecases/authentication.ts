export interface authenticationModel {
  email: string;
  password: string;
}

export interface Authentication {
  auth(authentication: authenticationModel): Promise<string>;
}
