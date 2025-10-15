import React, { useState, useEffect } from 'react';
import { getAttendenceByTeacherAndClass } from '../../api/attendenceApi';
import { getTeacherById } from '../../api/teacherApi';
import { useSelector } from 'react-redux';
import { Calendar, BookOpen, Users, CheckCircle, XCircle, Clock, AlertCircle, Filter, Download } from 'lucide-react';

const AttendenceRec = () => {
  const { user } = useSelector((state) => state.auth);
  const teacherId = user?.user?.roleDocumentId;

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchingRecords, setFetchingRecords] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  //=========== ===========  Load teacher's classes =========== =========== 
  useEffect(() => {
    const loadTeacherClasses = async () => {
      if (!teacherId) return;

      try {
        setLoading(true);
        const response = await getTeacherById(teacherId);
        const teacherData = response.data || response;
        setClasses(teacherData.classes || []);
      } catch (error) {
        setMessage('Error loading classes');
        setMessageType('error');
        console.error('Error fetching teacher classes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTeacherClasses();
  }, [teacherId]);

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!selectedClass || !teacherId) {
        setAttendanceRecords([]);
        return;
      }

      try {
        setFetchingRecords(true);
        setMessage('');
        const response = await getAttendenceByTeacherAndClass(teacherId, selectedClass);
        console.log(response);
        
        setAttendanceRecords(response.data || []);
        setMessage(`${response.data?.length || 0} attendance records found`);
        setMessageType('success');
      } catch (error) {
        if (error?.response?.status === 404) {
          setAttendanceRecords([]);
          setMessage('No attendance records found for this class');
          setMessageType('info');
        } else {
          setMessage('Error fetching attendance records');
          setMessageType('error');
        }
        console.error('Error fetching attendance:', error);
      } finally {
        setFetchingRecords(false);
      }
    };

    fetchAttendance();
  }, [selectedClass, teacherId]);

  const filteredRecords = attendanceRecords.filter(record => {
    const dateMatch = !filterDate || record.date?.startsWith(filterDate);
    const statusMatch = filterStatus === 'all' || record.status === filterStatus;
    return dateMatch && statusMatch;
  });

  const groupedByDate = filteredRecords.reduce((acc, record) => {
    const date = record.date?.split('T')[0] || 'Unknown';
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(record);
    return acc;
  }, {});

  const stats = {
    total: filteredRecords.length,
    present: filteredRecords.filter(r => r.status === 'present').length,
    absent: filteredRecords.filter(r => r.status === 'absent').length,
    leave: filteredRecords.filter(r => r.status === 'leave').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading attendance records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-white">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <Calendar className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Attendance Records</h1>
                <p className="text-blue-100 text-sm">View and analyze attendance history</p>
              </div>
            </div>
          </div>

          {message && (
            <div className={`px-8 py-4 border-b ${
              messageType === 'error'
                ? 'bg-red-50 border-red-200'
                : messageType === 'info'
                ? 'bg-blue-50 border-blue-200'
                : 'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-center space-x-2">
                {messageType === 'error' ? (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                ) : messageType === 'info' ? (
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
                <p className={`text-sm font-medium ${
                  messageType === 'error' ? 'text-red-700' : messageType === 'info' ? 'text-blue-700' : 'text-green-700'
                }`}>
                  {message}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4 flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-white">Select Class</h2>
          </div>

          <div className="p-6">
            {classes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classes.map((cl) => (
                  <label
                    key={cl._id}
                    className={`flex items-center p-5 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedClass === cl._id
                        ? 'border-emerald-500 bg-emerald-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-emerald-300 hover:shadow-sm'
                    }`}
                  >
                    <input
                      type="radio"
                      name="class"
                      value={cl._id}
                      checked={selectedClass === cl._id}
                      className="h-5 w-5 text-emerald-600 focus:ring-emerald-500"
                      onChange={(e) => setSelectedClass(e.target.value)}
                    />
                    <span className={`ml-3 font-semibold ${
                      selectedClass === cl._id ? 'text-emerald-900' : 'text-gray-800'
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

        {selectedClass && attendanceRecords.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Records</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Present</p>
                  <p className="text-2xl font-bold text-green-600">{stats.present}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Absent</p>
                  <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Leave</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.leave}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
          </div>
        )}

        {selectedClass && attendanceRecords.length > 0 && (

          // ======== Filtering ========
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-4 flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Filter className="w-6 h-6 text-violet-600" />
              </div>
              <h2 className="text-xl font-bold text-white">Filters</h2>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Date
                  </label>
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Status
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                  >
                    <option value="all">All Status</option>
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="leave">Leave</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setFilterDate('');
                      setFilterStatus('all');
                    }}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedClass && fetchingRecords && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading attendance records...</p>
          </div>
        )}

        {selectedClass && !fetchingRecords && filteredRecords.length > 0 && (
          <div className="space-y-6">
            {/* ===== Sorting in ddescending order */}
            {/* ======== Displaying result based on filter or all */}
            {Object.entries(groupedByDate).sort((a, b) => new Date(b[0]) - new Date(a[0])).map(([date, records]) => (
              <div key={date} className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-blue-600 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-6 h-6 text-white" />
                      <h3 className="text-xl font-bold text-white">
                        {new Date(date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </h3>
                    </div>
                    <span className="text-white text-sm bg-white/20 px-3 py-1 rounded-full">
                      {records.length} records
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Roll Number
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Time
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {records.map((record) => (
                        <tr key={record._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900">
                              {record.student?.user?.name || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600">
                              {record.student?.rollNumber || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              record.status === 'present'
                                ? 'bg-green-100 text-green-800'
                                : record.status === 'absent'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {record.status === 'present' && <CheckCircle className="w-3 h-3 mr-1" />}
                              {record.status === 'absent' && <XCircle className="w-3 h-3 mr-1" />}
                              {record.status === 'leave' && <Clock className="w-3 h-3 mr-1" />}
                              {record.status?.charAt(0).toUpperCase() + record.status?.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {new Date(record.date).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedClass && !fetchingRecords && filteredRecords.length === 0 && attendanceRecords.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <Filter className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Records Found</h3>
            <p className="text-gray-600">No attendance records match your current filters.</p>
            <button
              onClick={() => {
                setFilterDate('');
                setFilterStatus('all');
              }}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}

        {selectedClass && !fetchingRecords && attendanceRecords.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <Calendar className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Attendance Records</h3>
            <p className="text-gray-600">No attendance has been marked for this class yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendenceRec;