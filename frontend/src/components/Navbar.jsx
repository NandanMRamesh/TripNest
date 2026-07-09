import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plane, LogOut, Menu, X, LayoutDashboard, Calendar, PlusCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Brand Logo */}
        <Link to="/dashboard" className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-slate-900">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/10">
            <Plane className="h-4.5 w-4.5 -rotate-45" />
          </span>
          TripNest
        </Link>

        {/* Desktop User Info & Actions */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-3 border-r border-slate-100 pr-5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-600 border border-indigo-100/50">
              {getInitials(user?.name)}
            </span>
            <div className="text-left">
              <span className="block text-xs font-semibold text-slate-900 leading-none">{user?.name}</span>
              <span className="text-[10px] text-slate-400 font-medium">{user?.email}</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-50 hover:bg-red-50 hover:text-red-650 px-4.5 py-2 text-sm font-medium text-slate-655 border border-slate-200/50 transition duration-150"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>

        {/* Mobile menu trigger */}
        <button
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-50 md:hidden transition"
          onClick={() => setShowMenu(!showMenu)}
          aria-label="Toggle menu"
        >
          {showMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {showMenu && (
        <div className="border-t border-slate-150 bg-white p-5 md:hidden space-y-4 animate-fade-in shadow-lg">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-600 border border-indigo-100">
              {getInitials(user?.name)}
            </span>
            <div>
              <div className="text-sm font-semibold text-slate-900">{user?.name}</div>
              <div className="text-xs text-slate-400">{user?.email}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-1">
            <Link
              to="/dashboard"
              onClick={() => setShowMenu(false)}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition"
            >
              <LayoutDashboard className="h-4 w-4 text-slate-400" />
              Dashboard
            </Link>
            <Link
              to="/trips"
              onClick={() => setShowMenu(false)}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition"
            >
              <Calendar className="h-4 w-4 text-slate-400" />
              Trips
            </Link>
            <Link
              to="/trips/new"
              onClick={() => setShowMenu(false)}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition"
            >
              <PlusCircle className="h-4 w-4 text-slate-400" />
              Create Trip
            </Link>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-50 hover:bg-red-100/70 py-2.5 text-sm font-semibold text-red-650 transition duration-150"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
