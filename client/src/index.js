import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource/bebas-neue";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
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
