const supertest = require("supertest");
const db = require("../data/db-config");
const server = require("./server");

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
  await db.seed.run();
});

test("[0] Testler çalışır durumda]", () => {
  expect(true).toBe(true);
});

describe("User register", () => {
  it("[1] [POST] Register gerçekleşiyor mu ?", async () => {
    let sampleUser = {
      username: "p4ck6",
      password: "1234",
      e_mail: "user@hotmail.com",
    };
    const res = await supertest(server)
      .post("/api/users/register")
      .send(sampleUser);

    expect(res.status).toBe(201);
  });

  it("[2] [POST] username eksik ise hata veriyor mu ?", async () => {
    let sampleUser1 = {
      password: "1234",
      e_mail: "user@hotmail.com",
    };
    const res = await supertest(server)
      .post("/api/users/register")
      .send(sampleUser1);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Eksik bilgileri tamamlayınız");
  });

  it("[3] [POST] username eksik ise hata veriyor mu ?", async () => {
    let sampleUser = {
      username: "p4ck6",
      password: "1234",
      e_mail: "user@hotmail.com",
    };
    const res = await supertest(server)
      .post("/api/users/register")
      .send(sampleUser);

    expect(res.status).toBe(402);
    expect(res.body.message).toBe("Bu username daha önce alınmış");
  });

  it("[4] [POST] Password Hashlenmiş şekilde geliyor mu?", async () => {
    let sampleUser = {
      username: "p4ck7",
      password: "1234",
      e_mail: "user",
    };
    const res = await supertest(server)
      .post("/api/users/register")
      .send(sampleUser);

    expect(res.status).toBe(201);
    expect(res.body.password).not.toBe(sampleUser.password);
  });

  it("[5] [POST] Login yapılabiliyor mu?", async () => {
    let sampleUser = { username: "p4ck7", password: "1234" };
    const res = await supertest(server)
      .post("/api/users/login")
      .send(sampleUser);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/welcome/);
  });

  it("[6] [POST] Yanlış şifrede 401 dönüyor mu?", async () => {
    let sampleUser = { username: "p4ck7", password: "123s4" };
    const res = await supertest(server)
      .post("/api/users/login")
      .send(sampleUser);
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Geçersiz şifre");
  });

  it("[7] [POST] Yanlış Username girildiğinde 401 dönüyor mu?", async () => {
    let sampleUser = { username: "p4ck8", password: "123s4" };
    const res = await supertest(server)
      .post("/api/users/login")
      .send(sampleUser);
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Böyle bir user yok");
  });

  it("[8] [PUT] Tüm bilgiler girilmeden kullanıcı ayarları değişiyor mu?", async () => {
    let sampleUser = { username: "p4ck8", password: "123s4" };
    const res = await supertest(server)
      .put("/api/users/settings")
      .send(sampleUser);
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Eksik bilgileri tamamlayınız");
  });

  it("[9] [PUT] Kullanıcı ayarları değişiyor mu?", async () => {
    let sampleUser1 = { username: "p4ck7", password: "1234" };
    const login = await supertest(server)
      .post("/api/users/login")
      .send(sampleUser1);

    let changeUser = {
      username: "p4ck8",
      password: "123s4",
      e_mail: "zıttırıpıt@hotmail.com",
    };
    const res = await supertest(server)
      .put("/api/users/settings")
      .send(changeUser)
      .set("authorization", login.body.token);

    expect(res.status).toBe(201);
  });
  describe("Post Testler", () => {
    it("[10] [Get] Login değil ise postları görüyor mu?", async () => {
      const res = await supertest(server).get("/api/post");

      expect(res.status).toBe(402);
      expect(res.body.message).toBe(
        "Token mevcut değil, üye olun yada tekrar giriş yapınız.!!"
      );
    });
  });
});
