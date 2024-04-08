const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authentication")

const {
  signup,
  getUserByUsername,
  updateUser,
  deleteUser,
  login,
} = require("../controllers/userController");

router.post("/signup", signup);
router.post("/login", login);
router.get("/:username", authenticateUser, getUserByUsername);
router.put("/:userId", authenticateUser, updateUser);
router.delete("/:userId", authenticateUser, deleteUser);

module.exports = router;
