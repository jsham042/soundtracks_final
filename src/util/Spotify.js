// const redirectUri = 'http://localhost:3000/callback'; // Have to add this to your accepted Spotify redirect URIs on the Spotify API.
const redirectUri = "https://www.soundtracksai.com/"; // Have to add this to your accepted Spotify redirect URIs on the Spotify API.
const clientId = process.env.REACT_APP_MY_SPOTIFY_CLIENT_ID;

let accessToken;

const Spotify = {
  async getAccessToken() {
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
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location = accessUrl;
    }
  },
  search(term) {
    const accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          return null;
        }
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
          image: track.album.images.url,
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
        if (!response.ok) {
          return null;
        }
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
        }));
      });
  },
  makeRecommendation(songId1, songId2, songId3, songId4, songId5) {
    const accessToken = Spotify.getAccessToken();
    return fetch(
      `https://api.spotify.com/v1/recommendations?limit=20&market=US&seed_tracks=${songId1},${songId2},${songId3},${songId4},${songId5}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
      .then((response) => {
        if (!response.ok) {
          return null;
        }
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
        }));
      });
  },
  savePlaylist(name, trackUris) {
    if (!name || !trackUris.length) {
      return;
    }

    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };
    let userId;

    return fetch("https://api.spotify.com/v1/me", { headers: headers })
      .then((response) => {
        if (!response.ok) {
          return null;
        }
        return response.json();
      })
      .then((jsonResponse) => {
        userId = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          headers: headers,
          method: "POST",
          body: JSON.stringify({ name: name }),
        })
          .then((response) => {
            if (!response.ok) {
              return null;
            }
            return response.json();
          })
          .then((jsonResponse) => {
            const playlistId = jsonResponse.id;
            return fetch(
              `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
              {
                headers: headers,
                method: "POST",
                body: JSON.stringify({ uris: trackUris }),
              },
            );
          });
      });
  },
  isLoggedIn() {
    if (accessToken) {
      return true;
    } else {
      return false;
    }
  },

  getUserInfo() {
    const accessToken = Spotify.getAccessToken();
    return fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          return null;
        }
        return response.json();
      })
      .then((jsonResponse) => {
        return {
          username: jsonResponse.display_name,
          avatar: jsonResponse.images[0].url,
        };
      });
  },
};
export default Spotify;
