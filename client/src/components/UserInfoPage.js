import React, { useState, useEffect } from "react";
import "./UserInfoPage.css";

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
    if (!userInfo.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

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
        <div className="form-field"></div>
        <label>Name:</label>
        <input name="name" value={userInfo.name} onChange={handleChange} />
        <div className="form-field"></div>
        <label>Email:</label>
        <input name="email" value={userInfo.email} onChange={handleChange} />
        <div className="form-field"></div>
        <label>Birthday:</label>
        <input
          name="birthday"
          value={userInfo.birthday}
          onChange={handleChange}
        />
        <div className="form-field"></div>
        <label>Gender:</label>
        <input name="gender" value={userInfo.gender} onChange={handleChange} />
        <div className="form-field"></div>
        <label>Height:</label>
        <input name="height" value={userInfo.height} onChange={handleChange} />
        <div className="form-field"></div>
        <label>Weight:</label>
        <input name="weight" value={userInfo.weight} onChange={handleChange} />
        <div className="form-field"></div>
        <label>BMI:</label>
        <input name="bmi" value={userInfo.bmi} onChange={handleChange} />
        <div className="form-field"></div>
        <label>Activity Level:</label>
        <input
          name="activityLevel"
          value={userInfo.activityLevel}
          onChange={handleChange}
        />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default UserInfoPage;
