import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiBook, FiUsers, FiAward, FiCalendar, FiTrendingUp, FiCheckCircle, FiArrowRight } from 'react-icons/fi';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const features = [
    {
      icon: FiUsers,
      title: 'User Management',
      description: 'Manage students, teachers, and admin accounts efficiently',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: FiBook,
      title: 'Class Management',
      description: 'Organize classes, subjects, and assign teachers',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      icon: FiCalendar,
      title: 'Attendance Tracking',
      description: 'Mark and monitor student attendance records',
      color: 'from-violet-500 to-purple-600'
    },
    {
      icon: FiAward,
      title: 'Results Management',
      description: 'Create exams and manage student results',
      color: 'from-orange-500 to-red-600'
    },
    {
      icon: FiTrendingUp,
      title: 'Performance Analytics',
      description: 'Track student performance with detailed statistics',
      color: 'from-pink-500 to-rose-600'
    },
    {
      icon: FiCheckCircle,
      title: 'Fee Management',
      description: 'Handle fee records and payment tracking',
      color: 'from-cyan-500 to-blue-600'
    }
  ];

  const stats = [
    { label: 'Students', value: '500+', color: 'text-blue-600' },
    { label: 'Teachers', value: '50+', color: 'text-emerald-600' },
    { label: 'Classes', value: '30+', color: 'text-violet-600' },
    { label: 'Subjects', value: '20+', color: 'text-orange-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/*======== Hero Section ========*/}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {user && (
              <div className="inline-flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-md mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user?.user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-gray-700 font-medium">Welcome back, {user?.user?.name}!</span>
              </div>
            )}

            {/*======== Main Heading ========*/}
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                KHYBER PUBLIC SCHOOL
              </span>
            </h1>
            <p className="text-2xl text-gray-600 font-semibold mb-4">& COLLEGE</p>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Complete School Management System for Modern Education
            </p>

            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-xl transition-all transform hover:scale-105 shadow-xl"
            >
              <span>Go to Dashboard</span>
              <FiArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/*======== Stats ========*/}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-xl p-6 text-center transform hover:scale-105 transition-all">
                <p className={`text-4xl font-bold ${stat.color} mb-2`}>{stat.value}</p>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/*======== Features Section ========*/}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
          <p className="text-xl text-gray-600">Everything you need to manage your school efficiently</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <div className={`bg-gradient-to-r ${feature.color} px-6 py-4`}>
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/*======== Role-Based Quick Actions ========*/}
      {user && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-2">Quick Actions</h2>
              <p className="text-blue-100">Access your most used features quickly</p>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {user?.user?.role === 'admin' && (
                  <>
                    <button
                      onClick={() => navigate('/dashboard/createUser')}
                      className="flex flex-col items-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl hover:shadow-lg transition-all"
                    >
                      <FiUsers className="w-12 h-12 text-blue-600 mb-3" />
                      <span className="text-lg font-semibold text-gray-900">Add User</span>
                    </button>
                    <button
                      onClick={() => navigate('/dashboard/markAttendence')}
                      className="flex flex-col items-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl hover:shadow-lg transition-all"
                    >
                      <FiCalendar className="w-12 h-12 text-emerald-600 mb-3" />
                      <span className="text-lg font-semibold text-gray-900">Mark Attendance</span>
                    </button>
                    <button
                      onClick={() => navigate('/dashboard/create-result')}
                      className="flex flex-col items-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl hover:shadow-lg transition-all"
                    >
                      <FiAward className="w-12 h-12 text-violet-600 mb-3" />
                      <span className="text-lg font-semibold text-gray-900">Create Result</span>
                    </button>
                  </>
                )}

                {user?.user?.role === 'teacher' && (
                  <>
                    <button
                      onClick={() => navigate('/teacherdashboard/mark-attendence')}
                      className="flex flex-col items-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl hover:shadow-lg transition-all"
                    >
                      <FiCheckCircle className="w-12 h-12 text-emerald-600 mb-3" />
                      <span className="text-lg font-semibold text-gray-900">Mark Attendance</span>
                    </button>
                    <button
                      onClick={() => navigate('/teacherdashboard/create-result')}
                      className="flex flex-col items-center p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl hover:shadow-lg transition-all"
                    >
                      <FiAward className="w-12 h-12 text-orange-600 mb-3" />
                      <span className="text-lg font-semibold text-gray-900">Assign Marks</span>
                    </button>
                    <button
                      onClick={() => navigate('/teacherdashboard/student-stats')}
                      className="flex flex-col items-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl hover:shadow-lg transition-all"
                    >
                      <FiTrendingUp className="w-12 h-12 text-blue-600 mb-3" />
                      <span className="text-lg font-semibold text-gray-900">View Statistics</span>
                    </button>
                  </>
                )}

                {user?.user?.role === 'student' && (
                  <>
                    <button
                      onClick={() => navigate('/studentdashboard/attendence')}
                      className="flex flex-col items-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl hover:shadow-lg transition-all"
                    >
                      <FiCalendar className="w-12 h-12 text-emerald-600 mb-3" />
                      <span className="text-lg font-semibold text-gray-900">My Attendance</span>
                    </button>
                    <button
                      onClick={() => navigate('/studentdashboard/exam-results')}
                      className="flex flex-col items-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl hover:shadow-lg transition-all"
                    >
                      <FiAward className="w-12 h-12 text-violet-600 mb-3" />
                      <span className="text-lg font-semibold text-gray-900">My Results</span>
                    </button>
                    <button
                      onClick={() => navigate('/studentdashboard/my-classes')}
                      className="flex flex-col items-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl hover:shadow-lg transition-all"
                    >
                      <FiBook className="w-12 h-12 text-blue-600 mb-3" />
                      <span className="text-lg font-semibold text-gray-900">My Classes</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/*======== Footer ========*/}
      <div className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">
            © 2025 Khyber Public School & College. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;