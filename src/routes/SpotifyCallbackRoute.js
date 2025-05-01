const express = require('express');
const router = express.Router();
const SpotifyAuth = require('../SpotifyAuth');

router.get('/callback', async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.redirect('/error?message=NoCodeProvided');
    }

    try {
        const { accessToken, refreshToken } = await SpotifyAuth.exchangeCodeForToken(code);
        // Assuming you have a function to set these tokens in your session or a similar mechanism
        req.session.accessToken = accessToken;
        req.session.refreshToken = refreshToken;
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error exchanging code for tokens:', error);
        res.redirect('/error?message=AuthenticationFailed');
    }
});

module.exports = router;