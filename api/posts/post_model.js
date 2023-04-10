const db = require("../../data/db-config");

const getAllPost = () => {
  return db("posts");
};
const findByPost = (post_id) => {
  return db("posts").where("post_id", post_id);
};

const insertNewPost = async (input) => {
  const added = await db("posts").insert(input);

  return findByPost(added[0]);
};

const removePost = async (post_id) => {
  return await db("posts").where(post_id).del();
};
module.exports = { getAllPost, insertNewPost, findByPost, removePost };
