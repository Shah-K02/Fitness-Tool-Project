import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import NewsSection from "./components/NewsSection";
import MacronutrientSection from "./components/MacronutrientSection";
import LoginPage from "./components/LoginPage";
import UserHomePage from "./components/UserHomePage";
import MacroCalculator from "./components/MacroCalculator";
import "./App.css";
import UserInfoPage from "./components/UserInfoPage";
import NutritionTips from "./components/NutritionTips";
import Posts from "./components/Posts";

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
        <Route
          path="/user-home"
          element={
            <>
              <UserHomePage />
              <NewsSection />
              <NutritionTips />
              <Posts />
            </>
          }
        />
        <Route path="/profile" element={<UserInfoPage />} />
        <Route path="/macro-calculator" element={<MacroCalculator />} />
        <Route path="/nutrition-tips" element={<NutritionTips />} />
        <Route path="/posts" element={<Posts />} />
        {/* Add other routes here if needed */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
