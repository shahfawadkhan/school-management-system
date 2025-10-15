import React, { useState } from 'react';
import { Save, X, Edit } from 'lucide-react';
import { updateResult } from '../../api/resultsApi';

const EditResult = ({ result, onClose, onUpdate }) => {
  console.log(result);
  
  //===========> Initialize subjects state from result data
  const [subjects, setSubjects] = useState(
    (result?.subjects || [])
      .filter(sub => sub && sub.subject)
      .map(sub => ({
        subjectId: sub.subject._id,
        subjectName: sub.subject.name,
        marksObtained: sub.marksObtained ?? 0,
        totalMarks: sub.totalMarks ?? 0
      }))
  );

  //===========> State for tracking saving status and error messages
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  //===========> Handle changes in marks input fields
  const handleSubjectChange = (index, field, value) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index] = {
      ...updatedSubjects[index],
      [field]: Number(value) || 0
    };
    setSubjects(updatedSubjects);
    setError('');
  };

  //===========> Validate form before submitting updated result
  const validateForm = () => {
    for (let subject of subjects) {
      if (subject.marksObtained < 0 || subject.totalMarks <= 0) {
        setError(`Please enter valid marks for ${subject.subjectName}`);
        return false;
      }
      if (subject.marksObtained > subject.totalMarks) {
        setError(`Marks obtained cannot be greater than total marks for ${subject.subjectName}`);
        return false;
      }
    }
    return true;
  };

  //===========> Submit updated result to the server
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSaving(true);
      setError('');

      const updateData = {
        subjects: subjects.map(sub => ({
          subjectId: sub.subjectId,
          marksObtained: sub.marksObtained,
          totalMarks: sub.totalMarks
        }))
      };

      await updateResult(result._id, updateData);
      onUpdate?.();
      onClose?.();

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update result');
    } finally {
      setSaving(false);
    }
  };

  //===========> Calculate individual subject percentage
  const calculatePercentage = (obtained, total) => {
    return total > 0 ? ((obtained / total) * 100).toFixed(1) : 0;
  };

  //===========> Calculate total and overall percentage
  const getTotalMarks = () => {
    const obtained = subjects.reduce((sum, s) => sum + s.marksObtained, 0);
    const total = subjects.reduce((sum, s) => sum + s.totalMarks, 0);
    return { obtained, total };
  };

  const { obtained, total } = getTotalMarks();
  const overallPercentage = calculatePercentage(obtained, total);

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      {/*=========== Main container ===========*/}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/*=========== 

        Header section 
        
        ===========*/}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              <h2 className="text-xl font-bold">Edit Marks</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="text-sm text-indigo-100 mt-1">
            {result.student?.user?.name} - {result.student?.rollNumber}
          </p>
        </div>

        {error && (
          <div className="m-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/*=========== Form section ===========*/}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="space-y-3">
            {subjects.map((subject, index) => (
              <div key={subject.subjectId} className="border border-gray-200 rounded-lg p-4">
                
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-800">{subject.subjectName}</h3>
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      calculatePercentage(subject.marksObtained, subject.totalMarks) >= 50
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {calculatePercentage(subject.marksObtained, subject.totalMarks)}%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Marks Obtained
                    </label>
                    <input
                      type="number"
                      value={subject.marksObtained}
                      onChange={(e) => handleSubjectChange(index, 'marksObtained', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      min="0"
                      max={subject.totalMarks}
                      required
                      disabled={saving}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Marks
                    </label>
                    <input
                      type="number"
                      value={subject.totalMarks}
                      onChange={(e) => handleSubjectChange(index, 'totalMarks', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      min="1"
                      required
                      disabled={saving}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/*=========== Overall result ===========summary */}
          {total > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">Overall Result</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-bold text-gray-900">{obtained}/{total}</p>
                  <p className="text-xs text-gray-600">Total Marks</p>
                </div>
                <div>
                  <p className={`text-lg font-bold ${overallPercentage >= 50 ? 'text-green-600' : 'text-red-600'}`}>
                    {overallPercentage}%
                  </p>
                  <p className="text-xs text-gray-600">Percentage</p>
                </div>
                <div>
                  <p className={`text-lg font-bold ${overallPercentage >= 50 ? 'text-green-600' : 'text-red-600'}`}>
                    {overallPercentage >= 50 ? 'PASS' : 'FAIL'}
                  </p>
                  <p className="text-xs text-gray-600">Status</p>
                </div>
              </div>
            </div>
          )}

          {/*=========== Action buttons ===========*/}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditResult;
