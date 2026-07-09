import { CalendarDays, PiggyBank, Plane, WalletCards, ArrowRight, Compass } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getErrorMessage } from '../api/client';
import { dashboardApi } from '../api/tripService';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { currency, dateLabel } from '../utils';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    dashboardApi.get().then(setData).catch((err) => setError(getErrorMessage(err)));
  }, []);

  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-5 shadow-soft">
        <p className="text-sm font-semibold text-red-600">{error}</p>
      </div>
    );
  }
  
  if (!data) return <LoadingSpinner label="Loading dashboard" />;

  const stats = [
    { label: 'Total Trips', value: data.numberOfTrips, icon: Plane, color: 'from-blue-500 to-indigo-500', iconColor: 'text-blue-600', bgColor: 'bg-blue-50/50' },
    { label: 'Upcoming Trips', value: data.upcomingTrips.length, icon: CalendarDays, color: 'from-amber-500 to-orange-500', iconColor: 'text-amber-600', bgColor: 'bg-amber-50/50' },
    { label: 'Total Expenses', value: currency(data.totalExpenses), icon: WalletCards, color: 'from-violet-500 to-purple-500', iconColor: 'text-violet-600', bgColor: 'bg-violet-50/50' },
    { label: 'Remaining Budget', value: currency(data.budgetRemaining), icon: PiggyBank, color: 'from-emerald-500 to-teal-500', iconColor: 'text-emerald-600', bgColor: 'bg-emerald-50/50' }
  ];

  return (
    <div className="space-y-8">
      {/* Greeting Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Welcome back, <span className="bg-gradient-to-r from-indigo-600 to-sky-500 bg-clip-text text-transparent">{user?.name || 'Traveler'}</span>!
          </h1>
          <p className="mt-2 text-sm text-slate-500 font-light">Here is an overview of your current budget targets and upcoming plans.</p>
        </div>
        <Link
          to="/trips/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4.5 py-2.5 text-sm transition shadow-lg shadow-indigo-650/15"
        >
          <Compass className="h-4 w-4" /> Plan a New Trip
        </Link>
      </div>

      {/* Stats Widgets */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color, iconColor, bgColor }) => (
          <div
            key={label}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-md"
          >
            {/* Top accent line */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${color}`} />
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
              <span className={`grid h-8 w-8 place-items-center rounded-lg ${bgColor} ${iconColor}`}>
                <Icon className="h-4.5 w-4.5" />
              </span>
            </div>
            
            <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      {/* Main Panel grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="h-full flex flex-col">
            <h2 className="text-lg font-bold tracking-tight text-slate-900 border-b border-slate-100 pb-4 mb-4">Upcoming Trips</h2>
            <div className="flex-1 divide-y divide-slate-100">
              {data.upcomingTrips.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center h-full">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-slate-50 text-slate-400 mb-4 border border-slate-100">
                    <Plane className="h-5 w-5" />
                  </span>
                  <p className="text-sm text-slate-500 font-medium">No upcoming trips created yet</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs font-light">Create a trip and outline your dates to see it listed here.</p>
                </div>
              ) : (
                data.upcomingTrips.map((trip) => (
                  <Link
                    key={trip.id}
                    to={`/trips/${trip.id}`}
                    className="flex items-center justify-between py-4 group hover:bg-slate-50/50 px-2 rounded-xl transition duration-150"
                  >
                    <div className="space-y-1">
                      <span className="font-semibold text-slate-900 group-hover:text-indigo-600 transition">{trip.title}</span>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="font-medium">{trip.destination}</span>
                        <span>•</span>
                        <span>{dateLabel(trip.startDate)}</span>
                      </div>
                    </div>
                    <span className="rounded-full bg-slate-50 group-hover:bg-indigo-50 p-2 text-slate-400 group-hover:text-indigo-650 transition">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Small quick tips or side overview panel */}
        <div className="md:col-span-1">
          <Card className="bg-slate-900 text-white h-full border-none flex flex-col justify-between p-6 relative overflow-hidden">
            {/* Background blur highlights */}
            <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-indigo-500/20 blur-xl" />
            <div className="absolute -bottom-12 -left-12 h-24 w-24 rounded-full bg-sky-500/20 blur-xl" />

            <div className="relative z-10">
              <span className="inline-block bg-indigo-500/20 text-indigo-350 font-bold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full mb-4">
                Travel Tip
              </span>
              <h3 className="text-lg font-bold mb-3 tracking-tight">Keep Budget in Check</h3>
              <p className="text-slate-400 text-xs leading-relaxed font-light mb-6">
                Did you know? Logging your micro-expenses like transit and street snacks daily keeps your tracking over 95% accurate. Adjust budget parameters in real-time under Trip Details.
              </p>
            </div>
            
            <Link
              to="/trips"
              className="relative z-10 w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-semibold py-2.5 text-xs transition duration-200"
            >
              Browse All Trips
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
