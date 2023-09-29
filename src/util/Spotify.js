import SpotifyWebApi from "spotify-web-api-js";

const clientId = process.env.REACT_APP_MY_SPOTIFY_CLIENT_ID;

const redirectUri = "https://www.soundtracksai.com/";
let accessToken;

const spotifyApi = new SpotifyWebApi();

const Spotify = {
  getAccessToken: async function () {
    if (accessToken) {
      return accessToken;
    }

    try {
      const data = await spotifyApi.clientCredentialsGrant();
      console.log("The access token expires in " + data.body["expires_in"]);
      console.log("The access token is " + data.body["access_token"]);

      // Save the access token so that it's used in future calls
      spotifyApi.setAccessToken(data.body["access_token"]);
      accessToken = data.body["access_token"];
    } catch (err) {
      console.log("Something went wrong when retrieving an access token", err);
    }

    return accessToken;
  },
  retrieveUserInformation: function () {
    return spotifyApi.getMe().then((jsonResponse) => {
      if (!jsonResponse) {
        return { username: null, avatar: null };
      }
      return {
        username: jsonResponse.display_name,
        avatar: jsonResponse.images[0]?.url || null,
      };
    });
  },
  // Rest of the code remains the same
};
export default Spotify;
