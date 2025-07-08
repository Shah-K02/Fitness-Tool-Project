import React, { useState, useEffect } from "react";
import "./UserInfoPage.css";
import BackButton from "./BackButton";
import ErrorMessage from "./ErrorMessage";
import useAxios from "../helpers/useAxios";
import { useUser } from "../helpers/UserContext";

// Define gender and activity level options
const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];
const activityLevelOptions = [
  { value: "sedentary", label: "Sedentary: little or no exercise" },
  {
    value: "lightly_active",
    label: "Lightly Active: light exercise/sports 1-3 days/week",
  },
  {
    value: "moderately_active",
    label: "Moderately Active: moderate exercise/sports 3-5 days/week",
  },
  {
    value: "very_active",
    label: "Very Active: hard exercise/sports 6-7 days/week",
  },
  {
    value: "extra_active",
    label:
      "Extra Active: very hard exercise/sports & physical job or 2x training",
  },
];

const UserInfoPage = () => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    birthday: "",
    gender: "",
    height: "",
    weight: "",
    bmi: "",
    activityLevel: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const axios = useAxios();
  const { user } = useUser();
  const [errorTimestamp, setErrorTimestamp] = useState(null);

  useEffect(() => {
    if (!user) {
      setError("Please log in to view this page");
      return;
    }

    const fetchUserInfo = async () => {
      console.log("Starting fetch for user info.");
      setIsLoading(true);
      try {
        const response = await axios.get("/api/user/info");
        console.log("Data fetched successfully:", response.data);
        setUserInfo({
          ...response.data,
          birthday: response.data.birthday
            ? response.data.birthday.split("T")[0]
            : "",
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(
          error.response ? error.response.data.message : "Network error"
        );
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [axios, user]); // Ensure 'user' and 'axios' are stable references

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting updated user info:", userInfo);
    if (!userInfo.email.includes("@")) {
      setError("Please enter a valid email address.");
      setErrorTimestamp(Date.now());
      return;
    }
    if (
      !["male", "female", "other"].includes(userInfo.gender) ||
      ![
        "sedentary",
        "lightly_active",
        "moderately_active",
        "very_active",
        "extra_active",
      ].includes(userInfo.activityLevel)
    ) {
      setError("Please select both your gender and activity level.");
      setErrorTimestamp(Date.now());
      return;
    }
    setIsLoading(true);
    try {
      const updateResponse = await axios.post("/api/user/update", userInfo);
      console.log("Profile updated successfully", updateResponse.data);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update user info:", error);
      setError("Failed to update user info");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    console.log("Displaying login error message");
    return <ErrorMessage message="Please log in to view this page." />;
  }
  if (isLoading) {
    console.log("Displaying loading state");
    return <div>Loading...</div>;
  }
  if (error) {
    console.log("Displaying error message");
    return <ErrorMessage message={error} timestamp={errorTimestamp} />;
  }

  return (
    <div className="user-info-page">
      <BackButton className="back-button" backText=" Back" />
      <ErrorMessage message={error} timestamp={errorTimestamp} />
      <h1 className="user-info-title">Edit Profile</h1>
      <form className="user-info-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            name="name"
            value={userInfo.name || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-field">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            name="email"
            value={userInfo.email || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-field">
          <label htmlFor="birthday">Birthday:</label>
          <input
            id="birthday"
            type="date"
            name="birthday"
            value={userInfo.birthday || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-field">
          <label htmlFor="gender">Gender:</label>
          <select
            id="gender"
            name="gender"
            value={userInfo.gender}
            onChange={handleChange}
          >
            {genderOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="height">Height:</label>
          <input
            id="height"
            type="text"
            name="height"
            value={userInfo.height || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-field">
          <label htmlFor="weight">Weight:</label>
          <input
            id="weight"
            type="text"
            name="weight"
            value={userInfo.weight || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-field">
          <label htmlFor="bmi">BMI:</label>
          <input
            id="bmi"
            type="text"
            name="bmi"
            value={userInfo.bmi || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-field">
          <label htmlFor="activityLevel">Activity Level:</label>
          <select
            id="activityLevel"
            name="activityLevel"
            value={userInfo.activityLevel}
            onChange={handleChange}
          >
            {activityLevelOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <button className="submit-button" type="submit">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default UserInfoPage;
