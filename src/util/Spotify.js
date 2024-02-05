const clientId = process.env.REACT_APP_MY_SPOTIFY_CLIENT_ID; // client ID  that Joe got from registering the app
// const redirectUri = "https://www.soundtracksai.com/"; // Have to add this to your accepted Spotify redirect URIs on the Spotify API.
const redirectUri= process.env.REACT_APP_MY_SPOTIFY_REDIRECT_URI
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
    return fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((jsonResponse) => {
        if (!jsonResponse) {
          return { username: null, avatar: null };
        }
        return {
          username: jsonResponse.display_name,
          avatar: jsonResponse.images[0]?.url || null,
        };
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
        const trackIds = jsonResponse.tracks.items.map(track => track.id);
        return fetch(
          `https://api.spotify.com/v1/audio-features?ids=${trackIds.join(",")}`, // Fetching audio features to get the genre
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then(response => response.json())
        .then(featuresResponse => {
          const genres = featuresResponse.audio_features.map(feature => feature.genre);
          return fetch(
            `https://api.spotify.com/v1/tracks?ids=${trackIds.join(",")}`, // Fetching additional track details
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(response => response.json())
          .then(fullTracksResponse => {
            return fullTracksResponse.tracks.map((track, index) => ({
              id: track.id,
              name: track.name,
              artist: track.artists[0].name,
              album: track.album.name,
              uri: track.uri,
              preview_url: track.preview_url,
              image: track.album.images[0].url,
              genre: genres[index], // Adding genre information to each track object
              spotifyLogo: "spotify-logo.png",
              spotifyLink: `https://open.spotify.com/track/${track.id}`
            }));
          });
        });
      })
      .catch((error) => {
        console.log(error);
      });
  },
const Spotify = {
  // ... other methods ...
  savePlaylist(name, trackUris) {
    if (!name || !trackUris.length) {
      return;
    }
    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };
    let userId;

    return fetch("https://api.spotify.com/v1/me", { headers: headers })
      .then((response) => response.json())
      .then((jsonResponse) => {
        userId = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          headers: headers,
          method: "POST",
          body: JSON.stringify({ name: name }),
        })
          .then((response) => response.json())
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
  // ... other methods ...
};

export default Spotify;