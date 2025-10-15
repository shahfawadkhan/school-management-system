import api from "./axios";

export const createResult = async(data)=>{
    const response = await api.post('/results/createResult' , data)
    return response.data
}

export const getResultByClass = async(classId)=>{
    const response = await api.get(`/results/getResultByClass/${classId}`)
    return response.data
}

export const getResultsByStudent = async(studentId)=>{
    const response = await api.get(`/results/getResultsByStudent/${studentId}`)
    return response.data
}

export const getResultsByExam = async(examId)=>{
    const response = await api.get(`/results/getResultsByExam/${examId}`)
    return response.data
}
export const updateResult = async(id , data)=>{
    const response = await api.put(`/results/updateResult/${id}` , data)
    return response.data
}