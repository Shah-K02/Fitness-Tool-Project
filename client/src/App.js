import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import NewsSection from "./components/NewsSection";
import MacronutrientSection from "./components/MacronutrientSection";
import LoginPage from "./components/LoginPage"; // Import the login page component
import MacroCalculator from "./components/MacroCalculator"; // Import the stats page component
import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <HeroSection />
              <NewsSection />
              <MacronutrientSection />
              {/* Other components that you want to render on the homepage */}
            </>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        {/* Add other routes here */}
        <Route path="/macro-calculator" element={<MacroCalculator />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
