import { useEffect, useRef, useState } from 'react';
import InvoiceCaseStudy from '../components/InvoiceCaseStudy';
import ScrollHint from '../components/ScrollHint';

const STATS = [
  { to: 3, prefix: '', suffix: '×', label: 'self-serve adoption' },
  { to: 40, prefix: '−', suffix: '%', label: 'dev handoffs' },
  { to: 50, prefix: '~', suffix: '%', label: 'vendor dependency' },
  { to: 5, prefix: '', suffix: '+', label: 'surfaces · one owner' },
];

const SURFACES = ['Customer Portal', 'Admin Portal', 'Invoice Design', 'Developer Portal', 'Knowledge Base'];

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
  const [studyOpen, setStudyOpen] = useState(false);
  const [studyIdx, setStudyIdx] = useState(0);
  const globeSecRef = useRef(null);
  const baseGlobeRef = useRef(null);
  const hiGlobeRef = useRef(null);

  const openStudy = (name) => {
    const idx = SURFACES.indexOf(name);
    setStudyIdx(idx < 0 ? 0 : idx);
    setStudyOpen(true);
  };
  const closeStudy = () => setStudyOpen(false);
  const prevStudy = () => setStudyIdx((i) => (i + SURFACES.length - 1) % SURFACES.length);
  const nextStudy = () => setStudyIdx((i) => (i + 1) % SURFACES.length);

  useEffect(() => {
    document.body.classList.toggle('ovl-lock', studyOpen);
    return () => document.body.classList.remove('ovl-lock');
  }, [studyOpen]);

  useEffect(() => {
    if (!studyOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') closeStudy();
      if (e.key === 'ArrowLeft') prevStudy();
      if (e.key === 'ArrowRight') nextStudy();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [studyOpen]);

  // horizontal project-track scroll
  useEffect(() => {
    const noMotion = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    const enhanced = !noMotion;
    const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

    const scene = document.querySelector('[data-scene="polx"]');
    const track = document.getElementById('pxTrack');
    const bar = document.getElementById('pxBar');
    const count = document.getElementById('pxCount');

    const sceneProgress = () => {
      if (!scene) return 0;
      const top = scene.getBoundingClientRect().top + window.scrollY;
      const total = scene.offsetHeight - window.innerHeight;
      if (total <= 0) return 0;
      return clamp((window.scrollY - top) / total, 0, 1);
    };

    let rafId;
    const DEAD_ZONE = 0.08; // keep the intro panel fully readable before the track starts panning
    const tick = () => {
      if (enhanced && track && bar && count) {
        const raw = sceneProgress();
        const p = raw <= DEAD_ZONE ? 0 : (raw - DEAD_ZONE) / (1 - DEAD_ZONE);
        const max = track.scrollWidth - window.innerWidth;
        track.style.transform = `translateX(${-p * max}px)`;
        bar.style.width = `${p * 100}%`;
        count.textContent = `${1 + Math.round(p * 5)} / 6`;
      }
      rafId = window.requestAnimationFrame(tick);
    };

    if (enhanced) {
      rafId = window.requestAnimationFrame(tick);
    } else if (track) {
      track.style.flexWrap = 'wrap';
      track.style.height = 'auto';
    }

    return () => window.cancelAnimationFrame(rafId);
  }, []);

  // playable globe: dots that light up near the cursor
  useEffect(() => {
    const noMotion = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    const finePointer = window.matchMedia('(pointer:fine)').matches;
    if (noMotion || !finePointer) return undefined;
    const gsec = globeSecRef.current;
    const base = baseGlobeRef.current;
    const hi = hiGlobeRef.current;
    if (!gsec || !base || !hi) return undefined;

    const NS = 'http://www.w3.org/2000/svg';
    const dots = [];
    let inited = false;
    let raf = null;

    const initDots = () => {
      if (inited) return;
      inited = true;
      base.querySelectorAll('.g-line').forEach((ln) => {
        let length = 0;
        try {
          length = ln.getTotalLength();
        } catch {
          return;
        }
        if (!length) return;
        for (let d = 23; d < length; d += 46) {
          const p = ln.getPointAtLength(d);
          if (p.y < -10 || p.y > 478) continue;
          const c = document.createElementNS(NS, 'circle');
          c.setAttribute('cx', p.x);
          c.setAttribute('cy', p.y);
          c.setAttribute('r', '1.6');
          c.setAttribute('class', 'g-dot');
          base.appendChild(c);
          dots.push({ c, x: p.x, y: p.y });
        }
      });
    };

    const onMove = (e) => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = null;
        const r = base.getBoundingClientRect();
        const px = e.clientX - r.left;
        const py = e.clientY - r.top;
        hi.style.setProperty('--gx', `${px}px`);
        hi.style.setProperty('--gy', `${py}px`);
        hi.style.opacity = 1;
        const mx = px * (1000 / r.width);
        const my = py * (480 / r.height);
        const R = 130;
        dots.forEach((d) => {
          const dist = Math.hypot(d.x - mx, d.y - my);
          if (dist < R) {
            const k = 1 - dist / R;
            d.c.setAttribute('transform', `translate(0 ${(-16 * k).toFixed(1)})`);
            d.c.setAttribute('r', (1.6 + 2.8 * k).toFixed(2));
            d.c.style.fill = 'var(--signal)';
            d.c.style.opacity = (0.35 + 0.65 * k).toFixed(2);
          } else if (d.c.hasAttribute('transform')) {
            d.c.removeAttribute('transform');
            d.c.setAttribute('r', '1.6');
            d.c.style.fill = '';
            d.c.style.opacity = '';
          }
        });
      });
    };

    const onLeave = () => {
      hi.style.opacity = 0;
      dots.forEach((d) => {
        d.c.removeAttribute('transform');
        d.c.setAttribute('r', '1.6');
        d.c.style.fill = '';
        d.c.style.opacity = '';
      });
    };

    gsec.addEventListener('mouseenter', initDots);
    gsec.addEventListener('mousemove', onMove);
    gsec.addEventListener('mouseleave', onLeave);
    return () => {
      gsec.removeEventListener('mouseenter', initDots);
      gsec.removeEventListener('mousemove', onMove);
      gsec.removeEventListener('mouseleave', onLeave);
      dots.forEach((d) => d.c.remove());
    };
  }, []);

  return (
    <div>
      {/* 01 · simple open */}
      <section className="pol-open">
        <div className="wrap">
          <p className="pol-kicker rv">Current Project · 2022 — now</p>
          <h2 className="pol-title rv d1">
            <span className="bt">{'Building'.split('').map((ch, i) => <b key={i}>{ch}</b>)}</span><br />
            <span className="pw">Polarin</span>
            <span className="tdots" aria-hidden="true"><i></i><i></i><i></i></span>
          </h2>
          <p className="pol-open-sub rv d2">a four-year build, still going</p>
        </div>
        <ScrollHint />
      </section>

      {/* 02 · what is polarin (half globe) */}
      <section className="globe-sec" ref={globeSecRef}>
        <svg className="globe" ref={baseGlobeRef} viewBox="0 0 1000 480" aria-hidden="true">
          <defs>
            <clipPath id="dome"><rect x="0" y="0" width="1000" height="478" /></clipPath>
          </defs>
          <g clipPath="url(#dome)">
            <circle className="g-line" cx="500" cy="480" r="400" />
            <ellipse className="g-line" cx="500" cy="480" rx="280" ry="400" />
            <ellipse className="g-line" cx="500" cy="480" rx="150" ry="400" />
            <ellipse className="g-line" cx="500" cy="480" rx="40" ry="400" />
            <path className="g-line" d="M132 420 Q 500 300 868 420" />
            <path className="g-line" d="M196 300 Q 500 196 804 300" />
            <path className="g-line" d="M300 190 Q 500 116 700 190" />
            <circle className="g-node" cx="240" cy="400" r="4" /><circle className="g-node n2" cx="700" cy="330" r="4" />
            <circle className="g-node n3" cx="330" cy="250" r="4" /><circle className="g-node" cx="810" cy="380" r="4" />
            <circle className="g-node n2" cx="180" cy="440" r="4" /><circle className="g-node n3" cx="620" cy="200" r="4" />
            <circle className="g-node" cx="870" cy="420" r="4" />
          </g>
        </svg>
        <svg className="globe globe-hi" ref={hiGlobeRef} viewBox="0 0 1000 480" aria-hidden="true">
          <g clipPath="url(#dome)">
            <circle className="g-line" cx="500" cy="480" r="400" />
            <ellipse className="g-line" cx="500" cy="480" rx="280" ry="400" />
            <ellipse className="g-line" cx="500" cy="480" rx="150" ry="400" />
            <ellipse className="g-line" cx="500" cy="480" rx="40" ry="400" />
            <path className="g-line" d="M132 420 Q 500 300 868 420" />
            <path className="g-line" d="M196 300 Q 500 196 804 300" />
            <path className="g-line" d="M300 190 Q 500 116 700 190" />
          </g>
        </svg>
        <div className="wrap globe-copy">
          <p className="eyebrow rv" style={{ justifyContent: 'center' }}>What is Polarin</p>
          <p className="lede-big rv d1" style={{ margin: '0 auto', textAlign: 'center', maxWidth: '30ch' }}>Enterprise connectivity that provisions
          <i> like cloud</i> — a Network-as-a-Service platform by <em>POLO</em>, connecting businesses across the globe
          <i> in clicks, not contracts.</i></p>
          <div className="pol-sub rv d2" style={{ justifyContent: 'center', marginTop: '24px' }}>
            <span><b>NaaS</b> platform</span><span><b>global</b> connectivity</span><span><b>self-serve</b> by design</span>
          </div>
        </div>
      </section>

      {/* 03 · my role, brief */}
      <section className="role-sec">
        <div className="wrap" style={{ textAlign: 'center' }}>
          <p className="eyebrow rv" style={{ justifyContent: 'center' }}>My input</p>
          <h2 className="ch-title rv d1" style={{ fontSize: 'clamp(26px,4.4vw,50px)' }}>Its first designer.<br />Now its <span>product manager.</span></h2>
          <div className="hats3 rv d2">
            <div className="h3t">
              <span className="h3g">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 4l5 5L8 21H3v-5L15 4z" />
                  <path d="M4 23h16" strokeDasharray="16" strokeDashoffset="16">
                    <animate attributeName="stroke-dashoffset" values="16;0;0;16" keyTimes="0;.45;.7;1" dur="2.6s" repeatCount="indefinite" />
                  </path>
                </svg>
              </span>
              <b>Design</b>
              <p>every screen, 0 → 1 + the design system</p>
            </div>
            <div className="h3t">
              <span className="h3g">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <rect x="4" y="4.5" width="12" height="3.4" rx="1.7">
                    <animate attributeName="width" values="12;16;12" dur="2.4s" repeatCount="indefinite" />
                  </rect>
                  <rect x="4" y="10.3" width="16" height="3.4" rx="1.7">
                    <animate attributeName="width" values="16;9;16" dur="2.4s" begin=".4s" repeatCount="indefinite" />
                  </rect>
                  <rect x="4" y="16.1" width="8" height="3.4" rx="1.7">
                    <animate attributeName="width" values="8;14;8" dur="2.4s" begin=".8s" repeatCount="indefinite" />
                  </rect>
                </svg>
              </span>
              <b>Product</b>
              <p>roadmap, priorities & releases — end to end</p>
            </div>
            <div className="h3t">
              <span className="h3g">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round">
                  <path d="M13 2L5 13h6l-1 9 8-11h-6l1-9z" strokeDasharray="42" strokeDashoffset="42">
                    <animate attributeName="stroke-dashoffset" values="42;0;0;42" keyTimes="0;.4;.75;1" dur="2.2s" repeatCount="indefinite" />
                  </path>
                </svg>
              </span>
              <b>AI Build</b>
              <p>requirement → frontend → deploy, myself</p>
            </div>
          </div>
          <p className="role-link rv d3">the full arc — three roles, four years — lives in{' '}
            <a href="#/journey">My Journey · Ch.2 →</a>
            <span>·</span> how I work: <a href="#/journey">Ch.4 →</a>
          </p>
        </div>
      </section>

      {/* 04 · projects, horizontal */}
      <section>
        <div className="scene hscroll" data-scene="polx" style={{ height: '460vh' }}>
          <div className="pin">
            <div className="htrack" id="pxTrack">
              <div className="panel">
                <div className="panel-intro">
                  <p className="ch-num"><b>The surfaces</b> · complete design ownership</p>
                  <h2 className="ch-title" style={{ marginTop: '12px' }}>Five fronts.<br />One <span>owner.</span></h2>
                  <p style={{ color: 'var(--mute)', marginTop: '18px', maxWidth: '38ch' }}>What each one is, what I did, what moved. Scroll down — the roadmap moves sideways. →</p>
                </div>
              </div>

              <div className="panel panel-sm">
                <article className="panel-card pxcard">
                  <div className="px-top"><span className="glyphbox">⌂</span></div>
                  <div className="mg" aria-hidden="true">
                    <span className="mg-tag">— platform animation — placeholder</span>
                    <div className="mgbar"><i></i><i></i><i></i></div>
                    <span className="mgl w6"></span>
                    <div className="mgrow"><span className="mgbox"></span><span className="mgbox"></span></div>
                    <span className="mgbtn"></span>
                  </div>
                  <h3>Customer Portal</h3>
                  <div className="krow"><span>about</span><p>the self-serve front door — order, manage, monitor connectivity</p></div>
                  <div className="krow"><span>my role</span><p>designed it 0 → 1 · now own its roadmap & ship its frontend</p></div>
                  <div className="krow im"><span>impact</span><p className="big">3× <small>self-serve adoption</small></p></div>
                  <div className="proj-foot"><button type="button" className="cs-link" onClick={() => openStudy('Customer Portal')}>Deep dive →</button></div>
                </article>
              </div>

              <div className="panel panel-sm">
                <article className="panel-card pxcard">
                  <div className="px-top"><span className="glyphbox">⚙</span></div>
                  <div className="mg mg-admin" aria-hidden="true">
                    <span className="mg-tag">internal data — no preview</span>
                    <div className="tg on"><i></i></div><div className="tg"><i></i></div><div className="tg on"><i></i></div>
                    <div className="mgdots"><i></i><i></i><i></i></div>
                  </div>
                  <h3>Admin Portal</h3>
                  <div className="krow"><span>about</span><p>the internal ops console — user management & KYC approvals, inventory, reports, billing & invoicing</p></div>
                  <div className="krow"><span>my role</span><p>understood internal users, defined & designed the flows — then built and deployed them</p></div>
                  <div className="krow im"><span>impact</span><p className="big">faster <small>order → delivery cycle · clearer NaaS billing ops</small></p></div>
                  <div className="proj-foot"><button type="button" className="cs-link" onClick={() => openStudy('Admin Portal')}>Deep dive →</button></div>
                </article>
              </div>

              <div className="panel panel-sm">
                <article className="panel-card pxcard">
                  <div className="px-top"><span className="glyphbox">₹</span></div>
                  <div className="mg mg-inv" aria-hidden="true">
                    <span className="mg-tag">— invoice image — placeholder</span>
                    <span className="mgl w7"></span><span className="mgl w5"></span><span className="mgl w6"></span>
                    <span className="mgdash"></span>
                    <div className="mgtotal"><span>total</span><b>₹ ---</b></div>
                  </div>
                  <h3>Invoice Design</h3>
                  <div className="krow"><span>about</span><p>transparency for high-ticket billing — clarity for every second billed</p></div>
                  <div className="krow"><span>my role</span><p>designed a template that adapts complicated billing to complicated products</p></div>
                  <div className="krow im"><span>impact</span><p className="big">trust <small>transparent · readable · scalable — for users & finance</small></p></div>
                  <div className="proj-foot"><button type="button" className="cs-link" onClick={() => openStudy('Invoice Design')}>Deep dive →</button></div>
                </article>
              </div>

              <div className="panel panel-sm">
                <article className="panel-card pxcard">
                  <div className="px-top"><span className="glyphbox">λ</span></div>
                  <div className="mg mg-dev" aria-hidden="true">
                    <span className="mg-tag">— portal animation — placeholder</span>
                    <p><span className="c1">POST</span> /v1/circuits</p>
                    <p><span className="c2">{'{'}</span> bandwidth: <span className="c3">"10G"</span> <span className="c2">{'}'}</span></p>
                    <p><span className="c4">201</span> provisioned <i className="tcur s"></i></p>
                  </div>
                  <h3>Developer Portal</h3>
                  <div className="krow"><span>about</span><p>APIs, docs, keys, sandboxes — customers order & provision via API</p></div>
                  <div className="krow"><span>my role</span><p>DX design, docs & frontend · PRD + pricing framework · volumetrics with engineering</p></div>
                  <div className="krow im"><span>impact</span><p className="big">revenue <small>in testing — opens segments with in-house NMS tools</small></p></div>
                  <div className="proj-foot"><button type="button" className="cs-link" onClick={() => openStudy('Developer Portal')}>Deep dive →</button></div>
                </article>
              </div>

              <div className="panel panel-sm">
                <article className="panel-card pxcard">
                  <div className="px-top"><span className="glyphbox">▤</span></div>
                  <div className="mg mg-kb" aria-hidden="true">
                    <span className="mg-tag">— portal animation — placeholder</span>
                    <div className="mgsearch"><span></span></div>
                    <div className="mgpage p1"></div><div className="mgpage p2"></div><div className="mgpage p3"></div>
                  </div>
                  <h3>Knowledge Base</h3>
                  <div className="krow"><span>about</span><p>answers before tickets — self-help designed into the product</p></div>
                  <div className="krow"><span>my role</span><p>content architecture, design & frontend — findable, skimmable, honest</p></div>
                  <div className="krow im"><span>impact</span><p className="big">deflect <small>fewer tickets — customers help themselves</small></p></div>
                  <div className="proj-foot"><button type="button" className="cs-link" onClick={() => openStudy('Knowledge Base')}>Deep dive →</button></div>
                </article>
              </div>
            </div>
            <div className="hs-progress"><span>surfaces</span><span className="bar"><i id="pxBar"></i></span><span id="pxCount">1 / 6</span></div>
          </div>
        </div>
      </section>

      {/* 05 · overall metrics */}
      <section>
        <div className="wrap" style={{ padding: '80px 0 20px', textAlign: 'center' }}>
          <p className="eyebrow rv" style={{ justifyContent: 'center' }}>Four years in</p>
          <h2 className="ch-title rv d1" style={{ fontSize: 'clamp(28px,4.6vw,54px)' }}>What <span>moved.</span></h2>
          <div className="cs-stats rv d2" style={{ justifyContent: 'center', marginTop: '34px' }}>
            {STATS.map((s) => (
              <CountStat key={s.label} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* 06 · still building */}
      <section className="still-sec">
        <div className="wrap" style={{ textAlign: 'center' }}>
          <h2 className="still-t rv">still building<i className="tcur"></i></h2>
          <div className="soon-bar rv d1" style={{ maxWidth: '280px', margin: '22px auto 0' }}><i></i></div>
          <div className="soon-ctas rv d2" style={{ justifyContent: 'center', marginTop: '34px' }}>
            <a className="btn-big" href="#/journey">The whole story — My Journey <span aria-hidden="true">→</span></a>
            <a className="btn-ghost" href="#/">Home</a>
          </div>
        </div>
      </section>

      {/* case study overlay */}
      <div className={`ovl ${studyOpen ? 'open' : ''}`} role="dialog" aria-modal="true" aria-labelledby="ovlTitle">
        <div className="ovl-scrim" onClick={closeStudy}></div>
        <button className="ovl-close" onClick={closeStudy} aria-label="Close">×</button>
        <div className="ovl-panel">
          {SURFACES[studyIdx] === 'Invoice Design' ? (
            <InvoiceCaseStudy onPrev={prevStudy} onNext={nextStudy} idx={studyIdx} total={SURFACES.length} />
          ) : (
            <div className="ovl-inner">
              <p className="eyebrow">Polarin · Case study</p>
              <h2><span id="ovlTitle">{SURFACES[studyIdx]}</span><br /><em>deep dive soon.</em></h2>
              <p className="lede">Problem, evidence, the call, the AI-in-the-loop build, and what moved —
              project details are being added one by one, in the same three-act format as My Journey.</p>
              <div className="soon-term" style={{ marginTop: '30px' }}>
                <div><span className="k">$</span> publish case-study --surface <span>{SURFACES[studyIdx].toLowerCase().replace(/\s+/g, '-')}</span></div>
                <div><span className="k">status:</span> <span className="a">gathering artifacts…</span> <span className="cur"></span></div>
                <div className="soon-bar"><i></i></div>
              </div>
              <div className="ovl-nav">
                <button type="button" onClick={prevStudy}>← Prev</button>
                <span className="ovl-count"><b>{studyIdx + 1}</b> / {SURFACES.length} surfaces</span>
                <button type="button" onClick={nextStudy}>Next →</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
