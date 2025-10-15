import React, { useEffect, useState } from "react";
import { getAllExams, updateExam, deleteExam } from "../../api/examApi";
import { fetchAllClasses } from "../../api/classApi";
import { getAllSubjects } from "../../api/subjectsApi";

const GetAllExams = () => {
  const [exams, setExams] = useState([]);
  const [editingMode, setEditingMode] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [examName, setExamName] = useState("");
  const [examDate, setExamDate] = useState("");
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [allClasses, setAllClasses] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);

  //================= Fetch data  =================
  const loadExams = async () => {
    try {
      const response = await getAllExams();
      setExams([...response]);
    } catch (error) {
      console.log("Error while fetching exams", error);
    }
  };

  const loadClassesAndSubjects = async () => {
    try {
      const classesRes = await fetchAllClasses();
      const subjectsRes = await getAllSubjects();
      setAllClasses(classesRes);
      setAllSubjects(subjectsRes);
    } catch (error) {
      console.log("Error fetching classes/subjects", error);
    }
  };

  useEffect(() => {
    loadExams();
    loadClassesAndSubjects();
  }, []);

  const handleEdit = (exam) => {
    setEditingMode(true);
    setEditingId(exam._id);
    setExamName(exam.name);
    setExamDate(exam.date.split("T")[0]);
    setSelectedClasses(exam.classes.map((cl) => cl._id));
    setSelectedSubjects(exam.subjects.map((sub) => sub._id));
  };

  const handleUpdate = async () => {
    try {
      const updatedData = {
        name: examName,
        classes: selectedClasses,
        subjects: selectedSubjects,
        date: examDate,
      };
      await updateExam(editingId, updatedData);
      setEditingMode(false);
      loadExams();
    } catch (error) {
      console.log("Error updating exam", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteExam(id);
      setExams((prev) => prev.filter((ex) => ex._id !== id));
    } catch (error) {
      console.log("error while deleting exam");
    }
  };

  const toggleClass = (id) => {
    setSelectedClasses((prev) =>
      prev.includes(id) ? prev.filter((cl) => cl !== id) : [...prev, id]
    );
  };

  const toggleSubject = (id) => {
    setSelectedSubjects((prev) =>
      prev.includes(id) ? prev.filter((sb) => sb !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-8 bg-white rounded-2xl shadow-sm">
      <h2 className="text-center text-2xl font-bold text-blue-700 mb-8">
        All Exams
      </h2>
    {/* ================= All Exams Data ================= */}
      <div className="overflow-x-auto rounded-xl shadow-sm border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-blue-50 text-blue-800">
            <tr>
              <th className="p-4 font-semibold border-b">Class</th>
              <th className="p-4 font-semibold border-b">Subjects</th>
              <th className="p-4 font-semibold border-b">Exam Name</th>
              <th className="p-4 font-semibold border-b">Exam Date</th>
              <th className="p-4 font-semibold border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {exams?.map((ex, idx) => (
              <tr
                key={ex._id}
                className={`transition ${
                  idx % 2 === 0 ? "bg-white" : "bg-blue-50/30"
                } hover:bg-blue-50`}
              >
                <td className="p-4 border-b">
                  {ex?.classes?.map((cl) => cl.name).join(", ")}
                </td>
                <td className="p-4 border-b">
                  {ex?.subjects?.map((sub) => sub.name).join(", ")}
                </td>
                <td className="p-4 border-b font-medium text-gray-700">
                  {ex?.name}
                </td>
                <td className="p-4 border-b text-gray-600">
                  {new Date(ex?.date).toLocaleDateString()}
                </td>
                <td className="p-4 border-b text-center">
                  <button
                    onClick={() => handleEdit(ex)}
                    className="px-4 py-2 mr-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(ex._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingMode && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative animate-fadeIn">
            <h3 className="text-2xl font-bold text-blue-700 mb-6 text-center">
              Edit Exam
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Exam Name
                </label>
                <input
                  type="text"
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Exam Date
                </label>
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Select Classes
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {allClasses.map((cl) => (
                    <label key={cl._id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedClasses.includes(cl._id)}
                        onChange={() => toggleClass(cl._id)}
                        className="h-4 w-4 accent-blue-600"
                      />
                      <span>{cl.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Select Subjects
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {allSubjects.map((sb) => (
                    <label key={sb._id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedSubjects.includes(sb._id)}
                        onChange={() => toggleSubject(sb._id)}
                        className="h-4 w-4 accent-blue-600"
                      />
                      <span>{sb.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setEditingMode(false)}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetAllExams;
