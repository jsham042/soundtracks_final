// Assuming a Node.js environment with Express for handling HTTP requests and the 'dotenv' package for environment variables

require('dotenv').config();
const express = require('express');
const axios = require('axios');
const querystring = require('querystring');

const app = express();
const port = process.env.PORT || 3000;

// Spotify OAuth 2.0 setup
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;
const STATE_KEY = 'spotify_auth_state';
const SCOPE = 'user-read-private user-read-email';

// Generate a random string for the state parameter in the authentication request to prevent CSRF
function generateRandomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// Function to initiate the authentication process
app.get('/login', (req, res) => {
  const state = generateRandomString(16);
  res.cookie(STATE_KEY, state);

  // Redirect to Spotify's authorization page
  res.redirect(`https://accounts.spotify.com/authorize?${querystring.stringify({
    response_type: 'code',
    client_id: CLIENT_ID,
    scope: SCOPE,
    redirect_uri: REDIRECT_URI,
    state: state
  })}`);
});

// Function to handle the redirection from Spotify with the authentication code
app.get('/callback', (req, res) => {
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[STATE_KEY] : null;

  if (state === null || state !== storedState) {
    res.redirect(`/#${querystring.stringify({ error: 'state_mismatch' })}`);
  } else {
    res.clearCookie(STATE_KEY);

    // Exchange the code for an access token and a refresh token
    axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: querystring.stringify({
        code: code,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code'
      }),
      headers: {
        'Authorization': `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => {
      if (response.status === 200) {
        const { access_token, refresh_token } = response.data;

        // Securely store the tokens (for this example, we're just redirecting to the client with the tokens)
        res.redirect(`/#${querystring.stringify({ access_token, refresh_token })}`);
      } else {
        res.redirect(`/#${querystring.stringify({ error: 'invalid_token' })}`);
      }
    }).catch(error => {
      res.redirect(`/#${querystring.stringify({ error: 'invalid_request' })}`);
    });
  }
});

// Function to refresh the access token when it expires
app.get('/refresh_token', (req, res) => {
  const refresh_token = req.query.refresh_token;

  axios({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    data: querystring.stringify({
      refresh_token: refresh_token,
      grant_type: 'refresh_token'
    }),
    headers: {
      'Authorization': `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(response => {
    if (response.status === 200) {
      const { access_token } = response.data;
      res.send({ access_token });
    } else {
      res.send({ error: 'invalid_token' });
    }
  }).catch(error => {
    res.send({ error: 'invalid_request' });
  });
});

// Function to log out the user by clearing the stored tokens
app.get('/logout', (req, res) => {
  // For this example, we'll just redirect to the home page without the tokens
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});