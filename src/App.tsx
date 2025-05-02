import { Routes, Route } from "react-router";
import {
  ProtectedRoute,
  RedirectIfAuthenticated,
} from "@/routes/protected-routes.tsx";
import AdminDashboard from "@/routes/admin/admin-dashboard.tsx";
import Login from "@/routes/auth/login.tsx";
import StudentDashboard from "@/routes/student/student-dashboard.tsx";
import InstructorClassManagement from "@/routes/instructor/instructor-class-management.tsx";
import Register from "@/routes/auth/register.tsx";
import { Toaster } from "sonner";
import Logout from "@/routes/auth/logout.tsx";
import InstructorDashboard from "@/routes/instructor/instructor-dashboard.tsx";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <RedirectIfAuthenticated>
              <Login />
            </RedirectIfAuthenticated>
          }
        />

        <Route
          path="/login"
          element={
            <RedirectIfAuthenticated>
              <Login />
            </RedirectIfAuthenticated>
          }
        />
        <Route
          path="/register"
          element={
            <RedirectIfAuthenticated>
              <Register />
            </RedirectIfAuthenticated>
          }
        />
        <Route
          element={
            <ProtectedRoute allowedRoles={["student", "instructor", "admin"]} />
          }
        >
          <Route path="/logout" element={<Logout />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
          <Route path="/student" element={<StudentDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["instructor"]} />}>
          <Route
            path="/instructor/schedule"
            element={<InstructorClassManagement />}
          />
          <Route path="/instructor" element={<InstructorDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
