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
  logout: function () {
    // Clear the access token
    accessToken = "";
    // Use the Spotify SDK's logout method
    spotifyApi.logout();
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
  searchTracks: function (term) {
    return spotifyApi.searchTracks(term).then((jsonResponse) => {
      if (!jsonResponse) {
        return [];
      }
      return jsonResponse.tracks.items.map((track) => {
        return {
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri,
        };
      });
    });
  },
  makeRecommendations: function (seedTracks, seedArtists, seedGenres) {
    return spotifyApi
      .getRecommendations({
        seed_tracks: seedTracks,
        seed_artists: seedArtists,
        seed_genres: seedGenres,
      })
      .then((jsonResponse) => {
        if (!jsonResponse) {
          return [];
        }
        return jsonResponse.tracks.map((track) => {
          return {
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri,
          };
        });
      });
  },
  savePlaylist: function (name, trackUris) {
    if (!name || !trackUris.length) {
      return;
    }
    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };
    let userId;

    return spotifyApi
      .getMe()
      .then((response) => {
        userId = response.id;
        return spotifyApi.createPlaylist(userId, name, { public: false });
      })
      .then((response) => {
        const playlistId = response.id;
        return spotifyApi.addTracksToPlaylist(playlistId, trackUris);
      });
  },
};
export default Spotify;
