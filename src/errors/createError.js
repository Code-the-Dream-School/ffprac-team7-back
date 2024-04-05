const { StatusCodes } = require("http-status-codes");
const CustomError = require("./customError");

class CreateError extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.CONFLICT;
  }
}

module.exports = CreateError;
