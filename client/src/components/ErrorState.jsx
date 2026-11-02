import { AlertTriangle, RotateCcw } from 'lucide-react';

const ErrorState = ({ message = 'Something went wrong.', onRetry }) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-100 bg-rose-50/60 px-6 py-14 text-center">
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
      <AlertTriangle className="h-5 w-5" strokeWidth={1.75} />
    </div>
    <h3 className="font-display text-lg font-semibold text-ink">We hit a snag</h3>
    <p className="mt-1.5 max-w-sm text-sm text-ink/55">{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="btn-outline btn-sm mt-5">
        <RotateCcw className="h-3.5 w-3.5" /> Try again
      </button>
    )}
  </div>
);

export default ErrorState;
