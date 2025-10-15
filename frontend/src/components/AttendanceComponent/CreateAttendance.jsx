import React, { useState, useEffect } from 'react'
import { fetchAllClasses } from '../../api/classApi'
import { getStudentsByClass } from '../../api/studentApi'
import { fetchAllTeachers } from '../../api/teacherApi'
import { markAttandance } from '../../api/attendenceApi'

const CreateAttendance = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [message, setMessage] = useState("");
  const [selectClass, setSelectClass] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [attendanceData, setAttendanceData] = useState({});

  //================= Load all classes =================
  const loadAllClasses = async () => {
    try {
      const res = await fetchAllClasses();
      setClasses(res);
      setMessage("Classes Fetched Successfully");
    } catch (error) {
      setMessage("Error while fetching classes");
    }
  };

  //================= Load all teachers =================
  const loadTeacher = async () => {
    try {
      const res = await fetchAllTeachers();
      setTeachers(res);
      setMessage("Teachers Fetched Successfully");
    } catch (error) {
      setMessage("Error while fetching Teachers");
    }
  };

  //================= Fetch students when class is selected =================
  const handleClassSubmit = async (classId) => {
    try {
      const res = await getStudentsByClass(classId);
      setStudents(res?.students);
      setTeachers(res?.class?.teachers || []);
      setMessage("Students fetched successfully for this class");
    } catch (error) {
      setMessage("Error while fetching students for class");
    }
  };

  useEffect(() => {
    loadAllClasses();
    loadTeacher();
  }, []);

  useEffect(() => {
    if (selectClass) {
      handleClassSubmit(selectClass);
    }
  }, [selectClass]);

  //================= Handle attendance change =================
  const handleAttendanceChange = (studentId, status) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  //================= Submit attendance =================
  const handleSubmitAttendance = async () => {
    if (!selectClass || !selectedTeacher) {
      setMessage("Please select a class and a teacher first.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    try {
      const promises = Object.entries(attendanceData).map(
        async ([studentId, status]) => {
          return await markAttandance({
            studentId,
            classId: selectClass,
            teacherId: selectedTeacher,
            date: today,
            status,
          });
        }
      );

      await Promise.all(promises);
      setMessage("Attendance submitted successfully!");
    } catch (error) {
      setMessage(error?.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/*================= Header =================*/}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Mark Attendance</h1>
          <p className="text-gray-600">Select a class and mark student attendance for today</p>
          
          {message && (
            <div className={`mt-4 p-3 rounded-md ${
              message.includes("Error")
                ? "bg-red-50 border border-red-200 text-red-700"
                : "bg-green-50 border border-green-200 text-green-700"
            }`}>
              <p className="text-sm">{message}</p>
            </div>
          )}
        </div>

        {/*================= Class Selection =================*/}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Class</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.isArray(classes) && classes.length > 0 ? (
              classes.map((cl) => (
                <label
                  key={cl._id}
                  className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectClass === cl._id
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="class"
                    value={cl._id}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    onChange={(e) => setSelectClass(e.target.value)}
                  />
                  <span className="ml-3 font-medium">{cl.name}</span>
                </label>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No classes available</p>
              </div>
            )}
          </div>
        </div>

        {/*================= Selected Class Details =================*/}
        {selectClass && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Class Details</h3>
            
            {classes
              .filter((fc) => fc._id === selectClass)
              .map((sc) => (
                <div key={sc._id} className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Selected Class</p>
                    <p className="text-lg font-semibold text-gray-900">{sc?.name}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Teacher
                    </label>
                    <select
                      value={selectedTeacher}
                      onChange={(e) => setSelectedTeacher(e.target.value)}
                      className="w-full md:w-64 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      <option value="">Choose a teacher</option>
                      {teachers.map((t) => (
                        <option key={t._id} value={t._id}>
                          {t?.user?.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/*================= Students Attendance =================*/}
        {selectClass && students.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900">
                Students Attendance ({students.length} students)
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                Mark attendance for each student below
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Present
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Absent
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Leave
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((stu) => (
                    <tr key={stu._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {stu?.user?.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            Roll No: {stu?.rollNumber}
                          </div>
                        </div>
                      </td>
                      
                      {["present", "absent", "leave"].map((status) => (
                        <td key={status} className="px-6 py-4 whitespace-nowrap text-center">
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name={`attendance-${stu._id}`}
                              value={status}
                              checked={attendanceData[stu._id] === status}
                              onChange={() => handleAttendanceChange(stu._id, status)}
                              className={`h-4 w-4 focus:ring-2 ${
                                status === 'present' 
                                  ? 'text-green-600 focus:ring-green-500'
                                  : status === 'absent'
                                  ? 'text-red-600 focus:ring-red-500'
                                  : 'text-yellow-600 focus:ring-yellow-500'
                              }`}
                            />
                          </label>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/*================= Submit Button =================*/}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {Object.keys(attendanceData).length} of {students.length} students marked
              </div>
              <button
                onClick={handleSubmitAttendance}
                disabled={!selectedTeacher || Object.keys(attendanceData).length === 0}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Submit Attendance
              </button>
            </div>
          </div>
        )}

        {/*================= Empty State =================*/}
        {selectClass && students.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Students Found</h3>
            <p className="text-gray-600">No students are enrolled in this class.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateAttendance;