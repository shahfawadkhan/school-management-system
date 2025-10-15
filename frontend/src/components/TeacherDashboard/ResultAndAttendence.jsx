import React, { useState, useEffect } from 'react';
import { getTeacherById } from '../../api/teacherApi';
import { getAttendenceByTeacherAndClass } from '../../api/attendenceApi';
import { getAllExams } from '../../api/examApi';
import { getResultsByExam } from '../../api/resultsApi';
import { useSelector } from 'react-redux';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Users, Award, Calendar, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';

const ResultAndAttendenceGraphs = () => {
  const { user } = useSelector((state) => state.auth);
  const teacherId = user?.user?.roleDocumentId;

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [attendanceData, setAttendanceData] = useState({ pie: [], trend: [], summary: {} });
  const [resultsData, setResultsData] = useState({ grades: [], performance: [], summary: {} });
  const [loading, setLoading] = useState(true);
  const [fetchingData, setFetchingData] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  //=============== Load initial datan =============== 
  useEffect(() => {
    const loadInitialData = async () => {
      if (!teacherId) return;

      try {
        setLoading(true);
        const [teacherResponse, examsResponse] = await Promise.all([
          getTeacherById(teacherId),
          getAllExams()
        ]);
        
        const teacherData = teacherResponse.data || teacherResponse;
        setClasses(teacherData.classes || []);
        
        const examsData = examsResponse.data || examsResponse || [];
        setExams(examsData);
        
        if (examsData.length > 0) {
          const recentExam = [...examsData].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
          setSelectedExam(recentExam._id);
        }
        
        setMessage('Data loaded successfully');
        setMessageType('success');
      } catch (error) {
        setMessage('Error loading data');
        setMessageType('error');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [teacherId]);

  //===============  Fetch data when selections change =============== 
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedClass || !selectedExam || !teacherId) {
        setAttendanceData({ pie: [], trend: [], summary: {} });
        setResultsData({ grades: [], performance: [], summary: {} });
        return;
      }

      try {
        setFetchingData(true);
        setMessage('Loading statistics...');
        setMessageType('info');

        const [attendanceResponse, resultsResponse] = await Promise.all([
          getAttendenceByTeacherAndClass(teacherId, selectedClass),
          getResultsByExam(selectedExam)
        ]);

        //===============  Process attendance =============== 
        const attendance = attendanceResponse.data || attendanceResponse || [];
        setAttendanceData(processAttendanceData(attendance));

        //===============  Process results =============== 
        let results = extractArray(resultsResponse);
        let classResults = results.filter(r => (r.class?._id || r.class) === selectedClass);
        
        if (classResults.length === 0 && results.length > 0) {
          classResults = results;
          setMessage(`No results for selected class. Showing all exam results (${results.length} total)`);
          setMessageType('info');
        } else {
          setMessage('Statistics updated successfully');
          setMessageType('success');
        }

        setResultsData(processResultsData(classResults));
      } catch (error) {
        setMessage('Error fetching statistics');
        setMessageType('error');
      } finally {
        setFetchingData(false);
      }
    };

    fetchData();
  }, [selectedClass, selectedExam, teacherId]);

  //===============  Helper to extract array from various response formats =============== 
  const extractArray = (response) => {
    if (Array.isArray(response)) {
      return response.length === 1 && Array.isArray(response[0]) ? response[0] : response;
    }
    if (response?.data && Array.isArray(response.data)) return response.data;
    if (response?.results && Array.isArray(response.results)) return response.results;
    return [];
  };

  //===============  Process attendance data =============== 
  const processAttendanceData = (attendance) => {
    if (!attendance?.length) return { pie: [], trend: [], summary: {} };

    const statusCount = { present: 0, absent: 0, leave: 0 };
    const dateMap = {};

    attendance.forEach(record => {
      if (record.status) statusCount[record.status]++;
      
      const date = record.date?.split('T')[0];
      if (date) {
        if (!dateMap[date]) dateMap[date] = { date, present: 0, absent: 0, leave: 0, total: 0 };
        dateMap[date][record.status]++;
        dateMap[date].total++;
      }
    });

    const total = attendance.length;
    const presentPercentage = total > 0 ? ((statusCount.present / total) * 100).toFixed(1) : 0;

    const pieData = [
      { name: 'Present', value: statusCount.present, color: '#10b981' },
      { name: 'Absent', value: statusCount.absent, color: '#ef4444' },
      { name: 'Leave', value: statusCount.leave, color: '#f59e0b' }
    ];

    const trendData = Object.values(dateMap)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-10)
      .map(item => ({
        date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        attendance: ((item.present / item.total) * 100).toFixed(1)
      }));

    return {
      pie: pieData,
      trend: trendData,
      summary: { total, ...statusCount, percentage: presentPercentage }
    };
  };

  //===============  Process results data  =============== 
  const processResultsData = (results) => {
    if (!results?.length) return { grades: [], performance: [], summary: {} };

    const gradesCount = { 'A+': 0, 'A': 0, 'B': 0, 'C': 0, 'D': 0, 'E': 0, 'F': 0 };
    let totalPercentage = 0;
    let passCount = 0;

    const performanceData = results.map(result => {
      const totalObtained = result.subjects?.reduce((sum, s) => sum + (s.marksObtained || 0), 0) || 0;
      const totalMax = result.subjects?.reduce((sum, s) => sum + (s.totalMarks || 0), 0) || 0;
      const percentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;
      
      totalPercentage += percentage;

      let grade = 'F';
      if (percentage >= 90) grade = 'A+';
      else if (percentage >= 80) grade = 'A';
      else if (percentage >= 70) grade = 'B';
      else if (percentage >= 60) grade = 'C';
      else if (percentage >= 50) grade = 'D';
      else if (percentage >= 33) grade = 'E';

      gradesCount[grade]++;
      if (percentage >= 33) passCount++;

      return {
        student: result.student?.user?.name || 'Unknown',
        percentage: parseFloat(percentage.toFixed(1)),
        grade
      };
    }).sort((a, b) => b.percentage - a.percentage);

    const gradesData = Object.entries(gradesCount)
      .filter(([_, count]) => count > 0)
      .map(([grade, count]) => ({ grade, count }));

    const avgPercentage = results.length > 0 ? (totalPercentage / results.length).toFixed(1) : 0;
    const passPercentage = results.length > 0 ? ((passCount / results.length) * 100).toFixed(1) : 0;

    return {
      grades: gradesData,
      performance: performanceData.slice(0, 10),
      summary: {
        total: results.length,
        passed: passCount,
        failed: results.length - passCount,
        avgPercentage,
        passPercentage
      }
    };
  };

  //===============  Stat Card Component =============== 
  const StatCard = ({ icon: Icon, label, value, color, borderColor }) => (
    <div className={`bg-white rounded-xl shadow-lg p-5 border-l-4 ${borderColor}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-600 mb-1">{label}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
        <Icon className={`w-8 h-8 ${color}`} />
      </div>
    </div>
  );

  //===============  Custom tooltip for top students =============== 
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{payload[0].payload.student}</p>
          <p className="text-sm text-gray-600">Percentage: <span className="font-bold text-blue-600">{payload[0].value}%</span></p>
          <p className="text-sm text-gray-600">Grade: <span className="font-bold text-purple-600">{payload[0].payload.grade}</span></p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading statistics...</p>
        </div>
      </div>
    );
  }

  const { summary: attendanceStats } = attendanceData;
  const { summary: resultsStats } = resultsData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-white">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Performance Analytics</h1>
                <p className="text-blue-100 text-sm">Attendance and exam results overview</p>
              </div>
            </div>
          </div>

          {message && (
            <div className={`px-8 py-4 border-b ${
              messageType === 'error' ? 'bg-red-50 border-red-200' :
              messageType === 'info' ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-center space-x-2">
                {messageType === 'error' ? <AlertCircle className="w-5 h-5 text-red-600" /> :
                 messageType === 'info' ? <AlertCircle className="w-5 h-5 text-blue-600" /> :
                 <CheckCircle className="w-5 h-5 text-green-600" />}
                <p className={`text-sm font-medium ${
                  messageType === 'error' ? 'text-red-700' : 
                  messageType === 'info' ? 'text-blue-700' : 'text-green-700'
                }`}>
                  {message}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-b from-blue-400 to to-blue-500 px-6 py-4 flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-emerald-600" />
              </div>
              <h2 className="text-lg font-bold text-white">Select Class</h2>
            </div>
            <div className="p-6">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              >
                <option value="">Choose a class</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>{cls.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-b from-blue-600 to to-blue-800  px-6 py-4 flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-violet-600" />
              </div>
              <h2 className="text-lg font-bold text-white">Select Exam</h2>
            </div>
            <div className="p-6">
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
              >
                <option value="">Choose an exam</option>
                {exams.map((exam) => (
                  <option key={exam._id} value={exam._id}>
                    {exam.name} - {new Date(exam.date).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {fetchingData && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center mb-6">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading statistics...</p>
          </div>
        )}

        {selectedClass && !fetchingData && (
          <>
            {/*===============  Attendance Stats ===============  */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <StatCard icon={Users} label="Total Records" value={attendanceStats.total || 0} color="text-gray-900" borderColor="border-blue-500" />
              <StatCard icon={CheckCircle} label="Present" value={attendanceStats.present || 0} color="text-green-600" borderColor="border-green-500" />
              <StatCard icon={AlertCircle} label="Absent" value={attendanceStats.absent || 0} color="text-red-600" borderColor="border-red-500" />
              <StatCard icon={Calendar} label="Leave" value={attendanceStats.leave || 0} color="text-yellow-600" borderColor="border-yellow-500" />
              <StatCard icon={TrendingUp} label="Attendance" value={`${attendanceStats.percentage || 0}%`} color="text-indigo-600" borderColor="border-indigo-500" />
            </div>

            {/*===============  Attendance Graphs =============== */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
                  <h3 className="text-xl font-bold text-white">Attendance Distribution</h3>
                </div>
                <div className="p-6">
                  {attendanceData.pie?.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={attendanceData.pie}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                          outerRadius={100}
                          dataKey="value"
                        >
                          {attendanceData.pie.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-gray-500">No attendance data</div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
                  <h3 className="text-xl font-bold text-white">Attendance Trend (Last 10 Days)</h3>
                </div>
                <div className="p-6">
                  {attendanceData.trend?.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={attendanceData.trend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip formatter={(value) => `${value}%`} />
                        <Legend />
                        <Line type="monotone" dataKey="attendance" stroke="#3b82f6" strokeWidth={3} name="Attendance %" />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-gray-500">No trend data</div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {selectedClass && selectedExam && !fetchingData && (
          <>
            {/*===============  Results Stats =============== */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <StatCard icon={Users} label="Total Students" value={resultsStats.total || 0} color="text-gray-900" borderColor="border-purple-500" />
              <StatCard icon={CheckCircle} label="Passed" value={resultsStats.passed || 0} color="text-green-600" borderColor="border-green-500" />
              <StatCard icon={AlertCircle} label="Failed" value={resultsStats.failed || 0} color="text-red-600" borderColor="border-red-500" />
              <StatCard icon={TrendingUp} label="Pass Rate" value={`${resultsStats.passPercentage || 0}%`} color="text-blue-600" borderColor="border-blue-500" />
              <StatCard icon={Award} label="Class Average" value={`${resultsStats.avgPercentage || 0}%`} color="text-indigo-600" borderColor="border-indigo-500" />
            </div>

            {/*===============  Results Graphs =============== */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4">
                  <h3 className="text-xl font-bold text-white">Grade Distribution</h3>
                </div>
                <div className="p-6">
                  {resultsData.grades?.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={resultsData.grades}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="grade" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" name="Students" fill="#8b5cf6" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-gray-500">No results data</div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-4">
                  <h3 className="text-xl font-bold text-white">Top 10 Students Performance</h3>
                </div>
                <div className="p-6">
                  {resultsData.performance?.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={resultsData.performance}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="student" angle={-45} textAnchor="end" height={100} interval={0} />
                        <YAxis domain={[0, 100]} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="percentage" name="Percentage %" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-gray-500">No performance data</div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {!selectedClass && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <TrendingUp className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Select Class and Exam</h3>
            <p className="text-gray-600">Choose a class and exam to view attendance and results statistics.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultAndAttendenceGraphs;