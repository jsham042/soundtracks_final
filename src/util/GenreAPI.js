require("dotenv").config();
const fetch = require("node-fetch");

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

// Function to get the access token from Spotify
async function getSpotifyAccessToken() {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(clientId + ":" + clientSecret).toString("base64"),
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  return data.access_token;
}

// Function to fetch genre by artist name
async function fetchGenreByArtist(artistName) {
  try {
    const accessToken = await getSpotifyAccessToken();
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const data = await response.json();
    const artists = data.artists.items;

    if (artists.length === 0) {
      return "No artist found with that name.";
    }

    // Assuming we take the first artist found
    const genres = artists[0].genres;

    if (genres.length === 0) {
      return "No genres found for this artist.";
    }

    return genres;
  } catch (error) {
    console.error("Error fetching genre by artist:", error);
    throw new Error("Failed to fetch genre information.");
  }
}

module.exports = { fetchGenreByArtist };
