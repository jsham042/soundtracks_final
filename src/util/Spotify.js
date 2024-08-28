const clientId = process.env.REACT_APP_MY_SPOTIFY_CLIENT_ID; // client ID  that Joe got from registering the app
const awsPullRequestId = process.env.AWS_PULL_REQUEST_ID;
const awsAppId = process.env.AWS_APP_ID;
const previewUri =
  awsPullRequestId && awsAppId && domain
    ? `https://pr-${awsPullRequestId}.${awsAppId}.amplifyapp.com`
    : undefined;
const developmentProductionUri = process.env.REACT_APP_MY_SPOTIFY_REDIRECT_URI;
const redirectUri = previewUri || developmentProductionUri;

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
  async getUserInfo() {
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

  async getArtistGenres(artistId, accessToken) {
    try {
      const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const artistInfo = await response.json();
      return artistInfo.genres[0] || "Unknown Genre";
    } catch (error) {
      console.error(`Error fetching artist info: ${error}`);
      return "Unknown Genre";
    }
  },

  async openAiSearch(term) {
    const track = term.song;
    const artist = term.artist;
    const accessToken = Spotify.getAccessToken();
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=track:${track}+artist:${artist}&type=track&limit=1`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const jsonResponse = await response.json();
      if (!jsonResponse.tracks) {
        return [];
      }
      const tracks = jsonResponse.tracks.items;
      const trackPromises = tracks.map(async (track) => {
        if (!track.preview_url) {
          console.error(
            `Missing preview URL for track: ${track.name} by ${track.artists[0].name}`,
          );
        }
        return {
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri,
          preview_url: track.preview_url || "No preview available",
          image: track.album.images[0].url,
          spotifyLogo: "spotify-logo.png",
          spotifyLink: `https://open.spotify.com/track/${track.id}`,
        };
      });
      return Promise.all(trackPromises);
    } catch (error) {
      console.error("Error in openAiSearch:", error);
      return [];
    }
  },

  async makeRecommendation(trackIds) {
    const accessToken = Spotify.getAccessToken();
    const seedTracks = trackIds.slice(0, 5).join(',');
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/recommendations?limit=25&market=US&seed_tracks=${seedTracks}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const jsonResponse = await response.json();
      if (!jsonResponse.tracks) {
        return [];
      }
      const trackPromises = jsonResponse.tracks.map(async (track) => {
        const mainGenre = await this.getArtistGenres(track.artists[0].id, accessToken);
        if (!track.preview_url) {
          console.error(
            `Missing or invalid preview URL for track ID: ${track.id}, track name: ${track.name}`,
          );
        }
        return {
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri,
          image: track.album.images[0].url,
          preview_url: track.preview_url || "No preview available",
          spotifyLogo: "spotify-logo.png",
          spotifyLink: `https://open.spotify.com/track/${track.id}`,
        };
      });
      return Promise.all(trackPromises);
    } catch (error) {
      console.error("Error in makeRecommendation:", error);
      return [];
    }
  },

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