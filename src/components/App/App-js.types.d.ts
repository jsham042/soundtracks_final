// Derived from src/components/App/App.js

export interface AppState {
    loggedIn: boolean;
    searchResults: Track[];
    playlistName: string;
    playlistTracks: Track[];
    isFetching: boolean;
    searchState: boolean;
    albumArt: string;
    currentTrack: Track | null;
    spotifyUsername: string | null;
    spotifyAvatar: string | null;
}

export interface Track {
    id: string;
    uri: string;
    preview_url: string;
    // Add other properties as needed
}

export interface UserInfo {
    username: string;
    avatar: string;
}

export interface OpenAiAPIRequest {
    interpretPrompt(prompt: string): Promise<any>;
    generatePlaylistName(prompt: string): Promise<string>;
    generateImage(prompt: string): Promise<string>;
}

export interface Spotify {
    getAccessToken(): Promise<string | null>;
    getUserInfo(): Promise<UserInfo>;
    openAiSearch(song: string): Promise<Track[]>;
    savePlaylist(name: string, trackUris: string[]): Promise<void>;
}
