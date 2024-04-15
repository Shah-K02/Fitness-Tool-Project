import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/Login/LoginPage";
import UserInfoPage from "./components/UserInfoPage";
import FoodLogPage from "./components/FoodLogPage";
import MacroCalculator from "./components/MacroCalculator";
import Navbar from "./components/Index/Navbar";
import Footer from "./components/Index/Footer";
import ExercisesPage from "./components/Exercises/ExercisesPage";
const HeroSection = lazy(() => import("./components/Index/HeroSection"));
const NewsSection = lazy(() => import("./components/Index/NewsSection"));
const MacronutrientSection = lazy(() =>
  import("./components/MacronutrientSection")
);
const UserHomePage = lazy(() => import("./components/UserHomePage"));
const NutritionTips = lazy(() => import("./components/NutritionTips"));
const Posts = lazy(() => import("./components/Posts"));
const FoodDetailPage = lazy(() => import("./components/FoodDetailPage"));

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <HeroSection />
                  <NewsSection />
                  <MacronutrientSection />
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
            <Route path="*" element={<h1>Not Found</h1>} />
            <Route path="/exercisespage" element={<>{<ExercisesPage />}</>} />
          </Routes>
        </Suspense>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
