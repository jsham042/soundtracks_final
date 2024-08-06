import fetch from 'node-fetch';
import { createObjectCsvWriter as csv } from 'csv-writer';
import type { Playlist, Track, SearchResult } from './SoundCloud-js.types';

const API_ENDPOINT = "https://api-v2.soundcloud.com";
const SEARCH_ENDPOINT = "https://api-v2.soundcloud.com/search/playlists";
const API_KEY = "YOUR_API_KEY_HERE";

const csvWriter = csv({
    path: 'playlists.csv',
    header: [
        { id: 'playlistName', title: 'Playlist Name' },
        { id: 'trackName', title: 'Track Name' }
    ]
});

async function searchPlaylists(searchPhrase: string): Promise<void> {
    const searchUrl = `${SEARCH_ENDPOINT}?q=${searchPhrase}&client_id=${API_KEY}`;
    const searchResponse = await fetch(searchUrl);
    const searchResult: SearchResult = await searchResponse.json();

    const playlists = searchResult.collection.filter(item => item.kind === "playlist");

    const data: { playlistName: string, trackName: string }[] = [];

    for (const playlist of playlists) {
        const playlistId = playlist.id;
        const playlistResponse = await fetch(`${API_ENDPOINT}/playlists/${playlistId}?representation=full&client_id=${API_KEY}`);
        const playlistData: Playlist = await playlistResponse.json();
        const playlistName = playlistData.title;

        for (const track of playlistData.tracks) {
            const trackId = track.id;
            const trackResponse = await fetch(`${API_ENDPOINT}/tracks/${trackId}?client_id=${API_KEY}`);
            const trackData: Track = await trackResponse.json();
            const trackName = trackData.title;

            data.push({ playlistName, trackName });
        }
    }

    await csvWriter.writeRecords(data);

    console.log(`Data written to playlists.csv`);
}

searchPlaylists("SEARCH_PHRASE_HERE").catch(error => {
    console.error(error);
});
