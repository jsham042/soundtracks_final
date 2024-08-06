// Derived from src/util/Spotify.js

export type SpotifyUserInfo = {
  username: string | null;
  avatar: string | null;
};

export type SpotifyTrack = {
  id: string;
  name: string;
  artist: string;
  album: string;
  uri: string;
  preview_url: string;
  image: string;
  spotifyLogo: string;
  spotifyLink: string;
  genre?: string;
};

export type SpotifyRecommendationTrack = {
  id: string;
  name: string;
  artist: string;
  album: string;
  uri: string;
  preview_url: string;
  spotifyLogo: string;
  spotifyLink: string;
};

export type SpotifySearchTerm = {
  song: string;
  artist: string;
};

export type SpotifyApiResponse<T> = {
  items: T[];
};

export type SpotifyArtistInfo = {
  genres: string[];
};

export type SpotifyJsonResponse = {
  display_name: string;
  images: { url: string }[];
};

export type SpotifyTrackResponse = {
  tracks: SpotifyApiResponse<SpotifyTrack>;
};

export type SpotifyRecommendationResponse = {
  tracks: SpotifyApiResponse<SpotifyRecommendationTrack>;
};

export type SpotifyPlaylistResponse = {
  id: string;
};

export type SpotifyUserResponse = {
  id: string;
};
