const express = require('express');

// Controllers for auth
const { signup, login } = require('../controllers/auth.controller');

const authRouter = express.Router();

authRouter.post('/signup', signup);
authRouter.post('/login', login);

module.exports = authRouter;