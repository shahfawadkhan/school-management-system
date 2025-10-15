import React, { useState, useEffect } from "react";
import {
  createClass,
  fetchAllClasses,
  deleteClass,
  updateClass,
} from "../../api/classApi";
import { getAllSubjects } from "../../api/subjectsApi";
import { fetchAllTeachers } from "../../api/teacherApi";
import { fetchAllStudents } from "../../slices/studentSlice";
import { useDispatch, useSelector } from "react-redux";

const GetAllClasses = () => {
  const dispatch = useDispatch();
  const { allStudents } = useSelector((state) => state.students);
  const { user } = useSelector((state) => state.auth);

  const [className, setClassName] = useState("");
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);

  // Edit states
  const [editId, setEditId] = useState("");
  const [editingMode, setEditingMode] = useState(false);
  const [editClassName, setEditClassName] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedTeachers, setSelectedTeachers] = useState([]);

  // Handle edit
  const handleUpdate = (id) => {
    const classToEdit = classes.find((cls) => cls._id === id);
    if (classToEdit) {
      setEditId(id);
      setEditClassName(classToEdit.name);
      setSelectedStudents(classToEdit.students.map((s) => s._id));
      setSelectedSubjects(classToEdit.subjects?.map((s) => s._id) || []);
      setSelectedTeachers(classToEdit.teachers.map((t) => t._id));
      setEditingMode(true);
    }
  };

  const handleCancelEdit = () => {
    setEditingMode(false);
    setEditId("");
    setEditClassName("");
    setSelectedStudents([]);
    setSelectedSubjects([]);
    setSelectedTeachers([]);
  };

  const handleSaveEdit = async () => {
    try {
      await updateClass(editId, {
        name: editClassName,
        students: selectedStudents,
        subjects: selectedSubjects,
        teachers: selectedTeachers,
      });
      handleCancelEdit();
      loadClasses();
      window.alert("Class updated successfully!");
    } catch (error) {
      console.error("Error updating class:", error);
      window.alert("Error updating class. Please try again.");
    }
  };

  const handleMultiSelect = (value, selectedItems, setSelectedItems) => {
    setSelectedItems(
      selectedItems.includes(value)
        ? selectedItems.filter((item) => item !== value)
        : [...selectedItems, value]
    );
  };

  const handleSubmit = async () => {
    if (!className.trim()) return;
    await createClass(className);
    setClassName("");
    loadClasses();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      await deleteClass(id);
      window.alert("Class deleted successfully");
      loadClasses();
    }
  };

  const loadClasses = async () => {
    try {
      const response = await fetchAllClasses();
      setClasses(response);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setTeachers(await fetchAllTeachers());
        setSubjects(await getAllSubjects());
        await loadClasses();
        dispatch(fetchAllStudents());
      } catch (error) {
        console.error(error);
      }
    })();
  }, [dispatch]);

  return (
    <div className="p-2 min-h-screen font-sans">
      <div className="max-w-4xl mx-auto mb-10">
        <h1 className="text-3xl h-[70px] rounded-2xl flex justify-center items-center font-bold bg-blue-600 text-white mb-6 text-center">
          Manage Classes
        </h1>
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-5 rounded-2xl shadow-lg">
          <input
            type="text"
            placeholder="Enter Class Name"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-md"
          >
            + Create Class
          </button>
        </div>
      </div>


      <div className="max-w-5xl mx-auto">

        {/* ================= All Classes Details ================= */}
        <ul className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {classes.map((cls) => (
            <li
              key={cls._id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200 flex flex-col justify-between min-h-[260px]"
            >
              <h2 className="text-xl font-semibold text-blue-700 mb-3 bg-blue-50 w-full p-2 ">
                {cls.name}
              </h2>
              <p className="text-gray-600 mb-1">
                <span className="font-medium text-gray-700">Students:</span>{" "}
                {cls.students?.length || 0}
              </p>
              <p className="text-gray-600 mb-1">
                <span className="font-medium text-gray-700">Teachers:</span>{" "}
                {cls.teachers?.length
                  ? cls.teachers
                      .map((t) => t?.user?.name || t?.name)
                      .join(", ")
                  : "No teachers assigned"}
              </p>
              <p className="text-gray-600 mb-4">
                <span className="font-medium text-gray-700">Subjects:</span>{" "}
                {cls.subjects?.length
                  ? cls.subjects.map((s) => s?.name).join(", ")
                  : "No subjects assigned"}
              </p>

              {user?.user?.role === "admin" && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleDelete(cls._id)}
                    className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleUpdate(cls._id)}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Edit
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {editingMode && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-between z-50 p-6">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl h-[92vh] overflow-y-auto shadow-2xl mb-4">
            <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
              Edit Class
            </h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class Name
              </label>
              <input
                type="text"
                value={editClassName}
                onChange={(e) => setEditClassName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            {/*================= Students Selection =================*/}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Students ({selectedStudents.length} selected)
              </label>
              <div className="border border-gray-200 rounded-lg p-4 max-h-48 overflow-y-auto bg-gray-50">
                {allStudents?.map((student) => (
                  <div key={student._id} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student._id)}
                      onChange={() =>
                        handleMultiSelect(
                          student._id,
                          selectedStudents,
                          setSelectedStudents
                        )
                      }
                      className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label className="ml-3 text-gray-700 cursor-pointer">
                      {student.user?.name || student.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/*================= Subjects Selection =================*/}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Subjects ({selectedSubjects.length} selected)
              </label>
              <div className="border border-gray-200 rounded-lg p-4 max-h-48 overflow-y-auto bg-gray-50">
                {subjects?.map((subject) => (
                  <div key={subject._id} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={selectedSubjects.includes(subject._id)}
                      onChange={() =>
                        handleMultiSelect(
                          subject._id,
                          selectedSubjects,
                          setSelectedSubjects
                        )
                      }
                      className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label className="ml-3 text-gray-700 cursor-pointer">
                      {subject.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/*================= Teachers Selection =================*/}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Teachers ({selectedTeachers.length} selected)
              </label>
              <div className="border border-gray-200 rounded-lg p-4 max-h-48 overflow-y-auto bg-gray-50">
                {teachers?.map((teacher) => (
                  <div key={teacher._id} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={selectedTeachers.includes(teacher._id)}
                      onChange={() =>
                        handleMultiSelect(
                          teacher._id,
                          selectedTeachers,
                          setSelectedTeachers
                        )
                      }
                      className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label className="ml-3 text-gray-700 cursor-pointer">
                      {teacher.user?.name || teacher.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/*================= Action Buttons =================*/}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleCancelEdit}
                className="px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
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

export default GetAllClasses;
