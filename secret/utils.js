const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./secretToken");

exports.createToken = (payload, time) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: time });
};
