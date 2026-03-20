import { axiosInstance, axiosInstanceWithoutAuth } from "../axios";

const login = async (data) => {
  const user = await axiosInstanceWithoutAuth.post("/auth/login", data);

  return user;
};

const logout = async (data) => {
  const user = await axiosInstance.post("/auth/logout", data);
  return user;
};

const register = async (data) => {
  const user = await axiosInstanceWithoutAuth.post("/auth/register", data);
  return user;
};

const getUserProfile = async () => {
  const result = await axiosInstance.get("/user");

  return result;
};

const getRestaurantOwnerWhoNotHaveRestroApi = async () => {
  const result = await axiosInstance.get("/user/restaurnt-owner");
  
  return result;
};

const getRoles = async () => {
  const result = await axiosInstanceWithoutAuth.get("/getroles");
  console.log(result);
  
  return result;
};

const updateUserProfile = async (data) => {
  const result = await axiosInstance.patch("/user", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return result;
};

export { login, register, getUserProfile, updateUserProfile, getRoles, logout,getRestaurantOwnerWhoNotHaveRestroApi };
