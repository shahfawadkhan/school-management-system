import React, { useState, useEffect } from "react";
import {
  fetchAllTeachers,
  updateTeacher,
  deleteTeacher,
} from "../../api/teacherApi";

import {
  FaEdit,
  FaEye,
  FaTimes,
  FaUserGraduate,
  FaPhone,
  FaMapMarkerAlt,
  FaVenusMars,
  FaBirthdayCake,
  FaUser,
  FaBook,
  FaChalkboardTeacher,
  FaTrash,
} from "react-icons/fa";

const GetAllTeachers = () => {
  const [allTeachers, setAllTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewingTeacher, setViewingTeacher] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});

  const handleDeleteTeacher = async (id) => {
    try {
      await deleteTeacher(id);
      setAllTeachers((prev) => prev.filter((t) => t._id !== id));
      console.log("Teacher deleted Successfully");
    } catch (error) {
      console.log(`error while deleting teacher`, error);
    }
  };

  const loadTeachers = async () => {
    try {
      setLoading(true);
      const res = await fetchAllTeachers();
      setAllTeachers(res);
    } catch (err) {
      setError(
        err?.response?.data?.message || err.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  const handleViewDetails = (teacher) => {
    setViewingTeacher(teacher);
  };

  const handleEdit = (id) => {
    setEditingId(id);
    const teacherToEdit = allTeachers.find((t) => t._id === id);
    if (teacherToEdit) {
      setFormData({
        mobileNo: teacherToEdit.mobileNo || "",
        address: teacherToEdit.address || "",
        gender: teacherToEdit.gender || "",
        dob: teacherToEdit.dob
          ? new Date(teacherToEdit.dob).toISOString().split("T")[0]
          : "",
        fatherName: teacherToEdit.fatherName || "",
        classes: teacherToEdit.classes?.map((c) => c._id) || [],
        subjects: teacherToEdit.subjects?.map((s) => s._id) || [],
      });
    }
    setShowModal(true);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      if (!editingId) return;
      const updated = await updateTeacher(editingId, formData);

      setAllTeachers((prev) =>
        prev.map((t) => (t._id === editingId ? updated : t))
      );

      setShowModal(false);
      setEditingId(null);
    } catch (err) {
      console.error("Update failed:", err);
      alert(err?.response?.data?.message || "Failed to update teacher");
    }
  };

  return (
    <div className="h-[100vh]  p-2">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 bg-blue-600 p-4 rounded">
          <h1 className="text-4xl font-bold text-white flex items-center gap-3">
            <FaUserGraduate className="text-white" />
            Teachers Directory
          </h1>
          <p className="text-white mt-1">
            Manage and view all registered teachers
          </p>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allTeachers.length === 0 && (
              <div className="col-span-full text-center py-12">
                <FaUserGraduate className="text-6xl text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-lg">No teachers found</p>
              </div>
            )}

            {allTeachers.map((teacher) => (
              <div
                key={teacher._id}
                className="shadow-[0_0_8px_rgba(0,0,0,0.3)] bg-white rounded-2xl  hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-3 rounded-full">
                      <FaUserGraduate className="text-2xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {teacher.user?.name || "No Name"}
                      </h3>
                      <p className="text-blue-100 text-sm">
                        {teacher.user?.email || "No email"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-gray-700">
                    <FaPhone className="text-blue-500" />
                    <span className="text-sm">{teacher.mobileNo || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <FaMapMarkerAlt className="text-blue-500" />
                    <span className="text-sm truncate">
                      {teacher.address || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <FaBook className="text-blue-500" />
                    <span className="text-sm">
                      {teacher.subjects?.length || 0} Subjects
                    </span>
                  </div>

                  <div className="flex justify-between gap-3 pt-5">
                    <button
                      onClick={() => handleViewDetails(teacher)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-1 font-medium"
                    >
                      <FaEye />
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(teacher._id)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-1 font-medium"
                    >
                      <FaEdit />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTeacher(teacher._id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-1 font-medium"
                    >
                      <FaTrash />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {viewingTeacher && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-blue-100">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white sticky top-0">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-1">
                    {viewingTeacher.user?.name || "Teacher Details"}
                  </h2>
                  <p className="text-blue-100">{viewingTeacher.user?.email}</p>
                </div>
                <button
                  onClick={() => setViewingTeacher(null)}
                  className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
                >
                  <FaTimes className="text-lg" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    icon: <FaPhone className="text-blue-500" />,
                    label: "Phone",
                    value: viewingTeacher.mobileNo || "N/A",
                  },
                  {
                    icon: <FaVenusMars className="text-blue-500" />,
                    label: "Gender",
                    value: viewingTeacher.gender || "N/A",
                  },
                  {
                    icon: <FaBirthdayCake className="text-blue-500" />,
                    label: "Date of Birth",
                    value: viewingTeacher.dob
                      ? new Date(viewingTeacher.dob).toLocaleDateString()
                      : "N/A",
                  },
                  {
                    icon: <FaUser className="text-blue-500" />,
                    label: "Father's Name",
                    value: viewingTeacher.fatherName || "N/A",
                  },
                ].map((item, i) => (
                  <div key={i} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      {item.icon}
                      <span className="font-semibold text-gray-700">
                        {item.label}
                      </span>
                    </div>
                    <p className="text-gray-800">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <FaMapMarkerAlt className="text-blue-500" />
                  <span className="font-semibold text-gray-700">Address</span>
                </div>
                <p className="text-gray-800">{viewingTeacher.address || "N/A"}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <FaChalkboardTeacher className="text-blue-500" />
                  <span className="font-semibold text-gray-700">Classes</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {viewingTeacher.classes?.length > 0 ? (
                    viewingTeacher.classes.map((c) => (
                      <span
                        key={c._id}
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {c.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">No classes assigned</span>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <FaBook className="text-blue-500" />
                  <span className="font-semibold text-gray-700">Subjects</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {viewingTeacher.subjects?.length > 0 ? (
                    viewingTeacher.subjects.map((s) => (
                      <span
                        key={s._id}
                        className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {s.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">No subjects assigned</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-blue-100">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white sticky top-0">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Edit Teacher</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-white/20 hover:bg-white/30 p-2 rounded-full"
                >
                  <FaTimes className="text-lg" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {[
                { label: "Mobile Number", name: "mobileNo", type: "text" },
                { label: "Address", name: "address", type: "text" },
                { label: "Date of Birth", name: "dob", type: "date" },
                { label: "Father's Name", name: "fatherName", type: "text" },
              ].map((field, i) => (
                <div key={i}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition-all"
                  />
                </div>
              ))}

=              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Gender
                </label>
                <div className="flex gap-6">
                  {["Male", "Female", "Other"].map((g) => (
                    <label
                      key={g}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={formData.gender === g}
                        onChange={handleChange}
                        className="w-4 h-4 text-green-500 cursor-pointer"
                      />
                      <span className="text-gray-700">{g}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetAllTeachers;
