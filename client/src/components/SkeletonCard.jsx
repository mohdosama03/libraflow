const SkeletonCard = () => (
  <div className="card overflow-hidden">
    <div className="h-48 w-full animate-pulse bg-ink/[0.06]" />
    <div className="space-y-2.5 p-4">
      <div className="h-3 w-1/3 animate-pulse rounded-full bg-ink/[0.08]" />
      <div className="h-4 w-4/5 animate-pulse rounded-full bg-ink/[0.08]" />
      <div className="h-3 w-2/5 animate-pulse rounded-full bg-ink/[0.08]" />
    </div>
  </div>
);

export default SkeletonCard;
