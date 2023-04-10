const bcrypt = require("bcryptjs");
const { findPassword, findById } = require("./auth_model");
const { json } = require("express");
const passwordValidation = async function (req, res, next) {
  try {
    const { password } = req.body;
    let validPassword = await bcrypt.compare(password, req.user.password);
    if (!validPassword) {
      res.status(401).json({ message: "Geçersiz şifre" });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};
const usernameCheck = async (req, res, next) => {
  try {
    let { username } = req.body;
    const existUser = await findPassword(username);
    if (!existUser) {
      res.status(404).json({ message: "Böyle bir user yok" });
    } else {
      req.user = existUser;
      next();
    }
  } catch (error) {
    next(error);
  }
};
const conflictUsername = async (req, res, next) => {
  try {
    const isExist = await findPassword(req.body.username);
    if (isExist) {
      res.status(402).json({ message: "Bu username daha önce alınmış" });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  passwordValidation,
  usernameCheck,
  conflictUsername,
};
