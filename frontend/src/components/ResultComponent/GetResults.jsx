import React, { useState, useEffect } from "react";
import { Search, BookOpen, Users, TrendingUp, Award, AlertCircle, CheckCircle, XCircle, Edit, Trash2 } from "lucide-react";
import { getAllExams } from "../../api/examApi";
import { getResultByClass } from "../../api/resultsApi";
import EditResult from "./EditResult"; // Import your EditResult component

const GetResults = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [classResult, setClassResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingResult, setEditingResult] = useState(null);

  const loadExams = async () => {
    try {
      setLoading(true);
      const response = await getAllExams();
      const allClasses = response.flatMap((exam) => exam.classes);
      setClasses(allClasses);
      setError("");
    } catch (error) {
      console.log("Error while fetching classes", error);
      setError("Failed to load classes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClassResult = async () => {
    if (!selectedClass) return;
    try {
      setLoading(true);
      setError("");
      const response = await getResultByClass(selectedClass);
      setClassResult(response);
      console.log("Result by class fetched successfully", response);
    } catch (error) {
      console.log("Error while getting Class Result", error);
      setError("Failed to fetch results. Please try again.");
      setClassResult([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditResult = (result) => {
    setEditingResult(result);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingResult(null);
  };

  const handleResultUpdated = () => {
    if (selectedClass) {
      handleClassResult();
    }
  };

  const handleDeleteResult = (resultId) => {
    if (window.confirm("Are you sure you want to delete this result?")) {
      console.log("Deleting result:", resultId);
    }
  };

  const getClassStats = () => {
    if (classResult.length === 0) return null;
    const stats = classResult.map(res => {
      const totalObtained = res.subjects?.reduce((sum, subj) => sum + (subj.marksObtained || 0), 0) || 0;
      const totalMarks = res.subjects?.reduce((sum, subj) => sum + (subj.totalMarks || 0), 0) || 0;
      const percentage = totalMarks > 0 ? (totalObtained / totalMarks) * 100 : 0;
      return { totalObtained, totalMarks, percentage, passed: percentage >= 50 };
    });

    const totalStudents = stats.length;
    const passedStudents = stats.filter(s => s.passed).length;
    const failedStudents = totalStudents - passedStudents;
    const avgPercentage = stats.reduce((sum, s) => sum + s.percentage, 0) / totalStudents;
    const passRate = (passedStudents / totalStudents) * 100;

    return { totalStudents, passedStudents, failedStudents, avgPercentage, passRate };
  };

  const classStats = getClassStats();

  useEffect(() => {
    loadExams();
  }, []);

  const getGrade = (percentage) => {
    if (percentage >= 90) return { grade: 'A+', color: 'text-green-700 bg-green-100' };
    if (percentage >= 80) return { grade: 'A', color: 'text-green-600 bg-green-50' };
    if (percentage >= 70) return { grade: 'B', color: 'text-blue-600 bg-blue-50' };
    if (percentage >= 60) return { grade: 'C', color: 'text-yellow-600 bg-yellow-50' };
    if (percentage >= 50) return { grade: 'D', color: 'text-orange-600 bg-orange-50' };
    return { grade: 'F', color: 'text-red-600 bg-red-50' };
  };

  return (
    <div className="min-h-screen w-full p-3">
      <div className="w-full ">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-indigo-600 rounded-full">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Class Results Dashboard</h1>
          </div>
          <p className="text-gray-600 text-lg">View and analyze student performance by class</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-800">Select Class</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <select
                onChange={(e) => setSelectedClass(e.target.value)}
                value={selectedClass}
                className="w-full appearance-none bg-white border-2 border-gray-200 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                disabled={loading}
              >
                <option value="">-- Select Class --</option>
                {classes.map((cl) => (
                  <option key={cl._id} value={cl._id}>
                    {cl.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            <button
              onClick={handleClassResult}
              disabled={!selectedClass || loading}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <Search className="h-5 w-5" />
              )}
              {loading ? 'Loading...' : 'Get Results'}
            </button>
          </div>
        </div>

        {classStats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{classStats.totalStudents}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Passed</p>
                  <p className="text-2xl font-bold text-green-600">{classStats.passedStudents}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Failed</p>
                  <p className="text-2xl font-bold text-red-600">{classStats.failedStudents}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pass Rate</p>
                  <p className="text-2xl font-bold text-purple-600">{classStats.passRate.toFixed(1)}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-indigo-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Class Average</p>
                  <p className="text-2xl font-bold text-indigo-600">{classStats.avgPercentage.toFixed(1)}%</p>
                </div>
                <Award className="h-8 w-8 text-indigo-500" />
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading results...</p>
          </div>
        ) : classResult.length > 0 ? (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full ">
            <div className="px-3 py-4 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Student Results</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                  <tr>
                    <th className="px-4 py-4 text-left font-semibold">Roll No</th>
                    <th className="px-4 py-4 text-left font-semibold">Student Name</th>
                    <th className="px-4 py-4 text-left font-semibold">Subject Details</th>
                    <th className="px-4 py-4 text-center font-semibold">Total Marks</th>
                    <th className="px-4 py-4 text-center font-semibold">Percentage</th>
                    <th className="px-4 py-4 text-center font-semibold">Grade</th>
                    <th className="px-4 py-4 text-center font-semibold">Status</th>
                    <th className="px-4 py-4 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {classResult.map((res, index) => {
                    const totalObtained = res.subjects?.reduce(
                      (sum, subj) => sum + (subj.marksObtained || 0),
                      0
                    ) || 0;
                    const totalMarks = res.subjects?.reduce(
                      (sum, subj) => sum + (subj.totalMarks || 0),
                      0
                    ) || 0;
                    const percentage = totalMarks > 0 ? (totalObtained / totalMarks) * 100 : 0;
                    const gradeInfo = getGrade(percentage);
                    const isPassed = percentage >= 50;

                    return (
                      <tr 
                        key={res._id} 
                        className={`hover:bg-gray-50 transition-colors duration-200 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-200'
                        }`}
                      >
                        <td className="px-6 py-4 text-center font-medium text-gray-900">
                          {res.student?.rollNumber}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">
                            {res.student?.user?.name}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            {res.subjects?.map((subj, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border"
                              >
                                <span className="font-semibold">{subj.subject?.name}:</span>
                                <span className="ml-1">
                                  {subj.marksObtained}/{subj.totalMarks}
                                </span>
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="font-bold text-lg text-gray-900">
                            {totalObtained}/{totalMarks}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className={`font-bold text-lg ${
                            percentage >= 40 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {percentage.toFixed(2)}%
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${gradeInfo.color} border`}>
                            {gradeInfo.grade}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                            isPassed 
                              ? 'bg-green-100 text-green-800 border border-green-200' 
                              : 'bg-red-100 text-red-800 border border-red-200'
                          }`}>
                            {isPassed ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <XCircle className="h-4 w-4" />
                            )}
                            {isPassed ? 'Pass' : 'Fail'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => handleEditResult(res)}
                              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
                              title="Edit Result"
                            >
                              <Edit className="h-4 w-4" />
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteResult(res._id)}
                              className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
                              title="Delete Result"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : classes.length === 0 && !loading ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Found</h3>
            <p className="text-gray-600">No results found for the selected class. Please try selecting a different class.</p>
          </div>
        ) : null}

        {showEditModal && editingResult && (
          <EditResult
            result={editingResult}
            onClose={handleCloseEditModal}
            onUpdate={handleResultUpdated}
          />
        )}
      </div>
    </div>
  );
};

export default GetResults;