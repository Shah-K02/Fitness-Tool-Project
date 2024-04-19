import React, { useState, useEffect } from "react";
import "./UserInfoPage.css";
import BackButton from "./BackButton";
import ErrorMessage from "./ErrorMessage";

// Define gender options
const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

// Define activity level options
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
  const [errorTimestamp, setErrorTimestamp] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/user/info`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the request headers
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch user info");
        const fetchedData = await response.json();
        const sanitizedData = Object.keys(fetchedData).reduce((acc, key) => {
          acc[key] = fetchedData[key] === null ? "" : fetchedData[key];
          return acc;
        }, {});
        setUserInfo(sanitizedData);
      } catch (error) {
        setError(error.message);
        setErrorTimestamp(Date.now());
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the email
    if (!userInfo.email.includes("@")) {
      setError("Please enter a valid email address.");
      setErrorTimestamp(Date.now());
      return;
    }

    // Validate the gender and activity level
    const validGenders = ["male", "female", "other"];
    const validActivityLevels = [
      "sedentary",
      "lightly_active",
      "moderately_active",
      "very_active",
      "extra_active",
    ];

    // Validate gender and activityLevel selections
    if (
      !validGenders.includes(userInfo.gender) ||
      !validActivityLevels.includes(userInfo.activityLevel)
    ) {
      setError("Please select both your gender and activity level.");
      setErrorTimestamp(Date.now());
      return;
    }
    console.log(
      `Updating with gender: ${userInfo.gender}, activityLevel: ${userInfo.activityLevel}`
    );

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token"); // Retrieve the auth token
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/user/update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token in the request headers
          },
          body: JSON.stringify(userInfo),
        }
      );
      if (!response.ok) throw new Error("Failed to update user info");
      alert("Profile updated successfully!");
    } catch (error) {
      setError(error.message);
      setErrorTimestamp(Date.now());
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
