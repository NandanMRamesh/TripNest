import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getErrorMessage } from '../api/client';
import { budgetApi } from '../api/tripService';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { currency } from '../utils';
import { ArrowLeft, PiggyBank, ReceiptText, Wallet } from 'lucide-react';

export default function Budget() {
  const { id } = useParams();
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    budgetApi.get(id).then(setSummary).catch((err) => setError(getErrorMessage(err)));
  }, [id]);

  if (error) {
    return (
      <div className="rounded-2xl border border-red-150 bg-red-50 p-5 shadow-soft">
        <p className="text-sm font-semibold text-red-655">{error}</p>
      </div>
    );
  }
  
  if (!summary) return <LoadingSpinner label="Loading budget summary" />;

  const spentPercent = summary.budget > 0 ? Math.min(100, (summary.totalExpenses / summary.budget) * 100) : 0;

  // Dynamically determine progress bar color
  let progressColor = 'bg-emerald-500';
  if (spentPercent > 90) {
    progressColor = 'bg-red-500';
  } else if (spentPercent > 60) {
    progressColor = 'bg-amber-500';
  }

  return (
    <div className="max-w-3xl space-y-8">
      {/* Back Button & Header */}
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-6">
        <Link to={`/trips/${id}`} className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-950 transition">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Trip Details
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Budget Analysis</h1>
          <p className="mt-2 text-sm text-slate-500 font-light">{summary.tripTitle}</p>
        </div>
      </div>

      <Card className="p-6 md:p-8 space-y-8">
        {/* Core numbers Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-1">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <Wallet className="h-4 w-4 text-slate-350" /> Target Budget
            </span>
            <p className="text-2xl font-bold tracking-tight text-slate-950">{currency(summary.budget)}</p>
          </div>
          
          <div className="space-y-1">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <ReceiptText className="h-4 w-4 text-slate-350" /> Spent So Far
            </span>
            <p className="text-2xl font-bold tracking-tight text-slate-950">{currency(summary.totalExpenses)}</p>
          </div>

          <div className="space-y-1">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <PiggyBank className="h-4 w-4 text-slate-350" /> Remaining
            </span>
            <p className={`text-2xl font-bold tracking-tight ${summary.remainingAmount < 0 ? 'text-red-655' : 'text-emerald-700'}`}>
              {currency(summary.remainingAmount)}
            </p>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex justify-between items-center text-xs font-bold text-slate-550 uppercase tracking-wider">
            <span>Spending Utilization</span>
            <span className={spentPercent > 90 ? 'text-red-600' : spentPercent > 60 ? 'text-amber-600' : 'text-emerald-650'}>
              {spentPercent.toFixed(0)}% Used
            </span>
          </div>
          
          <div className="h-3.5 w-full rounded-full bg-slate-100 overflow-hidden border border-slate-200/50">
            <div className={`h-full rounded-full transition-all duration-500 ${progressColor}`} style={{ width: `${spentPercent}%` }} />
          </div>

          {summary.remainingAmount < 0 && (
            <p className="text-xs text-red-650 font-semibold mt-2 animate-shake">
              ⚠️ Warning: You have exceeded your target budget limit by {currency(Math.abs(summary.remainingAmount))}.
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-3 pt-6 border-t border-slate-100">
          <Link to={`/trips/${id}/expenses`}>
            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl px-5 py-2.5 text-sm shadow-lg shadow-indigo-650/15">
              Track Expenses
            </Button>
          </Link>
          <Link to={`/trips/${id}`}>
            <Button variant="secondary" className="rounded-xl border-slate-200 text-slate-655 hover:bg-slate-50 px-5 py-2.5 text-sm font-semibold">
              Back to Trip
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
