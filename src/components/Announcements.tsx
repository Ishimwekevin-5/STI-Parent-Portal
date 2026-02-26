import React from 'react';
import { Megaphone, Calendar, Tag } from 'lucide-react';
import { Announcement } from '../types';
import { cn } from '../lib/utils';

interface AnnouncementsProps {
  announcements: Announcement[];
}

const Announcements: React.FC<AnnouncementsProps> = ({ announcements }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">School Updates</h2>

      <div className="grid grid-cols-1 gap-4">
        {announcements.map((item) => (
          <div 
            key={item.id} 
            className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all duration-200 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-xl",
                  item.category === 'Event' ? "bg-emerald-500/10 text-emerald-400" :
                  item.category === 'Holiday' ? "bg-amber-500/10 text-amber-400" :
                  "bg-blue-500/10 text-blue-400"
                )}>
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-100 group-hover:text-emerald-400 transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                      <Calendar className="w-3.5 h-3.5" />
                      {item.date}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                      <Tag className="w-3.5 h-3.5" />
                      {item.category}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed">
              {item.content}
            </p>
            <div className="mt-6 flex justify-end">
              <button className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
                Read More →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;
