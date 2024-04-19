import axios from "axios";
import { useNavigate } from "react-router-dom";

const useAxios = () => {
  const navigate = useNavigate();

  const axiosInstance = axios.create({
    // Create an instance of axios
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  axiosInstance.interceptors.response.use(
    (response) => {
      // Intercept the response to check for 401 status code
      return response;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token"); // Remove the expired token
        navigate.push("/login"); // Redirect to the login page
        alert("Session timeout, please log in again."); // Notify the user
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default useAxios;
