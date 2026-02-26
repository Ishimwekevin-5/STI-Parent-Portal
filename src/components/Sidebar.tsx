import React from 'react';
import { 
  LayoutDashboard, 
  GraduationCap, 
  CalendarCheck, 
  Wallet, 
  Bell, 
  LogOut,
  User
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'academic', label: 'Academic', icon: GraduationCap },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
    { id: 'financials', label: 'Financials', icon: Wallet },
    { id: 'announcements', label: 'Updates', icon: Bell },
  ];

  return (
    <div className="flex flex-col h-full bg-zinc-950 border-r border-zinc-800 w-64 p-6">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
          <GraduationCap className="text-white w-5 h-5" />
        </div>
        <span className="font-bold text-xl text-zinc-100 tracking-tight">EduPortal</span>
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
              activeTab === item.id 
                ? "bg-zinc-900 text-emerald-400 shadow-sm" 
                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5 transition-colors",
              activeTab === item.id ? "text-emerald-400" : "text-zinc-500 group-hover:text-zinc-300"
            )} />
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-zinc-800">
        <div className="flex items-center gap-3 px-2 mb-6">
          <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
            <User className="w-5 h-5 text-zinc-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-zinc-100">Parent Account</span>
            <span className="text-xs text-zinc-500">ishimwekevin199@...</span>
          </div>
        </div>
        <button className="w-full flex items-center gap-3 px-3 py-2 text-zinc-500 hover:text-red-400 transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
