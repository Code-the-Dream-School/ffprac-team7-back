const express = require("express");
const router = express.Router();

const {
  signup,
  getUserByUsername,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

router.post("/signup", signup);
router.get("/:username", getUserByUsername);
router.put("/:username", updateUser);
router.delete("/:username", deleteUser);

module.exports = router;
