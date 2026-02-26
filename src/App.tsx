/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AcademicProgress from './components/AcademicProgress';
import Attendance from './components/Attendance';
import Financials from './components/Financials';
import Announcements from './components/Announcements';
import { StudentData, FeeData, Announcement } from './types';
import { Loader2, AlertCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [feeData, setFeeData] = useState<FeeData | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const studentId = "STU1001";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [studentRes, feeRes, announceRes] = await Promise.all([
          fetch(`/api/parent/student/${studentId}`),
          fetch(`/api/parent/student/${studentId}/fees`),
          fetch('/api/parent/announcements')
        ]);

        if (!studentRes.ok || !feeRes.ok || !announceRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const [student, fees, announce] = await Promise.all([
          studentRes.json(),
          feeRes.json(),
          announceRes.json()
        ]);

        setStudentData(student);
        setFeeData(fees);
        setAnnouncements(announce);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderContent = () => {
    if (!studentData || !feeData) return null;

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard studentData={studentData} feeData={feeData} />;
      case 'academic':
        return <AcademicProgress grades={studentData.academic} />;
      case 'attendance':
        return <Attendance records={studentData.attendance} />;
      case 'financials':
        return <Financials data={feeData} />;
      case 'announcements':
        return <Announcements announcements={announcements} />;
      default:
        return <Dashboard studentData={studentData} feeData={feeData} />;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-zinc-100">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
        <p className="text-zinc-400 animate-pulse">Loading portal data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-zinc-100 p-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Connection Error</h2>
          <p className="text-zinc-400 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

