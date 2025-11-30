const axios = require('axios');
const { createSendToken } = require('./auth.controller');
const AppError = require('../utils/appError');
const User = require('../models/user.model');

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID;
const FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3000/api/oauth/facebook/callback";

const getGoogleAuthUrl = (req, res) => {
    const params = new URLSearchParams({
        client_id: process.env.MAIN_GOOGLE_ID,
        redirect_uri: process.env.MAIN_GOOGLE_REDIRECT,
        response_type: "code",
        scope: "openid email profile",
        access_type: "offline",
        prompt: "consent",
    });


    res.redirect(`${GOOGLE_AUTH_URL}?${params.toString()}`);
};

const googleCallback = async (req, res, next) => {
    try {
        const { code } = req.query;

        const tokenResponse = await axios.post(GOOGLE_TOKEN_URL, {
            code,
            client_id: process.env.MAIN_GOOGLE_ID,
            client_secret: process.env.MAIN_GOOGLE_SECRET,
            redirect_uri: process.env.MAIN_GOOGLE_REDIRECT,
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
            sameSite: 'None',
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

const getFacebookAuthUrl = (req, res) => {
    const params = new URLSearchParams({
        client_id: FACEBOOK_CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        scope: "public_profile",
    });

    res.redirect(`https://www.facebook.com/v17.0/dialog/oauth?${params.toString()}`);
};

const facebookCallback = async (req, res) => {
    try {
        const { code } = req.query;

        const tokenResponse = await axios.get("https://graph.facebook.com/v17.0/oauth/access_token", {
            params: {
                client_id: FACEBOOK_CLIENT_ID,
                client_secret: FACEBOOK_CLIENT_SECRET,
                redirect_uri: REDIRECT_URI,
                code,
            },
        });

        const { access_token } = tokenResponse.data;

        const userInfo = await axios.get("https://graph.facebook.com/me", {
            params: {
                fields: "id,name,email,picture",
                access_token
            }
        });

        console.log(userInfo.data);
    } catch(err) {
        console.log(err);
    }
};

module.exports = {googleCallback, getGoogleAuthUrl, getFacebookAuthUrl, facebookCallback};