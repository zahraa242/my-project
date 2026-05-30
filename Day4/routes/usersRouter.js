const { Router } = require("express");
const usersController = require("../controllers/usersController");
const auth = require("../middlewares/auth");
const authorizeTo = require("../middlewares/authorizeTo");

const router = Router();

// Public routes (no authentication required)
router.post("/sign-up", usersController.signUp);
router.post("/sign-in", usersController.signIn);

// Protected routes (admin only)
router.get("/", auth, authorizeTo("admin"), usersController.getAllUsers);
router.get("/:id", auth, authorizeTo("admin"), usersController.getUserById);
router.patch("/:id", auth, authorizeTo("admin"), usersController.updateUser);
router.delete("/:id", auth, authorizeTo("admin"), usersController.deleteUser);

module.exports = router;
