import React from "react";
import ReactDOM from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import "./index.css";
import App from "./App";
import "./App.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

// Replace with your own Auth0 application's values
const domain = "dev-pn3crq3siyrys6rb.us.auth0.com";
const clientId = "NMuxWvCJEYGoNuyc7ObBiY8IVhI3WVRl";

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      redirectUri={window.location.origin}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);
