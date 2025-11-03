const User = require("../models/user.model");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const createSendToken = (user, statusCode, res) => {
    const token = user.signToken();

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'prod',
        maxAge: process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    };

    user.password = undefined;

    res.status(statusCode).cookie('lg', token, cookieOptions).json(user);
};

const signup = catchAsync(async (req, res, next) => {
    const {email, fullname, password} = req.body;
    const newUser = await User.create({email, fullname, password});
    res.status(201).json("User created successfully");
});

const login = catchAsync(async (req, res, next) => {
    const {email, password} = req.body;

    const user = await User.findOne({email}).select('+password');

    if(!user) {
        return next(new AppError('Invalid email or password', 401));
    }

    const isPasswordValid = await user.comparePassword(password);

    if(!isPasswordValid) {
        return next(new AppError('Invalid email or password', 401));
    }

    createSendToken(user, 200, res);
});

module.exports = { signup, login };