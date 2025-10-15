import React, { useState } from "react";
import { register } from "../../api/authApi";
import StudentDetailsForm from "./StudentDetailsForm";
import TeacherDetailsForm from "./TeacherDetailsForm";
import { FiUserPlus, FiUser, FiMail, FiLock, FiShield, FiCheckCircle, FiAlertCircle, FiChevronDown } from "react-icons/fi";

const AddUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [showTeacherForm, setShowTeacherForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [createdUserId, setCreatedUserId] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage("");
      const res = await register(formData);
      setMessage(res.message || "User added successfully!");
      setMessageType("success");
      console.log(res);
      
      if (formData.role === "student") {
        setCreatedUserId(res.user?._id || res._id); 
        setShowStudentForm(true);
      } else if (formData.role === "teacher"){
        setCreatedUserId(res.user?._id || res._id); 
        setShowTeacherForm(true);
      } else {
        setFormData({
          name: "",
          email: "",
          password: "",
          role: "",
        });
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || "Failed to add user.";
      setMessage(errMsg);
      setMessageType("error");
      console.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentCreationComplete = () => {
    setShowStudentForm(false);
    setShowTeacherForm(false);
    setCreatedUserId(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "",
    });
    if (formData.role === "student") {
      setMessage("Student created successfully with all details!");
      setMessageType("success");
    } else if(formData.role === "teacher"){
      setMessage("Teacher created successfully with all details!");
      setMessageType("success");
    } else {
      setMessage("Admin created successfully with all details!");
      setMessageType("success");
    }
  };

  const handleStudentCreationCancel = () => {
    setShowStudentForm(false);
    setShowTeacherForm(false);
    setCreatedUserId(null);
  };

  if (showStudentForm) {
    return (
      <StudentDetailsForm
        userId={createdUserId}
        onComplete={handleStudentCreationComplete}
        onCancel={handleStudentCreationCancel}
      />
    );
  }

  if (showTeacherForm) {
    return (
      <TeacherDetailsForm
        userId={createdUserId}
        onComplete={handleStudentCreationComplete}
        onCancel={handleStudentCreationCancel}
      />
    );
  }

  return (
    <div className="h-[100vh]  px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-white">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <FiUserPlus className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Add New User</h2>
                <p className="text-blue-100 text-sm">Create a new account for admin, teacher, or student</p>
              </div>
            </div>
          </div>

          {message && (
            <div className={`px-8 py-4 border-b ${
              messageType === "error"
                ? "bg-red-50 border-red-200"
                : "bg-green-50 border-green-200"
            }`}>
              <div className="flex items-center space-x-2">
                {messageType === "error" ? (
                  <FiAlertCircle className="w-5 h-5 text-red-600" />
                ) : (
                  <FiCheckCircle className="w-5 h-5 text-green-600" />
                )}
                <p className={`text-sm font-medium ${
                  messageType === "error" ? "text-red-700" : "text-green-700"
                }`}>
                  {message}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiMail className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="user@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter secure password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">Password must be at least 8 characters</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  User Role
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiShield className="text-gray-400" />
                  </div>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full pl-11 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none bg-white"
                    required
                  >
                    <option value="">Select a role</option>
                    <option value="admin">Admin</option>
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <FiChevronDown className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {formData.role && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-start space-x-3">
                    <FiCheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {formData.role === "admin" && "Admin Account"}
                        {formData.role === "student" && "Student Account - Additional Details Required"}
                        {formData.role === "teacher" && "Teacher Account - Additional Details Required"}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {formData.role === "admin" && "Full system access and management privileges"}
                        {formData.role === "student" && "You'll need to provide class, roll number, and other student details"}
                        {formData.role === "teacher" && "You'll need to assign subjects and classes after creation"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3.5 px-6 rounded-xl transition-all transform hover:scale-105 disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg disabled:shadow-none flex items-center justify-center space-x-2"
              >
               Create User Account
              </button>
            </form>
          </div>
        </div>

        <div className="mt-4  bg-white rounded-xl shadow-md p-4 border border-gray-200">
          <div className="flex items-start space-x-3">
            <FiAlertCircle className="w-5 h-5 text-indigo-600 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Important Note</p>
              <p className="text-xs text-gray-600 mt-1">
                For student and teacher accounts, you'll be prompted to enter additional required information after creating the user account.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUser;