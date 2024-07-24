import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please Enter you name"],
            minlength: [3, "Name must be at least 3 characters long"],
            maxlength: [30, "Name must be at most 30 characters long"],
        },
        email: {
            type: String,
            required: [true, "Please Enter you email"],
            unique: true,
            validate: [validator.isEmail, "Please Enter a valid email address"],
        },
        password: {
            type: String,
            required: [true, "Please Enter you password"],
            minlength: [8, "Password must be at least 8 characters long"],
            select: false,
        },
        avatar: {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
        },
        role: {
            type: String,
            default: "user",
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date,
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) next();

    this.password = await bcrypt.hash(this.password, 10);
});

// Jwt token
userSchema.methods.getJWTToken = function () {
    return JWT.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

//check for password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

//Generating password reset token
userSchema.methods.getResetPasswordToken = function () {
    //Generating token
    const resetToken = crypto.randomBytes(20).toString("hex");

    //hashing and add to userSchema
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

    return resetToken;
};

export const User = mongoose.model("User", userSchema);
