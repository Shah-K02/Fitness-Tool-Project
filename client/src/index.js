import React from "react";
import ReactDOM from "react-dom/client";
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
