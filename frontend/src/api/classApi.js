import api from "./axios";

export const createClass = async (name) => {
  const response = await api.post('/classes/createClass', { name });
  return response.data;
};

export const fetchAllClasses = async()=>{
    const response = await api.get('/classes/getAllClasses');        
    return response.data
}

export const getClassByStudentOrTeacherId = async(userId , role)=>{
  const response = await api.get(`/classes/getClassByStudentOrTeacherId/${userId}/${role}`)
  return response.data
}
export const deleteClass = async(id)=>{
    const response = await api.delete(`/classes/deleteClass/${id}`)
    return response.data
}

export const updateClass = async (id , data)=>{
  const response = await api.put(`/classes/updateClass/${id}` , data)
  return response.data
}