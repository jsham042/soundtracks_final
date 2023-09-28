import SpotifyWebApi from "spotify-web-api-js";

const clientId = process.env.REACT_APP_MY_SPOTIFY_CLIENT_ID;

const redirectUri = "https://www.soundtracksai.com/";
let accessToken;

const Spotify = {
  getAccessToken() {
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
  getUserInfo() {
    const accessToken = Spotify.getAccessToken();
    const spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(accessToken);
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
  search(term) {
    const accessToken = Spotify.getAccessToken();
    const spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(accessToken);
    return spotifyApi.searchTracks(term).then((jsonResponse) => {
      if (!jsonResponse.tracks) {
        return [];
      }
      return jsonResponse.tracks.items.map((track) => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri,
        preview_url: track.preview_url,
        image: track.album.images[0].url,
        spotifyLogo: "spotify-logo.png",
        spotifyLink: `https://open.spotify.com/track/${track.id}`,
      }));
    });
  },
  openAiSearch(term) {
    const responseArray = term.split("-").map((item) => item.trim());
    const track = responseArray[0];
    const artist = responseArray[1];
    const accessToken = Spotify.getAccessToken();
    const spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(accessToken);
    return spotifyApi
      .searchTracks(`track:${track} artist:${artist}`)
      .then((jsonResponse) => {
        if (!jsonResponse.tracks) {
          return [];
        }
        return jsonResponse.tracks.items.map((track) => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri,
          preview_url: track.preview_url,
          image: track.album.images[0].url,
          spotifyLogo: "spotify-logo.png",
          spotifyLink: `https://open.spotify.com/track/${track.id}`,
        }));
      })
      .catch((error) => {
        console.log(error);
      });
  },
  makeRecommendation(songId1, songId2, songId3, songId4, songId5) {
    const accessToken = Spotify.getAccessToken();
    const spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(accessToken);
    return spotifyApi
      .getRecommendations({
        seed_tracks: [songId1, songId2, songId3, songId4, songId5],
        limit: 25,
        market: "US",
      })
      .then((jsonResponse) => {
        if (!jsonResponse.tracks) {
          return [];
        }
        return jsonResponse.tracks.items.map((track) => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri,
          preview_url: track.preview_url,
          spotifyLogo: "spotify-logo.png",
          spotifyLink: `https://open.spotify.com/track/${track.id}`,
        }));
      });
  },
  savePlaylist(name, trackUris) {
    if (!name || !trackUris.length) {
      return;
    }

    const accessToken = Spotify.getAccessToken();
    const spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(accessToken);
    return spotifyApi.getMe().then((jsonResponse) => {
      const userId = jsonResponse.id;
      return spotifyApi
        .createPlaylist(userId, { name: name })
        .then((jsonResponse) => {
          const playlistId = jsonResponse.id;
          return spotifyApi.addTracksToPlaylist(playlistId, trackUris);
        });
    });
  },
  logout() {
    accessToken = "";
  },
  isLoggedIn() {
    if (accessToken) {
      return true;
    } else {
      return false;
    }
  },
};

export default Spotify;
