/**
 * This module contains a function to filter tracks based on BPM ranges.
 */

/**
 * Filters an array of track objects based on a specified BPM range.
 *
 * @param {Object[]} tracks - Array of track objects, each track object should have a 'bpm' property.
 * @param {number} minBPM - The minimum BPM (inclusive) of the range to filter by.
 * @param {number} maxBPM - The maximum BPM (inclusive) of the range to filter by.
 * @returns {Object[]} A new array containing only the tracks that fall within the specified BPM range.
 */
function filterByBPM(tracks, minBPM, maxBPM) {
  return tracks.filter((track) => track.bpm >= minBPM && track.bpm <= maxBPM);
}

module.exports = { filterByBPM };
