const StatCard = ({ icon: Icon, label, value, tone = 'indigo', trend }) => {
  const tones = {
    indigo: 'bg-indigo-50 text-indigo-600',
    plum: 'bg-plum-50 text-plum-600',
    marine: 'bg-marine-50 text-marine-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
    emerald: 'bg-emerald-50 text-emerald-600',
  };

  return (
    <div className="card flex items-center gap-4 p-5">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-ink/45">{label}</p>
        <p className="mt-0.5 font-display text-2xl font-semibold text-ink">{value}</p>
        {trend && <p className="mt-0.5 text-xs text-ink/40">{trend}</p>}
      </div>
    </div>
  );
};

export default StatCard;
