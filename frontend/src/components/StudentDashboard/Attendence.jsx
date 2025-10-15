import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAttendanceByStudentId } from "../../api/attendenceApi";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AttendancePage = () => {
  // Get logged-in user from Redux
  const { user } = useSelector((state) => state.auth);
  const studentId = user?.user?.roleDocumentId;

  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [filterMonth, setFilterMonth] = useState(""); 
  const [filterClass, setFilterClass] = useState("");
  const [loading, setLoading] = useState(true);

  //===============  Fetch attendance data by student ID =============== 
  const fetchAttendance = async () => {
    if (!studentId) return;
    try {
      setLoading(true);
      const response = await getAttendanceByStudentId(studentId);
      const records = response.attendance || response;

      // Sort records by date (latest first)
      setAttendanceRecords(records.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [studentId]);

  //===============  Filtered records based on month and class =============== 
  const filteredRecords = attendanceRecords.filter((rec) => {
    let monthMatch = true;
    let classMatch = true;

    if (filterMonth) {
      const recMonth = new Date(rec.date).toISOString().slice(0, 7);
      monthMatch = recMonth === filterMonth;
    }

    if (filterClass) {
      classMatch = rec.class?._id === filterClass;
    }

    return monthMatch && classMatch;
  });

  const total = filteredRecords.length;
  const present = filteredRecords.filter((r) => r.status === "present").length;
  const absent = filteredRecords.filter((r) => r.status === "absent").length;
  const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : 0;

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading attendance records...</p>
        </div>
      </div>
    );
  }

  if (!attendanceRecords || attendanceRecords.length === 0) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center bg-white p-12 rounded-2xl shadow-xl">
          <p className="text-gray-600 text-xl">No attendance records found</p>
          <p className="text-gray-500 text-sm mt-2">Your attendance records will appear here once marked</p>
        </div>
      </div>
    );
  }

  //===============  Chart data for visual representation =============== 
  const chartData = [
    { name: 'Present', value: present, color: '#10B981' },
    { name: 'Absent', value: absent, color: '#EF4444' }
  ];

  const barChartData = [
    { status: 'Present', count: present },
    { status: 'Absent', count: absent }
  ];

  //===============  Get attendance grade based on percentage =============== 
  const getAttendanceGrade = () => {
    const percent = parseFloat(percentage);
    if (percent >= 90) return { grade: 'Excellent', color: 'text-green-600', bg: 'bg-green-50' };
    if (percent >= 75) return { grade: 'Good', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (percent >= 60) return { grade: 'Average', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { grade: 'Poor', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const grade = getAttendanceGrade();

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 md:px-8">
      
      {/* ================= Header Section ================= */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Attendance Overview</h1>
        <p className="text-gray-600">Track your presence and participation</p>
      </div>

      {/* ================= Stats Cards ================= */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Attendance percentage card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
          <p className="text-gray-500 text-sm font-medium">Attendance Rate</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">{percentage}%</p>
        </div>

        {/* Present days card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
          <p className="text-gray-500 text-sm font-medium">Days Present</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{present}</p>
          <p className="text-sm text-gray-600 mt-1">out of {total}</p>
        </div>

        {/* Absent days card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500">
          <p className="text-gray-500 text-sm font-medium">Days Absent</p>
          <p className="text-3xl font-bold text-red-600 mt-1">{absent}</p>
          <p className="text-sm text-gray-600 mt-1">missed days</p>
        </div>

        {/* Performance grade card */}
        <div className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 ${grade.bg.replace('bg-', 'border-')}`}>
          <p className="text-gray-500 text-sm font-medium">Performance</p>
          <p className={`text-3xl font-bold mt-1 ${grade.color}`}>{grade.grade}</p>
        </div>
      </div>

      {/* ================= Charts Section ================= */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Bar chart showing count of present/absent days */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Attendance Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {barChartData.map((entry, index) => (
                  <Cell key={index} fill={entry.status === 'Present' ? '#10B981' : '#EF4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart showing attendance distribution */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================= Filter Section ================= */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Filter Records</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Month filter */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Filter by Month</label>
              <input
                type="month"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-2 focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Class filter */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Filter by Class</label>
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-2 focus:border-blue-500 focus:outline-none transition-colors"
              >
                <option value="">All Classes</option>
                {attendanceRecords
                  .map((rec) => rec.class)
                  .filter((v, i, a) => v && a.findIndex((x) => x?._id === v._id) === i)
                  .map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Clear filters button */}
            <div className="flex items-end">
              <button
                onClick={() => { setFilterMonth(""); setFilterClass(""); }}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold shadow-md"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= Attendance Records Table ================= */}
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Detailed Records</h2>

        {filteredRecords.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 uppercase">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 uppercase">Class</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 uppercase">Teacher</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRecords.map((rec) => (
                  <tr key={rec._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-700">
                      {new Date(rec.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {rec.class?.name || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {rec.teacher?.user?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-4 py-2 rounded-full text-sm font-bold w-fit ${
                        rec.status === "present" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-red-100 text-red-700"
                      }`}>
                        {rec.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          // No filtered records found
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No records match your filters</p>
            <button
              onClick={() => { setFilterMonth(""); setFilterClass(""); }}
              className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
            >
              Clear filters to see all records
            </button>
          </div>
        )}
      </div>

      {/* ================= Summary Footer ================= */}
      <div className="max-w-7xl mx-auto mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-8 text-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {/* Progress bar */}
          <div>
            <p className="text-blue-100 text-sm mb-2">Attendance Progress</p>
            <div className="w-full bg-blue-800 rounded-full h-3 mb-2">
              <div
                className="bg-white h-3 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <p className="text-2xl font-bold">{percentage}% Present</p>
          </div>
          
          {/* Total days summary */}
          <div>
            <p className="text-blue-100 text-sm mb-2">Total Days</p>
            <p className="text-4xl font-bold">{total}</p>
          </div>
          
          {/* Status summary */}
          <div>
            <p className="text-blue-100 text-sm mb-2">Status</p>
            <p className={`text-4xl font-bold ${parseFloat(percentage) >= 75 ? 'text-white' : 'text-yellow-300'}`}>
              {parseFloat(percentage) >= 75 ? '✓ Good' : '⚠ Warning'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
