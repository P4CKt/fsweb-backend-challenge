const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../secret/secretToken");
const { findByPost } = require("./post_model");

const verifyUser = (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    if (token) {
      jwt.verify(token, JWT_SECRET, (error, decodedJWT) => {
        if (error) {
          res
            .status(401)
            .json({ message: "Token geçersiz, tekrar giriş yapınız.!!" });
        } else {
          req.tokenCode = decodedJWT;
          next();
        }
      });
    } else {
      res.status(402).json({
        message: "Token mevcut değil, üye olun yada tekrar giriş yapınız.!!",
      });
    }
  } catch (error) {
    next(error);
  }
};
const authToChange = async (req, res, next) => {
  const targetPost = await findByPost(req.params.id);

  if (req.tokenCode.user_id !== targetPost[0].user_id) {
    res.status(401).json({
      message: `Buna yetkiniz yok ${targetPost[0].user_id} ; ${req.tokenCode.user_id}`,
    });
  } else {
    next();
  }
};
const postToChange = async (req, res, next) => {
  const targetPost = await findByPost(req.params.id);

  if (req.tokenCode.user_id !== targetPost[0].user_id) {
    res.status(401).json({
      message: `Buna yetkiniz yok ${targetPost[0].user_id} ; ${req.tokenCode.user_id}`,
    });
  } else {
    next();
  }
};
const tokenIsValid = async (req, res, next) => {
  if (!req.tokenCode.user_id) {
    res.status(401).json({
      message: "Token Geçersiz",
    });
  } else {
    next();
  }
};
const idIsExist = async (req, res, next) => {
  if (!req.body.interaction_id) {
    res.status(401).json({
      message: "interaction ID eksik",
    });
  } else {
    next();
  }
};
const postIsExist = async (req, res, next) => {
  const post = await findByPost(req.params.id);
  if (!post[0]) {
    res.status(401).json({
      message: "Böyle bir Post bulunamadı",
    });
  } else {
    next();
  }
};

module.exports = {
  verifyUser,
  authToChange,
  tokenIsValid,
  postToChange,
  idIsExist,
  postIsExist,
};
