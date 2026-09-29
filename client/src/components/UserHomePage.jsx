import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./UserHomePage.css";
import SearchBar from "./SearchBar/SearchBar";
import { useUser } from "../helpers/UserContext";

const sections = [
  {
    to: "/log-food",
    title: "Log Food",
    sub: "Add today's meals to the ledger",
  },
  {
    to: "/macro-calculator",
    title: "Macro Calculator",
    sub: "Calculate BMI, calories, and macro targets",
  },
  {
    to: "/profile",
    title: "Profile",
    sub: "Height, weight, goal, and activity level",
  },
];

const UserHomePage = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="content">
      <h1>Today</h1>
      <p className="page-sub">{today}</p>
      <div className="search-bar-container">
        <SearchBar />
      </div>
      <div className="index-list">
        {sections.map((section) => (
          <Link to={section.to} className="index-row" key={section.to}>
            <span>
              {section.title}
              <span className="index-row-sub">{section.sub}</span>
            </span>
            <span className="index-row-arrow">&rarr;</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default UserHomePage;
