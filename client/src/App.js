// App.js
import React from "react";
import Navbar from "./components/Navbar"; // Adjust the path if Navbar is in a different directory
import "./App.css"; // Your global styles
import "./index.css"; // Your global styles
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import NewsSection from "./components/NewsSection";

function App() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <NewsSection />
      <Footer />
      {/* Other components that you want to render below the navbar */}
    </>
  );
}

export default App;
