const { Router } = require("express");
const postsController = require("../controllers/postsController");
const auth = require("../middlewares/auth");

const router = Router();

router.post("/", auth, postsController.createPost);
router.get("/", auth, postsController.getAllPosts);
router.get("/:id", auth, postsController.getPostById);
router.patch("/:id", auth, postsController.updatePostById);
router.delete("/:id", auth, postsController.deletePostById);

module.exports = router;
