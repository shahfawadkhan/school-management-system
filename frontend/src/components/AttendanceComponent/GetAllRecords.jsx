import React, { useEffect, useState } from "react";
import { getClassAttendance } from "../../api/attendenceApi";
import { fetchAllClasses } from "../../api/classApi";
import GetStudentRecord from "./GetStudentRecord";
const GetAllRecords = () => {
  const [classes, setClasses] = useState([]);
  const [classMessage, setClassMessage] = useState(""); 
  const [attendanceMessage, setAttendanceMessage] = useState(""); 
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [groupBy, setGroupBy] = useState("date"); 
  const [studentId , setStudentId] = useState("")

  const onclose = ()=>{
    setStudentId("")
  }

  
  const loadClasses = async () => {
    try {
      const res = await fetchAllClasses();
      setClasses(res);
      setClassMessage("Classes fetched successfully");
    } catch (error) {
      setClassMessage(error?.response?.data?.message || "Error while fetching classes");
    }
  };

  const handleClassRecordSubmit = async () => {
    if (!selectedClass) {
      setAttendanceMessage("⚠️ Please select a class first.");
      return;
    }

    try {
      const response = await getClassAttendance(selectedClass, selectedDate); 
      console.log(response);

      if (response?.length > 0) {
        setAttendanceRecords(response);
        setAttendanceMessage("Records fetched successfully");
      } else {
        setAttendanceRecords([]);
        setAttendanceMessage("No attendance records found");
      }
    } catch (error) {
      setAttendanceMessage(error?.response?.data?.message || "Error while fetching records");
    }
  };

  const groupedRecords = attendanceRecords.reduce((groups, record) => {
    const date = new Date(record.date).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(record);
    return groups;
  }, {});

  const calculateStats = (records) => {
    const present = records.filter(r => r.status?.toLowerCase() === 'present').length;
    const absent = records.filter(r => r.status?.toLowerCase() === 'absent').length;
    const leave = records.filter(r => r.status?.toLowerCase() === 'leave').length;
    const total = records.length;
    const attendanceRate = total > 0 ? ((present / total) * 100).toFixed(1) : 0;
    
    return { present, absent, leave, total, attendanceRate };
  };

  const overallStats = calculateStats(attendanceRecords);

  useEffect(() => {
    loadClasses();    
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Class Attendance Records
          </h1>
          <p className="text-gray-600">View and analyze attendance records for your classes</p>
          
          {classMessage && (
            <div className={`mt-4 p-3 rounded-md ${
              classMessage.includes('Error') 
                ? 'bg-red-50 border border-red-200 text-red-700' 
                : 'bg-green-50 border border-green-200 text-green-700'
            }`}>
              <p className="text-sm">{classMessage}</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Class
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              >
                <option value="">-- Select Class --</option>
                {classes.map((cl) => (
                  <option key={cl?._id} value={cl?._id}>
                    {cl?.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date (Optional)
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="md:col-span-2">
              <button
                onClick={handleClassRecordSubmit}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Get Records
              </button>
            </div>
          </div>

          {attendanceMessage && (
            <div className={`mt-4 p-3 rounded-md ${
              attendanceMessage.includes('⚠️') || attendanceMessage.includes('❌') 
                ? 'bg-red-50 border border-red-200 text-red-700' 
                : 'bg-green-50 border border-green-200 text-green-700'
            }`}>
              <p className="text-sm">{attendanceMessage}</p>
            </div>
          )}
        </div>
          {/* ================= Attendence Stats ================= */}
        {attendanceRecords.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Overall Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-sm text-blue-600 font-medium">Total Records</p>
                <p className="text-2xl font-bold text-blue-900">{overallStats.total}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-sm text-green-600 font-medium">Present</p>
                <p className="text-2xl font-bold text-green-900">{overallStats.present}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <p className="text-sm text-red-600 font-medium">Absent</p>
                <p className="text-2xl font-bold text-red-900">{overallStats.absent}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <p className="text-sm text-yellow-600 font-medium">Leave</p>
                <p className="text-2xl font-bold text-yellow-900">{overallStats.leave}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <p className="text-sm text-purple-600 font-medium">Attendance Rate</p>
                <p className="text-2xl font-bold text-purple-900">{overallStats.attendanceRate}%</p>
              </div>
            </div>
          </div>
        )}

        {attendanceRecords.length > 0 && (
          <div className="space-y-6">
            {Object.entries(groupedRecords)
              .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA)) 
              .map(([date, records]) => {
                const stats = calculateStats(records);
                return (
                  <div key={date} className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{date}</h3>
                          <p className="text-sm text-gray-600">{records.length} students</p>
                        </div>
                        <div className="flex flex-wrap gap-4 mt-2 md:mt-0">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-sm text-gray-600">Present: {stats.present}</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                            <span className="text-sm text-gray-600">Absent: {stats.absent}</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                            <span className="text-sm text-gray-600">Leave: {stats.leave}</span>
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            Rate: {stats.attendanceRate}%
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Roll No
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Name
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {records
                            .sort((a, b) => a.student?.rollNumber?.localeCompare(b.student?.rollNumber))
                            .map((record, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {record?.student?.rollNumber}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {record?.student?.user?.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                                  record?.status?.toLowerCase() === 'present' 
                                    ? 'bg-green-100 text-green-800'
                                    : record?.status?.toLowerCase() === 'absent'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {record?.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <button 
                                onClick={(e)=>{setStudentId(record?.student?._id)}}
                                className="bg-blue-600 text-white p-2 rounded">
                                  Full Record
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {attendanceRecords.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Records Found</h3>
            <p className="text-gray-600">No attendance records were found for the selected criteria.</p>
          </div>
        )}
      </div>
      {/*================= Getting Student Full Rec =================  */}
      {studentId &&(
        <GetStudentRecord studentId={studentId} onclose={onclose} />
      )
      }
    </div>
  );
};

export default GetAllRecords;