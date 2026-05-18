import axios from "axios";
import { getApiErrorPayload } from "../utils/feedback";

const getStoredBearer = () => {
  const token = localStorage.getItem("Bearer");

  if (!token || token === "null" || token === "undefined") return null;

  try {
    return JSON.parse(token);
  } catch {
    localStorage.removeItem("Bearer");
    return null;
  }
};

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers:{
        Authorization:getStoredBearer(),
    }
})

export const axiosInstanceWithoutAuth = axios.create({
    baseURL:import.meta.env.VITE_API_URL,
})


axiosInstance.interceptors.request.use(config => {
  const Bearer = getStoredBearer();
  
  if (Bearer) {
    config.headers.Authorization = Bearer;
  }
  return config;
});

const handleAuthRedirect = (response) => {
     if(!response.data.success && (response.data.message=='invalid token' || response.data.message=='Unauthorized user')){ 
      localStorage.removeItem('Bearer');
      if(window.location.pathname!='/login') window.location.href = '/login'
      
      return response;
     }
     return response;
  };

const handleRejectedResponse = (error) => {
  const errorPayload = getApiErrorPayload(error);

  return Promise.resolve({
    data: errorPayload,
    error: errorPayload,
    status: error?.response?.status,
  });
};

axiosInstance.interceptors.response.use(handleAuthRedirect, handleRejectedResponse);
axiosInstanceWithoutAuth.interceptors.response.use(
  (response) => response,
  handleRejectedResponse,
);
