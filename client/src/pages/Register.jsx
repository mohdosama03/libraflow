import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  BookMarked,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  GraduationCap,
  Bookmark,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    const pwd = form.password;
    if (!pwd) return { score: 0, label: 'None', color: 'bg-ink/10' };

    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-rose-500', width: 'w-1/3' };
    if (score <= 3) return { score: 2, label: 'Medium', color: 'bg-amber-500', width: 'w-2/3' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-500', width: 'w-full' };
  }, [form.password]);

  const passwordsMatch = form.password && form.confirmPassword ? form.password === form.confirmPassword : true;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agreeTerms) {
      toast.error('Please agree to the Library Honor Code and terms.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...payload } = form;
      await register(payload);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.message || 'Registration failed. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    setForm({
      name: 'Maya Lin',
      email: `maya.lin${randomSuffix}@student.libraflow.edu`,
      phone: '9812345678',
      password: 'Password@123',
      confirmPassword: 'Password@123',
    });
    setAgreeTerms(true);
    toast.success('Sample registration details generated!', { icon: '✨' });
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-paper py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      {/* Decorative Blur Background Orbs */}
      <div
        className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-plum-300/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-300/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-5xl">
        <div className="overflow-hidden rounded-3xl border border-ink/[0.08] bg-white shadow-lift grid grid-cols-1 lg:grid-cols-12">
          {/* Left Hero Visual Panel */}
          <div className="relative hidden lg:flex lg:col-span-5 flex-col justify-between bg-ink p-10 text-white overflow-hidden">
            {/* Grain texture & lighting effects */}
            <div className="absolute inset-0 bg-grain pointer-events-none opacity-40" />
            <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-plum-500/30 blur-2xl" />
            <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-indigo-500/25 blur-2xl" />

            <div className="relative z-10">
              <Link to="/" className="inline-flex items-center gap-2.5 group">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md text-white transition group-hover:scale-105 group-hover:bg-plum-500">
                  <BookMarked className="h-5 w-5" strokeWidth={2} />
                </span>
                <span className="font-display text-2xl font-semibold tracking-tight text-white">
                  LibraFlow
                </span>
              </Link>

              <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-xs font-medium text-white/90 backdrop-blur-md">
                <GraduationCap className="h-3.5 w-3.5 text-indigo-300" />
                <span>Student Membership</span>
              </div>

              <h2 className="mt-6 font-display text-3xl font-bold leading-tight tracking-tight text-white">
                Start your campus reading journey.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                Unlock instant digital reservations, automatic catalog search, personalized reading lists, and seamless borrowing history.
              </p>

              {/* Student Perks */}
              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-3 rounded-2xl bg-white/[0.06] p-3 border border-white/10 backdrop-blur-sm">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-500/30 text-indigo-300">
                    <Bookmark className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Up to 5 Concurrent Books</h4>
                    <p className="text-[11px] text-white/60">Standard 14-day borrowing with 1-click renewals.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-white/[0.06] p-3 border border-white/10 backdrop-blur-sm">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-plum-500/30 text-plum-300">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Auto Student ID</h4>
                    <p className="text-[11px] text-white/60">Assigned a permanent unique digital ID upon signup.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-white/[0.06] p-3 border border-white/10 backdrop-blur-sm">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/30 text-emerald-300">
                    <ShieldCheck className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Zero Hidden Charges</h4>
                    <p className="text-[11px] text-white/60">Transparent loan tracking and automated due date alerts.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* University Badge */}
            <div className="relative z-10 mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between text-xs text-white/60">
                <span>Central Campus Library System</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Instant Activation
                </span>
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
                    <span className="h-1.5 w-1.5 rounded-full bg-plum-500 animate-pulse" />
                    Student Registration
                  </span>
                  <button
                    type="button"
                    onClick={handleDemoFill}
                    className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-700 hover:bg-indigo-100 transition active:scale-95"
                  >
                    <Sparkles className="h-3 w-3 text-indigo-600" />
                    Fill Demo
                  </button>
                </div>
                <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                  Create your account
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-ink/60">
                  Join LibraFlow today. It only takes a minute to get started.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="label" htmlFor="register-name">Full name</label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
                    <input
                      id="register-name"
                      type="text"
                      required
                      className="input pl-10 text-sm"
                      placeholder="e.g. Maya Lin"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                </div>

                {/* Email and Phone grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="label" htmlFor="register-email">Email address</label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
                      <input
                        id="register-email"
                        type="email"
                        required
                        className="input pl-10 text-sm"
                        placeholder="you@student.libraflow.edu"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label" htmlFor="register-phone">Phone (optional)</label>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
                      <input
                        id="register-phone"
                        type="tel"
                        className="input pl-10 text-sm"
                        placeholder="e.g. 9810000000"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="label" htmlFor="register-password">Password</label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
                    <input
                      id="register-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      className="input pl-10 pr-10 text-sm"
                      placeholder="At least 6 characters"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                    <button
                      type="button"
                      id="toggle-register-password"
                      onClick={() => setShowPassword((s) => !s)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/35 hover:text-ink/70 transition p-1"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {form.password && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-ink/50">Password strength:</span>
                        <span className="font-semibold text-ink/75">{passwordStrength.label}</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink/[0.06]">
                        <div
                          className={`h-full transition-all duration-300 ${passwordStrength.color} ${passwordStrength.width}`}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <div className="flex items-center justify-between">
                    <label className="label" htmlFor="register-confirm-password">Confirm Password</label>
                    {form.confirmPassword && (
                      <span className="text-[11px] flex items-center gap-1 font-medium">
                        {form.password === form.confirmPassword ? (
                          <span className="text-emerald-600 flex items-center gap-0.5">
                            <CheckCircle2 className="h-3 w-3" /> Passwords match
                          </span>
                        ) : (
                          <span className="text-rose-500 flex items-center gap-0.5">
                            <XCircle className="h-3 w-3" /> Passwords do not match
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
                    <input
                      id="register-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      className="input pl-10 pr-10 text-sm"
                      placeholder="Re-enter password"
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    />
                    <button
                      type="button"
                      id="toggle-register-confirm-password"
                      onClick={() => setShowConfirmPassword((s) => !s)}
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/35 hover:text-ink/70 transition p-1"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Terms and Honor Code Agreement */}
                <div className="rounded-xl bg-paper p-3 border border-ink/[0.06]">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      id="agree-terms-checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-ink/20 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-xs text-ink/70 leading-relaxed">
                      I agree to the <span className="font-semibold text-ink">Library Honor Code</span>, loan limits (14 days), and acceptable use policy.
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  id="submit-register-btn"
                  disabled={loading || !agreeTerms || (form.confirmPassword && !passwordsMatch)}
                  className="btn-primary w-full py-3 text-sm font-semibold tracking-wide flex items-center justify-center gap-2 shadow-card"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Footer Switcher */}
              <div className="mt-7 text-center border-t border-ink/[0.06] pt-5">
                <p className="text-xs sm:text-sm text-ink/60">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="font-semibold text-indigo-600 hover:text-indigo-800 transition"
                  >
                    Log in here
                  </Link>
                </p>
                <p className="mt-2 text-[11px] text-ink/40">
                  Are you library staff? Please ask an administrator to provision your credentials.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
