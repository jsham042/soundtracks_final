// Importing necessary filtering functions from other modules
import { filterByBPM } from "./BPMFilter";
import { filterByMoodAndGenre } from "./MoodGenreFilter";

/**
 * Function to generate music recommendations based on BPM, mood, and genre filters.
 * @param {Array} tracks - Array of track objects.
 * @param {Object} bpmRange - Object with min and max properties for BPM filtering.
 * @param {String} mood - Desired mood for the music recommendations.
 * @param {Array} genres - Array of genres for filtering.
 * @returns {Array} - Filtered list of tracks that match all specified criteria.
 */
function generateRecommendations(tracks, bpmRange, mood, genres) {
  // First, filter tracks by BPM range
  const tracksFilteredByBPM = filterByBPM(tracks, bpmRange);

  // Then, filter the resulting tracks by mood and genre
  const finalFilteredTracks = filterByMoodAndGenre(
    tracksFilteredByBPM,
    mood,
    genres,
  );

  // Return the final list of tracks that match all criteria
  return finalFilteredTracks;
}

export default generateRecommendations;
