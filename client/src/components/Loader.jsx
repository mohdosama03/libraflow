import { BookOpen } from 'lucide-react';

const Loader = ({ fullScreen = false, label = 'Loading...' }) => {
  const content = (
    <div className="flex flex-col items-center gap-3">
      <div className="relative flex h-12 w-12 items-center justify-center">
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
        <BookOpen className="h-5 w-5 text-indigo-600" strokeWidth={1.75} />
      </div>
      <p className="text-sm font-medium text-ink/50">{label}</p>
    </div>
  );

  if (fullScreen) {
    return <div className="flex min-h-[60vh] w-full items-center justify-center">{content}</div>;
  }
  return <div className="flex w-full items-center justify-center py-16">{content}</div>;
};

export default Loader;
