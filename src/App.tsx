import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RoleGuard } from './components/RoleGuard';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { MemberDashboard } from './pages/member/Dashboard';
import { MemberProfile } from './pages/member/Profile';
import { AdminDashboard } from './pages/admin/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Member Routes */}
          <Route 
            path="/member" 
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['member']}>
                  <Layout />
                </RoleGuard>
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<MemberDashboard />} />
            <Route path="profile" element={<MemberProfile />} />
            <Route path="jobs" element={<div className="p-4">Jobs (Coming Soon)</div>} />
          </Route>

          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['admin', 'super_admin']}>
                  <Layout />
                </RoleGuard>
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="members" element={<div className="p-4">Members (Coming Soon)</div>} />
            <Route path="jobs" element={<div className="p-4">Jobs (Coming Soon)</div>} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
