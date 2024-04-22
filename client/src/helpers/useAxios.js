import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

const useAxios = () => {
  const navigate = useNavigate();

  // Retrieve the token once to set up the axios instance
  const token = localStorage.getItem("token");

  const axiosInstance = useMemo(
    () =>
      axios.create({
        baseURL: process.env.REACT_APP_API_BASE_URL,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    [token]
  );
  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        alert("Session timeout, please log in again.");
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default useAxios;
