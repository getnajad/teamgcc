import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User as UserIcon, Globe, Briefcase, FileText } from 'lucide-react';

export const MemberDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.email}</h1>
        <p className="text-gray-500 mt-1">Here is a summary of your profile and activities.</p>
        
        {/* Placeholder for Profile Completion warning */}
        <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
          <div className="flex justify-between items-center">
            <p className="text-sm text-blue-700">Your profile is incomplete. Please update your information to help the community.</p>
            <button className="text-sm font-medium text-blue-700 underline">Update Profile</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="My Profile" icon={UserIcon} value="View" color="bg-primary/10 text-primary" />
        <StatCard title="GCC Information" icon={Globe} value="Update" color="bg-emerald-100 text-emerald-600" />
        <StatCard title="Job Opportunities" icon={Briefcase} value="5 Open" color="bg-amber-100 text-amber-600" />
        <StatCard title="My Applications" icon={FileText} value="0" color="bg-purple-100 text-purple-600" />
      </div>
    </div>
  );
};

const StatCard = ({ title, icon: Icon, value, color }: { title: string, icon: any, value: string, color: string }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer">
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon size={24} />
    </div>
  </div>
);
