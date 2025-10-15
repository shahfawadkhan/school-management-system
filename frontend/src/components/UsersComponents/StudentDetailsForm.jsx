import React, { useState, useEffect } from "react";
import { createStudent } from "../../api/studentApi";
import { fetchAllClasses } from "../../api/classApi";
import { toast } from "react-toastify";

const StudentDetailsForm = ({ userId, onComplete, onCancel }) => {
  const [studentData, setStudentData] = useState({
    user: userId,
    fatherName : "",
    mobileNumber: "",
    class: "",
    address: "",
    gender: "",
  });

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const response = await fetchAllClasses();
        setClasses(response);
      } catch (error) {
        console.error("Failed to load classes:", error);
        setMessage("Failed to load classes. Please try again.");
      }
    };

    loadClasses();
  }, []);

  const handleChange = (e) => {
    setStudentData({
      ...studentData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await createStudent(studentData);
      toast.success('Student details added successfully!')      
      setTimeout(() => {
        onComplete();
      }, 1500);
      
    } catch (error) {
      const errMsg = error.response?.data?.message || "Failed to create student profile.";
      setMessage(errMsg);
      console.error("Student creation error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Add Student Details</h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        User account created successfully! Now please fill in the student-specific details.
      </p>

      {message && (
        <p className={`mb-4 text-sm ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
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
            placeholder="Enter Father Name"
            value={studentData.fatherName}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Roll Number *
          </label>
          <input
            type="text"
            name="rollNumber"
            placeholder="Enter roll number"
            value={studentData.rollNumber}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Class *
          </label>
          <select
            name="class"
            value={studentData.class}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Class</option>
            {classes.map((classItem) => (
              <option key={classItem._id} value={classItem._id}>
                {classItem.name} - {classItem.section}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth *
          </label>
          <input
            type="date"
            name="dob"
            value={studentData.dob}
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
            placeholder="Enter full address"
            value={studentData.address}
            onChange={handleChange}
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
            value={studentData.gender}
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
            {loading ? "Creating Student..." : "Create Student Profile"}
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

export default StudentDetailsForm;