import React from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths 
} from 'date-fns';
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { AttendanceRecord } from '../types';
import { cn } from '../lib/utils';

interface AttendanceProps {
  records: AttendanceRecord[];
}

const Attendance: React.FC<AttendanceProps> = ({ records }) => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'absent': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'late': return <Clock className="w-4 h-4 text-amber-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-emerald-500/10 border-emerald-500/20';
      case 'absent': return 'bg-red-500/10 border-red-500/20';
      case 'late': return 'bg-amber-500/10 border-amber-500/20';
      default: return 'bg-zinc-900/50 border-zinc-800';
    }
  };

  const stats = {
    present: records.filter(r => r.status === 'present').length,
    absent: records.filter(r => r.status === 'absent').length,
    late: records.filter(r => r.status === 'late').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">Attendance</h2>
        <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-xl p-1">
          <button 
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-zinc-100"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium text-zinc-200 px-2 min-w-[120px] text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button 
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-zinc-100"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs font-medium text-zinc-500 uppercase py-2">
                {day}
              </div>
            ))}
            {/* Padding for start of month */}
            {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, i) => (
              <div key={`pad-${i}`} className="aspect-square" />
            ))}
            {days.map(day => {
              const record = records.find(r => isSameDay(new Date(r.date), day));
              return (
                <div 
                  key={day.toString()} 
                  className={cn(
                    "aspect-square rounded-xl border flex flex-col items-center justify-center gap-1 transition-all duration-200",
                    record ? getStatusColor(record.status) : "bg-zinc-950 border-zinc-800/50"
                  )}
                >
                  <span className={cn(
                    "text-xs font-medium",
                    record ? "text-zinc-100" : "text-zinc-500"
                  )}>
                    {format(day, 'd')}
                  </span>
                  {record && getStatusIcon(record.status)}
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">Present</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-zinc-100">{stats.present} Days</div>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-red-400 uppercase tracking-wider">Absent</span>
              <XCircle className="w-4 h-4 text-red-500" />
            </div>
            <div className="text-2xl font-bold text-zinc-100">{stats.absent} Days</div>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-amber-400 uppercase tracking-wider">Late</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-zinc-100">{stats.late} Days</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
