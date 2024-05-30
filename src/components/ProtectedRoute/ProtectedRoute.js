import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  // Simulate a function to check if user is authenticated
  // In a real application, replace this with actual authentication logic
  const isAuthenticated = () => {
    const token = localStorage.getItem('accessToken');
    return !!token;
  };

  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated() ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/spotify-login', state: { from: props.location } }} />
        )
      }
    />
  );
};

export default ProtectedRoute;