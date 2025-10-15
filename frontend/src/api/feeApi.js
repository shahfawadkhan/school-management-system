import api from "./axios";

export const createFee = async (data)=>{
    const response = await api.post('/fees/createFee' , data);
    return response.data
}
export const getFeeByClass = async(classId)=>{
    const response = await api.get(`/fees/getClassFeeRecords/${classId}`)
    return response.data
}

export const getStudentFee = async(studentId, year) => {
    const response = await api.get(`/fees/studentFeeRecords/${studentId}/${year}`)
    return response.data
}