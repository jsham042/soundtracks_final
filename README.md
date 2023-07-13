# SoundTracks
<img src="./public/djboticon.png" alt="SoundTracks logo" width="200"/>

SoundTracks is a React application that allows users to generate Spotify playlists based on a given prompt. The app uses the Spotify Web API for playlist creation and management, while also using the OpenAI API to interpret prompts and generate unique, creative playlist names.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Features
- Generate Spotify playlists using a given prompt.
- Retrieve song recommendations and playlist names from OpenAI's GPT-4.
- Create, update, and save Spotify playlists.
- Fetch album art for the created playlist.
- User authentication through Spotify.

## Installation

Clone the repository:
```bash
git clone https://github.com/jsham042/soundtracks_final
```

Change to the project directory:

```bash
cd SoundTracks
```

Install the dependencies:
```bash
npm install
```

Start application:
```bash
npm start
```

## Use your environment variables
Create a `.env` file in the root directory of your project. Add environment-specific variables on new lines in the form of `NAME=VALUE`. For example:

```
REACT_APP_MY_SPOTIFY_CLIENT_ID=your-spotify-client-id
REACT_APP_MY_OPENAI_API_KEY = your-openai-api-key
```
