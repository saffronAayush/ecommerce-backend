import ErrorHandler from "../utills/ErrorHandler.js";

const ErrorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    //wrong mongoose id error
    if (err.name === "CastError") {
        const message = `Resource not found, invalid: ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    //mongoose duplicate key erro
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHandler(400, message);
    }

    //JWT wrong
    if (err.name === "JsonWebTokenError") {
        const message = `json web token is invalid, try again`;
        err = new ErrorHandler(400, message);
    }
    //JWT wrong
    if (err.name === "TokenExpiredError") {
        const message = `json web token is expired, try again`;
        err = new ErrorHandler(400, message);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};

export default ErrorMiddleware;
