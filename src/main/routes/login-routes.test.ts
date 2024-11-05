import { MongoHelper } from "../../infra/database/mongodb/helpers/mongo-helper";

describe("Login Routes Middleware", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  });

  test("should test success", () => {
    expect(1).toBe(1);
  });
});
