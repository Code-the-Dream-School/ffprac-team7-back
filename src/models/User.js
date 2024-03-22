const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide your username"],
    minlength: 3,
    maxlength: 50,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  location: {
    type: String,
    trim: true,
  },
});

userSchema.pre("save", async function (next) {
  try {
    if (!validator.isAlphanumeric(this.username)) {
      const error = new Error("Username must be alphanumeric");
      error.status = 400;
      return next(error);
    }

    if (!validator.isEmail(this.email)) {
      const error = new Error("Please provide a valid email");
      error.status = 400;
      return next(error);
    }

    // Checking username and email uniqueness 
    const userExists = await mongoose
      .model("User")
      .findOne({ $or: [{ username: this.username }, { email: this.email }] });
    if (userExists) {
      const error = new Error("Username or email already exists");
      error.status = 400;
      return next(error);
    }

    // Checking customized password strength
    if (!isPasswordStrongEnough(this.password)) {
      const error = new Error(
        "Password must be at least 8 characters long and contain at least one digit, one lowercase letter, and one uppercase letter"
      );
      error.status = 400;
      return next(error);
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// create the jsonwebtoken
userSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, username: this.username },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

// comparing the password for logging in the user
userSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

// checking if the password is strong
// (?=.*\d) - check if the password contains at least one digit
// (?=.*[a-z]) - check if the password contains at least one lowercase letter
// (?=.*[A-Z]) - check if the password contains at least one uppercase letter
// .{8,} - check if the password has a minimum length of 8 characters
function isPasswordStrongEnough(password) {
  return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password);
}

module.exports = mongoose.model("User", userSchema);
