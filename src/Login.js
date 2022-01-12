import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LoginButton = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  let styleForLoginButton = {
    position: 'absolute',
    top: '200px',
    left: '600px',
    width: '100px',
    height: '100px',
    cursor: 'pointer',
  };
  return (
    !isAuthenticated && (
      <button style={styleForLginButton} onClick={() => loginWithRedirect()}>
        Please Login to Access your task List
      </button>
    )
  );
};

export default LoginButton;
