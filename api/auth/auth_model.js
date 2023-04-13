const db = require("../../data/db-config");

const getUsers = () => {
  return db("users");
};

const getTargetUser = (filter) => {
  return db("users").where(filter).first();
};
const findById = (user_id) => {
  return db("users")
    .where(user_id)
    .select("user_id", "username", "e_mail")
    .first();
};

const findPassword = (username) => {
  return db("users").where("username", username).first();
};

const insertNewUser = async (input) => {
  await db("users").insert(input);
  const item = findById({ user_id: input.user_id });
  return item;
};
const updateToUser = async (input, user_id) => {
  await db("users").where("user_id", user_id).update(input);

  return findById({ user_id: user_id });
};
const remove = async (user_id) => {
  return await db("users").where("user_id", user_id).del();
};

module.exports = {
  insertNewUser,
  updateToUser,
  getTargetUser,
  getUsers,
  findById,
  findPassword,
  remove,
};
