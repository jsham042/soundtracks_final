/**
 * SavedTracksManager.js
 * 
 * A utility module for managing saved tracks in localStorage.
 * Provides functions for reading, writing, and clearing saved tracks.
 */

const SAVED_TRACKS_KEY = 'savedTracks';

/**
 * Get all saved tracks from localStorage
 * @returns {Array} Array of track objects or empty array if nothing is stored
 */
export const getSavedTracks = () => {
  try {
    const savedTracks = localStorage.getItem(SAVED_TRACKS_KEY);
    return savedTracks ? JSON.parse(savedTracks) : [];
  } catch (error) {
    console.error('Error retrieving saved tracks from localStorage:', error);
    return [];
  }
};

/**
 * Add tracks to the saved tracks in localStorage
 * Merges the supplied tracks with existing tracks, deduplicating by track.id
 * @param {Array} tracksArray - Array of track objects to save
 * @returns {Array} Updated array of saved tracks
 */
export const addTracks = (tracksArray) => {
  if (!Array.isArray(tracksArray) || tracksArray.length === 0) {
    return getSavedTracks();
  }

  try {
    const currentTracks = getSavedTracks();
    
    // Create a map of existing track IDs for faster lookup
    const existingTrackIds = new Map();
    currentTracks.forEach(track => {
      if (track.id) {
        existingTrackIds.set(track.id, true);
      }
    });
    
    // Add only new tracks that don't already exist
    const newTracks = tracksArray.filter(track => track.id && !existingTrackIds.has(track.id));
    
    // Merge and save to localStorage
    const updatedTracks = [...currentTracks, ...newTracks];
    localStorage.setItem(SAVED_TRACKS_KEY, JSON.stringify(updatedTracks));
    
    return updatedTracks;
  } catch (error) {
    console.error('Error adding tracks to localStorage:', error);
    return getSavedTracks();
  }
};

/**
 * Clear all saved tracks from localStorage
 */
export const clearSavedTracks = () => {
  try {
    localStorage.removeItem(SAVED_TRACKS_KEY);
  } catch (error) {
    console.error('Error clearing saved tracks from localStorage:', error);
  }
};

export default {
  getSavedTracks,
  addTracks,
  clearSavedTracks
};