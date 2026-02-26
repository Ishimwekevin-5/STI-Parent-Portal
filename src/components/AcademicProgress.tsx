import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Grade } from '../types';

interface AcademicProgressProps {
  grades: Grade[];
}

const AcademicProgress: React.FC<AcademicProgressProps> = ({ grades }) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return '#10b981'; // emerald-500
    if (score >= 80) return '#3b82f6'; // blue-500
    if (score >= 70) return '#f59e0b'; // amber-500
    return '#ef4444'; // red-500
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">Academic Progress</h2>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-xs text-zinc-400">Excellent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-xs text-zinc-400">Good</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-xs text-zinc-400">Average</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <h3 className="text-sm font-medium text-zinc-400 mb-6 uppercase tracking-wider">Subject Performance</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={grades} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis 
                  dataKey="subject" 
                  stroke="#71717a" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#71717a" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  domain={[0, 100]}
                />
                <Tooltip 
                  cursor={{ fill: '#27272a' }}
                  contentStyle={{ 
                    backgroundColor: '#18181b', 
                    border: '1px solid #3f3f46',
                    borderRadius: '12px',
                    color: '#f4f4f5'
                  }}
                />
                <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                  {grades.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getScoreColor(entry.score)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <h3 className="text-sm font-medium text-zinc-400 mb-6 uppercase tracking-wider">Subject List</h3>
          <div className="space-y-4">
            {grades.map((grade) => (
              <div key={grade.subject} className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800/50">
                <span className="text-sm font-medium text-zinc-200">{grade.subject}</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ 
                        width: `${grade.score}%`, 
                        backgroundColor: getScoreColor(grade.score) 
                      }} 
                    />
                  </div>
                  <span className="text-sm font-bold text-zinc-100">{grade.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicProgress;
