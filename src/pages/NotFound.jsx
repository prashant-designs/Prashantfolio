export default function NotFound() {
  return (
    <section className="notfound zone zone-sink">
      <div className="wrap">
        <p className="eyebrow">404 · Lost signal</p>
        <h1 className="nf-title">This page <span>doesn&apos;t exist.</span></h1>
        <p className="nf-sub">The route you followed leads nowhere - a typo, an old link, or a page that moved. Nothing broke; it&apos;s just not here.</p>
        <a className="btn-big" href="#/">Back to home <span aria-hidden="true">→</span></a>
      </div>
    </section>
  );
}
