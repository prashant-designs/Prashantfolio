import { useEffect, useRef, useState } from 'react';

const CS_STAGES = [
  { id: 'cs1', label: '01 Context' },
  { id: 'cs2', label: '02 Problem' },
  { id: 'cs3', label: '03 Discovery' },
  { id: 'cs4', label: '04 The Call' },
  { id: 'cs5', label: '05 The Build' },
  { id: 'cs6', label: '06 Outcome' },
];

const STATS = [
  { to: 3, prefix: '', suffix: '×', label: 'self-serve adoption' },
  { to: 40, prefix: '−', suffix: '%', label: 'dev handoffs per feature' },
  { to: 50, prefix: '~', suffix: '%', label: 'vendor dependency cut' },
];

function CountStat({ to, prefix, suffix, label }) {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !done.current) {
            done.current = true;
            const start = performance.now ? performance.now() : 0;
            const duration = 1100;
            const step = (now) => {
              const t = Math.min(1, (now - start) / duration);
              setN(Math.round(to * (1 - Math.pow(1 - t, 3))));
              if (t < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [to]);

  return (
    <div className="cstat" ref={ref}>
      <div className="n">{prefix}<b>{n}</b><span className="sfx">{suffix}</span></div>
      <div className="l">{label}</div>
    </div>
  );
}

export default function CurrentProject() {
  const [activeCs, setActiveCs] = useState('cs1');
  const fillRef = useRef(null);

  useEffect(() => {
    const blocks = CS_STAGES.map((s) => document.getElementById(s.id)).filter(Boolean);
    if (blocks.length === 0) return undefined;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = CS_STAGES.findIndex((s) => s.id === entry.target.id);
            if (idx >= 0) {
              setActiveCs(entry.target.id);
              if (fillRef.current) fillRef.current.style.height = `${((idx + 1) / CS_STAGES.length) * 100}%`;
            }
          }
        });
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 },
    );
    blocks.forEach((b) => obs.observe(b));
    return () => obs.disconnect();
  }, []);

  const jumpTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      {/* POLARIN HERO */}
      <section className="pol-hero">
        <div className="wrap">
          <p className="pol-kicker rv">Current Project · <b>POLO</b> · Network-as-a-Service</p>
          <h2 className="pol-title rv d1"><span>Polarin.</span></h2>
          <div className="pol-sub rv d2">
            <span><b>4 years</b> · 2022 — now</span>
            <span><b>first designer</b> → associate product manager</span>
            <span><b>5 surfaces</b> · one roadmap</span>
            <span><b>AI</b> in every loop</span>
          </div>
        </div>
      </section>

      {/* BRIEF */}
      <section>
        <div className="wrap pol-brief-grid">
          <p className="lede-big rv">Polarin is enterprise connectivity that provisions like cloud — and it's been
          <i> my longest-running product story.</i> I joined when it was a blank Figma file. Four years and three
          roles later, <em>every screen it has still passes through my hands</em> — first as its designer,
          now as its product manager, always as its builder.</p>
          <div className="pol-facts rv d1">
            <div className="fb"><span>platform</span><b>Network-as-a-Service</b></div>
            <div className="fb"><span>tenure</span><b>Nov 2022 — present</b></div>
            <div className="fb"><span>arc</span><b>Exec. Designer → Sr. Exec. → APM</b></div>
            <div className="fb"><span>surfaces owned</span><b>customer · admin · dev · invoicing · DS</b></div>
            <div className="fb"><span>self-serve adoption</span><b className="g">3× ↑</b></div>
            <div className="fb"><span>vendor dependency</span><b className="g">~50% ↓</b></div>
            <div className="fb"><span>status</span><b className="a">● shipping weekly</b></div>
          </div>
        </div>
      </section>

      {/* THREE HATS */}
      <section>
        <div className="wrap ch-head" style={{ paddingTop: '50px' }}>
          <p className="ch-num rv"><b>My input</b> · one product, three hats</p>
          <h2 className="ch-title rv d1">Same product.<br />Three <span>hats.</span></h2>
          <p style={{ color: 'var(--mute)', maxWidth: '56ch', marginTop: '14px' }} className="rv d2">Most products pass through many hands. Polarin passed through mine three times — in three different roles. Scroll: each hat stacks on the last, the way the skills did.</p>
        </div>
        <div className="wrap hat-stack">
          <article className="hat" data-big="DESIGN" style={{ top: 'calc(var(--nav-h) + 56px)', zIndex: 1 }}>
            <p className="hat-tag">Hat 01 · The Designer</p>
            <h3>Gave it a <span>face</span> — and a language.</h3>
            <p className="period">2022 — 2024 · Executive UI/UX Designer · first designer in the building</p>
            <p className="hat-desc">There was a network platform and no product surface. I drew the first screen,
            then <b>every module of the customer portal, 0 → 1</b> — and built the system underneath so
            screen two hundred would be as coherent as screen one.</p>
            <ul className="hat-list">
              <li><b>0→1 modules</b> — structure, core flows, screens for each portal capability</li>
              <li><b>Polarin Design System</b> — tokens, components, patterns; every surface still runs on it</li>
              <li><b>IA & navigation</b> — a mental model engineers and customers could share</li>
              <li><b>Usability testing</b> — flows validated with real network engineers before build</li>
            </ul>
            <div className="hat-metrics"><span className="hm">design → dev drift ↓ near zero</span><span className="hm">1 system · all surfaces</span></div>
          </article>
          <article className="hat" data-big="MANAGE" style={{ top: 'calc(var(--nav-h) + 74px)', zIndex: 2 }}>
            <p className="hat-tag">Hat 02 · The Manager</p>
            <h3>Gave it a <span>direction</span> — and a reason.</h3>
            <p className="period">2025 — now · Sr. Executive → Associate Product Manager · promoted 2×</p>
            <p className="hat-desc">The screens worked; the question became <b>which screens deserve to exist.</b>
            I took ownership of the developer & customer portal roadmap end to end — priorities argued from
            evidence, not opinion.</p>
            <ul className="hat-list">
              <li><b>Roadmap ownership</b> — end-to-end, across both portals</li>
              <li><b>Evidence-led priorities</b> — support data, usage analytics, customer interviews</li>
              <li><b>Sprint & release planning</b> — the drumbeat engineering ships to</li>
              <li><b>Stakeholder alignment</b> — sales, support, network engineering on one page</li>
            </ul>
            <div className="hat-metrics"><span className="hm">self-serve adoption 3× ↑</span><span className="hm">roadmap · 5 surfaces</span></div>
          </article>
          <article className="hat" data-big="BUILD" style={{ top: 'calc(var(--nav-h) + 92px)', zIndex: 3 }}>
            <p className="hat-tag">Hat 03 · The AI Builder</p>
            <h3>Gave it <span>speed</span> — and closed the loop.</h3>
            <p className="period">2024 — now · Claude · Figma · Cursor · VS Code · Vercel</p>
            <p className="hat-desc">Frontend changes used to route through outsourced vendors. Now the person who
            finds the problem <b>ships the fix</b> — I deploy frontend changes directly, and prototypes stopped
            being pictures of the spec. They became the spec.</p>
            <ul className="hat-list">
              <li><b>Direct deploys</b> — frontend changes via Claude + Figma in VS Code</li>
              <li><b>Prototypes as specs</b> — high-fidelity, working, on the design system</li>
              <li><b>AI discovery synthesis</b> — tickets & transcripts → ranked friction themes</li>
              <li><b>Rapid POCs</b> — idea to testable software in days, not sprints</li>
            </ul>
            <div className="hat-metrics"><span className="hm">vendor dependency ~50% ↓</span><span className="hm">dev handoffs 40% ↓</span></div>
          </article>
        </div>
      </section>

      {/* DETAILED CASE STUDY */}
      <section>
        <div className="wrap cs-head">
          <p className="ch-num rv"><b>Case Study 01</b> · Customer Portal · deep dive</p>
          <h2 className="ch-title rv d1">Teaching customers to<br />serve <span>themselves.</span></h2>
          <p style={{ color: 'var(--mute)', maxWidth: '58ch', marginTop: '14px' }} className="rv d2">The flagship story of my four years on Polarin — told the way the work actually went: context, problem, evidence, the call, the build, and what moved.</p>
        </div>
        <div className="wrap cs-wrap">
          <nav className="cs-rail" aria-label="Case study stages">
            <span className="cs-rail-line" aria-hidden="true"></span>
            <span className="cs-rail-fill" ref={fillRef} aria-hidden="true"></span>
            {CS_STAGES.map((s) => (
              <button key={s.id} className={activeCs === s.id ? 'on' : ''} onClick={() => jumpTo(s.id)}>
                <span className="dot"></span><span className="lbl">{s.label}</span>
              </button>
            ))}
          </nav>
          <div>
            <div className="cs-block" id="cs1">
              <p className="stage">Stage 01 · Context</p>
              <h3>A platform with everything except a front door.</h3>
              <p>By 2024, Polarin could provision enterprise circuits, meter bandwidth, and surface network health.
              The capability was real. But the <b>customer portal was a brochure</b> — customers could see what
              Polarin did, not do it themselves.</p>
              <p>I was uniquely placed to fix it: I had drawn every screen as its designer, and now I owned its
              roadmap as its PM. <b>No translation loss between the person who knew the problem and the person
              who could decide.</b></p>
            </div>
            <div className="cs-block" id="cs2">
              <p className="stage">Stage 02 · Problem</p>
              <h3>Capability lived in the platform. Usage lived in tickets.</h3>
              <p>Customers asked humans for what the portal could already do. Every order, change, and health
              question routed through support — <b>slow for them, expensive for us, and invisible to the roadmap</b>
              because friction never left the ticket queue.</p>
              <div className="pull">"Honestly? It's faster to email your team than to figure out the portal."
                <small>— enterprise customer, discovery interview</small></div>
              <p>That sentence became the problem statement. Not "improve the portal" — <b>make the portal the
              faster path.</b></p>
            </div>
            <div className="cs-block" id="cs3">
              <p className="stage">Stage 03 · Discovery</p>
              <h3>Let the tickets testify.</h3>
              <p>Instead of guessing, I fed the evidence to the pipeline: <b>support-ticket exports, usage analytics,
              and customer interview transcripts, synthesized with Claude</b> into friction themes I could
              interrogate, challenge, and rank. Two weeks of analysis became two days.</p>
              <div className="rklist">
                <div className="rk"><span className="no">1</span><span className="tx"><b>Ordering opacity</b> — customers couldn't predict steps, time, or price before committing</span><span className="sh">top theme</span></div>
                <div className="rk"><span className="no">2</span><span className="tx"><b>Status blindness</b> — "where is my request?" was a ticket, not a screen</span><span className="sh">#2</span></div>
                <div className="rk"><span className="no">3</span><span className="tx"><b>Permission maze</b> — the right person could rarely do the thing themselves</span><span className="sh">#3</span></div>
              </div>
            </div>
            <div className="cs-block" id="cs4">
              <p className="stage">Stage 04 · The Call</p>
              <h3>Make the obvious path the self-serve path.</h3>
              <p>The bet: redesign the three highest-friction flows so that self-serve wasn't a feature —
              it was <b>the shortest route</b>. Transparent ordering with steps and timelines up front, a live
              request-status surface, and role-based permissions that matched how customer teams actually work.</p>
              <p>What we said <b>no</b> to mattered as much: no big-bang redesign, no new nav paradigm, no
              "portal 2.0" branding. <b>Same portal, shorter paths.</b></p>
            </div>
            <div className="cs-block" id="cs5">
              <p className="stage">Stage 05 · The Build</p>
              <h3>Prototype was the spec. Spec was the product.</h3>
              <p>This is where the three hats compound. PRDs drafted with Claude as a sparring partner; high-fidelity
              <b> working prototypes built on the Polarin Design System</b> in days; validated with customers before
              the first engineering ticket; and the frontend polish <b>deployed directly via Claude + Figma in
              VS Code</b>.</p>
              <div className="mini-tl">
                <div className="mtl"><span className="t">Days 1—2</span><p className="d">Evidence synthesis, friction themes ranked</p></div>
                <div className="mtl"><span className="t">Days 3—5</span><p className="d">PRD + working prototype on the DS</p></div>
                <div className="mtl"><span className="t">Week 2</span><p className="d">Customer validation on real software</p></div>
                <div className="mtl"><span className="t">Weeks 3—6</span><p className="d">Build with engineering, direct FE deploys</p></div>
              </div>
            </div>
            <div className="cs-block" id="cs6">
              <p className="stage">Stage 06 · Outcome</p>
              <h3>The portal became the front door.</h3>
              <div className="cs-stats">
                {STATS.map((s) => (
                  <CountStat key={s.label} {...s} />
                ))}
              </div>
              <p>Customers now order, change, and check status without a ticket. The friction data that once hid
              in the support queue <b>feeds the roadmap directly</b> — which is exactly how the next case study
              begins.</p>
              <div className="soon-ctas" style={{ marginTop: '26px' }}>
                <a className="btn-big" href="#/journey">See it in the story — Ch.3 <span aria-hidden="true">→</span></a>
                <a className="btn-ghost" href="#/journey">My AI loop — Ch.4</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OTHER SURFACES */}
      <section>
        <div className="wrap surf-head">
          <p className="ch-num rv"><b>The other surfaces</b> · same roadmap, studies in progress</p>
          <h2 className="ch-title rv d1" style={{ fontSize: 'clamp(28px,4.4vw,52px)' }}>One roadmap, five <span>fronts.</span></h2>
        </div>
        <div className="wrap proj-grid">
          <article className="proj-card rv">
            <span className="st build">In build</span>
            <div className="glyphbox">▤</div>
            <h3>Admin Portal</h3>
            <p>The internal ops console — provisioning, approvals, customer management. Killing swivel-chair
            workflows so <b>ops moves at portal speed</b>.</p>
            <div className="proj-tags"><span className="chip">internal tools</span><span className="chip">workflows</span></div>
            <div className="proj-foot"><span className="cs-soon">case study soon</span></div>
          </article>
          <article className="proj-card rv d1">
            <span className="st build">In build</span>
            <div className="glyphbox">λ</div>
            <h3>Developer Portal</h3>
            <p>APIs, docs, keys, sandboxes — turning Polarin from a product into a <b>platform other teams
            build on</b>.</p>
            <div className="proj-tags"><span className="chip">API-first</span><span className="chip">DX</span></div>
            <div className="proj-foot"><span className="cs-soon">case study soon</span></div>
          </article>
          <article className="proj-card rv d2">
            <span className="st live">Shipping</span>
            <div className="glyphbox">¤</div>
            <h3>Invoicing</h3>
            <p>Billing without tickets — usage clarity, invoice history, disputes in-portal.
            <b> Finance teams see what they pay for</b>, and why.</p>
            <div className="proj-tags"><span className="chip">billing UX</span><span className="chip">trust</span></div>
            <div className="proj-foot"><span className="cs-soon">case study soon</span></div>
          </article>
          <article className="proj-card rv d3">
            <span className="st live">Live · every surface</span>
            <div className="glyphbox">◆</div>
            <h3>Polarin Design System</h3>
            <p>Tokens, components, patterns — the shared language every surface runs on, and the vocabulary
            <b> my AI pipeline speaks</b> when generating frontends.</p>
            <div className="proj-tags"><span className="chip">tokens</span><span className="chip">AI-ready</span></div>
            <div className="proj-foot"><a className="cs-link" href="#/journey">Its origin in Ch.2 <span aria-hidden="true">→</span></a></div>
          </article>
        </div>
      </section>
    </div>
  );
}
