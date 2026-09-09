import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import StudentDashboard from "../pages/student/StudentDashboard";
import MyClassrooms from "../pages/student/MyClassrooms";
import Classroom from "../pages/student/Classroom";
import Assignment from "../pages/student/Assignment";
import Results from "../pages/student/Results";

import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import Analytics from "../pages/teacher/Analytics";
import CreateAssignment from "../pages/teacher/CreateAssignment";
import CreateClassroom from "../pages/teacher/CreateClassroom";
import ManageClassroom from "../pages/teacher/ManageClassroom";
import Submissions from "../pages/teacher/Submissions";
import Announcements from "../pages/teacher/Announcements";

import { useAuth } from "../hooks/useAuth";

function ProtectedRoute({ children, role }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {
    return (
      <Navigate
        to={
          user?.role === "teacher"
            ? "/teacher/dashboard"
            : "/student/dashboard"
        }
        replace
      />
    );
  }

  return children;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/classrooms"
          element={
            <ProtectedRoute role="student">
              <MyClassrooms />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/classrooms/:classroomId"
          element={
            <ProtectedRoute role="student">
              <Classroom />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/assignments/:assignmentId"
          element={
            <ProtectedRoute role="student">
              <Assignment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/results"
          element={
            <ProtectedRoute role="student">
              <Results />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/dashboard"
          element={
            <ProtectedRoute role="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/analytics"
          element={
            <ProtectedRoute role="teacher">
              <Analytics />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/assignments"
          element={
            <ProtectedRoute role="teacher">
              <CreateAssignment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/assignments/create"
          element={
            <ProtectedRoute role="teacher">
              <CreateAssignment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/classrooms"
          element={
            <ProtectedRoute role="teacher">
              <ManageClassroom />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/classrooms/create"
          element={
            <ProtectedRoute role="teacher">
              <CreateClassroom />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/submissions"
          element={
            <ProtectedRoute role="teacher">
              <Submissions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/announcements"
          element={
            <ProtectedRoute role="teacher">
              <Announcements />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;