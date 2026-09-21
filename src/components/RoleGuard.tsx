import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: Array<'member' | 'admin' | 'super_admin'>;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles }) => {
  const { role, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  if (!role || !allowedRoles.includes(role)) {
    // If not authorized, redirect based on their actual role or login
    if (role === 'admin' || role === 'super_admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (role === 'member') {
      return <Navigate to="/member/dashboard" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
