import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  BookMarked,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  BookOpenCheck,
  Clock,
  Shield,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

const Login = () => {
  const [role, setRole] = useState('student');
  const [form, setForm] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedEmail = localStorage.getItem('libraflow_saved_email');
    if (savedEmail) {
      setForm((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    try {
      const user = await login({ ...form, role });
      if (rememberMe) {
        localStorage.setItem('libraflow_saved_email', form.email);
      } else {
        localStorage.removeItem('libraflow_saved_email');
      }
      const from = location.state?.from?.pathname;
      navigate(from || (user.role === 'admin' ? '/admin' : '/dashboard'), { replace: true });
    } catch (err) {
      toast.error(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (targetRole) => {
    setRole(targetRole);
    if (targetRole === 'admin') {
      setForm({
        email: 'admin@libraflow.edu',
        password: 'Password@123',
      });
      toast.success('Admin demo credentials populated!', { icon: '🛡️' });
    } else {
      setForm({
        email: 'aarav.sharma@student.libraflow.edu',
        password: 'Password@123',
      });
      toast.success('Student demo credentials populated!', { icon: '🎓' });
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-paper py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      {/* Background Decorative Blur Elements */}
      <div
        className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-300/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-plum-300/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-5xl">
        <div className="overflow-hidden rounded-3xl border border-ink/[0.08] bg-white shadow-lift grid grid-cols-1 lg:grid-cols-12">
          {/* Left Hero Visual Panel */}
          <div className="relative hidden lg:flex lg:col-span-5 flex-col justify-between bg-ink p-10 text-white overflow-hidden">
            {/* Grain and subtle radial lighting overlay */}
            <div className="absolute inset-0 bg-grain pointer-events-none opacity-40" />
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-2xl" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-plum-500/30 blur-2xl" />

            <div className="relative z-10">
              <Link to="/" className="inline-flex items-center gap-2.5 group">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md text-white transition group-hover:scale-105 group-hover:bg-indigo-500">
                  <BookMarked className="h-5 w-5" strokeWidth={2} />
                </span>
                <span className="font-display text-2xl font-semibold tracking-tight text-white">
                  LibraFlow
                </span>
              </Link>

              <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-xs font-medium text-white/90 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-gold" />
                <span>Next-Gen Campus Library</span>
              </div>

              <h2 className="mt-6 font-display text-3xl font-bold leading-tight tracking-tight text-white">
                Discover knowledge without boundaries.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                Borrow seamlessly, track real-time reservations, and access academic resources anywhere on campus.
              </p>

              {/* Highlights Feature List */}
              <div className="mt-8 space-y-3.5">
                <div className="flex items-start gap-3 rounded-2xl bg-white/[0.06] p-3.5 border border-white/10 backdrop-blur-sm transition hover:bg-white/[0.09]">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/30 text-indigo-300">
                    <BookOpenCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Instant Reservations</h4>
                    <p className="text-[11px] text-white/60">Reserve high-demand books and pick up in under 60 seconds.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-white/[0.06] p-3.5 border border-white/10 backdrop-blur-sm transition hover:bg-white/[0.09]">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-plum-500/30 text-plum-300">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Smart Renewal Alerts</h4>
                    <p className="text-[11px] text-white/60">Never get caught by overdue fees with automated reminders.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-white/[0.06] p-3.5 border border-white/10 backdrop-blur-sm transition hover:bg-white/[0.09]">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/30 text-emerald-300">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Role-Based Access</h4>
                    <p className="text-[11px] text-white/60">Dedicated student dashboard and powerful librarian admin tools.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial Quote */}
            <div className="relative z-10 mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-400 to-plum-400 text-ink font-bold text-xs">
                  LF
                </div>
                <div>
                  <p className="text-xs font-medium text-white/90">Over 10,000+ Active Books</p>
                  <p className="text-[11px] text-white/50">Trusted by modern university libraries</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="col-span-1 lg:col-span-7 p-7 sm:p-10 flex flex-col justify-center">
            <div className="mx-auto w-full max-w-md">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <span className="eyebrow flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                    Authentication
                  </span>
                  <Link
                    to="/"
                    className="text-xs font-semibold text-ink/40 hover:text-ink transition flex items-center gap-1"
                  >
                    Back to Catalog <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
                <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                  Welcome to LibraFlow
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-ink/60">
                  Please select your account type and enter your login details.
                </p>
              </div>

              {/* Account Role Selector */}
              <div className="mb-6 rounded-2xl bg-paper p-1.5 border border-ink/[0.06] grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  id="role-student-btn"
                  onClick={() => setRole('student')}
                  className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                    role === 'student'
                      ? 'bg-white text-ink shadow-soft border border-ink/[0.04]'
                      : 'text-ink/50 hover:text-ink hover:bg-white/50'
                  }`}
                >
                  <GraduationCap className="h-4 w-4 text-indigo-600" />
                  <span>Student Portal</span>
                </button>
                <button
                  type="button"
                  id="role-admin-btn"
                  onClick={() => setRole('admin')}
                  className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                    role === 'admin'
                      ? 'bg-white text-ink shadow-soft border border-ink/[0.04]'
                      : 'text-ink/50 hover:text-ink hover:bg-white/50'
                  }`}
                >
                  <ShieldCheck className="h-4 w-4 text-plum-600" />
                  <span>Staff / Admin</span>
                </button>
              </div>

              {/* Quick Demo Pre-fill Bar */}
              <div className="mb-6 rounded-xl border border-indigo-100 bg-indigo-50/50 p-3 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
                <div className="flex items-center gap-2 text-indigo-900/80 font-medium">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                  <span>Testing the platform?</span>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => handleDemoFill('student')}
                    className="flex-1 sm:flex-none rounded-lg bg-white px-2.5 py-1 font-semibold text-indigo-700 shadow-sm border border-indigo-200/80 hover:bg-indigo-50 transition active:scale-95 text-[11px]"
                  >
                    Demo Student
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoFill('admin')}
                    className="flex-1 sm:flex-none rounded-lg bg-white px-2.5 py-1 font-semibold text-plum-700 shadow-sm border border-plum-200/80 hover:bg-plum-50 transition active:scale-95 text-[11px]"
                  >
                    Demo Admin
                  </button>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <label className="label" htmlFor="email-input">
                      {role === 'admin' ? 'Staff Email' : 'Student Email'}
                    </label>
                    <span className="text-[11px] text-ink/40">
                      {role === 'admin' ? 'admin@libraflow.edu' : '@student.libraflow.edu'}
                    </span>
                  </div>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
                    <input
                      id="email-input"
                      type="email"
                      required
                      className="input pl-10 text-sm"
                      placeholder={role === 'admin' ? 'admin@libraflow.edu' : 'aarav.sharma@student.libraflow.edu'}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="label" htmlFor="password-input">Password</label>
                    <Link
                      to="/forgot-password"
                      className="mb-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
                    <input
                      id="password-input"
                      type={showPassword ? 'text' : 'password'}
                      required
                      className="input pl-10 pr-10 text-sm"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                    <button
                      type="button"
                      id="toggle-password-visibility"
                      onClick={() => setShowPassword((s) => !s)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/35 hover:text-ink/70 transition p-1"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      id="remember-me"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-ink/20 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-xs text-ink/70 font-medium">Remember my email</span>
                  </label>
                  <span className="text-[11px] text-ink/40 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" /> 256-bit SSL encrypted
                  </span>
                </div>

                <button
                  type="submit"
                  id="submit-login-btn"
                  disabled={loading}
                  className="btn-primary w-full py-3 text-sm font-semibold tracking-wide flex items-center justify-center gap-2 shadow-card"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In as {role === 'admin' ? 'Administrator' : 'Student'}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Footer Switcher */}
              <div className="mt-7 text-center border-t border-ink/[0.06] pt-5">
                <p className="text-xs sm:text-sm text-ink/60">
                  New to LibraFlow?{' '}
                  <Link
                    to="/signup"
                    className="font-semibold text-indigo-600 hover:text-indigo-800 transition"
                  >
                    Create student account
                  </Link>
                </p>
                <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-ink/40">
                  <span>Help & Support</span>
                  <span>•</span>
                  <span>Library Guidelines</span>
                  <span>•</span>
                  <span>Privacy Policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
