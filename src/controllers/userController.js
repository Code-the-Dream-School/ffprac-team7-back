const User = require("../models/User");
const bcrypt = require("bcryptjs");
const validatePassword = require("../middleware/updatePasswordValidation");

const signup = async (req, res) => {
  try {
    const user = await User.create({ ...req.body });
    const token = user.createJWT();
    res.status(201).json({
      username: user.username,
      email: user.email,
      location: user.location,
      token,
    });
  } catch (error) {
    console.error(error);
    let statusCode = 500;
    let errorMessage = "Internal Server Error";

    // checking for a validation error
    if (error.name === "ValidationError") {
      statusCode = 400;
      errorMessage = error.message;

      // checking for duplicate email addresses
    } else if (error.code === 11000) {
      statusCode = 409;
      errorMessage = "Username or email already exists";
    }
    res.status(statusCode).json({ error: errorMessage });
  }
};

const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      username: user.username,
      email: user.email,
      location: user.location,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateUser = async (req, res) => {
  try {
    // validate password in the request body
    validatePassword(req.body);

    const { password, ...updateFields } = req.body;

    // check if the password is provided and hash it
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateFields.password = hashedPassword;
    }
    // updating user in the database via the user id
    const { userId } = req.params;
    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      message: "User updated successfully",
      username: updatedUser.username,
      email: updatedUser.email,
      location: updatedUser.location,
    });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ error: "Username or email already in use" });
    }
    res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { username } = req.params;
    const deletedUser = await User.findOneAndDelete({ username });

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "User deleted successfully",
      username: deletedUser.username,
      email: deletedUser.email,
      location: deletedUser.location,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = user.createJWT();
    res.status(200).json({
      username: user.username,
      email: user.email,
      location: user.location,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
};

module.exports = { signup, getUserByUsername, updateUser, deleteUser, login };
