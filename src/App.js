import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/Login/LoginPage";
import UserInfoPage from "./components/UserInfoPage";
import FoodLogPage from "./components/FoodLogPage";
import MacroCalculator from "./components/MacroCalculator";
import Navbar from "./components/Index/Navbar";
import Footer from "./components/Index/Footer";
import SearchExercises from "./components/SearchBar/SearchExercises";
import Exercises from "./components/Exercises";
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
          <Route path="*" element={<h1>Not Found</h1>} />
          <Route path="/searchExercises" element={<SearchExercises />} />
          <Route path="/exercises" element={<Exercises />} />
        </Routes>
      </Suspense>
      <Footer />
    </Router>
  );
}

export default App;
