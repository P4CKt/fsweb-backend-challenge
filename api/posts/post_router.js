const router = require("express").Router();
const {
  getAllPost,
  findByPost,
  insertNewPost,
  removePost,
} = require("./post_model");
const { authToChange } = require("./post_middleware");

router.get("/", async (req, res, next) => {
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
    res.json(newData);
  } catch (error) {
    next(error);
  }
});
router.put("/:id", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});
router.delete("/:id", authToChange, async (req, res, next) => {
  try {
    const postDel = await removePost(req.params.id);
    res.json(postDel);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
