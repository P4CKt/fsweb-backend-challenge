const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { insertNewUser, findPassword } = require("./auth_model");
const utils = require("../../secret/utils");
const {
  passwordValidation,
  conflictUsername,
  usernameCheck,
} = require("./auth_middleware");

router.post("/register", conflictUsername, async (req, res, next) => {
  try {
    const model = {
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

router.post(
  "/login",
  usernameCheck,
  passwordValidation,
  async (req, res, next) => {
    try {
      const { user_id } = await findPassword(req.body.username);
      const model = {
        username: req.body.username,
        user_id: user_id,
      };
      const token = utils.createToken(model, "1d");
      res.json({ message: `welcomee`, token: token });
    } catch (error) {
      next(error);
    }
  }
);
// router.get( // BURAYA KULLANICININ POSTLARINI GÖRMESİ İÇİN YAPILACAK
//   "/post",
//   usernameCheck,
//   passwordValidation,
//   async (req, res, next) => {
//     try {
//       const { user_id } = await findPassword(req.body.username);
//       const model = {
//         username: req.body.username,
//         user_id: user_id,
//       };
//       const token = utils.createToken(model, "1d");
//       res.json({ message: `welcomee`, token: token });
//     } catch (error) {
//       next(error);
//     }
//   }
// );
module.exports = router;
