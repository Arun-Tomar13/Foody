import axios from "axios";
import { useNavigate } from "react-router";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers:{
        Authorization:JSON.parse(localStorage.getItem('Bearer') || null),
    }
})

export const axiosInstanceWithoutAuth = axios.create({
    baseURL:import.meta.env.VITE_API_URL,
})


axiosInstance.interceptors.request.use(config => {
  const Bearer = JSON.parse(localStorage.getItem('Bearer'));
  
  if (Bearer) {
    config.headers.Authorization = Bearer;
  }
  return config;
});

axiosInstance.interceptors.response.use(function onFulfilled(response) {
     if(!response.data.success && (response.data.message=='invalid token' || response.data.message=='Unauthorized user')){ 

      if(window.location.pathname!='/login') window.location.href = '/login'
      
      return response;
     }
     return response;
  }, function onRejected(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });
