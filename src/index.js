import React from 'react';
import ReactDOM from 'react-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import { BrowserRouter } from 'react-router-dom';
import AuthControlComponent from './AuthenticationControl.js';

const domain = 'dev-t4-f1ujc.us.auth0.com';
const clientId = 'VFzZvuKFVLhkbyVcilRNET8xjAY0e1vm';

ReactDOM.render(
  <BrowserRouter>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      redirectUri={window.location.origin}
    >
      <AuthControlComponent />
    </Auth0Provider>
  </BrowserRouter>,
  document.getElementById('root')
);
