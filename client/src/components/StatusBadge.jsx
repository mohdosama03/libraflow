const STATUS_STYLES = {
  available: 'bg-emerald-50 text-emerald-700',
  unavailable: 'bg-ink/8 text-ink/50',
  issued: 'bg-indigo-50 text-indigo-700',
  'due soon': 'bg-amber-50 text-amber-700',
  'due-soon': 'bg-amber-50 text-amber-700',
  overdue: 'bg-rose-50 text-rose-700',
  returned: 'bg-emerald-50 text-emerald-700',
  pending: 'bg-amber-50 text-amber-700',
  approved: 'bg-emerald-50 text-emerald-700',
  rejected: 'bg-rose-50 text-rose-700',
  completed: 'bg-indigo-50 text-indigo-700',
  paid: 'bg-emerald-50 text-emerald-700',
  waived: 'bg-ink/8 text-ink/55',
  active: 'bg-emerald-50 text-emerald-700',
  inactive: 'bg-ink/8 text-ink/50',
};

const DOT_STYLES = {
  available: 'bg-emerald-500',
  issued: 'bg-indigo-500',
  'due soon': 'bg-amber-500',
  'due-soon': 'bg-amber-500',
  overdue: 'bg-rose-500',
  returned: 'bg-emerald-500',
  pending: 'bg-amber-500',
  approved: 'bg-emerald-500',
  rejected: 'bg-rose-500',
  completed: 'bg-indigo-500',
  paid: 'bg-emerald-500',
  waived: 'bg-ink/40',
  active: 'bg-emerald-500',
  inactive: 'bg-ink/30',
  unavailable: 'bg-ink/30',
};

const StatusBadge = ({ status }) => {
  const key = (status || '').toLowerCase();
  const style = STATUS_STYLES[key] || 'bg-ink/8 text-ink/60';
  const dot = DOT_STYLES[key] || 'bg-ink/40';
  const label = key.replace(/-/g, ' ');

  return (
    <span className={`badge ${style} capitalize`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
};

export default StatusBadge;
