import api from "./axios";

export const markAttandance = async(data)=>{
    const response = await api.post('/attendance/markAttendance' , data);
    return response.data;
}

export const getClassAttendance = async (classId, date) => {
  const url = date
    ? `/attendance/getAttendanceRecordsByClass/${classId}?date=${date}`
    : `/attendance/getAttendanceRecordsByClass/${classId}`;

  const response = await api.get(url);
  return response.data;
};

export const getStudentRecord = async (id, year, month) => {
  const response = await api.get(`/attendance/getAttendanceRecords/${id}/${year}/${month}`);
  return response.data;
};

export const getAttendanceByStudentId = async(studentId)=>{
  const response = await api.get(`/attendance/getAttendanceByStudentId/${studentId}`);
  return response.data;
}

export const getAttendenceByTeacherAndClass = async(teacherId , classId)=>{
  const response = await api.get(`/attendance/getAttendenceByTeacherAndClass/${teacherId}/${classId}`);
  return response.data
}