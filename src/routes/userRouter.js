const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authentication");
const upload = require("../../config/multerConfig");

const {
  signup,
  getUserByUsername,
  updateUser,
  deleteUser,
  login,
  uploadProfilePicture,
} = require("../controllers/userController");

router.post("/signup", signup);
router.post("/login", login);
router.post(
  "/upload-profile-picture",
  authenticateUser,
  upload.single("profilePicture"),
  uploadProfilePicture
);
router.get("/:username", authenticateUser, getUserByUsername);
router.put("/:userId", authenticateUser, updateUser);
router.delete("/:userId", authenticateUser, deleteUser);

module.exports = router;
