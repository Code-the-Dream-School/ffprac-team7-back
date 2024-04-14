const User = require("../models/User");
const bcrypt = require("bcryptjs");
const validatePassword = require("../middleware/updatePasswordValidation");
const { StatusCodes } = require("http-status-codes");
const { UnauthenticatedError, NotFoundError } = require("../errors");

const signup = async (req, res, next) => {
  try {
    const user = await User.create({ ...req.body });
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({
      username: user.username,
      email: user.email,
      location: user.location,
      phoneNumber: user.phoneNumber,
      token,
    });
  } catch (error) {
    next(error);
  }
};

const getUserByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    res.status(StatusCodes.OK).json({
      username: user.username,
      email: user.email,
      location: user.location,
      phoneNumber: user.phoneNumber,
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
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
    res.status(StatusCodes.OK).json({
      message: "User updated successfully",
      username: updatedUser.username,
      email: updatedUser.email,
      location: updatedUser.location,
      phoneNumber: updatedUser.phoneNumber,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      throw new NotFoundError("User not found");
    }

    res.status(StatusCodes.OK).json({
      message: "User deleted successfully",
      username: deletedUser.username,
      email: deletedUser.email,
      location: deletedUser.location,
      phoneNumber: deletedUser.phoneNumber,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      throw new UnauthenticatedError("Invalid username or password");
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError("Invalid username or password");
    }

    const token = user.createJWT();
    res.status(StatusCodes.OK).json({
      username: user.username,
      email: user.email,
      location: user.location,
      token,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, getUserByUsername, updateUser, deleteUser, login };
