const axios = require('axios');
const { createSendToken } = require('./auth.controller');
const AppError = require('../utils/appError');
const User = require('../models/user.model');

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

const getGoogleAuthUrl = (req, res) => {
    const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        response_type: "code",
        scope: "openid email profile",
        access_type: "offline",
        prompt: "consent",
    });


    res.redirect(`${GOOGLE_AUTH_URL}?${params.toString()}`);
}

const googleCallback = async (req, res, next) => {
    try {
        const { code } = req.query;

        const tokenResponse = await axios.post(GOOGLE_TOKEN_URL, {
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: process.env.GOOGLE_REDIRECT_URI,
            grant_type: 'authorization_code'
        });

        const { access_token } = tokenResponse.data;

        const userInfo = await axios.get(GOOGLE_USERINFO_URL, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });

        const { email, name, picture, sub, email_verified } = userInfo.data;

        let user = await User.findOne({oauthid: sub, email});

        if(!user) {
            if(!email_verified) {
                return next(new AppError('Google account not verified', 400));
            }

            user = await User.create({
                fullname: name,
                email,
                avatar: picture,
                oauthid: sub,
                oauthProvider: 'google',
                isVerified: true,
            });
        }

        // Create JWT token
        const token = user.signToken();

        // Set cookie with the token
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'prod',
            sameSite: 'Lax',
            maxAge: process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
        };

        res.cookie('lg', token, cookieOptions);

        // Redirect to panel after setting cookie
        res.redirect(`${process.env.CLIENT_URL}/panel`);
    } catch(err) {
        console.log(err);
        res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`);
    }
};

module.exports = {googleCallback, getGoogleAuthUrl};