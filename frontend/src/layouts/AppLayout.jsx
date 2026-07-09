import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-7xl w-full mx-auto grid lg:grid-cols-[250px_1fr]">
        <Sidebar />
        <main className="p-6 lg:p-10 overflow-hidden">
          <div className="animate-fade-in duration-200">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
