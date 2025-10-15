import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAttendanceByStudentId } from "../../api/attendenceApi";
import { getStudentById } from "../../api/studentApi";
import {
  Mail,
  Calendar,
  BookOpen,
  Users,
  CheckCircle,
  XCircle,
  TrendingUp,
  MapPin,
  UserCircle,
} from "lucide-react";

const Overview = () => {
  const { user } = useSelector((state) => state.auth);
  const currentUser = user?.user;
  const studentId = currentUser?.roleDocumentId;

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attendanceStats, setAttendanceStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    percentage: 0,
    records: [],
  });

  // ==================== HELPER FUNCTIONS ====================

  const admissionDate = currentUser?.createdAt
    ? new Date(currentUser.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  const getStudentAttendance = async () => {
    if (!studentId) return;
    try {
      const response = await getAttendanceByStudentId(studentId);
      const records = response.attendance || response;

      const total = records.length;
      const present = records.filter((r) => r.status === "present").length;
      const absent = records.filter((r) => r.status === "absent").length;
      const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : 0;

      const sortedRecords = records.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setAttendanceStats({
        total,
        present,
        absent,
        percentage,
        records: sortedRecords.slice(0, 6),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getStudent = async () => {
    try {
      setLoading(true);
      const response = await getStudentById(studentId);
      setStudent(response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStudentAttendance();
    getStudent();
  }, [studentId]);

  // ==================== LOADING STATE ====================
  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // ==================== ATTENDANCE GRADE LOGIC ====================
  const getAttendanceGrade = () => {
    const percent = parseFloat(attendanceStats.percentage);
    if (percent >= 90)
      return { grade: "Excellent", color: "text-green-600", bg: "bg-green-50" };
    if (percent >= 75)
      return { grade: "Good", color: "text-blue-600", bg: "bg-blue-50" };
    if (percent >= 60)
      return {
        grade: "Average",
        color: "text-yellow-600",
        bg: "bg-yellow-50",
      };
    return { grade: "Poor", color: "text-red-600", bg: "bg-red-50" };
  };

  const grade = getAttendanceGrade();

  // ==================== MAIN RETURN ====================
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 md:px-8">
      
      {/* ================= HEADER (WELCOME SECTION) ================= */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {currentUser?.name || "Student"}! 👋
          </h1>
          <p className="text-blue-100 mb-6">Here's your academic overview</p>

          {/* === Basic Info Cards === */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Email Card */}
            <div className="bg-white rounded-xl p-4 shadow-md">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 rounded-full p-2">
                  <Mail className="w-5 h-5 text-blue-700" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-gray-600 text-sm">Email</p>
                  <p className="font-semibold text-gray-800 truncate">
                    {currentUser?.email || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Role Card */}
            <div className="bg-white rounded-xl p-4 shadow-md">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 rounded-full p-2">
                  <UserCircle className="w-5 h-5 text-indigo-700" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-gray-600 text-sm">Role</p>
                  <p className="font-semibold capitalize text-gray-800 truncate">
                    {currentUser?.role || "Student"}
                  </p>
                </div>
              </div>
            </div>

            {/* Admission Date Card */}
            <div className="bg-white rounded-xl p-4 shadow-md">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 rounded-full p-2">
                  <Calendar className="w-5 h-5 text-purple-700" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-gray-600 text-sm">Admitted on</p>
                  <p className="font-semibold text-gray-800 text-sm">
                    {admissionDate}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= STUDENT INFORMATION ================= */}
      {student && (
        <div className="max-w-7xl mx-auto mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                Student Information
              </h2>
            </div>

            {/* === Info Grid === */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-xl p-5 border-2 border-blue-100">
                <p className="text-gray-600 text-sm mb-1">Roll Number</p>
                <p className="text-gray-800 font-bold text-lg">
                  {student.rollNumber}
                </p>
              </div>

              <div className="bg-indigo-50 rounded-xl p-5 border-2 border-indigo-100">
                <p className="text-gray-600 text-sm mb-1">Class</p>
                <p className="text-gray-800 font-bold text-lg">
                  {student.class?.name || "N/A"}
                </p>
              </div>

              <div className="bg-purple-50 rounded-xl p-5 border-2 border-purple-100">
                <p className="text-gray-600 text-sm mb-1">Date of Birth</p>
                <p className="text-gray-800 font-bold text-lg">
                  {new Date(student.dob).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="bg-blue-50 rounded-xl p-5 border-2 border-blue-100">
                <p className="text-gray-600 text-sm mb-1">Father's Name</p>
                <p className="text-gray-800 font-bold text-lg">
                  {student.fatherName}
                </p>
              </div>

              <div className="bg-indigo-50 rounded-xl p-5 border-2 border-indigo-100">
                <p className="text-gray-600 text-sm mb-1">Gender</p>
                <p className="text-gray-800 font-bold text-lg capitalize">
                  {student.gender}
                </p>
              </div>

              <div className="bg-purple-50 rounded-xl p-5 border-2 border-purple-100">
                <p className="text-gray-600 text-sm mb-1 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Address
                </p>
                <p className="text-gray-800 font-bold text-lg">
                  {student.address}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= ATTENDANCE OVERVIEW ================= */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">
            Attendance Overview
          </h2>
        </div>

        {/* === Attendance Summary Cards === */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Present Days */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Days Present</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {attendanceStats.present}
                </p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-500 opacity-20" />
            </div>
          </div>

          {/* Absent Days */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Days Absent</p>
                <p className="text-3xl font-bold text-red-600 mt-1">
                  {attendanceStats.absent}
                </p>
              </div>
              <XCircle className="w-12 h-12 text-red-500 opacity-20" />
            </div>
          </div>

          {/* Total Days */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Days</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">
                  {attendanceStats.total}
                </p>
              </div>
              <Calendar className="w-12 h-12 text-blue-500 opacity-20" />
            </div>
          </div>

          {/* Attendance Rate */}
          <div
            className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 ${grade.bg.replace(
              "bg-",
              "border-"
            )}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Attendance Rate
                </p>
                <p className={`text-3xl font-bold mt-1 ${grade.color}`}>
                  {attendanceStats.percentage}%
                </p>
                <p className={`text-sm font-semibold mt-1 ${grade.color}`}>
                  {grade.grade}
                </p>
              </div>
              <TrendingUp className={`w-12 h-12 opacity-20 ${grade.color}`} />
            </div>
          </div>
        </div>
      </div>

      {/* ================= RECENT ATTENDANCE ================= */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">
              Recent Attendance
            </h2>
          </div>

          {attendanceStats.records.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {attendanceStats.records.map((rec) => (
                <div
                  key={rec._id}
                  className={`rounded-xl p-5 border-2 transition-all hover:shadow-md ${
                    rec.status === "present"
                      ? "bg-green-50 border-green-200 hover:border-green-300"
                      : "bg-red-50 border-red-200 hover:border-red-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {rec.class?.name || "N/A"}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                        rec.status === "present"
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {rec.status === "present" ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      {rec.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">
                        Teacher: {rec.teacher?.user?.name || "N/A"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">
                        {new Date(rec.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                No recent attendance records
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ================= FOOTER (QUICK STATS) ================= */}
      <div className="max-w-7xl mx-auto mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-8 text-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-blue-100 text-sm mb-2">Your Performance</p>
            <div className="w-full bg-blue-800 rounded-full h-3 mb-2">
              <div
                className="bg-white h-3 rounded-full transition-all duration-500"
                style={{ width: `${attendanceStats.percentage}%` }}
              ></div>
            </div>
            <p className="text-2xl font-bold">
              {attendanceStats.percentage}% Attendance
            </p>
          </div>

          <div>
            <p className="text-blue-100 text-sm mb-2">Total Record</p>
            <p className="text-4xl font-bold">{attendanceStats.total} Days</p>
          </div>

          <div>
            <p className="text-blue-100 text-sm mb-2">Status</p>
            <p
              className={`text-4xl font-bold ${
                parseFloat(attendanceStats.percentage) >= 75
                  ? "text-white"
                  : "text-yellow-300"
              }`}
            >
              {parseFloat(attendanceStats.percentage) >= 75
                ? "✓ Good"
                : "⚠ Warning"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
