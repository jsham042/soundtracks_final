/**
 * SavedTracks.js
 * Utility module for persisting tracks that have been included in previously-saved playlists.
 */

const STORAGE_KEY = 'savedTracks';

/**
 * Retrieves the saved tracks from localStorage
 * @returns {Array} Array of saved track objects, or empty array if none exist
 */
const getSavedTracks = () => {
  try {
    const savedTracks = localStorage.getItem(STORAGE_KEY);
    return savedTracks ? JSON.parse(savedTracks) : [];
  } catch (error) {
    console.error('Error retrieving saved tracks from localStorage:', error);
    return [];
  }
};

/**
 * Adds tracks to the saved tracks collection, de-duplicating by track.id
 * @param {Array} tracksArray - Array of Track objects to be added
 */
const addTracks = (tracksArray) => {
  if (!Array.isArray(tracksArray) || tracksArray.length === 0) {
    return;
  }

  try {
    const savedTracks = getSavedTracks();
    const savedTrackIds = new Set(savedTracks.map(track => track.id));
    
    // Filter out tracks that already exist in saved tracks
    const newTracks = tracksArray.filter(track => !savedTrackIds.has(track.id));
    
    // If there are new tracks to add, combine with existing tracks and save
    if (newTracks.length > 0) {
      const updatedTracks = [...savedTracks, ...newTracks];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTracks));
    }
  } catch (error) {
    console.error('Error adding tracks to localStorage:', error);
  }
};

/**
 * Clears the saved tracks collection from localStorage
 */
const clearSavedTracks = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing saved tracks from localStorage:', error);
  }
};

export default {
  getSavedTracks,
  addTracks,
  clearSavedTracks
};