import React, { useState, useEffect } from 'react';
import { getTeacherById } from '../../api/teacherApi';
import { getStudentsByClass } from '../../api/studentApi';
import { markAttandance } from '../../api/attendenceApi';
import { useSelector } from 'react-redux';
import { BookOpen, Users, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const MarkAttendence = () => {
  const { user } = useSelector((state) => state.auth);
  const teacherId = user?.user?.roleDocumentId;

  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [selectClass, setSelectClass] = useState("");
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(true);

  const loadTeacherClasses = async () => {
    if (!teacherId) return;

    try {
      setLoading(true);
      const response = await getTeacherById(teacherId);
      const teacherData = response.data || response;
      setClasses(teacherData.classes || []);
      setMessage("Classes loaded successfully");
      setMessageType("success");
    } catch (error) {
      setMessage("Error while fetching classes");
      setMessageType("error");
      console.error("Error fetching teacher classes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClassSubmit = async (classId) => {
    try {
      const res = await getStudentsByClass(classId);
      setStudents(res?.students || []);
      setMessage(`${res?.students?.length || 0} students loaded`);
      setMessageType("success");
      setAttendanceData({}); 
    } catch (error) {
      setMessage("Error while fetching students for class");
      setMessageType("error");
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    loadTeacherClasses();
  }, [teacherId]);

  useEffect(() => {
    if (selectClass) {
      handleClassSubmit(selectClass);
    } else {
      setStudents([]);
      setAttendanceData({});
    }
  }, [selectClass]);

  // ======== Setting the data of anttendence in to object Attendence data ========
  const handleAttendanceChange = (studentId, status) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSubmitAttendance = async () => {
    if (!selectClass || !teacherId) {
      setMessage("Missing required information");
      setMessageType("error");
      return;
    }

    if (Object.keys(attendanceData).length === 0) {
      setMessage("Please mark attendance for at least one student");
      setMessageType("error");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    try {
      // ======== Submitting Attendence ======== Date is automatically selected
      const promises = Object.entries(attendanceData).map(
        async ([studentId, status]) => {
          return await markAttandance({
            studentId,
            classId: selectClass,
            teacherId: teacherId,
            date: today,
            status,
          });
        }
      );

      await Promise.all(promises);
      toast.success("Attendance submitted successfully!" ,{
                theme : "dark"
              })
      setMessage("Attendance submitted successfully!");
      setMessageType("success");
      setAttendanceData({});
    } catch (error) {
      setMessage(error?.response?.data?.message || "Error submitting attendance");
      toast.error("Attendance already submitted!" ,{
                theme : "dark"
              })
      setMessageType("error");
      console.error("Error submitting attendance:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen ">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your classes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-white">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Mark Attendance</h1>
                <p className="text-blue-100 text-sm">Select a class and mark student attendance</p>
              </div>
            </div>
          </div>

          {message && (
            <div className={`px-8 py-4 border-b ${
              messageType === "error"
                ? "bg-red-50 border-red-200"
                : "bg-green-50 border-green-200"
            }`}>
              <div className="flex items-center space-x-2">
                {messageType === "error" ? (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
                <p className={`text-sm font-medium ${
                  messageType === "error" ? "text-red-700" : "text-green-700"
                }`}>
                  {message}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="text-blue-500 shadow-sm px-6 py-4 flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-blue-500">YOUR CLASSES</h2>
          </div>

          <div className="p-6">
            {classes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classes.map((cl) => (
                  <label
                    key={cl._id}
                    className={`flex items-center p-5 rounded-xl border-2 cursor-pointer transition-all ${
                      selectClass === cl._id
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                    }`}
                  >
                    <input
                      type="radio"
                      name="class"
                      value={cl._id}
                      checked={selectClass === cl._id}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                      onChange={(e) => setSelectClass(e.target.value)}
                    />
                    <span className={`ml-3 font-semibold ${
                      selectClass === cl._id ? 'text-blue-900' : 'text-gray-800'
                    }`}>
                      {cl.name}
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Classes Assigned</h3>
                <p className="text-gray-500">You don't have any classes assigned yet.</p>
              </div>
            )}
          </div>
        </div>
            {/*====== Marking Attendence based on selected class ====*/}
            {/* ====== Data of the selected class students are displaying here */}
        {selectClass && students.length > 0 && (
          <div className="bg-blue-500 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-blue-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Student Attendance</h2>
                  <p className="text-gray-100 text-sm">{students.length} students in class</p>
                </div>
              </div>
              <div className="text-white text-sm font-medium bg-blue-800 px-4 py-2 rounded-lg">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Student Details
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center justify-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Present</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center justify-center space-x-2">
                        <XCircle className="w-4 h-4 text-red-600" />
                        <span>Absent</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center justify-center space-x-2">
                        <Clock className="w-4 h-4 text-yellow-600" />
                        <span>Leave</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((stu, index) => (
                    <tr key={stu._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              {stu?.user?.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              Roll No: {stu?.rollNumber}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <label className="inline-flex items-center justify-center cursor-pointer">
                          <input
                            type="radio"
                            name={`attendance-${stu._id}`}
                            value="present"
                            checked={attendanceData[stu._id] === "present"}
                            onChange={() => handleAttendanceChange(stu._id, "present")}
                            className="h-5 w-5 text-green-600 focus:ring-2 focus:ring-green-500 cursor-pointer"
                          />
                        </label>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <label className="inline-flex items-center justify-center cursor-pointer">
                          <input
                            type="radio"
                            name={`attendance-${stu._id}`}
                            value="absent"
                            checked={attendanceData[stu._id] === "absent"}
                            onChange={() => handleAttendanceChange(stu._id, "absent")}
                            className="h-5 w-5 text-red-600 focus:ring-2 focus:ring-red-500 cursor-pointer"
                          />
                        </label>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <label className="inline-flex items-center justify-center cursor-pointer">
                          <input
                            type="radio"
                            name={`attendance-${stu._id}`}
                            value="leave"
                            checked={attendanceData[stu._id] === "leave"}
                            onChange={() => handleAttendanceChange(stu._id, "leave")}
                            className="h-5 w-5 text-yellow-600 focus:ring-2 focus:ring-yellow-500 cursor-pointer"
                          />
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-5 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center space-x-2">
                <div className="text-sm text-gray-600">
                  <span className="font-semibold text-blue-600">{Object.keys(attendanceData).length}</span>
                  <span className="text-gray-500"> of {students.length} students marked</span>
                </div>
                {Object.keys(attendanceData).length > 0 && (
                  <div className="flex items-center space-x-1 text-xs">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                      {Object.values(attendanceData).filter(s => s === 'present').length} P
                    </span>
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded">
                      {Object.values(attendanceData).filter(s => s === 'absent').length} A
                    </span>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                      {Object.values(attendanceData).filter(s => s === 'leave').length} L
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={handleSubmitAttendance}
                disabled={Object.keys(attendanceData).length === 0}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 px-8 rounded-xl transition-all transform hover:scale-105 disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg disabled:shadow-none"
              >
                Submit Attendance
              </button>
            </div>
          </div>
        )}
{/* ======== If No Rec Found ======== */}
        {selectClass && students.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <Users className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Students Found</h3>
            <p className="text-gray-600">This class doesn't have any students enrolled yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkAttendence;