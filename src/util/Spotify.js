const clientId = process.env.REACT_APP_MY_SPOTIFY_CLIENT_ID;
const redirectUri = 'https://www.soundtracksai.com/';
let accessToken;

const Spotify = {
  // existing methods...

  // New method to get user details
  getUserDetails() {
    const accessToken = Spotify.getAccessToken();
    return fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
    .then(response => response.json())
    .then(jsonResponse => {
      // Update the loggedInUser and userAvatar state variables in App.js
      // This part will depend on how you manage state in your application
      // For example, if you're using Redux, you might dispatch an action here
      // For the purpose of this task, we'll just return the user details
      return {
        username: jsonResponse.display_name,
        avatar: jsonResponse.images[0].url
      };
    });
  }
};

export default Spotify;