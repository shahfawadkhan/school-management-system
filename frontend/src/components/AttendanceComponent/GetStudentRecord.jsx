import React, { useState } from 'react'
import { getStudentRecord } from '../../api/attendenceApi';

const GetStudentRecord = ({ studentId, onclose }) => {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [record, setRecord] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFetchRecord = async () => {
    if (!year || !month) {
      setError("Please enter year and month");
      return;
    }
    try {
      setError('');
      setLoading(true);
      const data = await getStudentRecord(studentId, year, month);
      setRecord(data);
    } catch (err) {
      setError("Failed to fetch record");
    } finally {
      setLoading(false);
    }
  };

  const studentInfo = record.length > 0 ? record[0].student : null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
        <h2 className="text-xl font-bold mb-4">Get Attendance Record</h2>
        <p className="mb-2">Student ID: {studentId}</p>

        <input 
          type="number" 
          placeholder="Enter Year" 
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />

        <input 
          type="number" 
          placeholder="Enter Month (1-12)" 
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />

        {error && <p className="text-red-500">{error}</p>}

        <button 
          onClick={handleFetchRecord} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Loading..." : "Fetch Record"}
        </button>

        {record.length > 0 && (
          <div className="mt-4 border-t pt-2">
            <h3 className="font-semibold mb-2">
              {studentInfo.user?.name} (Roll No: {studentInfo.rollNumber})
            </h3>

            {/*================= Attendance Table of a student =================*/}
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-2 py-1">Date</th>
                  <th className="border px-2 py-1">Status</th>
                </tr>
              </thead>
              <tbody>
                {record.map((rec) => (
                  <tr key={rec._id}>
                    <td className="border px-2 py-1">
                      {new Date(rec.date).toLocaleDateString()}
                    </td>
                    <td className="border px-2 py-1">{rec.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button 
          onClick={onclose} 
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default GetStudentRecord;
