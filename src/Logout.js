import React from 'react';
import { useAuthO } from '@autho/auth0-react';

const LogoutButton = () => {
  const { loginWithRedirect } = useAuthO();
  return <button onClick={() => loginWithRedirect()}>Login</button>;
};

export default LogoutButton;
