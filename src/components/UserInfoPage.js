import React, { useState, useEffect } from "react";
import "./UserInfoPage.css";

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

  useEffect(() => {
    const fetchUserInfo = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage after login
        const response = await fetch("http://localhost:8081/api/user/info", {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request headers
          },
        });
        if (!response.ok) throw new Error("Failed to fetch user info");
        const fetchedData = await response.json();
        const sanitizedData = Object.keys(fetchedData).reduce((acc, key) => {
          acc[key] = fetchedData[key] === null ? "" : fetchedData[key];
          return acc;
        }, {});

        // Now use sanitizedData to set your component's state
        setUserInfo(sanitizedData);
      } catch (error) {
        setError(error.message);
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
      return;
    }
    console.log(
      `Updating with gender: ${userInfo.gender}, activityLevel: ${userInfo.activityLevel}`
    );

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token"); // Retrieve the auth token
      const response = await fetch("http://localhost:8081/api/user/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token in the request headers
        },
        body: JSON.stringify(userInfo),
      });
      if (!response.ok) throw new Error("Failed to update user info");
      alert("Profile updated successfully!");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Edit Profile</h1>
      <form className="user-info-form" onSubmit={handleSubmit}>
        {/* Removed empty divs as they seem unnecessary unless they are for styling purposes */}

        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={userInfo.name || ""}
          onChange={handleChange}
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={userInfo.email || ""}
          onChange={handleChange}
        />

        <label>Birthday:</label>
        <input
          type="date"
          name="birthday"
          value={userInfo.birthday || ""}
          onChange={handleChange}
        />

        <label>Gender:</label>
        <select name="gender" value={userInfo.gender} onChange={handleChange}>
          {genderOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <label>Height:</label>
        <input
          type="text"
          name="height"
          value={userInfo.height || ""}
          onChange={handleChange}
        />

        <label>Weight:</label>
        <input
          type="text"
          name="weight"
          value={userInfo.weight || ""}
          onChange={handleChange}
        />

        <label>BMI:</label>
        <input
          type="text"
          name="bmi"
          value={userInfo.bmi || ""}
          onChange={handleChange}
        />

        <label>Activity Level:</label>
        <select
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

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default UserInfoPage;
