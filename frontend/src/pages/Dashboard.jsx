import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FiChevronDown,
  FiChevronUp,
  FiBookOpen,
  FiUsers,
  FiUserPlus,
  FiUser,
  FiBook,
  FiSettings,
  FiDollarSign,
  FiCheckSquare,
  FiFileText,
  FiAward,
  FiCalendar,
  FiList,
  FiShield,
} from "react-icons/fi";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const [showUsers, setShowUsers] = useState(false);
  const [showClasses, setShowClasses] = useState(false);
  const [showFee, setShowFee] = useState(false);
  const [showAttend, setShowAttend] = useState(false);
  const [showExam, setShowExam] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const menuSections = [
    {
      id: "users",
      title: "User Management",
      icon: FiUsers,
      isOpen: showUsers,
      toggle: () => setShowUsers(!showUsers),
      items: [
        { to: "getAllUsers", icon: FiUsers, label: "All Users" },
        { to: "getAllTeachers", icon: FiUser, label: "Teachers" },
        { to: "getAllStudents", icon: FiUser, label: "Students" },
        { to: "createUser", icon: FiUserPlus, label: "Add User" },
      ],
    },
    {
      id: "classes",
      title: "Classes",
      icon: FiBook,
      isOpen: showClasses,
      toggle: () => setShowClasses(!showClasses),
      items: [
        { to: "getAllClasses", icon: FiBook, label: "All Classes" },
        { to: "getAllSubjects", icon: FiBookOpen, label: "Subjects" },
      ],
    },
    {
      id: "fees",
      title: "Fees",
      icon: FiDollarSign,
      isOpen: showFee,
      toggle: () => setShowFee(!showFee),
      items: [{ to: "getAllFee", icon: FiDollarSign, label: "Fee Record" }],
    },
    {
      id: "attendance",
      title: "Attendance",
      icon: FiCheckSquare,
      isOpen: showAttend,
      toggle: () => setShowAttend(!showAttend),
      items: [
        { to: "markAttendence", icon: FiCheckSquare, label: "Mark Attendance" },
        { to: "get-all-records", icon: FiList, label: "Attendance Records" },
      ],
    },
    {
      id: "exams",
      title: "Exams",
      icon: FiFileText,
      isOpen: showExam,
      toggle: () => setShowExam(!showExam),
      items: [
        { to: "exams", icon: FiFileText, label: "Create Exam" },
        { to: "get-all-exams", icon: FiCalendar, label: "All Exams" },
      ],
    },
    {
      id: "results",
      title: "Results",
      icon: FiAward,
      isOpen: showResult,
      toggle: () => setShowResult(!showResult),
      items: [
        { to: "create-result", icon: FiAward, label: "Create Result" },
        { to: "get-all-results", icon: FiList, label: "Result Records" },
      ],
    },
  ];

  return (
    <div className="flex h-[89vh] bg-gray-50">
      <aside className="w-64 bg-white border-r-2 border-gray-300 overflow-y-auto h-full scrollbar-thin">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-blue-600 to-blue-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <FiShield className="text-white text-lg" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Admin Portal</h2>
              {user?.user.role === "admin" && (
                <p className="text-xs text-blue-100">Management Panel</p>
              )}
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 250px)' }}>
          {menuSections.map((section) => {
            const SectionIcon = section.icon;
            return (
              <div key={section.id}>
                <button
                  onClick={section.toggle}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                    section.isOpen
                      ? "bg-blue-50 text-blue-700"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <SectionIcon className={`${section.isOpen ? "text-blue-600" : "text-gray-500"}`} size={18} />
                    <span className="text-sm font-medium">{section.title}</span>
                  </div>
                  {section.isOpen ? (
                    <FiChevronUp size={16} className="text-gray-400" />
                  ) : (
                    <FiChevronDown size={16} className="text-gray-400" />
                  )}
                </button>

                {section.isOpen && (
                  <div className="ml-9 mt-1 space-y-0.5">
                    {section.items.map((item) => {
                      const ItemIcon = item.icon;
                      return (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          className={({ isActive }) =>
                            `flex items-center space-x-2.5 px-3 py-2 rounded-md text-sm transition-all ${
                              isActive
                                ? "bg-blue-50 text-blue-700 font-medium"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`
                          }
                        >
                          <ItemIcon size={16} />
                          <span>{item.label}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="px-4 py-4 mt-auto border-t border-gray-200">
          <button className="flex items-center space-x-2.5 px-3 py-2 w-full rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-all">
            <FiSettings size={18} className="text-gray-500" />
            <span>Settings</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="h-full w-full p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;