// Derived from src/util/SoundCloud.js

export const API_ENDPOINT: string = "https://api-v2.soundcloud.com";
export const SEARCH_ENDPOINT: string = "https://api-v2.soundcloud.com/search/playlists";
export const API_KEY: string = "YOUR_API_KEY_HERE";

export interface CsvWriter {
    path: string;
    header: Array<{ id: string, title: string }>;
}

export interface SearchResult {
    collection: Array<PlaylistItem>;
}

export interface PlaylistItem {
    kind: string;
    id: number;
}

export interface PlaylistData {
    title: string;
    tracks: Array<Track>;
}

export interface Track {
    id: number;
    title: string;
}

export interface TrackData {
    title: string;
}

export interface DataRecord {
    playlistName: string;
    trackName: string;
}
