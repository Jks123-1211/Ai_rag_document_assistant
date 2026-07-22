function Navbar({ onMenuClick }) {
  return (
    <header className="flex shrink-0 items-center justify-between border-b border-white/8 bg-zinc-950/80 px-4 py-3 backdrop-blur-xl sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-zinc-300 transition hover:bg-white/10 hover:text-white lg:hidden"
          aria-label="Open chat menu"
        >
          <span className="text-lg leading-none">☰</span>
        </button>
        <div>
          <p className="text-sm font-semibold tracking-tight text-white sm:text-base">
            AI Data Analyst
          </p>
          <p className="hidden text-xs text-zinc-500 sm:block">
            Ask questions about your uploaded documents
          </p>
        </div>
      </div>

      <div className="hidden items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-300 sm:flex">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        Ready to analyze
      </div>
    </header>
  );
}

export default Navbar;
