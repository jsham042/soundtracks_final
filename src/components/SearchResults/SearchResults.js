import React from 'react';

import './SearchResults.css';

export default class SearchResults extends React.Component {

constructor(props) {
        super(props);
        this.state = {
            tracks: [],
            updateQueue: []
        };
        this.addTopFive = this.addTopFive.bind(this);
        this.addTopTen = this.addTopTen.bind(this);
        this.addAll = this.addAll.bind(this);
        this.updateTrackState = this.updateTrackState.bind(this);
    }

    componentDidMount() {
        this.updateInterval = setInterval(() => {
            if (this.state.updateQueue.length > 0) {
                const nextTrack = this.state.updateQueue.shift();
                this.setState(prevState => ({
                    tracks: [...prevState.tracks, nextTrack]
                }));
            }
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.updateInterval);
    }

    updateTrackState(track) {
        this.setState(prevState => ({
            updateQueue: [...prevState.updateQueue, track]
        }));
    }

    //add the top five tracks to the playlist
    addTopFive() {
        this.props.onAdd(this.state.tracks.slice(0, 5));
    }

    //add top 10 tracks to the playlist
    addTopTen() {
        this.props.onAdd(this.state.tracks.slice(0, 10));
    }

    addAll() {
        this.props.onAdd(this.state.tracks);
    }
    render() {
    return (
      <div className="SearchResults">
        <h2>Results</h2>
        <TrackList tracks={this.state.tracks} onAdd={this.props.onAdd} onToggle={this.props.onToggle}  currentTrack={this.props.currentTrack}/>
      </div>
    );
  }
}

constructor(props) {\n        super(props);\n        this.state = {\n            tracks: [],\n            updateQueue: []\n        };\n        this.addTopFive = this.addTopFive.bind(this);\n        this.addTopTen = this.addTopTen.bind(this);\n        this.addAll = this.addAll.bind(this);\n        this.updateTrackState = this.updateTrackState.bind(this);\n    }\n\n    componentDidMount() {\n        this.updateInterval = setInterval(() => {\n            if (this.state.updateQueue.length > 0) {\n                const nextTrack = this.state.updateQueue.shift();\n                this.setState(prevState => ({\n                    tracks: [...prevState.tracks, nextTrack]\n                }));\n            }\n        }, 1000);\n    }\n\n    componentWillUnmount() {\n        clearInterval(this.updateInterval);\n    }\n\n    updateTrackState(track) {\n        this.setState(prevState => ({\n            updateQueue: [...prevState.updateQueue, track]\n        }));\n    }\n\n    //add the top five tracks to the playlist\n    addTopFive() {\n        this.props.onAdd(this.state.tracks.slice(0, 5));\n    }\n\n    //add top 10 tracks to the playlist\n    addTopTen() {\n        this.props.onAdd(this.state.tracks.slice(0, 10));\n    }\n\n    addAll() {\n        this.props.onAdd(this.state.tracks);\n    }\n    render() {\n    return (\n      <div className=\"SearchResults\">\n        <h2>Results</h2>\n        <TrackList tracks={this.state.tracks} onAdd={this.props.onAdd} onToggle={this.props.onToggle}  currentTrack={this.props.currentTrack}/>\n      </div>\n    );\n  }