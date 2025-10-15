import api from "./axios";

export const createExam = async(data)=>{
    const response = await api.post('/exams/createExam' , data)
    return response.data
}

export const getAllExams = async ()=>{
    const response = await api.get('/exams/getAllExams')
    return response.data;
}

export const deleteExam = async(id)=>{
    const response = await api.delete(`/exams/deleteExam/${id}`)
    return response.data;
}

export const updateExam = async(id , data)=>{
    const response = await api.put(`/exams/updateExam/${id}` , data)
    return response.data
}