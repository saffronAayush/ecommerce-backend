import ErrorHandler from "../utills/ErrorHandler.js";
import CatchAsynError from "./AsyncError.js";
import JWT from "jsonwebtoken";
import { User } from "../models/User.model.js";

const isAuthenticatedUser = CatchAsynError(async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return next(
            new ErrorHandler(401, "Please Login to acces this resorce")
        );
    }

    const decodedData = JWT.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decodedData.id);

    next();
});

const AuthorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(
                    403,
                    `Role:${req.user.role} is not allowed to acces the resource`
                )
            );
        }
        next();
    };
};

export { isAuthenticatedUser, AuthorizeRoles };
