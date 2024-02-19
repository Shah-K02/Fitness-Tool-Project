import React, { useState, useEffect } from "react";

const UserInfoPage = () => {
  // State for user info
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

  // Fetch user info from API
  useEffect(() => {
    const fetchUserInfo = async () => {
      // Fetch user information from your API
      // Placeholder: replace with your actual API call
      const response = await fetch("/api/user/info"); // Adjust API endpoint as necessary
      const data = await response.json();
      setUserInfo(data);
    };

    fetchUserInfo();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Update user info
  const handleSubmit = async (e) => {
    e.preventDefault();
    // API call to update user info
    // Placeholder: replace with your actual API call
    await fetch("/api/user/update", {
      // Adjust API endpoint as necessary
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    });

    // You might want to add error handling and success feedback here
  };

  return (
    <div>
      <h1>Edit Profile</h1>
      <form onSubmit={handleSubmit}>
        {/* Create input fields for each attribute, binding them to the state */}
        <label>Name:</label>
        <input name="name" value={userInfo.name} onChange={handleChange} />

        {/* Repeat for other fields: email, birthday, etc. */}
        {/* Example for email: */}
        <label>Email:</label>
        <input name="email" value={userInfo.email} onChange={handleChange} />

        <label>Birthday:</label>
        <input
          name="birthday"
          value={userInfo.birthday}
          onChange={handleChange}
        />
        <label>Gender:</label>
        <input name="gender" value={userInfo.gender} onChange={handleChange} />
        <label>Height:</label>
        <input name="height" value={userInfo.height} onChange={handleChange} />
        <label>Weight:</label>
        <input name="weight" value={userInfo.weight} onChange={handleChange} />
        <label>BMI:</label>
        <input name="bmi" value={userInfo.bmi} onChange={handleChange} />
        <label>Activity Level:</label>
        <input
          name="activityLevel"
          value={userInfo.activityLevel}
          onChange={handleChange}
        />
        {/* Add inputs for birthday, gender, height, weight, bmi, activity level */}
        {/* Make sure to adjust the type attribute for different inputs, e.g., type="email" for email */}

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default UserInfoPage;
