const SendToken = async (user, statusCode, res) => {
    const token = user.getJWTToken();

    //options for cokkie
    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
       httpOnly: true,
        secure:true,
        sameSite:'None'
    };

    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        user,
        token,
    });
};

export default SendToken;
