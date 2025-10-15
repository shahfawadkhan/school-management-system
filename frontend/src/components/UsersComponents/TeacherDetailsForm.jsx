import React, { useState, useEffect } from "react";
import { createTeacher } from "../../api/teacherApi";
import { fetchAllClasses } from "../../api/classApi";
import { getAllSubjects } from "../../api/subjectsApi";

const TeacherDetailsForm = ({ userId, onComplete, onCancel }) => {
  const [teacherData, setTeacherData] = useState({
  user: userId,
  fatherName: "",
  mobileNo: "",    
  dob: "",
  classes: [],     
  subjects: [],
  address: "",
  gender: "",
});


  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const classRes = await fetchAllClasses();
        setClasses(classRes);

        const subjectRes = await getAllSubjects();
        setSubjects(subjectRes);
      } catch (error) {
        console.error("Failed to load data:", error);
        setMessage("Failed to load classes/subjects. Please try again.");
      }
    };

    loadData();
  }, []);

  const handleChange = (e) => {
    setTeacherData({
      ...teacherData,
      [e.target.name]: e.target.value,
    });
  };

  const handleMultiSelectChange = (e) => {
    const { name, options } = e.target;
    const values = Array.from(options).filter((o) => o.selected).map((o) => o.value);

    setTeacherData({
      ...teacherData,
      [name]: values,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createTeacher(teacherData);
      setMessage("Teacher details added successfully!");

      setTimeout(() => {
        onComplete();
      }, 1500);
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        "Failed to create teacher profile.";
      setMessage(errMsg);
      console.error("Teacher creation error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Add Teacher Details</h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      {message && (
        <p
          className={`mb-4 text-sm ${
            message.includes("successfully")
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Father Name *
          </label>
          <input
            type="text"
            name="fatherName"
            value={teacherData.fatherName}
            onChange={handleChange}
            placeholder="Enter Father Name"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mobile Number *
          </label>
          <input
            type="text"
            name="mobileNo"
            value={teacherData.mobileNo}
            onChange={handleChange}
            placeholder="Enter mobile number"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/*===============  Classes (multi-select) =============== */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Classes *
          </label>
          <select
            name="classes"
            multiple
            value={teacherData.class}
            onChange={handleMultiSelectChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
            required
          >
            {classes.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name} - {c.section}
              </option>
            ))}
          </select>
          <small className="text-gray-500">Hold Ctrl (Windows) or Cmd (Mac) to select multiple</small>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subjects *
          </label>
          <select
            name="subjects"
            multiple
            value={teacherData.subjects}
            onChange={handleMultiSelectChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
            required
          >
            {subjects.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
          <small className="text-gray-500">Hold Ctrl (Windows) or Cmd (Mac) to select multiple</small>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth *
          </label>
          <input
            type="date"
            name="dob"
            value={teacherData.dob}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address *
          </label>
          <textarea
            name="address"
            value={teacherData.address}
            onChange={handleChange}
            placeholder="Enter full address"
            rows="3"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender *
          </label>
          <select
            name="gender"
            value={teacherData.gender}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? "Creating Teacher..." : "Create Teacher Profile"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="px-6 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TeacherDetailsForm;
