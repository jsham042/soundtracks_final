import SpotifyWebApi from "spotify-web-api-js";

const clientId = process.env.REACT_APP_MY_SPOTIFY_CLIENT_ID; // client ID  that Joe got from registering the app

const redirectUri = "https://www.soundtracksai.com/"; // Have to add this to your accepted Spotify redirect URIs on the Spotify API.
let accessToken;

const spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(accessToken);

const Spotify = {
  getAccessToken: function () {
    if (accessToken) {
      return accessToken;
    }

    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
      window.history.pushState("Access Token", null, "/"); // This clears the parameters, allowing us to grab a new access token when it expires.
      return accessToken;
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location = accessUrl;
    }
  },
  getUserInfo: function () {
    return spotifyApi.getMe().then(
      (data) => {
        return {
          username: data.body.display_name,
          avatar: data.body.images[0]?.url || null,
        };
      },
      function (err) {
        console.error(err);
      },
    );
  },
  // Rest of the code remains the same
};
export default Spotify;
