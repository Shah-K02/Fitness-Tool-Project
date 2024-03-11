import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Index/Navbar";
import Footer from "./components/Index/Footer";
import HeroSection from "./components/Index/HeroSection";
import NewsSection from "./components/Index/NewsSection";
import MacronutrientSection from "./components/MacronutrientSection";
import LoginPage from "./components/Login/LoginPage";
import UserHomePage from "./components/UserHomePage";
import MacroCalculator from "./components/MacroCalculator";
import "./App.css";
import UserInfoPage from "./components/UserInfoPage";
import NutritionTips from "./components/NutritionTips";
import Posts from "./components/Posts";
import "@fontsource/bebas-neue";
import FoodDetailPage from "./components/FoodDetailPage";
import FoodLogPage from "./components/FoodLogPage";

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
        <Route path="/log-food" element={<FoodLogPage />} />
        <Route path="/macro-calculator" element={<MacroCalculator />} />
        <Route path="/nutrition-tips" element={<NutritionTips />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/food/:id" element={<FoodDetailPage />} />
        {/* Add other routes here if needed */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
