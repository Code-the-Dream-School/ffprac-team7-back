const { BadRequestError } = require("../errors");

const validatePassword = (reqBody) => {
  const { password } = reqBody;
  if (password && !isPasswordStrongEnough(password)) {
    throw new BadRequestError(
      "Password must be at least 8 characters long and contain at least one digit, one lowercase letter, and one uppercase letter"
    );
  }
  return true;
};

function isPasswordStrongEnough(password) {
  return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password);
}

module.exports = validatePassword;
