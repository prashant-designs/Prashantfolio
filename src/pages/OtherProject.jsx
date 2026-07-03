export default function OtherProject() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-4 py-10 sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-80px)] max-w-5xl flex-col justify-center rounded-[2rem] border border-white/10 bg-white/5 p-10 shadow-[0_30px_120px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:p-12">
        <span className="mb-4 inline-flex rounded-full bg-cyan-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200">
          Other Project
        </span>
        <h1 className="text-4xl font-semibold text-white sm:text-5xl">Another chapter is coming.</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          This page will soon showcase additional portfolio work and design experimentation. For now, the experience stays consistent with the dark theme and focused layout.
        </p>
        <div className="mt-10 rounded-3xl border border-slate-800 bg-slate-950/80 p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Status</p>
          <p className="mt-4 text-2xl font-semibold text-slate-100">Coming soon</p>
          <p className="mt-3 text-slate-400">More projects are being prepared for the same polished portfolio flow.</p>
        </div>
      </section>
    </main>
  );
}
