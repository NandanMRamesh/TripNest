import { CalendarDays, LayoutDashboard, ReceiptText } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/trips', label: 'Trips', icon: CalendarDays },
  { to: '/trips/new', label: 'Create Trip', icon: ReceiptText }
];

export default function Sidebar() {
  return (
    <aside className="border-r border-slate-200 bg-white px-3 py-5 lg:min-h-[calc(100vh-4rem)]">
      <nav className="flex gap-2 overflow-x-auto lg:block lg:space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex min-w-fit items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
                isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
