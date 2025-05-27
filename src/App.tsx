
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import PublicRoute from "@/components/PublicRoute";

// Public Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
// import VerifyOtp from "./pages/VerifyOtp";
import RegistrationSuccess from "./pages/RegistrationSuccess";
import PendingApproval from "./pages/PendingApproval";
import NotFound from "./pages/NotFound";

// User Pages
import UserDashboard from "./pages/user/Dashboard";
import UserTeam from "./pages/user/Team";
import UserWithdrawal from "./pages/user/Withdrawal";
import UserProfile from "./pages/user/Profile";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminUserManagement from "./pages/admin/UserManagement";
import AdminReferrals from "./pages/admin/Referrals";
import AdminWithdrawals from "./pages/admin/Withdrawals";
import AdminSettings from "./pages/admin/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/" 
              element={
                <PublicRoute>
                  <Landing />
                </PublicRoute>
              } 
            />
            <Route 
              path="/login" 
              element={
                <PublicRoute restricted>
                  <Login />
                </PublicRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute restricted>
                  <Register />
                </PublicRoute>
              } 
            />
            <Route 
              path="/verify-email" 
              element={
                <PublicRoute restricted>
                  <VerifyEmail />
                </PublicRoute>
              } 
            />
            {/* <Route 
              path="/verify-otp" 
              element={
                <PublicRoute>
                  <VerifyOtp />
                </PublicRoute>
              } 
            /> */}
            <Route 
              path="/registration-success" 
              element={
                <PublicRoute>
                  <RegistrationSuccess />
                </PublicRoute>
              } 
            />
            <Route 
              path="/pending-approval" 
              element={
                <PublicRoute>
                  <PendingApproval />
                </PublicRoute>
              } 
            />

            {/* User Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/team" 
              element={
                <ProtectedRoute>
                  <UserTeam />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/withdrawal" 
              element={
                <ProtectedRoute>
                  <UserWithdrawal />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              } 
            />

            {/* Admin Routes */}
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute requireAdmin>
                  <AdminUsers />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/user-management" 
              element={
                <ProtectedRoute requireAdmin>
                  <AdminUserManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/referrals" 
              element={
                <ProtectedRoute requireAdmin>
                  <AdminReferrals />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/withdrawals" 
              element={
                <ProtectedRoute requireAdmin>
                  <AdminWithdrawals />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/settings" 
              element={
                <ProtectedRoute requireAdmin>
                  <AdminSettings />
                </ProtectedRoute>
              } 
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
