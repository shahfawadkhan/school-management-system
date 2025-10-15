import React, { useState, useEffect } from 'react';
import { getAllExams } from '../../api/examApi';
import { getTeacherById } from '../../api/teacherApi';
import { getStudentsByClass } from '../../api/studentApi';
import { createResult } from '../../api/resultsApi';
import { useSelector } from 'react-redux';
import { BookOpen, Users, FileText, CheckCircle, AlertCircle, Award, ClipboardList } from 'lucide-react';
import { toast } from 'react-toastify';

const AssignMarks = () => {
  const { user } = useSelector((state) => state.auth);
  const teacherId = user?.user?.roleDocumentId;

  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  
  const [marksData, setMarksData] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  //=========== Load teacher data (classes and subjects) =========== 
  useEffect(() => {
    const loadTeacherData = async () => {
      if (!teacherId) return;

      try {
        setLoading(true);
        const response = await getTeacherById(teacherId);
        const teacherData = response.data || response;
        setClasses(teacherData.classes || []);
        setSubjects(teacherData.subjects || []);
        
        //===========  Load all exams =========== 
        const examsResponse = await getAllExams();
        setExams(examsResponse.data || examsResponse || []);
        
        setMessage('Data loaded successfully');
        setMessageType('success');
      } catch (error) {
        setMessage('Error loading data');
        setMessageType('error');
        console.error('Error loading teacher data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTeacherData();
  }, [teacherId]);

  //===========  Load students when class is selected =========== 
  useEffect(() => {
    const loadStudents = async () => {
      if (!selectedClass) {
        setStudents([]);
        return;
      }

      try {
        const response = await getStudentsByClass(selectedClass);
        setStudents(response?.students || []);
        setMessage(`${response?.students?.length || 0} students loaded`);
        setMessageType('success');
      } catch (error) {
        setMessage('Error loading students');
        setMessageType('error');
        console.error('Error loading students:', error);
      }
    };

    loadStudents();
  }, [selectedClass]);

  //===========  Reset marks data when student changes =========== 
  useEffect(() => {
    if (selectedStudent) {
      const initialMarks = {};
      subjects.forEach(subject => {
        initialMarks[subject._id] = {
          subject: subject._id,
          marksObtained: '',
          totalMarks: ''
        };
      });
      setMarksData(initialMarks);
    } else {
      setMarksData({});
    }
  }, [selectedStudent, subjects]);

  //=========== ===========  Handle marks input change =========== =========== 
  const handleMarksChange = (subjectId, field, value) => {
    setMarksData(prev => ({
      ...prev,
      [subjectId]: {
        ...prev[subjectId],
        [field]: value
      }
    }));
  };

  //=========== ===========  Validate marks =========== =========== 
  const validateMarks = () => {
    for (let subjectId in marksData) {
      const { marksObtained, totalMarks } = marksData[subjectId];
      
      if (!marksObtained || !totalMarks) {
        setMessage('Please fill in all marks fields');
        setMessageType('error');
        return false;
      }

      const obtained = parseFloat(marksObtained);
      const total = parseFloat(totalMarks);

      if (isNaN(obtained) || isNaN(total)) {
        setMessage('Marks must be valid numbers');
        setMessageType('error');
        return false;
      }

      if (obtained < 0 || total < 0) {
        setMessage('Marks cannot be negative');
        setMessageType('error');
        return false;
      }

      if (obtained > total) {
        setMessage('Obtained marks cannot exceed total marks');
        setMessageType('error');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!selectedExam || !selectedClass || !selectedStudent) {
      setMessage('Please select exam, class, and student');
      setMessageType('error');
      return;
    }

    if (!validateMarks()) {
      return;
    }

    try {
      setSubmitting(true);
      
      const subjectsArray = Object.values(marksData).map(mark => ({
        subject: mark.subject,
        marksObtained: parseFloat(mark.marksObtained),
        totalMarks: parseFloat(mark.totalMarks)
      }));

      const resultData = {
        student: selectedStudent,
        exam: selectedExam,
        class: selectedClass,
        subjects: subjectsArray
      };

      await createResult(resultData);
      toast.success("Result submitted successfully!" ,{
                      theme : "dark"
                    })
      setMessage('Result created successfully!');
      setMessageType('success');
      
      setSelectedStudent('');
      setMarksData({});
      
    } catch (error) {
      if (error?.response?.data?.message) {
        setMessage(error.response.data.message);
        toast.error("error while submitting result!" ,{
        theme : "dark"})
      } else {
        setMessage('Error creating result');
      }
      setMessageType('error');
      console.error('Error creating result:', error);
    } finally {
      setSubmitting(false);
    }
  };

  //=========== ===========  Calculate total marks =========== =========== 
  const calculateTotals = () => {
    let totalObtained = 0;
    let totalMax = 0;
    
    Object.values(marksData).forEach(mark => {
      if (mark.marksObtained && mark.totalMarks) {
        totalObtained += parseFloat(mark.marksObtained) || 0;
        totalMax += parseFloat(mark.totalMarks) || 0;
      }
    });

    const percentage = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(2) : 0;
    
    return { totalObtained, totalMax, percentage };
  };

  const totals = calculateTotals();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
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
                <h1 className="text-2xl font-bold">Assign Marks</h1>
                <p className="text-blue-100 text-sm">Create exam results for students</p>
              </div>
            </div>
          </div>

          {message && (
            <div className={`px-8 py-4 border-b ${
              messageType === 'error'
                ? 'bg-red-50 border-red-200'
                : 'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-center space-x-2">
                {messageType === 'error' ? (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
                <p className={`text-sm font-medium ${
                  messageType === 'error' ? 'text-red-700' : 'text-green-700'
                }`}>
                  {message}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          
          {/* =========== =========== Select Exam =========== ===========  */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-b from-blue-600 to to-violet-500 px-6 py-4 flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-emerald-600" />
              </div>
              <h2 className="text-lg font-bold text-white">Select Exam</h2>
            </div>
            <div className="p-6">
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
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

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-b from-blue-600 to to-violet-500 px-6 py-4 flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-violet-600" />
              </div>
              <h2 className="text-lg font-bold text-white">Select Class</h2>
            </div>
            <div className="p-6">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
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
            <div className="bg-gradient-to-b from-blue-600 to to-violet-600 px-6 py-4 flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-lg font-bold text-white">Select Student</h2>
            </div>
            <div className="p-6">
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                disabled={!selectedClass}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
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
        </div>

        {/* =========== =========== Marks Entry Section =========== =========== */}
        {selectedStudent && subjects.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-indigo-500 to-blue-600 px-6 py-4 flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <ClipboardList className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-white">Enter Marks</h2>
            </div>

            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Obtained Marks
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Total Marks
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Percentage
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {subjects.map((subject, index) => {
                      const obtained = parseFloat(marksData[subject._id]?.marksObtained) || 0;
                      const total = parseFloat(marksData[subject._id]?.totalMarks) || 0;
                      const percentage = total > 0 ? ((obtained / total) * 100).toFixed(2) : 0;

                      return (
                        <tr key={subject._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                {index + 1}
                              </div>
                              <span className="text-sm font-semibold text-gray-900">
                                {subject.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={marksData[subject._id]?.marksObtained || ''}
                              onChange={(e) => handleMarksChange(subject._id, 'marksObtained', e.target.value)}
                              placeholder="0"
                              className="w-full p-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={marksData[subject._id]?.totalMarks || ''}
                              onChange={(e) => handleMarksChange(subject._id, 'totalMarks', e.target.value)}
                              placeholder="0"
                              className="w-full p-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                              percentage >= 90 ? 'bg-green-100 text-green-800' :
                              percentage >= 75 ? 'bg-blue-100 text-blue-800' :
                              percentage >= 60 ? 'bg-yellow-100 text-yellow-800' :
                              percentage >= 33 ? 'bg-orange-100 text-orange-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {percentage}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-gray-100 border-t-2 border-gray-300">
                    <tr>
                      <td className="px-6 py-4 text-right font-bold text-gray-900">
                        TOTAL
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-blue-600">
                        {totals.totalObtained}
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-blue-600">
                        {totals.totalMax}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                          totals.percentage >= 90 ? 'bg-green-100 text-green-800' :
                          totals.percentage >= 75 ? 'bg-blue-100 text-blue-800' :
                          totals.percentage >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          totals.percentage >= 33 ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {totals.percentage}%
                        </span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/*=========== ===========  Submit Button =========== ===========  */}
            <div className="px-6 py-5 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={submitting || !selectedExam || !selectedClass || !selectedStudent}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 px-8 rounded-xl transition-all transform hover:scale-105 disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg disabled:shadow-none flex items-center space-x-2"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Submit Result</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {!selectedStudent && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <Award className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Assign Marks</h3>
            <p className="text-gray-600">Select an exam, class, and student to begin entering marks.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignMarks;