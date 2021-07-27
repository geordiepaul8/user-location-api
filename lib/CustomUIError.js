/**
 * CustomUIError class. Allows for a message and statusCode to be
 * built from each HttpError.
 */
class CustomUIError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = CustomUIError;
