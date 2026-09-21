import React, { useEffect, useState } from 'react';
import { Users, Globe, Briefcase, FileText } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    gccMembers: 0,
    jobSeekers: 0,
    openJobs: 0
  });

  useEffect(() => {
    // Basic implementation to fetch counts. We'll expand this later.
    const fetchStats = async () => {
      try {
        const [{ count: totalMembers }, { count: jobSeekers }, { count: openJobs }] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('skills').select('*', { count: 'exact', head: true }).eq('looking_for_job', true),
          supabase.from('job_postings').select('*', { count: 'exact', head: true }).eq('status', 'Open')
        ]);

        setStats({
          totalMembers: totalMembers || 0,
          gccMembers: totalMembers || 0, // Placeholder: count where gcc_details exists
          jobSeekers: jobSeekers || 0,
          openJobs: openJobs || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of the community platform.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Members" icon={Users} value={stats.totalMembers.toString()} color="bg-primary/10 text-primary" />
        <StatCard title="GCC Members" icon={Globe} value={stats.gccMembers.toString()} color="bg-emerald-100 text-emerald-600" />
        <StatCard title="Job Seekers" icon={Briefcase} value={stats.jobSeekers.toString()} color="bg-amber-100 text-amber-600" />
        <StatCard title="Open Jobs" icon={FileText} value={stats.openJobs.toString()} color="bg-purple-100 text-purple-600" />
      </div>
      
      {/* Charts and Tables will be implemented fully in subsequent steps */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[300px] flex items-center justify-center">
        <p className="text-gray-500">Charts and Recent Members table will be populated here.</p>
      </div>
    </div>
  );
};

const StatCard = ({ title, icon: Icon, value, color }: { title: string, icon: any, value: string, color: string }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon size={24} />
    </div>
  </div>
);
