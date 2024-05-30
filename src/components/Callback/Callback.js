import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { exchangeCodeForToken } from '../../SpotifyAuth';

const Callback = () => {
  const history = useHistory();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      exchangeCodeForToken(code)
        .then(() => {
          history.push('/'); // Redirect to the main page after successful authentication
        })
        .catch((error) => {
          console.error('Error exchanging code for tokens', error);
          history.push('/login'); // Redirect to login page on error
        });
    } else {
      history.push('/login'); // Redirect to login if no code is found in the URL
    }
  }, [history]);

  return (
    <div>
      Redirecting...
    </div>
  );
};

export default Callback;