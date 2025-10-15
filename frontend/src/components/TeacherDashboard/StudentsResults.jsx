import React, { useState, useEffect } from 'react';
import { getTeacherById } from '../../api/teacherApi';
import { getStudentsByClass } from '../../api/studentApi';
import { getAllExams } from '../../api/examApi';
import { getResultsByStudent } from '../../api/resultsApi';
import { useSelector } from 'react-redux';
import { Award, BookOpen, Users, FileText, TrendingUp, AlertCircle, CheckCircle, Search } from 'lucide-react';

const StudentsResults = () => {
  const { user } = useSelector((state) => state.auth);
  const teacherId = user?.user?.roleDocumentId;

  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedExam, setSelectedExam] = useState('all');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchingResults, setFetchingResults] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // ===============  initiala state  =============== 
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
        setExams(examsResponse.data || examsResponse || []);
        
        setMessage('Data loaded successfully');
        setMessageType('success');
      } catch (error) {
        setMessage('Error loading data');
        setMessageType('error');
        console.error('Error loading initial data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [teacherId]);

  useEffect(() => {
    const loadStudents = async () => {
      if (!selectedClass) {
        setStudents([]);
        setSelectedStudent('');
        return;
      }

      try {
        const response = await getStudentsByClass(selectedClass);
        setStudents(response?.students || []);
      } catch (error) {
        setMessage('Error loading students');
        setMessageType('error');
        console.error('Error loading students:', error);
      }
    };

    loadStudents();
  }, [selectedClass]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!selectedStudent) {
        setResults([]);
        return;
      }

      try {
        setFetchingResults(true);
        setMessage('');
        const response = await getResultsByStudent(selectedStudent);
        console.log('Results API Response:', response);
        
        let resultsData = [];
        if (Array.isArray(response)) {
          resultsData = response;
        } else if (response.data && Array.isArray(response.data)) {
          resultsData = response.data;
        } else if (response.results && Array.isArray(response.results)) {
          resultsData = response.results;
        }
        
        setResults(resultsData);
        
        if (resultsData.length > 0) {
          setMessage(`${resultsData.length} result(s) found`);
          setMessageType('success');
        } else {
          setMessage('No results found for this student');
          setMessageType('info');
        }
      } catch (error) {
        if (error?.response?.status === 404) {
          setResults([]);
          setMessage('No results found for this student');
          setMessageType('info');
        } else {
          setMessage('Error fetching results');
          setMessageType('error');
        }
        console.error('Error fetching results:', error);
      } finally {
        setFetchingResults(false);
      }
    };

    fetchResults();
  }, [selectedStudent]);

  const filteredResults = selectedExam === 'all' 
    ? results 
    : results.filter(result => result.exam?._id === selectedExam);

  const calculateStats = (result) => {
    let totalObtained = 0;
    let totalMax = 0;

    result.subjects?.forEach(subject => {
      totalObtained += subject.marksObtained || 0;
      totalMax += subject.totalMarks || 0;
    });

    const percentage = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(2) : 0;
    
    let grade = 'F';
    if (percentage >= 90) grade = 'A+';
    else if (percentage >= 80) grade = 'A';
    else if (percentage >= 70) grade = 'B';
    else if (percentage >= 60) grade = 'C';
    else if (percentage >= 50) grade = 'D';
    else if (percentage >= 33) grade = 'E';

    return { totalObtained, totalMax, percentage, grade };
  };
  //===============  separate colors for diff grades =============== 
  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'B':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'C':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'D':
      case 'E':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      default:
        return 'bg-red-100 text-red-800 border-red-300';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading results...</p>
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
                <Award className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Students Results</h1>
                <p className="text-blue-100 text-sm">View and analyze student exam results</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-b from-blue-400 to to-blue-500  px-6 py-4 flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-500" />
              </div>
              <h2 className="text-lg font-bold text-white">Select Class</h2>
            </div>
            <div className="p-6">
              <select
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  setSelectedStudent('');
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="">Choose a class</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-b from-blue-500 to to-blue-600  px-6 py-4 flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-lg font-bold text-white">Select Student</h2>
            </div>
            <div className="p-6">
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                disabled={!selectedClass}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Choose a student</option>
                {students.map((student) => (
                  <option key={student._id} value={student._id}>
                    {student.user?.name} (Roll: {student.rollNumber})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-b from-blue-600 to to-blue-700  px-6 py-4 flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-700" />
              </div>
              <h2 className="text-lg font-bold text-white">Filter by Exam</h2>
            </div>
            <div className="p-6">
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                disabled={!selectedStudent}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="all">All Exams</option>
                {exams.map((exam) => (
                  <option key={exam._id} value={exam._id}>
                    {exam.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {selectedStudent && fetchingResults && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading results...</p>
          </div>
        )}
      {/*===============  STudent result data ===============  */}
        {selectedStudent && !fetchingResults && filteredResults.length > 0 && (
          <div className="space-y-6">
            {filteredResults.map((result) => {
              const stats = calculateStats(result);
              
              return (
                <div key={result._id} className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-blue-600 px-6 py-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-6 h-6 text-white" />
                        <div>
                          <h3 className="text-xl font-bold text-white">
                            {result.exam?.name || 'Exam'}
                          </h3>
                          <p className="text-blue-100 text-sm">
                            {result.exam?.date && new Date(result.exam.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      
                      {/*===============  Grade Badge =============== */}
                      <div className={`inline-flex items-center px-6 py-3 rounded-xl border-2 ${getGradeColor(stats.grade)} font-bold text-2xl`}>
                        Grade: {stats.grade}
                      </div>
                    </div>
                  </div>

                  {/*===============  Summary Stats =============== */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50 border-b border-gray-200">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Total Obtained</p>
                      <p className="text-2xl font-bold text-blue-600">{stats.totalObtained}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Total Marks</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalMax}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Percentage</p>
                      <p className="text-2xl font-bold text-indigo-600">{stats.percentage}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Subjects</p>
                      <p className="text-2xl font-bold text-purple-600">{result.subjects?.length || 0}</p>
                    </div>
                  </div>

                  {/*===============  Subject-wise Marks =============== */}
                  <div className="p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
                      Subject-wise Performance
                    </h4>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                              Subject
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                              Obtained
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                              Total
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                              Percentage
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {result.subjects?.map((subject, index) => {
                            const subjectPercentage = subject.totalMarks > 0 
                              ? ((subject.marksObtained / subject.totalMarks) * 100).toFixed(2) 
                              : 0;
                            const isPassing = subjectPercentage >= 33;

                            return (
                              <tr key={index} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                      {index + 1}
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900">
                                      {subject.subject?.name || 'N/A'}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                  <span className="text-lg font-bold text-blue-600">
                                    {subject.marksObtained}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                  <span className="text-lg font-bold text-gray-900">
                                    {subject.totalMarks}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                                    subjectPercentage >= 90 ? 'bg-green-100 text-green-800' :
                                    subjectPercentage >= 75 ? 'bg-blue-100 text-blue-800' :
                                    subjectPercentage >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                    subjectPercentage >= 33 ? 'bg-orange-100 text-orange-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {subjectPercentage}%
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                    isPassing 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {isPassing ? (
                                      <>
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Pass
                                      </>
                                    ) : (
                                      <>
                                        <AlertCircle className="w-3 h-3 mr-1" />
                                        Fail
                                      </>
                                    )}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/*=============== No Student Selected =============== */}
        {!selectedStudent && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <Search className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Student</h3>
            <p className="text-gray-600">Choose a class and student to view their exam results.</p>
          </div>
        )}

        {/*===============  Empty State - No Results =============== */}
        {selectedStudent && !fetchingResults && filteredResults.length === 0 && results.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <Award className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Found</h3>
            <p className="text-gray-600">This student doesn't have any exam results yet.</p>
          </div>
        )}

        {/*===============  Empty State - Filtered Results Empty =============== */}
        {selectedStudent && !fetchingResults && filteredResults.length === 0 && results.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <FileText className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results for Selected Exam</h3>
            <p className="text-gray-600">No results found for the selected exam filter.</p>
            <button
              onClick={() => setSelectedExam('all')}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Show all results
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentsResults;