const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong, try again later.",
  };

  if (err.name === "ValidationError") {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (err.code && err.code === 11000) {
    customError.msg = `${Object.keys(
      err.keyValue
    )} already exist, please choose another ${Object.keys(err.keyValue)}`;
    customError.statusCode = StatusCodes.CONFLICT;
  }

  if (err.name === "CastError") {
    if (err.message.includes("User") || err.message.includes("user")) {
      customError.msg = "User not found";
      customError.statusCode = StatusCodes.NOT_FOUND;
    } else {
      customError.msg = `No item found with id : ${err.value}`;
      customError.statusCode = StatusCodes.NOT_FOUND;
    }
  }

  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
