import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LogoutButton = () => {
  let styleForLogoutButton = {
    cursor: 'pointer',
    position: 'absolute',
    top: '10px',
    float: 'right',
    right: '50px',
  };
  const { logout, isAuthenticated } = useAuth0();
  return (
    isAuthenticated && (
      <button style={styleForLogoutButton} onClick={() => logout()}>
        Logout
      </button>
    )
  );
};

export default LogoutButton;
