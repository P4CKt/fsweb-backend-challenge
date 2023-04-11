const router = require("express").Router();
const {
  getAllPost,
  findByPost,
  insertNewPost,
  removePost,
  updatePost,
} = require("./post_model");
const { authToChange, verifyUser, tokenIsValid } = require("./post_middleware");

router.get("/", verifyUser, tokenIsValid, async (req, res, next) => {
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

module.exports = router;
