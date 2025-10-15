import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllStudents } from "../../slices/studentSlice";
import { deleteStudent, updateStudent } from "../../api/studentApi";
import { fetchAllClasses } from "../../api/classApi";
import {
  FaUser,
  FaEnvelope,
  FaIdCard,
  FaBirthdayCake,
  FaHome,
  FaChalkboardTeacher,
  FaTrash,
  FaEdit,
} from "react-icons/fa";

const GetAllStudents = () => {
  const dispatch = useDispatch();
  const { allStudents, error, loading } = useSelector((state) => state.students);

  const [allClasses, setAllClasses] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    rollNumber: "",
    dob: "",
    classId: "",
    address: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  // ================= Helper Function to Format Date =================
  const formatDate = (dob) => {
    if (!dob) return "";
    return new Date(dob).toISOString().split("T")[0];
  };

  // ================= Handle Delete Student =================
  const handleDelete = async (id) => {
    try {
      await deleteStudent(id);
      setMessage("✅ Student deleted successfully");
      dispatch(fetchAllStudents());
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error while deleting student:", error);
      setMessage(error.response?.data?.message || "Error while deleting student");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // ================= Handle Edit Student =================
  const handleEdit = (student) => {
    setEditingId(student._id);
    setFormData({
      name: student.user?.name || "",
      fatherName: student.fatherName || "",
      rollNumber: student.rollNumber || "",
      dob: formatDate(student.dob) || "",
      classId: student.class?._id || "",
      address: student.address || "",
    });
    setShowModal(true);
  };

  // ================= Handle Update Student =================
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateStudent(editingId, formData);
      setMessage("✅ Student updated successfully");
      setEditingId(null);
      setShowModal(false);
      setFormData({
        name: "",
        fatherName: "",
        rollNumber: "",
        dob: "",
        classId: "",
        address: "",
      });
      dispatch(fetchAllStudents());
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error while updating student:", error);
      setMessage(error.response?.data?.message || "Error while updating student");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // ================= Fetch All Students and Classes on Mount =================
  useEffect(() => {
    dispatch(fetchAllStudents());
    fetchAllClasses().then((res) => setAllClasses(res || []));
  }, [dispatch]);

  return (
    <div className="p-6 min-h-screen font-sans">
      
      {/* ================= Header Section ================= */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-5 px-6 rounded-2xl shadow-lg mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-wide">Students 🎓</h1>
      </div>

      <div className="max-w-6xl mx-auto">
        
        {/* ================= Status Messages ================= */}
        {(error || message) && (
          <div className="mb-6 text-center">
            {error && <p className="text-red-600 font-medium">{error}</p>}
            {message && <p className="text-green-600 font-medium">{message}</p>}
          </div>
        )}

        {/* ================= Loading Spinner ================= */}
        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-600"></div>
          </div>
        )}

        {/* ================= No Students Found ================= */}
        {!loading && allStudents?.length === 0 && (
          <div className="text-center text-gray-500 py-10 text-lg">
            No students found.
          </div>
        )}

        {/* ================= Students Grid ================= */}
        {!loading && allStudents?.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {allStudents.map((student) => (
              <div
                key={student._id}
                className="shadow-[0_0_8px_rgba(0,0,0,0.3)] bg-white border border-blue-100 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-5 flex flex-col"
              >
                {/* ================= Student Info ================= */}
                <div className="space-y-2 flex-grow">
                  <p className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                    <FaUser className="text-blue-600" />
                    {student.user?.name || "Unnamed Student"}
                  </p>
                  <p className="flex items-center gap-2 text-gray-600">
                    <FaIdCard className="text-blue-500" />
                    Roll No: {student.rollNumber || "N/A"}
                  </p>
                  <p className="flex items-center gap-2 text-gray-600">
                    <FaUser className="text-blue-500" />
                    Father: {student.fatherName || "N/A"}
                  </p>
                  <p className="flex items-center gap-2 text-gray-600">
                    <FaChalkboardTeacher className="text-blue-500" />
                    Class: {student.class?.name || "N/A"}
                  </p>
                  <p className="flex items-center gap-2 text-gray-600 break-words">
                    <FaEnvelope className="text-blue-500" />
                    {student.user?.email || "N/A"}
                  </p>
                  <p className="flex items-center gap-2 text-gray-600">
                    <FaBirthdayCake className="text-blue-500" />
                    DOB: {formatDate(student.dob)}
                  </p>
                  <p className="flex items-center gap-2 text-gray-600">
                    <FaHome className="text-blue-500" />
                    {student.address || "N/A"}
                  </p>
                </div>

                {/* ================= Action Buttons ================= */}
                <div className="flex justify-end gap-3 mt-5">
                  <button
                    onClick={() => handleDelete(student._id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg shadow hover:bg-red-600 transition"
                  >
                    <FaTrash /> Delete
                  </button>
                  <button
                    onClick={() => handleEdit(student)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow hover:bg-blue-700 transition"
                  >
                    <FaEdit /> Update
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= Update Modal ================= */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm z-50 p-6">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative animate-fadeIn my-10 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
              Update Student Info
            </h2>

            {/* ================= Update Form ================= */}
            <form className="grid gap-5" onSubmit={handleUpdate}>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Father Name
                </label>
                <input
                  type="text"
                  placeholder="Enter father's name"
                  value={formData.fatherName}
                  onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Roll Number
                </label>
                <input
                  type="text"
                  placeholder="Enter roll number"
                  value={formData.rollNumber}
                  onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Class
                </label>
                <select
                  value={formData.classId}
                  onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Select Class</option>
                  {allClasses.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Address
                </label>
                <input
                  type="text"
                  placeholder="Enter address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* ================= Modal Buttons ================= */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default GetAllStudents;
