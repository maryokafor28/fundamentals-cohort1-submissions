export function PageLoader() {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-sm text-slate-300">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
        <span>Loading the latest DevConnect updates…</span>
      </div>
    </div>
  );
}
