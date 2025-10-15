import api from "./axios.js";

export const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
}

export const signup = async (userInfo) => {
  const response = await api.post("/auth/register", userInfo);
  return response.data;
}

export const getProfile = async()=>{
    const response = await api.get("/auth/profile");
    return response.data;
}
export const getAllUsers = async()=>{
  const response = await api.get("/auth/getAllUsers")
  return response.data;
}

export const register = async (formData) => {
  const response = await api.post('/auth/register', formData);
  return response.data;
};


export const deletUser = async(id)=>{
  const response = await api.delete(`/auth/deleteUser/${id}`);
  return response.data
}