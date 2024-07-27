//User controler
import ErrorHandler from "../utills/ErrorHandler.js";
import CatchAsynError from "../middleware/AsyncError.js";
import { User } from "../models/User.model.js";
import SendToken from "../utills/JwtToken.js";
import SendEmail from "../utills/SendEmail.js";
import crypto from "crypto";
import cloudinary from "cloudinary";

const RegisterUser = CatchAsynError(async (req, res, next) => {
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
    });

    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        },
    });

    SendToken(user, 201, res);
});

//log in

const LoginUser = CatchAsynError(async function (req, res, next) {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler(400, "please enter user and password"));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) return next(new ErrorHandler(401, "Invalid email or password"));

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched)
        return next(new ErrorHandler(401, "Invalid email or password"));

    SendToken(user, 200, res);
    // res.send(user);
});

//logout
const LogoutUser = CatchAsynError(async (req, res, next) => {
    // Clear the token cookie
    res.cookie("token", "", {
        expires: new Date(Date.now() - 3600000), // Set a past expiration date
        httpOnly: true,
        secure:true, // Use secure flag in production
        sameSite: 'None' // Ensure this matches your frontend configuration
    });

    res.status(200).json({
        success: true,
        message: "User has been logged out",
    });
});


//forgot password
const ForgotPassword = CatchAsynError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(new ErrorHandler(404, "user not found"));

    //Get resetPassword token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false }); //save without checking required true validation
    console.log("protocol", req.protocol);
    console.log("host", req.get("host"));

    const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

    const message = `Your password reset link is: \n\n${resetPasswordUrl}`;

    try {
        await SendEmail({
            email: user.email,
            subject: "Ecommerce password recovery",
            message,
        });

        res.status(200).json({
            success: true,
            message: `Email has been sent to ${user.email} successfuly`,
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(500, error.message));
    }
});

//reset password
const ResetPassword = CatchAsynError(async (req, res, next) => {
    //create token hash
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user)
        return next(
            new ErrorHandler(404, "Invalid token or token has expired")
        );
    if (req.body.password !== req.body.confirmPassword)
        return next(new ErrorHandler(404, " Passwords do not match"));

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
        message: "Password updated successfully",
        user,
    });
});

// get user details
const GetUserDetails = CatchAsynError(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user,
    });
});

// Update password
const UpdatePassword = CatchAsynError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched)
        return next(new ErrorHandler(401, "Invalid old password"));

    if (req.body.newPassword !== req.body.confirmPassword)
        return next(new ErrorHandler(404, " Passwords do not match"));

    user.password = req.body.newPassword;
    await user.save();

    res.status(200).json({
        success: true,
    });
});

// Update UserProfile
const UpdateProfile = CatchAsynError(async (req, res, next) => {
    let newUserData = {
        name: req.body.name,
        email: req.body.email,
    };

    console.log("update profile ", Boolean(req.body.avatar.length > 0));
    if (req.body.avatar !== "undefined") {
        console.log("in");
        const user = await User.findById(req.user.id);
        const imageId = user.avatar.public_id;
        await cloudinary.v2.uploader.destroy(imageId);

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale",
        });

        newUserData = {
            name: req.body.name,
            email: req.body.email,
            avatar: {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            },
        };
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        user,
    });
});

// Update Usr role (admin)
const UpdateUserRole = CatchAsynError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    };

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        user,
    });
});

// Delete UserProfile (admin)
const DeleteUser = CatchAsynError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) return next(new ErrorHandler(500, "user not found"));

    const imageId = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId);

    await user.deleteOne();

    res.status(200).json({
        success: true,
        message: "User has been removed",
    });
});

//get all users (admin)
const GetAllUsers = CatchAsynError(async (req, res, next) => {
    const users = await User.find({});

    res.status(200).json({
        success: true,
        users,
    });
});

//get single user (admin)
const GetAUser = CatchAsynError(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) return next(new ErrorHandler(500, "user does not exist"));

    res.status(200).json({
        success: true,
        user,
    });
});

export {
    RegisterUser,
    LoginUser,
    LogoutUser,
    ForgotPassword,
    ResetPassword,
    GetUserDetails,
    UpdatePassword,
    UpdateProfile,
    GetAllUsers,
    GetAUser,
    UpdateUserRole,
    DeleteUser,
};
