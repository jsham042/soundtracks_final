const clientId = process.env.REACT_APP_MY_SPOTIFY_CLIENT_ID; // client ID  that Joe got from registering the app

const redirectUri = "https://www.soundtracksai.com/"; // Have to add this to your accepted Spotify redirect URIs on the Spotify API.
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
      window.history.pushState("Access Token", null, "/");
      return accessToken;
    } else {
      Spotify.login();
    }
  },
  getUserInfo() {
    return Spotify.getMe().then((response) => {
      return {
        username: response.display_name,
        avatar: response.images[0]?.url || null,
      };
    });
  },
  search(term) {
    return Spotify.searchTracks(term).then((response) => {
      return response.tracks.items.map((track) => ({
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
    return fetch(
      `https://api.spotify.com/v1/search?q=track:${track}+artist:${artist}&type=track&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
      .then((response) => {
        return response.json();
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
    return Spotify.getRecommendations({
      seed_tracks: [songId1, songId2, songId3, songId4, songId5],
    }).then((response) => {
      return response.tracks.items.map((track) => ({
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

    return Spotify.createPlaylist(name, { uris: trackUris });
  },
  logout() {
    Spotify.logout();
  },
  isLoggedIn() {
    return !!accessToken;
  },
};
