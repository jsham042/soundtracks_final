import type { SpotifyUserInfo, SpotifyTrack, SpotifyArtistInfo, SpotifyRecommendation } from './Spotify-js.types';

const clientId: string = process.env.REACT_APP_MY_SPOTIFY_CLIENT_ID as string; // client ID that Joe got from registering the app
const awsPullRequestId: string | undefined = process.env.AWS_PULL_REQUEST_ID;
const awsAppId: string | undefined = process.env.AWS_APP_ID;
const domain: string | undefined = process.env.DOMAIN; // Assuming domain is defined somewhere in the environment variables
const previewUri: string | undefined =
  awsPullRequestId && awsAppId && domain
    ? `https://pr-${awsPullRequestId}.${awsAppId}.amplifyapp.com`
    : undefined;
const developmentProductionUri: string = process.env.REACT_APP_MY_SPOTIFY_REDIRECT_URI as string;
const redirectUri: string = previewUri || developmentProductionUri;

let accessToken: string | undefined;

const Spotify = {
  getAccessToken(): string | undefined {
    if (accessToken) {
      return accessToken;
    }

    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      window.setTimeout(() => (accessToken = undefined), expiresIn * 1000);
      window.history.pushState("Access Token", "", "/"); // This clears the parameters, allowing us to grab a new access token when it expires.
      return accessToken;
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location.href = accessUrl;
    }
  },

  async getUserInfo(): Promise<SpotifyUserInfo> {
    const accessToken = Spotify.getAccessToken();
    if (!accessToken) {
      throw new Error("Access token is missing");
    }
    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const jsonResponse = await response.json();
    if (!jsonResponse) {
      return { username: null, avatar: null };
    }
    return {
      username: jsonResponse.display_name,
      avatar: jsonResponse.images[0]?.url || null,
    };
  },

  async openAiSearch(term: { song: string; artist: string }): Promise<SpotifyTrack[]> {
    const track = term.song;
    const artist = term.artist;
    const accessToken = Spotify.getAccessToken();
    if (!accessToken) {
      throw new Error("Access token is missing");
    }
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
    const artistPromises = tracks.map(async (track: SpotifyTrack) => {
      try {
        const artistResponse = await fetch(`https://api.spotify.com/v1/artists/${track.artists[0].id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const artistInfo: SpotifyArtistInfo = await artistResponse.json();
        const mainGenre = artistInfo.genres[0] || "Unknown Genre";
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
          genre: mainGenre,
        };
      } catch (error) {
        console.log(
          `Error fetching artist info for ${track.artists[0].name}: ${error}`,
        );
        return {
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri,
          preview_url: track.preview_url,
          image: track.album.images[0].url,
          spotifyLogo: "spotify-logo.png",
          spotifyLink: `https://open.spotify.com/track/${track.id}`,
          genre: "Unknown Genre",
        };
      }
    });
    return Promise.all(artistPromises);
  },

  async makeRecommendation(songId1: string, songId2: string, songId3: string, songId4: string, songId5: string): Promise<SpotifyRecommendation[]> {
    const accessToken = Spotify.getAccessToken();
    if (!accessToken) {
      throw new Error("Access token is missing");
    }
    const response = await fetch(
      `https://api.spotify.com/v1/recommendations?limit=25&market=US&seed_tracks=${songId1},${songId2},${songId3},${songId4},${songId5}`,
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
    return jsonResponse.tracks.map((track: SpotifyTrack) => {
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
        preview_url: track.preview_url || "No preview available",
        spotifyLogo: "spotify-logo.png",
        spotifyLink: `https://open.spotify.com/track/${track.id}`,
      };
    });
  },

  async savePlaylist(name: string, trackUris: string[]): Promise<void> {
    if (!name || !trackUris.length) {
      return;
    }

    const accessToken = Spotify.getAccessToken();
    if (!accessToken) {
      throw new Error("Access token is missing");
    }
    const headers = { Authorization: `Bearer ${accessToken}` };
    let userId: string;

    const userResponse = await fetch("https://api.spotify.com/v1/me", { headers: headers });
    const userJsonResponse = await userResponse.json();
    userId = userJsonResponse.id;

    const playlistResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      headers: headers,
      method: "POST",
      body: JSON.stringify({ name: name }),
    });
    const playlistJsonResponse = await playlistResponse.json();
    const playlistId = playlistJsonResponse.id;

    await fetch(
      `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
      {
        headers: headers,
        method: "POST",
        body: JSON.stringify({ uris: trackUris }),
      },
    );
  },

  logout(): void {
    accessToken = undefined;
  },

  isLoggedIn(): boolean {
    return !!accessToken;
  },
};

export default Spotify;
