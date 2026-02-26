import React from 'react';
import { CreditCard, History, TrendingUp, AlertCircle } from 'lucide-react';
import { FeeData } from '../types';
import { cn } from '../lib/utils';

interface FinancialsProps {
  data: FeeData;
}

const Financials: React.FC<FinancialsProps> = ({ data }) => {
  const { fees, history } = data;

  if (!fees) return (
    <div className="flex flex-col items-center justify-center h-64 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
      <AlertCircle className="w-10 h-10 text-zinc-500 mb-4" />
      <p className="text-zinc-400">No financial records found.</p>
    </div>
  );

  const balance = fees.total_amount - fees.paid_amount;
  const progress = (fees.paid_amount / fees.total_amount) * 100;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">Financial Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp className="w-16 h-16 text-emerald-500" />
          </div>
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Total Fees</p>
          <p className="text-3xl font-bold text-zinc-100">${fees.total_amount.toLocaleString()}</p>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs text-zinc-400">Academic Year 2023-24</span>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <CreditCard className="w-16 h-16 text-blue-500" />
          </div>
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Paid Amount</p>
          <p className="text-3xl font-bold text-emerald-400">${fees.paid_amount.toLocaleString()}</p>
          <div className="mt-4 w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <AlertCircle className="w-16 h-16 text-amber-500" />
          </div>
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Outstanding Balance</p>
          <p className="text-3xl font-bold text-amber-400">${balance.toLocaleString()}</p>
          <div className="mt-4 flex items-center gap-2">
            <span className={cn(
              "text-xs px-2 py-0.5 rounded-full border",
              fees.status === 'Paid' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-amber-500/10 border-amber-500/20 text-amber-400"
            )}>
              {fees.status}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-bottom border-zinc-800 flex items-center gap-3">
          <History className="w-5 h-5 text-zinc-400" />
          <h3 className="font-semibold text-zinc-100">Payment History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-950 border-y border-zinc-800">
                <th className="px-6 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Method</th>
                <th className="px-6 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Reference</th>
                <th className="px-6 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wider text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {history.map((payment) => (
                <tr key={payment.id} className="hover:bg-zinc-900/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-zinc-300">{payment.date}</td>
                  <td className="px-6 py-4 text-sm text-zinc-300">{payment.method}</td>
                  <td className="px-6 py-4 text-sm text-zinc-500 font-mono">#PAY-{payment.id}</td>
                  <td className="px-6 py-4 text-sm font-bold text-zinc-100 text-right">${payment.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Financials;
