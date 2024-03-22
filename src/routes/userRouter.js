const express = require("express");
const router = express.Router();

const {
  signup,
  getUserByUsername,
  updateUser,
  deleteUser,
  login,
} = require("../controllers/userController");

router.post("/signup", signup);
router.get("/:username", getUserByUsername);
router.put("/:userId", updateUser);
router.delete("/:username", deleteUser);
router.post("/login", login);

module.exports = router;
