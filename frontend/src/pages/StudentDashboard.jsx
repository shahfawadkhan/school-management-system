import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  FiBook,
  FiCalendar,
  FiDollarSign,
  FiAward,
  FiUser,
  FiBookOpen,
  FiSettings,
} from "react-icons/fi";

const StudentDashboard = () => {
  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const menuItems = [
    {
      to: "overview",
      icon: FiUser,
      label: "Overview",
      color: "from-blue-500 to-indigo-600",
    },
    {
      to: "attendence",
      icon: FiCalendar,
      label: "My Attendance",
      color: "from-green-500 to-emerald-600",
    },
    {
      to: "my-classes",
      icon: FiBookOpen,
      label: "My Classes",
      color: "from-violet-500 to-purple-600",
    },
    {
      to: "exam-results",
      icon: FiAward,
      label: "Exams & Results",
      color: "from-orange-500 to-red-600",
    },
    {
      to: "student-fee",
      icon: FiDollarSign,
      label: "Fee Records",
      color: "from-pink-500 to-rose-600",
    },
  ];

  return (
    <div className="flex h-[89vh] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/*===============  Sidebar =============== */}
      <aside className="w-80 bg-white border-r border-gray-200 shadow-xl flex flex-col h-full">
        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 border-b border-indigo-700">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-white/30">
              <FiBook className="text-white text-2xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Student Portal</h2>
              {user?.user.role === "student" && (
                <p className="text-sm text-blue-100 font-medium">
                  Dashboard Panel
                </p>
              )}
            </div>
          </div>
        </div>

        {/*===============  Scrollable Menu =============== */}
        <div className="flex-1 overflow-y-auto">
          <nav className="flex flex-col p-4 space-y-2">
            <div className="mb-2 px-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Menu
              </p>
            </div>

            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `group relative flex items-center space-x-3 p-3.5 rounded-xl text-base transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200/50 scale-105"
                        : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 hover:shadow-md"
                    }`
                  }
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {({ isActive }) => (
                    <>
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                          isActive
                            ? "bg-white/20 shadow-inner"
                            : "bg-gradient-to-br " +
                              item.color +
                              " text-white group-hover:shadow-md"
                        }`}
                      >
                        <Icon size={18} className={isActive ? "text-white" : ""} />
                      </div>
                      <span className="font-medium flex-1">{item.label}</span>
                      {isActive && (
                        <div className="w-1.5 h-8 bg-white rounded-full absolute right-2"></div>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="p-4 m-4 mt-auto bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <FiSettings className="text-indigo-600" />
            <span className="font-medium">Need help?</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Contact your teacher or admin
          </p>
        </div>
      </aside>

      <main className="flex-1 bg-gradient-to-br from-blue-50/30 via-indigo-50/30 to-purple-50/30 overflow-auto h-full">
        <div className="h-full w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
