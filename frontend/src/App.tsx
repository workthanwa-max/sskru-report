import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';

import { Login } from '@/pages/auth/Login';
import { Register } from '@/pages/auth/Register';
import { Profile } from '@/pages/auth/Profile';

import { StudentDashboard } from '@/pages/Student/StudentDashboard';
import { AdminDashboard } from '@/pages/Admin/AdminDashboard';
import { TechnicianDashboard } from '@/pages/Technician/TechnicianDashboard';
import { ManagerDashboard } from '@/pages/Manager/ManagerDashboard';
import { InfrastructureManagement } from '@/pages/Manager/InfrastructureManagement';
import { TicketDispatch } from '@/pages/Manager/TicketDispatch';
import { TechnicianManagement } from '@/pages/Manager/TechnicianManagement';
import { FacilityExplorer } from '@/pages/Student/FacilityExplorer';
import { LandingPage } from '@/pages/LandingPage';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          
          {/* Public Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Protected Main Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/profile" element={<Profile />} />
              
              {/* Role-based Dashboards */}
              <Route path="/dashboard/student" element={
                <ProtectedRoute allowedRoles={['Student']} />
              }>
                <Route index element={<StudentDashboard />} />
              </Route>
              
              <Route path="/dashboard/admin" element={
                <ProtectedRoute allowedRoles={['Admin']} />
              }>
                <Route index element={<AdminDashboard />} />
              </Route>

              <Route path="/dashboard/technician" element={
                <ProtectedRoute allowedRoles={['Technician']} />
              }>
                <Route index element={<TechnicianDashboard />} />
              </Route>

              <Route path="/dashboard/manager" element={
                <ProtectedRoute allowedRoles={['Manager']} />
              }>
                <Route index element={<ManagerDashboard />} />
              </Route>

              <Route path="/dashboard/infrastructure" element={
                <ProtectedRoute allowedRoles={['Manager']} />
              }>
                <Route index element={<InfrastructureManagement />} />
              </Route>

              <Route path="/dashboard/dispatch" element={
                <ProtectedRoute allowedRoles={['Manager']} />
              }>
                <Route index element={<TicketDispatch />} />
              </Route>

              <Route path="/dashboard/technicians" element={
                <ProtectedRoute allowedRoles={['Manager']} />
              }>
                <Route index element={<TechnicianManagement />} />
              </Route>

              <Route path="/dashboard/facilities" element={
                <ProtectedRoute allowedRoles={['Student', 'Technician', 'Admin', 'Manager']} />
              }>
                <Route index element={<FacilityExplorer />} />
              </Route>

            </Route>
          </Route>

          {/* Default Route Redirect */}
          <Route path="/" element={<LandingPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
