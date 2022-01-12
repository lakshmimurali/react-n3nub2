import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LoginButton = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  let styleForLoginButton = {
    position: 'absolute',
    top: '400px',
    left: '00px',
    width: '200px',
    height: '100px',
    cursor: 'pointer',
  };
  return (
    !isAuthenticated && (
      <button style={styleForLoginButton} onClick={() => loginWithRedirect()}>
        Please Login to Access your task List
      </button>
    )
  );
};

export default LoginButton;
