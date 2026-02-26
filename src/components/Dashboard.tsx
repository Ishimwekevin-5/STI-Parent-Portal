import React from 'react';
import { 
  TrendingUp, 
  Calendar, 
  Wallet, 
  ArrowUpRight,
  GraduationCap,
  CheckCircle2
} from 'lucide-react';
import { StudentData, FeeData } from '../types';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface DashboardProps {
  studentData: StudentData;
  feeData: FeeData;
}

const Dashboard: React.FC<DashboardProps> = ({ studentData, feeData }) => {
  const { profile, academic, attendance } = studentData;
  const { fees } = feeData;

  const averageGrade = academic.reduce((acc, curr) => acc + curr.score, 0) / academic.length;
  const attendanceRate = (attendance.filter(r => r.status === 'present').length / attendance.length) * 100;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Welcome back, Parent</h1>
          <p className="text-zinc-500 mt-1">Here's an overview of {profile.name}'s progress.</p>
        </div>
        <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-3">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
            <GraduationCap className="text-emerald-500 w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Student ID</p>
            <p className="text-sm font-bold text-zinc-100">{profile.student_id}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-zinc-500" />
          </div>
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Avg. Grade</p>
          <p className="text-2xl font-bold text-zinc-100">{averageGrade.toFixed(1)}%</p>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-zinc-500" />
          </div>
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Attendance</p>
          <p className="text-2xl font-bold text-zinc-100">{attendanceRate.toFixed(1)}%</p>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Wallet className="w-5 h-5 text-amber-500" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-zinc-500" />
          </div>
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Fee Balance</p>
          <p className="text-2xl font-bold text-zinc-100">${(fees.total_amount - fees.paid_amount).toLocaleString()}</p>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-purple-500" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-zinc-500" />
          </div>
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Status</p>
          <p className="text-2xl font-bold text-zinc-100">Active</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <h3 className="text-sm font-medium text-zinc-400 mb-6 uppercase tracking-wider">Performance Trend</h3>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={academic}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="subject" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#18181b', 
                    border: '1px solid #3f3f46',
                    borderRadius: '12px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <h3 className="text-sm font-medium text-zinc-400 mb-6 uppercase tracking-wider">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-emerald-500/50 transition-all group">
              <span className="text-sm font-medium text-zinc-200">Pay Outstanding Fees</span>
              <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400" />
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-blue-500/50 transition-all group">
              <span className="text-sm font-medium text-zinc-200">Download Report Card</span>
              <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-blue-400" />
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-amber-500/50 transition-all group">
              <span className="text-sm font-medium text-zinc-200">Contact Class Teacher</span>
              <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-amber-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
