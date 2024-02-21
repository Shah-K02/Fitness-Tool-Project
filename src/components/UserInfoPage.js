import React, { useState, useEffect } from "react";

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
        const response = await fetch("http://localhost:8081/api/user/info");
        if (!response.ok) throw new Error("Failed to fetch user info");
        const data = await response.json();
        setUserInfo(data);
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
    // Additional validation could be added here
    if (!userInfo.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8081/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInfo),
      });
      if (!response.ok) throw new Error("Failed to update user info");
      // Display success message or reset form as needed
      alert("Profile updated successfully!"); // Example success feedback
    } catch (error) {
      setError("Failed to update. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Edit Profile</h1>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input name="name" value={userInfo.name} onChange={handleChange} />
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
          name="activity-level"
          value={userInfo.activityLevel}
          onChange={handleChange}
        />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default UserInfoPage;
