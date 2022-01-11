import React from 'react';
import ReactDOM from 'react-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import LoginButton from './Login';

import AddToDo from './App';
const domain = 'dev-t4-f1ujc.us.auth0.com';
const clientId = 'VFzZvuKFVLhkbyVcilRNET8xjAY0e1vm';

ReactDOM.render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    redirectUri={window.location.origin}
  >
    <LoginButton />
    <AddToDo />
  </Auth0Provider>,
  document.getElementById('root')
);
