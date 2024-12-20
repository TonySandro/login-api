import { MongoHelper } from "../../infra/database/mongodb/helpers/mongo-helper";
import request from "supertest";
import app from "../config/app";
import { hash } from "bcrypt";
import { Collection } from "mongodb";

let accountCollection: Collection;

describe("Login Routes", () => {
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

  describe("POST /login", () => {
    test("Should return 200 on login", async () => {
      const password = await hash("123", 12);
      await accountCollection.insertOne({
        name: "Tony",
        email: "tony@email.com",
        password,
      });

      await request(app)
        .post("/api/login")
        .send({
          email: "tony@email.com",
          password: "123",
        })
        .expect(200);
    });

    test("Should return 401 on login", async () => {
      await request(app)
        .post("/api/login")
        .send({
          email: "tony@email.com",
          password: "123",
        })
        .expect(401);
    });
  });
});
