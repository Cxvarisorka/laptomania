const User = require("../models/user.model");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const bcrypt = require("bcrypt");

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

    user.password = undefined;

    res.status(200).json(user)
});

module.exports = { signup, login };