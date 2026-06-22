import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import CreateOrganization from "./pages/organization/CreateOrganization";
import OrganizationDetail from "./pages/organization/OrganizationDetail";
import InviteMembers from "./pages/invitation/InviteMember";
import JoinOrganization from "./pages/invitation/JoinOrganization";
import ProtectedRoute from "./Routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: "12px",
              background: "#1f2937",
              color: "#fff",
              fontSize: "14px",
            },
          }}
        />
        <Routes>
          {/* Default route */}
          <Route path="/" element={<Navigate to="/dashboard" />} />

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/join/:token" element={<JoinOrganization />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizations/create"
            element={
              <ProtectedRoute>
                <CreateOrganization />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizations/:id"
            element={
              <ProtectedRoute>
                <OrganizationDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizations/:id/invite"
            element={
              <ProtectedRoute>
                <InviteMembers />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;