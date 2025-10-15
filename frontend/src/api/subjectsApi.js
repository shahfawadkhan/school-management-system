import api from "./axios";

export const getAllSubjects = async ()=>{
    const response  = await api.get('/subjects/getAllSubjects')
    return response.data
}

export const createSubject = async (data)=>{
    const response = await api.post('/subjects/createSubject' , data)
    return response.data
}

export const deletSubject = async(id)=>{
    const response = await api.delete(`/subjects/deleteSubject/${id}`)
    return response.data
}