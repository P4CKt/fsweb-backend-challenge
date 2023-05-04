const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  insertNewUser,
  findPassword,
  updateToUser,
  remove,
  findById,
} = require("./auth_model");

const utils = require("../../secret/utils");
const { v4: uuidv4 } = require("uuid");
const {
  passwordValidation,
  conflictUsername,
  usernameCheck,
  isEmpty,
} = require("./auth_middleware");
const { verifyUser } = require("../posts/post_middleware");

router.get("/", (req, res, next) => {
  res.status(200).json({ message: "DENEMEE 1233" });
});

router.post(
  "/login",
  usernameCheck,
  passwordValidation,
  async (req, res, next) => {
    try {
      const { user_id } = await findPassword(req.body.username);
      const { e_mail } = await findById(user_id);
      const model = {
        username: req.body.username,
        user_id: user_id,
        e_mail: e_mail,
      };
      const token = utils.createToken(model, "1d");
      res.json({ message: `welcomee`, token: token });
    } catch (error) {
      next(error);
    }
  }
);

router.post("/register", isEmpty, conflictUsername, async (req, res, next) => {
  try {
    const model = {
      user_id: uuidv4(),
      username: req.body.username,
      e_mail: req.body.e_mail,
      password: bcrypt.hashSync(req.body.password, 8),
    };
    let add = await insertNewUser(model);
    res.status(201).json(add);
  } catch (error) {
    next(error);
  }
});

router.post("/logout", async (req, res, next) => {
  try {
    let randomNumberToAppend = toString(Math.floor(Math.random() * 1000 + 1));
    let hashedRandomNumberToAppend = await bcrypt.hash(
      randomNumberToAppend,
      10
    );
    const badToken = req.headers.authorization + hashedRandomNumberToAppend;
    req.headers.authorization = badToken;
    res.status(202).json({
      message: `Yine beklerizz `,
    });
  } catch (error) {
    next(error);
  }
});

router.put(
  "/settings",
  isEmpty,
  verifyUser,

  async (req, res, next) => {
    try {
      const model = {
        username: req.body.username,
        e_mail: req.body.e_mail,
        password: bcrypt.hashSync(req.body.password, 8),
      };
      let add = await updateToUser(model, req.tokenCode.user_id);
      res.status(201).json(add);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/delete",
  verifyUser,

  async (req, res, next) => {
    try {
      if (!req.tokenCode.user_id) {
        res.status(401).json({ message: "Lütfen önce giriş yapıız" });
      } else {
        await remove(req.tokenCode.user_id);
        res
          .status(204)
          .json({ message: "Silme işlemi gerçekleşti tekrar bekleriz" });
      }
    } catch (error) {
      next(error);
    }
  }
);
module.exports = router;
