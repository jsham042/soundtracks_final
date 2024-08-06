// Derived from src/components/SearchResults/SearchResults.js

export type Track = {
    id: string;
    name: string;
    artist: string;
    album: string;
    uri: string;
};

export type SearchResultsProps = {
    searchResults: Track[];
    onAdd: (tracks: Track[]) => void;
    onToggle: (track: Track) => void;
    currentTrack: Track | null;
};
