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

function AppRoutes() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/join/:token" element={<JoinOrganization />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/organizations/create" element={<ProtectedRoute><CreateOrganization /></ProtectedRoute>} />
        <Route path="/organizations/:id" element={<ProtectedRoute><OrganizationDetail /></ProtectedRoute>} />
        <Route path="/organizations/:id/invite" element={<ProtectedRoute><InviteMembers /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;