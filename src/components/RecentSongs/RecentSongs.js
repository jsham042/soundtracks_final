import React from "react";
import "./RecentSongs.css";
import Track from "../Track/Track.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHistory, faTrash } from "@fortawesome/free-solid-svg-icons";

class RecentSongs extends React.Component {
    constructor(props) {
        super(props);
        this.formatTimeAgo = this.formatTimeAgo.bind(this);
    }

    formatTimeAgo(timestamp) {
        const now = new Date();
        const addedTime = new Date(timestamp);
        const diffInMinutes = Math.floor((now - addedTime) / (1000 * 60));
        
        if (diffInMinutes < 1) {
            return "Just now";
        } else if (diffInMinutes < 60) {
            return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
        } else if (diffInMinutes < 1440) { // Less than 24 hours
            const hours = Math.floor(diffInMinutes / 60);
            return `${hours} hour${hours === 1 ? '' : 's'} ago`;
        } else {
            const days = Math.floor(diffInMinutes / 1440);
            return `${days} day${days === 1 ? '' : 's'} ago`;
        }
    }

    render() {
        const { recentlyAddedSongs, onAddFromRecent, onRemoveFromRecent, onClearHistory, currentTrack, onToggle } = this.props;

        if (recentlyAddedSongs.length === 0) {
            return (
                <div className="RecentSongs">
                    <div className="RecentSongs-header">
                        <h2>
                            <FontAwesomeIcon icon={faHistory} style={{ marginRight: "0.5em" }} />
                            Recently Added Songs
                        </h2>
                    </div>
                    <div className="RecentSongs-empty">
                        <p>No recently added songs yet.</p>
                        <p>Songs you add to playlists will appear here!</p>
                    </div>
                </div>
            );
        }

        return (
            <div className="RecentSongs">
                <div className="RecentSongs-header">
                    <h2>
                        <FontAwesomeIcon icon={faHistory} style={{ marginRight: "0.5em" }} />
                        Recently Added Songs
                    </h2>
                    <button 
                        className="RecentSongs-clear-button"
                        onClick={onClearHistory}
                        title="Clear recent history"
                    >
                        <FontAwesomeIcon icon={faTrash} />
                        Clear History
                    </button>
                </div>
                <div className="RecentSongs-list">
                    {recentlyAddedSongs.map((recentEntry, index) => (
                        <div key={`${recentEntry.track.id}-${recentEntry.addedAt}`} className="RecentSongs-item">
                            <div className="RecentSongs-track">
                                <Track
                                    track={recentEntry.track}
                                    onAdd={() => onAddFromRecent(recentEntry)}
                                    onToggle={onToggle}
                                    currentTrack={currentTrack}
                                    isRemoval={false}
                                />
                            </div>
                            <div className="RecentSongs-meta">
                                <span className="RecentSongs-timestamp">
                                    {this.formatTimeAgo(recentEntry.addedAt)}
                                </span>
                                <button 
                                    className="RecentSongs-remove-button"
                                    onClick={() => onRemoveFromRecent(recentEntry)}
                                    title="Remove from recent history"
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default RecentSongs;
