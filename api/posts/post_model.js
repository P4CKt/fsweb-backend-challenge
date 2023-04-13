const db = require("../../data/db-config");

const getAllPost = () => {
  return db("posts");
};
const findByPost = (post_id) => {
  return db("posts")
    .select("post_id", "post_content", "post_date")
    .where("post_id", post_id);
};

const insertNewPost = async (input) => {
  const added = await db("posts").insert(input);

  return findByPost(added[0]);
};
const updatePost = async (post_id, body) => {
  await db("posts").where("post_id", post_id).update(body);
  return findByPost(post_id);
};

const removePost = async (post_id) => {
  return await db("posts").where("post_id", post_id).del();
};

// Comment

const getAllComment = async (post_id) => {
  const targetPost = await db("post_interaction as pi")
    .leftJoin("posts as p", "pi.post_id", "p.post_id")
    .leftJoin("users as u", "pi.user_id", "u.user_id")
    .select("u.username", "pi.comment", "pi.interaction_date as date")
    .where("p.post_id", post_id)
    .not.where("pi.comment", "LIKE");
  return targetPost;
};

const insertNewComment = async (input) => {
  await db("post_interaction").insert(input);

  return getAllComment(input.post_id);
};
const removeComment = async (interaction_id) => {
  return await db("post_interaction as pi")
    .where("interaction_id", interaction_id)
    .del();
};
const getByCommentID = async (interaction_id) => {
  const user = await db("post_interaction")
    .where("interaction_id", interaction_id)
    .first();

  return user ? user : "boş";
};
//Likes
const isLikes = async (user_id, post_id) => {
  const targetPost = await db("post_interaction")
    .select("liked", "interaction_id as id")
    .where("user_id", user_id)
    .where("post_id", post_id)
    .where("liked", 1)
    .or.where("liked", 0)
    .first();

  if (targetPost) {
    return targetPost;
  } else {
    return null;
  }
};
const getAllLikes = async (user_id) => {
  const targetPost = await db("post_interaction as pi")
    .leftJoin("posts as p", "pi.post_id", "p.post_id")
    .leftJoin("users as u", "pi.user_id", "u.user_id")
    .select("u.username", "pi.interaction_date as date")
    .where("pi.liked", 1 || 0)
    .where("pi.user_id", user_id);

  return targetPost;
};
const likesCount = async (post_id) => {
  const targetPost = await db("post_interaction as pi")
    .leftJoin("posts as p", "pi.post_id", "p.post_id")
    .leftJoin("users as u", "pi.user_id", "u.user_id")
    .select("u.username as username")
    .where("pi.liked", 1)
    .where("p.post_id", post_id);

  return targetPost.length;
};
const insertNewLike = async (input) => {
  await db("post_interaction").insert(input);

  return getAllLikes(input.user_id);
};
const changeLike = async (input, interaction_id) => {
  await db("post_interaction")
    .where("interaction_id", interaction_id)
    .update(input);
  return getAllLikes(input.user_id);
};

module.exports = {
  getAllPost,
  insertNewPost,
  findByPost,
  removePost,
  updatePost,
  getAllComment,
  getAllLikes,
  insertNewComment,
  insertNewLike,
  isLikes,
  changeLike,
  likesCount,
  removeComment,
  getByCommentID,
};
