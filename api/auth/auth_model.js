const db = require("../../data/db-config");

const getUsers = () => {
  return db("users");
};

const getTargetUser = (filter) => {
  return db("users").where(filter).first();
};
const findById = (user_id) => {
  return db("users").where(user_id);
};

const findPassword = (username) => {
  return db("users").where("username", username).first();
};

const insertNewUser = async (input) => {
  const added = await db("users").insert(input);

  return findById({ user_id: added[0] });
};

module.exports = {
  insertNewUser,
  getTargetUser,
  getUsers,
  findById,
  findPassword,
};
