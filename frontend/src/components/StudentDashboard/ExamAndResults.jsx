import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getResultsByStudent } from '../../api/resultsApi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Award, BookOpen, TrendingUp, Calendar, BarChart3 } from 'lucide-react';

const StudentResultsDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const studentId = user?.user?.roleDocumentId;
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================== Fetch Results Data ==================
  useEffect(() => {
    const fetchResults = async () => {
      if (!studentId) return;
      try {
        setLoading(true);
        const data = await getResultsByStudent(studentId);
        setResults(data);
      } catch (error) {
        console.error('Error fetching results:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [studentId]);

  // ================== Loading State ==================
  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your results...</p>
        </div>
      </div>
    );
  }

  // ================== Empty Results ==================
  if (!results || results.length === 0) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center bg-white p-12 rounded-2xl shadow-xl">
          <BookOpen className="w-20 h-20 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-xl">No results found</p>
          <p className="text-gray-500 text-sm mt-2">Your exam results will appear here once published</p>
        </div>
      </div>
    );
  }

  // ================== Calculate Overall Statistics ==================
  const calculateStats = () => {
    let totalMarks = 0;
    let totalObtained = 0;
    let subjectCount = 0;

    results.forEach(result => {
      result.subjects.forEach(sub => {
        if (sub.subject) {
          totalMarks += sub.totalMarks;
          totalObtained += sub.marksObtained;
          subjectCount++;
        }
      });
    });

    const percentage = totalMarks > 0 ? ((totalObtained / totalMarks) * 100).toFixed(2) : 0;
    const average = subjectCount > 0 ? (totalObtained / subjectCount).toFixed(2) : 0;

    return { totalMarks, totalObtained, percentage, average, subjectCount };
  };

  const stats = calculateStats();

  // ================== Prepare Chart Data ==================
  const getBarChartData = () => {
    const data = [];
    results.forEach(result => {
      result.subjects.forEach(sub => {
        if (sub.subject) {
          data.push({
            name: sub.subject.name,
            obtained: sub.marksObtained,
            total: sub.totalMarks,
            percentage: ((sub.marksObtained / sub.totalMarks) * 100).toFixed(1)
          });
        }
      });
    });
    return data;
  };

  const getPieChartData = () => {
    const data = [];
    results.forEach(result => {
      result.subjects.forEach(sub => {
        if (sub.subject) {
          data.push({
            name: sub.subject.name,
            value: sub.marksObtained
          });
        }
      });
    });
    return data;
  };

  const getRadarChartData = () => {
    const data = [];
    results.forEach(result => {
      result.subjects.forEach(sub => {
        if (sub.subject) {
          data.push({
            subject: sub.subject.name,
            score: ((sub.marksObtained / sub.totalMarks) * 100).toFixed(0)
          });
        }
      });
    });
    return data;
  };

  // ================== Color & Grade Helpers ==================
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  const getGrade = (percentage) => {
    if (percentage >= 90) return { grade: 'A+', color: 'text-green-600', bg: 'bg-green-50' };
    if (percentage >= 80) return { grade: 'A', color: 'text-green-600', bg: 'bg-green-50' };
    if (percentage >= 70) return { grade: 'B', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (percentage >= 60) return { grade: 'C', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (percentage >= 50) return { grade: 'D', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { grade: 'F', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const overallGrade = getGrade(parseFloat(stats.percentage));

  // ================== Main Dashboard UI ==================
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 md:px-8">
      
      {/* ===== Dashboard Header ===== */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Award className="w-10 h-10 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-800">Academic Performance</h1>
        </div>
        <p className="text-gray-600 ml-13">Track your progress and achievements</p>
      </div>

      {/* ===== Summary Stats Cards ===== */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Overall Percentage</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">{stats.percentage}%</p>
            </div>
            <TrendingUp className="w-12 h-12 text-blue-500 opacity-20" />
          </div>
        </div>

        {/*===============  Total Marks Card =============== */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Marks</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{stats.totalObtained}/{stats.totalMarks}</p>
            </div>
            <BookOpen className="w-12 h-12 text-green-500 opacity-20" />
          </div>
        </div>

        {/*===============  Overall Grade Card =============== */}
        <div className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 ${overallGrade.bg.replace('bg-', 'border-')}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Overall Grade</p>
              <p className={`text-3xl font-bold mt-1 ${overallGrade.color}`}>{overallGrade.grade}</p>
            </div>
            <Award className={`w-12 h-12 opacity-20 ${overallGrade.color}`} />
          </div>
        </div>

        {/*===============  Subjects Count Card =============== */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Subjects</p>
              <p className="text-3xl font-bold text-purple-600 mt-1">{stats.subjectCount}</p>
            </div>
            <BarChart3 className="w-12 h-12 text-purple-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* ===== Charts Section ===== */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/*===============  Subject-wise Performance Chart =============== */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            Subject-wise Performance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getBarChartData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                formatter={(value, name) => [value, name === 'obtained' ? 'Marks Obtained' : 'Total Marks']}
              />
              <Legend />
              <Bar dataKey="obtained" fill="#3B82F6" radius={[8, 8, 0, 0]} name="Obtained" />
              <Bar dataKey="total" fill="#E5E7EB" radius={[8, 8, 0, 0]} name="Total" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-600" />
            Subject Progress
          </h3>
          <div className="space-y-5">
            {getBarChartData().map((item, index) => {
              const percentage = parseFloat(item.percentage);
              const barColor = percentage >= 80 ? 'bg-green-500' : percentage >= 60 ? 'bg-blue-500' : percentage >= 40 ? 'bg-yellow-500' : 'bg-red-500';
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-700">{item.name}</span>
                    <span className="text-sm font-bold text-gray-600">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div 
                      className={`h-4 rounded-full ${barColor} transition-all duration-500 flex items-center justify-end pr-2`}
                      style={{ width: `${percentage}%` }}
                    >
                      {percentage > 15 && (
                        <span className="text-white text-xs font-bold">{item.obtained}/{item.total}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ===== Detailed Exam Results ===== */}
      {results.map((result, idx) => (
        <div key={result._id} className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8 mb-6">
          
          <div className="flex items-center justify-between mb-6 pb-4 border-b">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{result.exam?.name || 'Exam'}</h2>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{result.exam?.date ? new Date(result.exam.date).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                  {result.class?.name || 'N/A'}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-sm">Roll Number</p>
              <p className="text-2xl font-bold text-gray-800">{result.student?.rollNumber || 'N/A'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {result.subjects.map((sub, subIdx) => {
              if (!sub.subject) return null;
              const subPercentage = ((sub.marksObtained / sub.totalMarks) * 100).toFixed(1);
              const subGrade = getGrade(parseFloat(subPercentage));

              return (
                <div key={sub._id} className={`${subGrade.bg} rounded-xl p-5 border-2 border-transparent hover:border-blue-300 transition-all`}>
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-bold text-gray-800">{sub.subject.name}</h4>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${subGrade.bg} ${subGrade.color}`}>
                      {subGrade.grade}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Marks</span>
                      <span className="font-bold text-gray-800">{sub.marksObtained}/{sub.totalMarks}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${subPercentage >= 80 ? 'bg-green-500' : subPercentage >= 60 ? 'bg-blue-500' : subPercentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${subPercentage}%` }}
                      ></div>
                    </div>
                    <p className="text-right text-sm font-semibold text-gray-700">{subPercentage}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudentResultsDashboard;
