export default function PageLoader() {
  return (
    <section className="loader-screen" aria-label="Loading">
      <div className="loader-mark" aria-hidden="true">
        <span className="loader-dot"></span>
        <span className="loader-dot"></span>
        <span className="loader-dot"></span>
      </div>
      <p className="loader-txt">loading…</p>
    </section>
  );
}
