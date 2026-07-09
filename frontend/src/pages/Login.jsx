import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import { Plane, Compass, ArrowLeft } from 'lucide-react';
import keralaImg from '../assets/kerala.jpg';

export default function Login() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    setValidationErrors((prev) => ({
      ...prev,
      [name]: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors({});

    try {
      await login(formData.email, formData.password);
      
      // Handle post-login redirection if searched from Landing page
      const searchParams = new URLSearchParams(window.location.search);
      const redirect = searchParams.get('redirect');
      const destination = searchParams.get('destination');
      if (redirect === 'new-trip' && destination) {
        navigate(`/trips/new?destination=${encodeURIComponent(destination)}`);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData?.errors) {
        setValidationErrors(errorData.errors);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left panel - Hero Visual (desktop only) */}
      <div className="relative hidden w-1/2 overflow-hidden lg:block">
        <img
          src={keralaImg}
          alt="Travel background"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/80 to-slate-950/90" />
        
        {/* Quote & Logo Info Overlay */}
        <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
          <Link to="/" className="inline-flex items-center gap-2.5 text-lg font-bold tracking-tight">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-650 text-white shadow-md">
              <Plane className="h-4.5 w-4.5 -rotate-45" />
            </span>
            TripNest
          </Link>
          
          <div className="space-y-6">
            <blockquote className="text-3xl font-light leading-relaxed">
              "The world is a book and those who do not travel read only one page."
            </blockquote>
            <cite className="block text-sm not-italic font-semibold text-indigo-350">— Saint Augustine</cite>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <Compass className="h-4 w-4 text-indigo-400" />
            Empowering over 10,000+ global explorers.
          </div>
        </div>
      </div>

      {/* Right panel - Form Canvas */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16 xl:px-24 bg-white relative">
        <Link to="/" className="absolute top-8 left-8 lg:left-16 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition font-medium">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <div className="mx-auto w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Welcome Back</h1>
            <p className="mt-2 text-sm text-slate-500 font-light">Sign in to your TripNest account to continue planning</p>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl bg-red-50 border border-red-150 p-4 animate-shake">
              <p className="text-sm font-semibold text-red-655">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <FormInput
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              error={validationErrors.email}
              required
            />

            <FormInput
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              error={validationErrors.password}
              required
            />

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition duration-200 mt-2 shadow-lg shadow-indigo-650/10"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-550">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 transition">
              Create one for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
