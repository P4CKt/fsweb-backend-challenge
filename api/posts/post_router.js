const router = require("express").Router();
const {
  getAllPost,
  findByPost,
  insertNewPost,
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
} = require("./post_model");
const { authToChange, verifyUser, tokenIsValid } = require("./post_middleware");

router.get("/", tokenIsValid, async (req, res, next) => {
  try {
    const allData = await getAllPost();
    res.json(allData);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const targetData = await findByPost(req.params.id);
    res.json(targetData);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const model = {
      post_content: req.body.post_content,
      user_id: req.tokenCode.user_id,
    };
    const newData = await insertNewPost(model);
    res.status(201).json(newData);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", authToChange, async (req, res, next) => {
  try {
    const update = await updatePost(req.params.id, req.body);
    res.status(201).json(update);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", authToChange, async (req, res, next) => {
  try {
    await removePost(req.params.id);
    res.status(204).json({ message: "Silme işlemi gerçekleşti" });
  } catch (error) {
    next(error);
  }
});

// Comment
router.get("/:id/comment", async (req, res, next) => {
  try {
    const targetPost = await findByPost(req.params.id);
    const postComment = await getAllComment(req.params.id);
    res.json({ targetPost, postComment });
  } catch (error) {
    next(error);
  }
});
router.post("/:id/comment", async (req, res, next) => {
  try {
    const model = {
      comment: req.body.comment,
      user_id: req.tokenCode.user_id,
      post_id: req.params.id,
      liked: null,
    };
    const newData = await insertNewComment(model);
    res.status(201).json(newData);
  } catch (error) {
    next(error);
  }
});
router.delete("/:id/comment", async (req, res, next) => {
  try {
    const isValid = await getByCommentID(req.body.interaction_id);

    if (isValid == req.tokenCode.user_id) {
      const remove = await removeComment(req.body.interaction_id);
      res.status(204).json(remove);
    } else {
      res.status(401).json({ message: ` Başkalarının yorumunu silemezsiniz ` });
    }
  } catch (error) {
    next(error);
  }
});
// Likes
router.get("/:id/likes", async (req, res, next) => {
  try {
    const targetPost = await findByPost(req.params.id);
    const postLikes = await getAllLikes(req.params.id);
    const likes = await likesCount(req.params.id);
    res.json({ "Post-Owner": targetPost, "number of likes": likes, postLikes });
  } catch (error) {
    next(error);
  }
});
router.post("/:id/likes", async (req, res, next) => {
  try {
    const validate = await isLikes(req.tokenCode.user_id, req.params.id);

    if (validate == null) {
      const model = {
        comment: "LIKE",
        user_id: req.tokenCode.user_id,
        post_id: req.params.id,
        liked: req.body.liked,
      };

      const newData = await insertNewLike(model);
      res.status(201).json(newData);
    } else {
      const model = {
        user_id: req.tokenCode.user_id,
        post_id: req.params.id,
        liked: req.body.liked,
      };

      const newData = await changeLike(model, validate.id);
      res.status(201).json(newData);
      res.json({ message: validate });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
