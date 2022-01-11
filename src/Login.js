import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LoginButton = () => {
  const { isLoading, isAuthenticated, error, user, loginWithRedirect, logout } =
    useAuth0();

  return <button onClick={() => loginWithRedirect()}>Login</button>;
};

export default LoginButton;
