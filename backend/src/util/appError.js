class appError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        // check if status code start with 4   and if so  the status will be  failed unless it will be error
        this.status = `${statusCode}`.startsWith(4) ? "failed" : "error";
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
module.exports = appError;