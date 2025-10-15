import React, { useEffect, useState } from "react";
import { createResult } from "../../api/resultsApi";
import { getAllExams } from "../../api/examApi";
import { fetchAllClasses } from "../../api/classApi";

const ResultDetails = () => {

  // ---------------------------------------------
  // State Management
  // ---------------------------------------------
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [subjects, setSubjects] = useState([]);

  // ---------------------------------------------
  // Load Exams from API
  // ---------------------------------------------
  const loadExams = async () => {
    try {
      const response = await getAllExams();
      setExams(response);
    } catch (error) {
      console.error("Error fetching exams:", error);
    }
  };

  // ---------------------------------------------
  // Load Classes from API
  // ---------------------------------------------
  const loadClasses = async () => {
    try {
      const response = await fetchAllClasses();
      setClasses(response);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  // ---------------------------------------------
  // Initial Data Load on Component Mount
  // ---------------------------------------------
  useEffect(() => {
    loadExams();
    loadClasses();
  }, []);

  // ---------------------------------------------
  // Update Students when a Class is selected
  // ---------------------------------------------
  useEffect(() => {
    if (selectedClass) setStudents(selectedClass.students || []);
    else setStudents([]);
  }, [selectedClass]);

  // ---------------------------------------------
  // Set Subjects when Exam or Student changes
  // ---------------------------------------------
  useEffect(() => {
    if (selectedExam && selectedExam.subjects?.length > 0) {
      setSubjects(
        selectedExam.subjects.map((subj) => ({
          subject: subj._id,
          marksObtained: "",
          totalMarks: ""
        }))
      );
    }
  }, [selectedStudent, selectedExam]);

  // ---------------------------------------------
  // Handle Input Change for Marks
  // ---------------------------------------------
  const handleMarksChange = (index, field, value) => {
    const updated = [...subjects];
    updated[index][field] = value;
    setSubjects(updated);
  };

  // ---------------------------------------------
  // Submit Result Data to Server
  // ---------------------------------------------
  const handleSubmit = async () => {
    if (!selectedStudent || !selectedExam) return alert("Select all fields");

    try {
      await createResult({
        student: selectedStudent._id,
        exam: selectedExam._id,
        class: selectedClass._id,
        subjects
      });
      alert("Result created successfully!");
      setSelectedStudent(null);
      setSubjects([]);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error creating result");
    }
  };

  // ---------------------------------------------
  // UI Rendering
  // ---------------------------------------------
  return (
    <div className="p-6 space-y-6 bg-white rounded-2xl">

      {/*========== Exam Selection ==========*/}
      <div>
        <label className="block mb-2 font-medium">Select Exam:</label>
        <select
          className="border rounded px-3 py-2 w-full"
          value={selectedExam?._id || ""}
          onChange={(e) =>
            setSelectedExam(exams.find((ex) => ex._id === e.target.value))
          }
        >
          <option value="">-- Select Exam --</option>
          {exams.map((ex) => (
            <option key={ex._id} value={ex._id}>
              {ex.name}
            </option>
          ))}
        </select>
      </div>

      {/*========== Class Selection ==========*/}

      {selectedExam && (
        <div>
          <label className="block mb-2 font-medium mt-4">Select Class:</label>
          <select
            className="border rounded px-3 py-2 w-full"
            value={selectedClass?._id || ""}
            onChange={(e) =>
              setSelectedClass(classes.find((cl) => cl._id === e.target.value))
            }
          >
            <option value="">-- Select Class --</option>
            {classes.map((cl) => (
              <option key={cl._id} value={cl._id}>
                {cl.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/*========== Student Selection ==========*/}
      {selectedClass && students.length > 0 && (
        <div>
          <label className="block mb-2 font-medium mt-4">Select Student:</label>
          <select
            className="border rounded px-3 py-2 w-full bg-white"
            value={selectedStudent?._id || ""}
            onChange={(e) =>
              setSelectedStudent(
                students.find((stu) => stu._id === e.target.value)
              )
            }
          >
            <option value="">-- Select Student --</option>
            {students.map((stu) => (
              <option key={stu._id} value={stu._id}>
                {stu.user.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/*=========== Subject Marks Table ==========*/}
      {selectedStudent && subjects.length > 0 && (
        <div className="mt-6 bg-white p-4 rounded-2xl shadow-2xl">
          <h3 className="text-lg font-semibold mb-4">
            Enter Marks for {selectedStudent.user.name}
          </h3>

          <div className="overflow-x-auto">
            <table className="table-auto border-collapse border border-gray-300 w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">Subject</th>
                  <th className="border border-gray-300 px-4 py-2">Marks Obtained</th>
                  <th className="border border-gray-300 px-4 py-2">Total Marks</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subj, index) => {
                  const subjectName =
                    selectedExam.subjects.find((s) => s._id === subj.subject)?.name ||
                    "";
                  return (
                    <tr key={subj.subject}>
                      <td className="border border-gray-300 px-4 py-2">{subjectName}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="number"
                          className="border rounded px-2 py-1 w-full"
                          value={subj.marksObtained}
                          onChange={(e) =>
                            handleMarksChange(index, "marksObtained", e.target.value)
                          }
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="number"
                          className="border rounded px-2 py-1 w-full"
                          value={subj.totalMarks}
                          onChange={(e) =>
                            handleMarksChange(index, "totalMarks", e.target.value)
                          }
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleSubmit}
          >
            Submit Result
          </button>
        </div>
      )}
    </div>
  );
};

export default ResultDetails;
