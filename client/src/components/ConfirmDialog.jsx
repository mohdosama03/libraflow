import { AlertTriangle, X } from 'lucide-react';

const ConfirmDialog = ({ open, title, description, confirmLabel = 'Confirm', danger = true, onConfirm, onClose, loading }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lift">
        <div className="flex items-start justify-between">
          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${danger ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'}`}>
            <AlertTriangle className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <button onClick={onClose} className="text-ink/30 hover:text-ink/60">
            <X className="h-4 w-4" />
          </button>
        </div>
        <h3 className="mt-4 font-display text-lg font-semibold text-ink">{title}</h3>
        {description && <p className="mt-1.5 text-sm text-ink/55">{description}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="btn-ghost btn-sm">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading} className={danger ? 'btn-danger btn-sm' : 'btn-primary btn-sm'}>
            {loading ? 'Please wait...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
