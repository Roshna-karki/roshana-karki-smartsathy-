import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('[Login] submit', { email: formData.email });

    try {
      await login(formData.email, formData.password);
      console.log('[Login] login succeeded, navigating to /dashboard');
      navigate('/dashboard');
    } catch (err) {
      console.error('[Login] login error', err);
      setError(
        err.response?.data?.message || 'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white overflow-hidden">
      {/* Form side */}
      <div className="flex-1 flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-lg space-y-6">
          <div className="space-y-2 text-center">
            <p className="text-blue-600 text-xl font-bold">Smart Sathy</p>
            <h1 className="text-2xl font-bold text-gray-900">
              Log in to Your Account
            </h1>
            <p className="text-gray-600 text-sm">
              Log in to your account so you can continue building and editing
              your onboarding flows.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-3">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-800"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none transition"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-800"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-2.5 rounded-lg border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none transition"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4 border-gray-300" />
                  Remember Me
                </label>
                <button
                  type="button"
                  className="text-blue-600 font-medium hover:text-blue-700"
                >
                  Forgot password
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold shadow-sm hover:bg-blue-700 transition disabled:opacity-60 flex justify-center items-center gap-2"
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                <span>{loading ? 'Signing in...' : 'LOG IN'}</span>
              </button>
            </form>

          </div>
        </div>
      </div>

      {/* Right blue CTA */}
      <div
        className="hidden lg:flex w-5/12 bg-blue-600 text-white items-center justify-center px-10 relative"
        style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0 100%)' }}
      >
        <div className="max-w-xs text-center space-y-3">
          <p className="text-2xl font-bold">Don’t Have an Account Yet?</p>
          <p className="text-white/90 text-sm leading-relaxed">
             Sign up today and start growing your audience with powerful email marketing.
          </p>
          <Link
            to="/register"
            className="inline-flex justify-center items-center w-full rounded border border-white/60 px-4 py-3 font-semibold hover:bg-white hover:text-blue-600 transition"
          >
            SIGN UP
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

