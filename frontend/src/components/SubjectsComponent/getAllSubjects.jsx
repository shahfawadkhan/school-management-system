import React, { useEffect, useState } from "react";
import {
  getAllSubjects,
  createSubject,
  deletSubject,
} from "../../api/subjectsApi";
import {
  FiBookOpen,
  FiUsers,
  FiGrid,
  FiPlus,
  FiTrash2,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

const SubjectsList = () => {
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      const response = await getAllSubjects();
      setSubjects(response || []);
      setError("");
    } catch (error) {
      setError(error?.response?.data?.message || "Error fetching subjects");
      setMessageType("error");
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectSubmit = async () => {
    try {
      if (!newSubject.trim()) {
        setError("Please enter a subject name");
        setMessageType("error");
        setTimeout(() => setError(""), 3000);
        return;
      }

      setCreating(true);
      const response = await createSubject({ name: newSubject });
      setMessage(response?.data?.message || "Subject created successfully");
      setMessageType("success");
      setNewSubject("");
      await loadSubjects();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setError(error?.response?.data?.message || "Error while creating subject");
      setMessageType("error");
      setTimeout(() => setError(""), 3000);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      const response = await deletSubject(id);
      setMessage(response?.data?.message || "Subject deleted successfully");
      setMessageType("success");
      await loadSubjects();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setError(error?.response?.data?.message || "Error while deleting subject");
      setMessageType("error");
      setTimeout(() => setError(""), 3000);
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  return (
    <div className="min-h-screen py-2 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-white flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <FiBookOpen className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-wide">
                Subjects Management
              </h1>
              <p className="text-blue-100 text-sm">
                Create and manage all subjects easily
              </p>
            </div>
          </div>

          {(error || message) && (
            <div
              className={`px-8 py-4 border-t ${
                messageType === "error"
                  ? "bg-red-50 border-red-200"
                  : "bg-green-50 border-green-200"
              }`}
            >
              <div className="flex items-center space-x-2">
                {messageType === "error" ? (
                  <FiAlertCircle className="w-5 h-5 text-red-600" />
                ) : (
                  <FiCheckCircle className="w-5 h-5 text-green-600" />
                )}
                <p
                  className={`text-sm font-medium ${
                    messageType === "error"
                      ? "text-red-700"
                      : "text-green-700"
                  }`}
                >
                  {error || message}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-blue-600 px-6 py-4 flex items-center space-x-2">
            <FiPlus className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">Create New Subject</h2>
          </div>
          <div className="p-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FiBookOpen className="absolute left-4 top-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Enter subject name (e.g., Mathematics)"
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && handleSubjectSubmit()
                }
              />
            </div>
            <button
              onClick={handleSubjectSubmit}
              disabled={creating}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.03] disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {creating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <FiPlus className="w-4 h-4" />
                  <span>Create Subject</span>
                </>
              )}
            </button>
          </div>
        </div>

        {loading && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading subjects...</p>
          </div>
        )}

        {!loading && subjects?.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <FiBookOpen className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Subjects Found
            </h3>
            <p className="text-gray-600">
              Start by creating a new subject above!
            </p>
          </div>
        )}

        {!loading && subjects?.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => (
              <div
                key={subject?._id}
                className="bg-white rounded-2xl shadow-2xl hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col"
              >
                <div className=" px-6 py-4 rounded-t-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10  bg-white/20 rounded-lg flex items-center justify-center">
                      <FiBookOpen className="w-5 h-5  text-blue-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-blue-600">
                      {subject?.name || "Unnamed Subject"}
                    </h2>
                  </div>
                </div>

                <div className="px-6 py-5 bg-blue-50 border-t border-gray-100 flex-1">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FiUsers className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Teachers</p>
                        <p className="text-lg font-bold text-gray-900">
                          {subject?.teachers?.length || 0}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <FiGrid className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Classes</p>
                        <p className="text-lg font-bold text-gray-900">
                          {subject?.classes?.length || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <FiUsers className="w-4 h-4 text-blue-600" />
                      <span>Teachers</span>
                    </h3>
                    {subject?.teachers?.length > 0 ? (
                      <ul className="space-y-1">
                        {subject?.teachers.map((teacher, i) => (
                          <li
                            key={i}
                            className="text-sm text-gray-700 flex items-center gap-2"
                          >
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                            <span>
                              {teacher?.user?.name || "Unnamed Teacher"}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500 italic">
                        No teachers assigned
                      </p>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <FiGrid className="w-4 h-4 text-purple-600" />
                      <span>Classes</span>
                    </h3>
                    {subject?.classes?.length > 0 ? (
                      <ul className="space-y-1">
                        {subject?.classes.map((cls, i) => (
                          <li
                            key={i}
                            className="text-sm text-gray-700 flex items-center gap-2"
                          >
                            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                            <span>{cls?.name || "Unnamed Class"}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500 italic">
                        No classes assigned
                      </p>
                    )}
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-100">
                  <button
                    onClick={() => handleDelete(subject?._id)}
                    disabled={deletingId === subject?._id}
                    className="w-full px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold rounded-xl transition-all transform hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-red-500 shadow-md flex items-center justify-center gap-2"
                  >
                        <FiTrash2 className="w-4 h-4" />
                        <span>Delete Subject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectsList;
