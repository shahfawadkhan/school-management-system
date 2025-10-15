import api from "./axios";

export const getAllStudents = async()=>{
    const response = await api.get('/students/getAllStudents')
    return response;
}

export const getStudentById = async(studentId)=>{
    const response = await api.get(`/students/getStudentById/${studentId}`)
    return response.data
}
export const createStudent = async (Credential)=>{
    const response = await api.post('/students/createStudent' , Credential)
    return response.data;
}

export const deleteStudent = async (id)=>{
    const response = await api.delete(`/students/deleteStudent/${id}`)
    return response.data;
}

export const updateStudent = async (id, studentData)=>{
    const response = await api.put(`/students/updateStudent/${id}` , studentData)
    return response.data;
}

export const getStudentsByClass = async(classId)=>{
    const response = await api.get(`/students/getStudentsByClassId/${classId}`)
    return response.data;
}