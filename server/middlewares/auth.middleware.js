const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const User = require("../models/user.model");
const catchAsync = require("../utils/catchAsync");

const protect = catchAsync(async (req, res, next) => {
    const token = req.cookies.lg;

    if(!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    // { id: 'userId', role: 'user', iat: timestamp, exp: timestamp }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if(!user) {
        return next(new AppError('The user belonging to this token does no longer exist.', 401));
    }

    req.user = user;
    next();
});

module.exports = protect;