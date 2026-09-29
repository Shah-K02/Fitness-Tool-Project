import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-sans/700.css";
import "./index.css";
import App from "./App";
import "./App.css";
import { UserProvider } from "./helpers/UserContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <UserProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </UserProvider>
);
