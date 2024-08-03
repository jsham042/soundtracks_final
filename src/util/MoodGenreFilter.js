/**
 * Filters tracks based on mood and genre specifications.
 * @param {Array} tracks - Array of track objects.
 * @param {string} mood - The mood to filter by.
 * @param {Array<string>} genres - The genres to filter by.
 * @returns {Array} - Array of tracks that match the mood and are within the specified genres.
 */
function filterByMoodAndGenre(tracks, mood, genres) {
  return tracks.filter((track) => {
    return track.mood === mood && genres.includes(track.genre);
  });
}

module.exports = { filterByMoodAndGenre };
