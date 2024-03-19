const User = require("../models/User");

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
      errorMessage = "Email is already in use.";
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
    const { username } = req.params;
    const update = req.body;

    if (update.username && update.username !== username) {
      return res.status(400).json({
        error: "Username in request body is different from username in route",
      });
    }

    const updatedUser = await User.findOneAndUpdate({ username }, update, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      username: updatedUser.username,
      email: updatedUser.email,
      location: updatedUser.location,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
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

module.exports = { signup, getUserByUsername, updateUser, deleteUser };
