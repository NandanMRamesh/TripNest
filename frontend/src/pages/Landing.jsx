import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Plane, Compass, Wallet, MapPin, Search, ArrowRight, ShieldCheck } from 'lucide-react';
import travelVideo from '../assets/travelcinematic.mp4';
import goaImg from '../assets/goa.jpg';
import manaliImg from '../assets/manali.jpg';
import keralaImg from '../assets/kerala.jpg';

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (isAuthenticated) {
        navigate(`/trips/new?destination=${encodeURIComponent(searchQuery)}`);
      } else {
        navigate(`/login?redirect=new-trip&destination=${encodeURIComponent(searchQuery)}`);
      }
    }
  };

  const destinations = [
    { name: 'Goa', image: goaImg, desc: 'Sun-kissed beaches & vibrant nightlife', budget: '$500+' },
    { name: 'Manali', image: manaliImg, desc: 'Snow-capped peaks & scenic valley escapes', budget: '$700+' },
    { name: 'Kerala', image: keralaImg, desc: 'Serene backwaters & lush nature trails', budget: '$600+' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Dynamic Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/80 backdrop-blur-md border-b border-slate-200/50 py-4 shadow-sm'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 text-xl font-bold tracking-tight">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
              <Plane className="h-5 w-5 -rotate-45" />
            </span>
            <span className={isScrolled ? 'text-slate-900' : 'text-white'}>TripNest</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#destinations" className={`text-sm font-medium transition ${isScrolled ? 'text-slate-600 hover:text-indigo-600' : 'text-slate-200 hover:text-white'}`}>
              Destinations
            </a>
            <a href="#features" className={`text-sm font-medium transition ${isScrolled ? 'text-slate-600 hover:text-indigo-600' : 'text-slate-200 hover:text-white'}`}>
              Features
            </a>
            <a href="#workflow" className={`text-sm font-medium transition ${isScrolled ? 'text-slate-600 hover:text-indigo-600' : 'text-slate-200 hover:text-white'}`}>
              How it Works
            </a>
          </nav>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 hover:shadow-indigo-600/30 transition duration-200"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`text-sm font-semibold transition ${
                    isScrolled ? 'text-slate-700 hover:text-indigo-600' : 'text-slate-200 hover:text-white'
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-550 transition duration-200"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative h-[100vh] flex items-center justify-center overflow-hidden">
        {/* Background Cinematic Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        >
          <source src={travelVideo} type="video/mp4" />
        </video>

        {/* Gradient/Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-slate-50 z-10" />

        {/* Content */}
        <div className="relative z-20 text-center px-6 max-w-4xl mx-auto mt-16">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md px-3.5 py-1.5 text-sm font-medium text-slate-200 border border-white/15 mb-6">
            <Compass className="h-4 w-4 text-indigo-400" /> Start Your Next Adventure
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight drop-shadow-sm">
            Discover Your Next <span className="bg-gradient-to-r from-indigo-300 to-sky-200 bg-clip-text text-transparent">Getaway</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Plan daily itineraries, coordinate budgets, and log expenses seamlessly in one premium platform.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="bg-white/10 backdrop-blur-xl p-2.5 rounded-2xl md:rounded-full flex flex-col md:flex-row items-center max-w-2xl mx-auto shadow-2xl border border-white/20 gap-3">
            <div className="flex items-center gap-3 px-4 w-full flex-1">
              <MapPin className="h-5 w-5 text-indigo-300 shrink-0" />
              <input
                type="text"
                placeholder="Where would you like to go?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-white placeholder-slate-300 w-full text-base py-2.5 focus:ring-0"
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl md:rounded-full flex items-center justify-center gap-2 transition w-full md:w-auto shadow-lg shadow-indigo-600/30"
            >
              <Search className="h-4 w-4" />
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Destinations Section */}
      <section id="destinations" className="max-w-7xl mx-auto px-6 py-24 md:py-32">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Popular Destinations</h2>
          <p className="mt-3 text-lg text-slate-500 font-light">Curated travel inspiration for your next itinerary outline.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {destinations.map((place) => (
            <div
              key={place.name}
              className="group bg-white rounded-3xl overflow-hidden shadow-soft border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col"
            >
              <div className="relative h-72 overflow-hidden">
                <img
                  src={place.image}
                  alt={place.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3.5 py-1.5 rounded-full text-xs font-bold text-indigo-600 shadow-sm">
                  Est: {place.budget}
                </div>
              </div>
              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{place.name}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1 font-light">{place.desc}</p>
                <Link
                  to={isAuthenticated ? '/trips/new' : '/login'}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-semibold py-3 text-sm transition-colors duration-200"
                >
                  Plan Trip <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-slate-900 text-white py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="inline-block bg-indigo-500/10 text-indigo-400 font-semibold text-xs tracking-wider uppercase px-3.5 py-1 rounded-full mb-3">
              Features
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Smart Planning Made Simple</h2>
            <p className="mt-3 text-slate-400 font-light">TripNest gives you full control over budgets, schedules, and expense histories.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-800 flex flex-col items-start hover:border-slate-700 transition duration-300">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-600 text-white mb-6">
                <Compass className="h-6 w-6" />
              </span>
              <h3 className="text-xl font-bold mb-3">Itinerary Timeline</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-light">
                Map out daily locations, sights, and tasks. Organise day-by-day routes with ease.
              </p>
            </div>

            <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-800 flex flex-col items-start hover:border-slate-700 transition duration-300">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-600 text-white mb-6">
                <Wallet className="h-6 w-6" />
              </span>
              <h3 className="text-xl font-bold mb-3">Budget Allocations</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-light">
                Set budget targets and observe visual status indicators that change based on spending rates.
              </p>
            </div>

            <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-800 flex flex-col items-start hover:border-slate-700 transition duration-300">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-600 text-white mb-6">
                <ShieldCheck className="h-6 w-6" />
              </span>
              <h3 className="text-xl font-bold mb-3">Expense Analytics</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-light">
                Log costs on the go, filter transactions by category, and download summaries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="max-w-7xl mx-auto px-6 py-24 md:py-32">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="inline-block bg-indigo-100 text-indigo-700 font-semibold text-xs tracking-wider uppercase px-3.5 py-1 rounded-full mb-3">
            Workflow
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">How TripNest Works</h2>
          <p className="mt-3 text-lg text-slate-500 font-light">Seamlessly transitions from travel idea to structured memory.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="flex flex-col items-center text-center p-6">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-indigo-650 font-extrabold text-lg border-4 border-indigo-50 mb-6 shadow-sm">1</span>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Create a Profile</h3>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs font-light">
              Sign up instantly to start building trips. Keep all itineraries secure and persistent.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-indigo-650 font-extrabold text-lg border-4 border-indigo-50 mb-6 shadow-sm">2</span>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Add Dates & Budget</h3>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs font-light">
              Provide locations, timeline range, and budget limits. The system sets up dashboards automatically.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-indigo-650 font-extrabold text-lg border-4 border-indigo-50 mb-6 shadow-sm">3</span>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Travel & Log</h3>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs font-light">
              Update itineraries from your phone or laptop. Register costs to track remaining budget in real-time.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-lg mb-4">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-white">
                <Plane className="h-4 w-4 -rotate-45" />
              </span>
              TripNest
            </div>
            <p className="text-sm text-slate-500 leading-relaxed font-light">
              Elevate your vacation coordination. Save time, budget better, travel smarter.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">App Pages</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/login" className="hover:text-indigo-400 transition">Sign In</Link></li>
              <li><Link to="/register" className="hover:text-indigo-400 transition">Register</Link></li>
              <li><Link to={isAuthenticated ? '/dashboard' : '/login'} className="hover:text-indigo-400 transition">My Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="hover:text-indigo-400 transition">About Us</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">Follow Us</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="hover:text-indigo-400 transition">Twitter / X</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition">Instagram</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition">Support Hub</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-900 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} TripNest. All rights reserved. Built with passion for modern travelers.
        </div>
      </footer>
    </div>
  );
}
