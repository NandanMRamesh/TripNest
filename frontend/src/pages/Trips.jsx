import { Edit, Eye, Plus, Trash2, LayoutGrid, List, Calendar, MapPin, DollarSign } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getErrorMessage } from '../api/client';
import { tripApi } from '../api/tripService';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import Table from '../components/Table';
import { currency, dateLabel } from '../utils';

export default function Trips() {
  const [trips, setTrips] = useState(null);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  const load = () => tripApi.list().then(setTrips).catch((err) => setError(getErrorMessage(err)));

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    if (!confirm('Are you sure you want to delete this trip and all its associated logs?')) return;
    await tripApi.remove(id);
    load();
  };

  const getStatusBadge = (status) => {
    const statuses = {
      active: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      upcoming: 'bg-blue-50 text-blue-700 border-blue-100',
      completed: 'bg-slate-50 text-slate-655 border-slate-200'
    };
    const s = String(status || 'upcoming').toLowerCase();
    const cls = statuses[s] || statuses.upcoming;
    return (
      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${cls}`}>
        {status || 'Upcoming'}
      </span>
    );
  };

  const columns = [
    { key: 'title', header: 'Trip' },
    { key: 'destination', header: 'Destination' },
    { key: 'dates', header: 'Dates', render: (trip) => `${dateLabel(trip.startDate)} - ${dateLabel(trip.endDate)}` },
    { key: 'budget', header: 'Budget', render: (trip) => currency(trip.budget) },
    { key: 'status', header: 'Status', render: (trip) => getStatusBadge(trip.status) },
    {
      key: 'actions',
      header: 'Actions',
      render: (trip) => (
        <div className="flex gap-1.5">
          <Link to={`/trips/${trip.id}`} className="rounded-lg p-2 text-slate-400 hover:text-indigo-650 hover:bg-indigo-50 transition" title="View"><Eye className="h-4 w-4" /></Link>
          <Link to={`/trips/${trip.id}/edit`} className="rounded-lg p-2 text-slate-400 hover:text-indigo-650 hover:bg-indigo-50 transition" title="Edit"><Edit className="h-4 w-4" /></Link>
          <button onClick={() => remove(trip.id)} className="rounded-lg p-2 text-slate-400 hover:text-red-655 hover:bg-red-50 transition" title="Delete"><Trash2 className="h-4 w-4" /></button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header section with toggle controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Trips</h1>
          <p className="mt-2 text-sm text-slate-500 font-light">Plan, coordinate details, and track your ongoing and past travel logs.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-205/60">
            <button
              onClick={() => setViewMode('grid')}
              className={`rounded-lg p-1.5 transition ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-950'}`}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`rounded-lg p-1.5 transition ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-950'}`}
              title="List View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          <Link to="/trips/new">
            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl px-4.5 py-2.5 text-sm shadow-lg shadow-indigo-650/15">
              <Plus className="h-4 w-4" /> New Trip
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-150 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-655">{error}</p>
        </div>
      )}

      {!trips ? (
        <LoadingSpinner label="Loading trips" />
      ) : trips.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-slate-200/60 rounded-3xl p-8">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-indigo-50 text-indigo-600 mb-6 border border-indigo-100">
            <Compass className="h-8 w-8" />
          </span>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No trips created yet</h3>
          <p className="text-sm text-slate-500 font-light max-w-sm mb-6">
            Get started by planning a new adventure! Specify your budget and destination to start logging itineraries.
          </p>
          <Link to="/trips/new">
            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl">
              Create your first trip
            </Button>
          </Link>
        </div>
      ) : viewMode === 'grid' ? (
        /* Card Grid View */
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">
                      <MapPin className="h-3 w-3" /> {trip.destination}
                    </span>
                    <h3 className="text-xl font-bold tracking-tight text-slate-950 group-hover:text-indigo-600 transition">
                      <Link to={`/trips/${trip.id}`}>{trip.title}</Link>
                    </h3>
                  </div>
                  {getStatusBadge(trip.status)}
                </div>

                <div className="flex flex-col gap-2 text-xs text-slate-400 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-350" />
                    {dateLabel(trip.startDate)} - {dateLabel(trip.endDate)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5 text-slate-350" />
                    Budget: <strong className="text-slate-655 font-semibold">{currency(trip.budget)}</strong>
                  </span>
                </div>
              </div>

              {/* Action Bar Footer */}
              <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-4">
                <Link
                  to={`/trips/${trip.id}`}
                  className="text-xs font-semibold text-indigo-650 hover:text-indigo-500 transition"
                >
                  Manage Itinerary →
                </Link>
                <div className="flex items-center gap-1">
                  <Link
                    to={`/trips/${trip.id}/edit`}
                    className="rounded-lg p-1.5 text-slate-400 hover:text-indigo-650 hover:bg-slate-50 transition"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => remove(trip.id)}
                    className="rounded-lg p-1.5 text-slate-400 hover:text-red-655 hover:bg-red-50 transition"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table List View */
        <Table columns={columns} rows={trips} emptyMessage="No trips found" />
      )}
    </div>
  );
}
