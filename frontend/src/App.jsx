import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import GetAllUsers from "./components/UsersComponents/GetAllUsers";
import GetAllStudents from "./components/StudentComponents/GetAllStudents";
import AddUser from "./components/UsersComponents/AddUser";
import GetAllClasses from "./components/ClassComponents/GetAllClasses";
import GetAllTeachers from "./components/TeacherComponent/GetAllTeachers";
import GetTeacherDetails from "./components/TeacherComponent/GetTeacherDetails";
import SubjectsList from "./components/SubjectsComponent/getAllSubjects";
import GetAllFeeDetails from "./components/FeeComponent/getAllFee";
import CreateAttendance from "./components/AttendanceComponent/CreateAttendance";
import GetAllRecords from "./components/AttendanceComponent/GetAllRecords";
import Exam from "./components/ExamComponent/Exam";
import GetAllExams from "./components/ExamComponent/GetAllExams";
import ResultDetails from "./components/ResultComponent/CreateResult";
import GetResults from "./components/ResultComponent/GetResults";
import StudentDashboard from "./pages/StudentDashboard";
import Overview from "./components/StudentDashboard/Overview";
import AttendancePage from "./components/StudentDashboard/Attendence";
import ClassesAndSubjects from "./components/StudentDashboard/ClassesAndSubjects";
import ExamAndResults from "./components/StudentDashboard/ExamAndResults";
import StudentFee from "./components/StudentDashboard/StudentFee";
import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherOverview from "./components/TeacherDashboard/Overview";
import MarkAttendence from "./components/TeacherDashboard/MarkAttendence";
import AttendenceRec from "./components/TeacherDashboard/AttendenceRec";
import AssignMarks from "./components/TeacherDashboard/AssignMarks";
import StudentsResults from "./components/TeacherDashboard/StudentsResults";
import ResultAndAttendenceGraphs from "./components/TeacherDashboard/ResultAndAttendence";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// --- Role-based guards ---
const AdminRoute = ({ user }) => {
  return user?.user?.role === "admin" ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
};

const StudentRoute = ({ user }) => {
  return user?.user?.role === "student" ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
};

const TeacherRoute = ({ user }) => {
  return user?.user?.role === "teacher" ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
};

function App() {
  const { token, user } = useSelector((state) => state.auth);
  const localToken = localStorage.getItem("token");
  const localUser = JSON.parse(localStorage.getItem("user"));
  const currentUser = user || localUser;
  const isAuthenticated = token || localToken;

  return (
    <>
    <Routes>
      <Route path="/login" element={<Login />} />

      {isAuthenticated ? (
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route element={<AdminRoute user={currentUser} />}>
            <Route path="dashboard" element={<Dashboard />}>
              <Route path="getAllUsers" element={<GetAllUsers />} />
              <Route path="GetAllStudents" element={<GetAllStudents />} />
              <Route path="createUser" element={<AddUser />} />
              <Route path="getAllClasses" element={<GetAllClasses />} />
              <Route path="getAllTeachers" element={<GetAllTeachers />} />
              <Route
                path="getTeacherDetails/:teacherId"
                element={<GetTeacherDetails />}
              />
              <Route path="getAllSubjects" element={<SubjectsList />} />
              <Route path="GetAllFee" element={<GetAllFeeDetails />} />
              <Route path="markAttendence" element={<CreateAttendance />} />
              <Route path="get-all-records" element={<GetAllRecords />} />
              <Route path="exams" element={<Exam />} />
              <Route path="get-all-exams" element={<GetAllExams />} />
              <Route path="create-result" element={<ResultDetails />} />
              <Route path="get-all-results" element={<GetResults />} />
            </Route>
          </Route>

          {/* 🎓 Student Routes */}
          <Route element={<StudentRoute user={currentUser} />}>
            <Route path="studentdashboard" element={<StudentDashboard />}>
              <Route index element={<Navigate to="overview" replace />} />
              <Route path="overview" element={<Overview />} />
              <Route path="attendence" element={<AttendancePage />} />
              <Route path="my-classes" element={<ClassesAndSubjects />} />
              <Route path="exam-results" element={<ExamAndResults />} />
              <Route path="student-fee" element={<StudentFee />} />
            </Route>
          </Route>


          {/* 👨‍🏫 Teacher Routes */}
              <Route element={<TeacherRoute user={currentUser} />}>
                <Route path="teacherdashboard" element={<TeacherDashboard />}>
                  <Route index element={<Navigate to="teacher-overview" replace />} />
                  <Route path="teacher-overview" element={<TeacherOverview />} />
                  <Route path="mark-attendence" element={<MarkAttendence />} />
                  <Route path="get-attendence" element={<AttendenceRec />} />
                  <Route path="create-result" element={<AssignMarks />} />
                  <Route path="student-result" element={<StudentsResults />} />
                  <Route path="student-stats" element={<ResultAndAttendenceGraphs />} />
                </Route>
              </Route>

          {/* Common Routes */}
          <Route path="profile" element={<Profile />} />
        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
    </Routes>

    <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored" 
      />
    </>
  );
}

export default App;