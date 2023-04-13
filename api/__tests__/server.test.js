const supertest = require("supertest");
const db = require("../../data/db-config");
const server = require("../server");

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
      e_mail: "user1@hotmail.com",
    };
    const res = await supertest(server)
      .post("/api/users/register")
      .send(sampleUser1);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Eksik bilgileri tamamlayınız");
  });

  it("[3] [POST] username kullanıyor ise hata veriyor mu ?", async () => {
    let sampleUser = {
      username: "p4ck6",
      password: "1234",
      e_mail: "user2@hotmail.com",
    };
    const res = await supertest(server)
      .post("/api/users/register")
      .send(sampleUser);

    expect(res.status).toBe(402);
    expect(res.body.message).toBe("Bu username daha önce alınmış");
  });
  it("[4] [POST] username kullanıyor ise hata veriyor mu ?", async () => {
    let sampleUser = {
      username: "p4ck11",
      password: "1234",
      e_mail: "user@hotmail.com",
    };
    const res = await supertest(server)
      .post("/api/users/register")
      .send(sampleUser);

    expect(res.status).toBe(402);
    expect(res.body.message).toBe("Bu e-mail daha önce alınmış");
  });

  it("[5] [POST] Password Hashlenmiş şekilde geliyor mu?", async () => {
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

  it("[6] [POST] Login yapılabiliyor mu?", async () => {
    let sampleUser = { username: "p4ck7", password: "1234" };
    const res = await supertest(server)
      .post("/api/users/login")
      .send(sampleUser);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/welcome/);
  });

  it("[7] [POST] Yanlış şifrede 401 dönüyor mu?", async () => {
    let sampleUser = { username: "p4ck7", password: "123s4" };
    const res = await supertest(server)
      .post("/api/users/login")
      .send(sampleUser);
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Geçersiz şifre");
  });

  it("[8] [POST] Yanlış Username girildiğinde 401 dönüyor mu?", async () => {
    let sampleUser = { username: "p4ck8", password: "123s4" };
    const res = await supertest(server)
      .post("/api/users/login")
      .send(sampleUser);
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Böyle bir user yok");
  });

  it("[9] [PUT] Tüm bilgiler girilmeden kullanıcı ayarları değişiyor mu?", async () => {
    let sampleUser = { username: "p4ck8", password: "123s4" };
    const res = await supertest(server)
      .put("/api/users/settings")
      .send(sampleUser);
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Eksik bilgileri tamamlayınız");
  });

  it("[10] [PUT] Kullanıcı ayarları değişiyor mu?", async () => {
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
    it("[11] [Get] Login değil ise postları görüyor mu?", async () => {
      const res = await supertest(server).get("/api/post");

      expect(res.status).toBe(402);
      expect(res.body.message).toBe(
        "Token mevcut değil, üye olun yada tekrar giriş yapınız.!!"
      );
    });
    it("[12] [Get] Login ise postları görüyor mu?", async () => {
      let sampleUser12 = { username: "p4ck8", password: "123s4" };
      const login1 = await supertest(server)
        .post("/api/users/login")
        .send(sampleUser12);

      const res = await supertest(server)
        .get("/api/post")
        .set("authorization", login1.body.token);

      expect(res.status).toBe(200);
    });
    it("[13] [Get] Post_id'li post'a gidiyor mu?", async () => {
      let sampleUser12 = { username: "p4ck8", password: "123s4" };
      const login = await supertest(server)
        .post("/api/users/login")
        .send(sampleUser12);

      const res = await supertest(server)
        .get("/api/post/2")
        .set("authorization", login.body.token);

      expect(res.status).toBe(200);
    });
    it("[14] [Get] Login olmadan Post_id'li post'a gidiyor mu?", async () => {
      // let sampleUser12 = { username: "p4ck8", password: "123s4" };
      // const login = await supertest(server)
      //   .post("/api/users/login")
      //   .send(sampleUser12);

      const res = await supertest(server).get("/api/post/2");
      expect(res.status).toBe(402);
      expect(res.body.message).toBe(
        "Token mevcut değil, üye olun yada tekrar giriş yapınız.!!"
      );
    });
    it("[15] [Get] yanlış token ile post'a gidiyor mu?", async () => {
      let sampleUser12 = { username: "p4ck8", password: "123s4" };
      const login = await supertest(server)
        .post("/api/users/login")
        .send(sampleUser12);

      const res = await supertest(server)
        .get("/api/post/2")
        .set("authorization", "asdasddasdasdas");

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Token geçersiz, tekrar giriş yapınız.!!");
    });
    it("[16] [POST] Yeni Post atabiliyor mu?", async () => {
      let sampleUser12 = { username: "p4ck8", password: "123s4" };
      const login = await supertest(server)
        .post("/api/users/login")
        .send(sampleUser12);

      const res = await supertest(server)
        .post("/api/post/")
        .send({
          post_content: "Merhabalarr",
        })
        .set("authorization", login.body.token);

      expect(res.status).toBe(201);
      expect(res.body.post_content).toBe("Merhabalarr");
    });
    it("[17] [POST] Yanlış token ile post atabiliyor mu?", async () => {
      const res = await supertest(server)
        .post("/api/post/")
        .send({
          post_content: "Merhabalarr",
        })
        .set("authorization", "login.body.token");

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Token geçersiz, tekrar giriş yapınız.!!");
    });
    it("[18] [POST] Post içeriği olmadan post atılabiliyor mu", async () => {
      let sampleUser12 = { username: "p4ck8", password: "123s4" };
      const login = await supertest(server)
        .post("/api/users/login")
        .send(sampleUser12);

      const res = await supertest(server)
        .post("/api/post/")
        .send({
          eksik: "Merhabalarr",
        })
        .set("authorization", login.body.token);

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Lütfen Post içeriği giriniz");
    });
  });
  describe("USER INTERACTION", () => {
    it("[19] GET Postların yorumları geliyor mu?", async () => {
      let sampleUser12 = { username: "p4ck8", password: "123s4" };
      const login = await supertest(server)
        .post("/api/users/login")
        .send(sampleUser12);

      const res = await supertest(server)
        .get("/api/post/1/comment")
        .set("authorization", login.body.token);

      expect(res.status).toBe(200);
      expect(res.body.postComment[0].username).toBe("kahve_-_ayusu");
    });
    it("[20] GET Postların yorumları geliyor mu?", async () => {
      let sampleUser12 = { username: "p4ck8", password: "123s4" };
      const login = await supertest(server)
        .post("/api/users/login")
        .send(sampleUser12);

      const res = await supertest(server)
        .get("/api/post/1/comment")
        .set("authorization", login.body.token);

      expect(res.status).toBe(200);
      expect(res.body.postComment[0].username).toBe("kahve_-_ayusu");
    });
    it("[21] POST Postlara yorum atılıyor mu?", async () => {
      let sampleUser12 = { username: "p4ck8", password: "123s4" };
      const login = await supertest(server)
        .post("/api/users/login")
        .send(sampleUser12);

      const res = await supertest(server)
        .post("/api/post/3/comment")
        .send({ comment: "Kahve edebiyatı içilir " })
        .set("authorization", login.body.token);

      expect(res.status).toBe(201);
      expect(res.body[0].username).toBe("p4ck8");
    });
    it("[22] DELETE Başkalarının yorumu siliniyor mu?", async () => {
      let sampleUser12 = { username: "p4ck8", password: "123s4" };
      const login = await supertest(server)
        .post("/api/users/login")
        .send(sampleUser12);

      const res = await supertest(server)
        .post("/api/post/3/comment")
        .send({ comment: "Kahve edebiyatı içilir " })
        .set("authorization", login.body.token);

      expect(res.status).toBe(201);
      const del = await supertest(server)
        .delete("/api/post/3/comment")
        .send({ interaction_id: 1 })
        .set("authorization", login.body.token);
      expect(del.status).toBe(401);
      expect(del.body.message).toBe("Başkalarının yorumunu silemezsiniz");
    });
    it("[23] POST like atılıyor mu?", async () => {
      let sampleUser12 = { username: "p4ck8", password: "123s4" };
      const login = await supertest(server)
        .post("/api/users/login")
        .send(sampleUser12);

      const like = await supertest(server)
        .post("/api/post/3/likes")
        .send({ liked: 1 })
        .set("authorization", login.body.token);
      expect(like.status).toBe(201);
      expect(like.body.username).toBe("p4ck8");
    });
    it("[24] POST unlike atılıyor mu?", async () => {
      let sampleUser = {
        username: "p4ck6",
        password: "1234",
        e_mail: "user@hotmail.com",
      };
      await supertest(server).post("/api/users/register").send(sampleUser);

      let sampleUser12 = { username: "p4ck6", password: "1234" };
      const login = await supertest(server)
        .post("/api/users/login")
        .send(sampleUser12);

      const like = await supertest(server)
        .post("/api/post/3/likes")
        .send({ liked: 1 })
        .set("authorization", login.body.token);
      expect(like.status).toBe(201);
      expect(like.body.date).toMatch(/2023/);
    });
  });
});
