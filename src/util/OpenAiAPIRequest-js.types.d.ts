// Derived from src/util/OpenAiAPIRequest.js

// Enum for different strategies
export enum Strategy {
    Literal = "Interpret the user's prompt literally.",
    Mood = "Capture the mood or theme implied by the user's prompt.",
    Genre = "Select songs from different genres that fit the context of the user's prompt.",
    Era = "Suggest songs from different eras or time periods that align with the user's prompt.",
    Creative = "Interpret the user's prompt creatively."
}

// Type for song recommendation
export interface SongRecommendation {
    song: string;
    artist: string;
}

// Type for the response from the AI for song recommendations
export interface SongRecommendationsResponse {
    recommendations: SongRecommendation[];
}

// Type for the response from the AI for strategies
export interface StrategiesResponse {
    strategies: Strategy[];
}

// Type for the response from the AI for playlist name
export interface PlaylistNameResponse {
    name: string;
}

// Type for the response from the AI for image generation
export interface ImageResponse {
    url: string;
}

// Type for the function parameters
export interface GenerateAISongRecommendationsParams {
    userSearchInput: string;
}

export interface GenerateSongRecommendationsParams {
    prompt: string;
}

export interface GeneratePlaylistNameParams {
    prompt: string;
}

export interface GenerateImageParams {
    prompt: string;
}

// Type for the function return values
export type GenerateAISongRecommendationsReturn = Promise<SongRecommendation[]>;
export type GenerateSongRecommendationsReturn = Promise<string>;
export type GeneratePlaylistNameReturn = Promise<string | null>;
export type GenerateImageReturn = Promise<string | null>;
export type DetermineAppropriateStrategiesReturn = Promise<Strategy[]>;

export {
    GenerateAISongRecommendationsParams,
    GenerateSongRecommendationsParams,
    GeneratePlaylistNameParams,
    GenerateImageParams,
    GenerateAISongRecommendationsReturn,
    GenerateSongRecommendationsReturn,
    GeneratePlaylistNameReturn,
    GenerateImageReturn,
    DetermineAppropriateStrategiesReturn
};
