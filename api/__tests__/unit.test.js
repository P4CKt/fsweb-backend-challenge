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
describe("[UNIT TEST AUTH]", () => {
  test("[1] getUsers çalışıyor mu ", async () => {
    const users = await authModel.getUsers();
    expect(users).toHaveLength(3);
  });
  test("[2] findById çalışıyor mu ", async () => {
    const users = await authModel.findById({ user_id: 1 });
    expect(users).toHaveProperty("username");
    expect(users).toHaveProperty("e_mail");
    expect(users).toHaveProperty("user_id");
  });
  test("[3] insertNewUser çalışıyor mu ", async () => {
    const users = await authModel.insertNewUser({
      user_id: 4,
      username: "deneme",
      password: "12345",
      e_mail: "dasdas@sdasd",
    });
    expect(users).toHaveProperty("username");
    expect(users.e_mail).toBe("dasdas@sdasd");
    expect(users).toHaveProperty("user_id");
  });
  test("[4] updateToUser çalışıyor mu ", async () => {
    const users = await authModel.updateToUser(
      {
        user_id: 1,
        username: "deneme1",
        password: "1234",
        e_mail: "dasdas@sdassdd",
      },
      1
    );
    expect(users).toHaveProperty("username");
    expect(users.e_mail).toBe("dasdas@sdassdd");
    expect(users).toHaveProperty("user_id");
  });
});
describe("[UNIT TEST POST]", () => {
  test("[1] getAllpost çalışıyor mu ", async () => {
    const post = await postModel.getAllPost();
    expect(post).toHaveLength(3);
  });
  test("[2] findByPost çalışıyor mu ", async () => {
    const post = await postModel.findByPost(1);
    expect(post[0]).toHaveProperty("post_content");
    expect(post[0].post_content).toBe(
      "Canım çok kahve istiyor çocukken kahve kazanına düşmedim mi yoksa "
    );
  });
  test("[3] getAllComment çalışıyor mu ", async () => {
    const post = await postModel.getAllComment(1);

    expect(post[0].comment).toBe("Filtre Kahvem var :P");
  });
  test("[4] getAllComment çalışıyor mu ", async () => {
    const post = await postModel.getAllComment(1);

    expect(post[0].comment).toBe("Filtre Kahvem var :P");
  });
  test("[5] Like kontrol çalışıyor mu mu ", async () => {
    const users = await postModel.isLikes(2, 1);
    expect(users.liked).toEqual(1);
  });
});
