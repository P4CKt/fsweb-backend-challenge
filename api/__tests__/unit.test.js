const authModel = require("../auth/auth_model");
const postModel = require("../posts/post_model");
const db = require("../../data/db-config");
beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db.seed.run();
});
describe("[UNIT TEST]", () => {
  test("[1] getUsers çalışıyor mu ", async () => {
    const users = await authModel.getUsers();
    expect(users).toHaveLength(3);
  });
  test("[2] Like kontrol çalışıyor mu mu ", async () => {
    const users = await postModel.isLikes(2, 1);
    expect(users.liked).toEqual(1);
  });
});
