import api from "./axios";

export const fetchAllTeachers = async()=>{
    const response = await api.get('/teachers/getAllTeachers')
    return response.data
}

export const createTeacher = async(teacherData)=>{
    const response = await api.post('/teachers/createTeacher' , teacherData)
    return response.data
}
export const getTeacherById = async(id)=>{
    const response = await api.get(`/teachers/getTeacherById/${id}`)
    return response.data
}

export const deleteTeacher = async(id)=>{
    const response = await api.delete(`/teachers/deleteTeacher/${id}`)
    return response.data
}

export const updateTeacher = async(id , data)=>{
    const response = await api.put(`/teachers/updateTeacher/${id}` , data)
    return response.data
}