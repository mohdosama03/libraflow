import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, BookMarked, CheckCircle2, ArrowLeft, ArrowRight, KeyRound, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
      toast.success('Password reset instructions dispatched.');
    } catch (err) {
      toast.error(err.message || 'Unable to send reset instructions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-paper py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      {/* Decorative Orbs */}
      <div
        className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-300/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-plum-300/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md">
        {/* Branding */}
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink text-white shadow-soft transition group-hover:scale-105 group-hover:bg-indigo-600">
              <BookMarked className="h-5 w-5" strokeWidth={2} />
            </span>
            <span className="font-display text-2xl font-bold tracking-tight text-ink">LibraFlow</span>
          </Link>
          <h1 className="mt-6 font-display text-2xl sm:text-3xl font-bold text-ink">Reset Password</h1>
          <p className="mt-1.5 text-xs sm:text-sm text-ink/60">
            Enter your registered student or staff email to receive recovery instructions.
          </p>
        </div>

        {/* Main Card */}
        <div className="card p-7 sm:p-8 shadow-card border border-ink/[0.08]">
          {sent ? (
            <div className="text-center py-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50">
                <CheckCircle2 className="h-7 w-7" strokeWidth={2} />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-ink">Check your inbox</h3>
              <p className="mt-2 text-xs sm:text-sm text-ink/60 leading-relaxed">
                If an account exists for <span className="font-semibold text-ink">{email}</span>, we have dispatched a secure recovery link.
              </p>

              <div className="mt-6 rounded-xl bg-paper p-3 text-xs text-ink/50 border border-ink/[0.06]">
                Did not receive the email? Check your spam folder or try re-entering your email address.
              </div>

              <div className="mt-6 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="btn-outline w-full text-xs font-semibold"
                >
                  Try another email
                </button>
                <Link to="/login" className="btn-primary w-full text-xs font-semibold">
                  Back to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label" htmlFor="reset-email">Email address</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
                  <input
                    id="reset-email"
                    type="email"
                    required
                    className="input pl-10 text-sm"
                    placeholder="you@student.libraflow.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                className="btn-primary w-full py-3 text-sm font-semibold tracking-wide flex items-center justify-center gap-2 shadow-card"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Instructions</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="mt-3 rounded-xl bg-indigo-50/60 p-3 text-xs text-indigo-900/80 border border-indigo-100 flex items-start gap-2">
                <KeyRound className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>
                  Demo accounts are protected. Standard test accounts use password: <code className="font-mono font-semibold">Password@123</code>
                </span>
              </div>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-xs sm:text-sm text-ink/50">
          Remember your password?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-800 transition">
            Return to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
