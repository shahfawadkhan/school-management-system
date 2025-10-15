import React, { useState, useEffect } from "react";
import { getTeacherById } from "../../api/teacherApi";
import { useSelector } from "react-redux";
import { Mail, Phone, Calendar, MapPin, BookOpen, School, User } from "lucide-react";

const TeacherOverview = () => {
  const { user } = useSelector((state) => state.auth);
  const teacherId = user?.user?.roleDocumentId;

  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacher = async () => {
      if (!teacherId) return;

      try {
        const response = await getTeacherById(teacherId);
        console.log("Teacher API Response:", response);
        setTeacher(response.data || response);
      } catch (error) {
        console.error("Error fetching teacher details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [teacherId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading teacher details...</p>
        </div>
      </div>
    );
  }

  if (!teacher || !teacher.user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-red-600 font-semibold text-lg">No teacher found</p>
          <p className="text-gray-500 mt-2">Unable to load teacher information</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/*================ Header Card ================*/}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-12 text-white">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                <User className="w-10 h-10 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1">{teacher.user.name}</h1>
                <p className="text-blue-100 text-lg">Teacher Profile</p>
              </div>
            </div>
          </div>

          {/*================ Contact Information ================*/}
          <div className="px-8 py-6 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Email</p>
                  <p className="text-gray-800 font-medium">{teacher.user.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Phone</p>
                  <p className="text-gray-800 font-medium">{teacher.mobileNo}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Date of Birth</p>
                  <p className="text-gray-800 font-medium">
                    {new Date(teacher.dob).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Address</p>
                  <p className="text-gray-800 font-medium">{teacher.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/*================ Subjects and Classes Grid ================*/}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="shadow-[0_0_5px_rgba(0,0,0,0.1),0_0_15px_rgba(0,0,0,0.05)] bg-white rounded-2xl overflow-hidden">
            <div className="text-blue px-6 py-4 flex items-center bg-white shadow-sm space-x-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-500" />
              </div>
              <h2 className="text-xl font-bold text-blue-500">Subjects Teaching</h2>
            </div>
            <div className="p-6">
              {teacher.subjects?.length > 0 ? (
                <div className="space-y-3">
                  {teacher.subjects.map((sub, index) => (
                    <div 
                      key={sub._id}
                      className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <span className="text-gray-800 font-medium">{sub.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No subjects assigned yet</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-[0_0_5px_rgba(0,0,0,0.1),0_0_15px_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="px-6 py-4 flex items-center space-x-3 shadow-sm">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <School className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-blue-500">Classes Assigned</h2>
            </div>
            <div className="p-6">
              {teacher.classes?.length > 0 ? (
                <div className="space-y-3">
                  {teacher.classes.map((cls, index) => (
                    <div 
                      key={cls._id}
                      className="flex items-center space-x-3 p-3 bg-blue-50  hover:bg-blue-100 transition-colors"
                    >
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <span className="text-gray-800 font-medium">{cls.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <School className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No classes assigned yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-2xl shadow-xl p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <p className="text-3xl font-bold text-blue-600">{teacher.subjects?.length || 0}</p>
              <p className="text-sm text-gray-600 mt-1">Total Subjects</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
              <p className="text-3xl font-bold text-purple-600">{teacher.classes?.length || 0}</p>
              <p className="text-sm text-gray-600 mt-1">Total Classes</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl">
              <p className="text-3xl font-bold text-emerald-600">Active</p>
              <p className="text-sm text-gray-600 mt-1">Status</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
              <p className="text-3xl font-bold text-orange-600">
                {new Date().getFullYear() - new Date(teacher.dob).getFullYear()}
              </p>
              <p className="text-sm text-gray-600 mt-1">Age</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherOverview;