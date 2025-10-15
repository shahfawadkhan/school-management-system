import React, { useEffect, useState } from 'react';
import { getClassByStudentOrTeacherId } from '../../api/classApi';
import { useSelector } from 'react-redux';
import { Users, BookOpen, GraduationCap, Calendar, Mail, User } from 'lucide-react';

const MyClassOverview = () => {
  const { user } = useSelector((state) => state.auth);
  const role = user?.user?.role;
  const userId = user?.user?.roleDocumentId;

  const [myClass, setMyClass] = useState(null);
  const [loading, setLoading] = useState(true);

  // ============================
  // Fetch class details based on student/teacher ID
  // ============================
  const fetchMyClass = async () => {
    if (!userId || !role) return;
    try {
      setLoading(true);
      const response = await getClassByStudentOrTeacherId(userId, role);
      setMyClass(response.classes[0] || null);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // Fetch class when user data or role changes
  // ============================
  useEffect(() => {
    fetchMyClass();
  }, [userId, role]);

  // ============================
  // Loading state UI
  // ============================
  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading class details...</p>
        </div>
      </div>
    );
  }

  // ============================
  // Empty state (no class found)
  // ============================
  if (!myClass) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center bg-white p-12 rounded-2xl shadow-xl">
          <GraduationCap className="w-20 h-20 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-xl">Class details not found</p>
          <p className="text-gray-500 text-sm mt-2">You haven't been assigned to any class yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 md:px-8">
      {/* ============================
          Page Header
      ============================ */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-2">
          <GraduationCap className="w-10 h-10 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-800">My Class Overview</h1>
        </div>
        <p className="text-gray-600 ml-13">Your classroom information and details</p>
      </div>

      {/* ============================
          Class Name Banner
      ============================ */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-2">Class Name</p>
              <h2 className="text-4xl font-bold">{myClass.name}</h2>
            </div>
            <Users className="w-20 h-20 text-white opacity-20" />
          </div>
        </div>
      </div>

      {/* ============================
          Class Stats Cards
      ============================ */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Students */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Students</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">{myClass.students?.length || 0}</p>
            </div>
            <Users className="w-12 h-12 text-blue-500 opacity-20" />
          </div>
        </div>

        {/* Total Subjects */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Subjects</p>
              <p className="text-3xl font-bold text-indigo-600 mt-1">{myClass.subjects?.length || 0}</p>
            </div>
            <BookOpen className="w-12 h-12 text-indigo-500 opacity-20" />
          </div>
        </div>

        {/* Total Teachers */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Teachers</p>
              <p className="text-3xl font-bold text-purple-600 mt-1">{myClass.teachers?.length || 0}</p>
            </div>
            <GraduationCap className="w-12 h-12 text-purple-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* ============================
          Detailed Information Cards
      ============================ */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Teachers Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <GraduationCap className="w-6 h-6 text-blue-600" />
            <h3 className="text-2xl font-bold text-gray-800">Class Teachers</h3>
          </div>

          {/* List of Teachers */}
          {myClass.teachers && myClass.teachers.length > 0 ? (
            <div className="space-y-4">
              {myClass.teachers.map((teacher) => (
                <div
                  key={teacher._id}
                  className="bg-blue-50 rounded-xl p-5 border-2 border-blue-100 hover:border-blue-300 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-200 rounded-full p-3">
                      <User className="w-6 h-6 text-blue-700" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 text-lg mb-1">
                        {teacher.user?.name || 'N/A'}
                      </p>
                      {teacher.user?.email && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span className="text-sm">{teacher.user.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No teachers assigned yet</p>
            </div>
          )}
        </div>

        {/* Subjects Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            <h3 className="text-2xl font-bold text-gray-800">Subjects</h3>
          </div>

          {/* List of Subjects */}
          {myClass.subjects && myClass.subjects.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {myClass.subjects.map((subject, index) => (
                <div
                  key={subject._id || index}
                  className="bg-indigo-50 rounded-xl p-4 border-2 border-indigo-100 hover:border-indigo-300 transition-all flex items-center gap-3"
                >
                  <div className="bg-indigo-200 rounded-full p-2">
                    <BookOpen className="w-5 h-5 text-indigo-700" />
                  </div>
                  <p className="font-semibold text-gray-800">{subject.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No subjects assigned yet</p>
            </div>
          )}
        </div>
      </div>

      {/* ============================
          Class Information Section
      ============================ */}
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-6 h-6 text-blue-600" />
          <h3 className="text-2xl font-bold text-gray-800">Class Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Created At */}
          <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-200 rounded-full p-2">
                <Calendar className="w-5 h-5 text-blue-700" />
              </div>
              <h4 className="font-bold text-gray-800">Created At</h4>
            </div>
            <p className="text-gray-700 text-lg ml-11">
              {new Date(myClass.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          {/* Last Updated */}
          <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-200 rounded-full p-2">
                <Calendar className="w-5 h-5 text-blue-700" />
              </div>
              <h4 className="font-bold text-gray-800">Last Updated</h4>
            </div>
            <p className="text-gray-700 text-lg ml-11">
              {new Date(myClass.updatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* ============================
          Summary Footer Section
      ============================ */}
      <div className="max-w-7xl mx-auto mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-8 text-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-blue-100 text-sm mb-2">Class Strength</p>
            <p className="text-4xl font-bold">{myClass.students?.length || 0} Students</p>
          </div>

          <div>
            <p className="text-blue-100 text-sm mb-2">Academic Coverage</p>
            <p className="text-4xl font-bold">{myClass.subjects?.length || 0} Subjects</p>
          </div>

          <div>
            <p className="text-blue-100 text-sm mb-2">Teaching Staff</p>
            <p className="text-4xl font-bold">{myClass.teachers?.length || 0} Teachers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyClassOverview;
