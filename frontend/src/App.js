import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Student Pages
import StudentLogin from './pages/Student/StudentLogin';
import StudentRegister from './pages/Student/StudentRegister';
import StudentDashboard from './pages/Student/StudentDashboard';
import StudentProfile from './pages/Student/StudentProfile';
import StudentComplaints from './pages/Student/StudentComplaints';
import StudentMessLeave from './pages/Student/StudentMessLeave';
import StudentAnnouncements from './pages/Student/StudentAnnouncements';

// Admin Pages
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminStudents from './pages/Admin/AdminStudents';
import AdminAttendance from './pages/Admin/AdminAttendance';
import AdminComplaints from './pages/Admin/AdminComplaints';
import AdminMessLeave from './pages/Admin/AdminMessLeave';
import AdminAnnouncements from './pages/Admin/AdminAnnouncements';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/student/login" element={<StudentLogin />} />
            <Route path="/student/register" element={<StudentRegister />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            
            <Route path="/student/dashboard" element={
              <PrivateRoute role="student">
                <StudentDashboard />
              </PrivateRoute>
            } />
            <Route path="/student/profile" element={
              <PrivateRoute role="student">
                <StudentProfile />
              </PrivateRoute>
            } />
            <Route path="/student/complaints" element={
              <PrivateRoute role="student">
                <StudentComplaints />
              </PrivateRoute>
            } />
            <Route path="/student/mess-leave" element={
              <PrivateRoute role="student">
                <StudentMessLeave />
              </PrivateRoute>
            } />
            <Route path="/student/announcements" element={
              <PrivateRoute role="student">
                <StudentAnnouncements />
              </PrivateRoute>
            } />

            <Route path="/admin/dashboard" element={
              <PrivateRoute role="admin">
                <AdminDashboard />
              </PrivateRoute>
            } />
            <Route path="/admin/students" element={
              <PrivateRoute role="admin">
                <AdminStudents />
              </PrivateRoute>
            } />
            <Route path="/admin/attendance" element={
              <PrivateRoute role="admin">
                <AdminAttendance />
              </PrivateRoute>
            } />
            <Route path="/admin/complaints" element={
              <PrivateRoute role="admin">
                <AdminComplaints />
              </PrivateRoute>
            } />
            <Route path="/admin/mess-leave" element={
              <PrivateRoute role="admin">
                <AdminMessLeave />
              </PrivateRoute>
            } />
            <Route path="/admin/announcements" element={
              <PrivateRoute role="admin">
                <AdminAnnouncements />
              </PrivateRoute>
            } />

            <Route path="/" element={<Navigate to="/student/login" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

