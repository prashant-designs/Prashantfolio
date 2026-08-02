import { useEffect, useRef, useState } from 'react';
import InvoiceCaseStudy from '../components/InvoiceCaseStudy';
import AdminPortalCaseStudy from '../components/AdminPortalCaseStudy';
import CustomerPortalCaseStudy from '../components/CustomerPortalCaseStudy';
import DeveloperPortalCaseStudy from '../components/DeveloperPortalCaseStudy';
import KnowledgeBaseCaseStudy from '../components/KnowledgeBaseCaseStudy';
import ScrollHint from '../components/ScrollHint';

const STATS = [
  { to: 3, prefix: '', suffix: '×', label: 'self-serve adoption' },
  { to: 40, prefix: '−', suffix: '%', label: 'dev handoffs' },
  { to: 50, prefix: '~', suffix: '%', label: 'vendor dependency' },
  { to: 5, prefix: '', suffix: '+', label: 'surfaces · one owner' },
];

const SURFACES = ['Customer Portal', 'Admin Portal', 'Invoice Design', 'Developer Portal', 'Knowledge Base'];

const TIMELINE = [
  { tag: 'context', nav: 'What is Polarin', title: 'What is Polarin' },
  { tag: '2022', nav: 'Joined as designer', title: 'Joined as its first designer' },
  { tag: '2022 - 2024', nav: 'Zero to one', title: 'Building it: zero to one' },
  { tag: '2025 - now', nav: 'AI product manager', title: 'Now: AI product manager' },
  { tag: 'every day', nav: 'Most days', title: 'What most days look like' },
];

// the exact vocabulary the immersion covered - nothing added
const FOG_WORDS = ['L1', 'L2', 'L3', 'ports', 'VRs', 'VCs'];

const LEARN_STREAMS = [
  { t: 'the architects', p: 'networking learned first-hand - L1/L2/L3, ports, VRs, VCs. sat in sales calls. walked the manual provisioning workflows.' },
  { t: 'sales, ops, engineering', p: 'structured interviews with the people already running the process end to end.' },
  { t: 'the desk', p: 'telecom regulations, NaaS category maps, every public competitor doc.' },
];

const prefersReducedMotion = typeof window !== 'undefined'
  && window.matchMedia
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Geometry of a pinned scroll track, in document space. Resolved fresh on every
 * call so it survives resizes, late font loads and the vh-based heights in the
 * stylesheet. Returns null when the track isn't taller than its sticky stage -
 * i.e. when pinning is switched off (the <=760px fallback).
 */
function sceneMetrics(el) {
  const stage = el && el.firstElementChild;
  if (!el || !stage) return null;
  const span = el.offsetHeight - stage.offsetHeight;
  if (span <= 0) return null;
  const stick = parseFloat(window.getComputedStyle(stage).top) || 0;
  const start = el.getBoundingClientRect().top + window.scrollY - stick;
  return { start, span };
}

/**
 * Pinned scroll-beat tracker, adapted from the case-study overlays' hook to run
 * against page scroll instead of the .ovl-panel element.
 *
 * `ref` points at a tall track whose first child is `position: sticky`. As the
 * track scrolls past, progress through (track height - sticky stage height) is
 * sliced into `beats`, and the current slice index is returned. `jump(b)`
 * scrolls to the middle of a given beat.
 */
function useScrollBeat(ref, beats) {
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    if (!ref.current) return undefined;
    let raf = null;

    const update = () => {
      raf = null;
      const m = sceneMetrics(ref.current);
      if (!m) return;
      const p = Math.min(1, Math.max(0, (window.scrollY - m.start) / m.span));
      setBeat(Math.min(beats - 1, Math.floor(p * beats)));
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref, beats]);

  const jump = (b) => {
    const m = sceneMetrics(ref.current);
    if (!m) return;
    window.scrollTo({
      top: m.start + ((b + 0.5) / beats) * m.span,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  return [beat, jump];
}

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
  const ovlPanelRef = useRef(null);
  const globeSecRef = useRef(null);
  const baseGlobeRef = useRef(null);
  const hiGlobeRef = useRef(null);

  // the timeline is scroll-driven: `beat` comes from scroll position through
  // the pinned scene, `step` is what's rendered. they're the same thing except
  // while a rail click is animating - `claim` holds the clicked stop so the
  // detail panel doesn't flicker through every stop on the way there.
  const sceneRef = useRef(null);
  const [beat, jump] = useScrollBeat(sceneRef, TIMELINE.length);
  const [step, setStep] = useState(0);
  const claim = useRef(null);
  const claimTimer = useRef(null);

  useEffect(() => {
    if (claim.current !== null) {
      if (claim.current !== beat) return;
      claim.current = null;
    }
    setStep(beat);
  }, [beat]);

  useEffect(() => () => clearTimeout(claimTimer.current), []);

  const goToStop = (i) => {
    claim.current = i;
    clearTimeout(claimTimer.current);
    // safety valve: if the scroll never lands on that beat (mobile fallback,
    // interrupted scroll) let scroll-spy take over again.
    claimTimer.current = setTimeout(() => { claim.current = null; }, 1500);
    setStep(i);
    jump(i);
  };

  // playable globe (step 0 only): a highlight that auto-roams the globe, and
  // follows the cursor on hover. re-runs on every `step` change since the
  // globe's DOM only exists while step 0 is mounted - refs are null otherwise
  // and the effect just no-ops.
  useEffect(() => {
    const noMotion = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    const finePointer = window.matchMedia('(pointer:fine)').matches;
    if (noMotion) return undefined;
    const gsec = globeSecRef.current;
    const base = baseGlobeRef.current;
    const hi = hiGlobeRef.current;
    if (!gsec || !base || !hi) return undefined;

    const NS = 'http://www.w3.org/2000/svg';
    const dots = [];
    let hovering = false;
    let raf = null;

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

    // px/py: on-screen pixel position (for the --gx/--gy mask centre). mx/my: matching position in the 1000x480 viewBox (for dot distance).
    const applyGlow = (px, py, mx, my) => {
      hi.style.setProperty('--gx', `${px}px`);
      hi.style.setProperty('--gy', `${py}px`);
      hi.style.opacity = 1;
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
    };

    const startTime = performance.now();
    const tick = (now) => {
      raf = window.requestAnimationFrame(tick);
      if (hovering) return;
      const t = now - startTime;
      const mx = 500 + 300 * Math.sin(t * 0.00025);
      const my = 300 + 90 * Math.sin(t * 0.00037 + 1.3);
      const r = base.getBoundingClientRect();
      applyGlow((mx / 1000) * r.width, (my / 480) * r.height, mx, my);
    };
    raf = window.requestAnimationFrame(tick);

    let moveRaf = null;
    const onMove = (e) => {
      hovering = true;
      if (moveRaf) return;
      moveRaf = window.requestAnimationFrame(() => {
        moveRaf = null;
        const r = base.getBoundingClientRect();
        const px = e.clientX - r.left;
        const py = e.clientY - r.top;
        applyGlow(px, py, px * (1000 / r.width), py * (480 / r.height));
      });
    };

    const onLeave = () => {
      hovering = false;
    };

    if (finePointer) {
      gsec.addEventListener('mousemove', onMove);
      gsec.addEventListener('mouseleave', onLeave);
    }
    return () => {
      window.cancelAnimationFrame(raf);
      if (moveRaf) window.cancelAnimationFrame(moveRaf);
      gsec.removeEventListener('mousemove', onMove);
      gsec.removeEventListener('mouseleave', onLeave);
      dots.forEach((d) => d.c.remove());
    };
  }, [step]);

  const openStudy = (name) => {
    const idx = SURFACES.indexOf(name);
    setStudyIdx(idx < 0 ? 0 : idx);
    setStudyOpen(true);
  };
  const closeStudy = () => setStudyOpen(false);
  // prev/next stay within their own group - the 3 "zero to one" case studies
  // (Customer/Admin/Invoice) cycle among themselves, not into the 2 "AI PM"
  // ones (Developer Portal/Knowledge Base), and vice versa.
  const groupStart = (i) => (i < 3 ? 0 : 3);
  const groupLen = (i) => (i < 3 ? 3 : 2);
  const prevStudy = () => setStudyIdx((i) => groupStart(i) + ((i - groupStart(i) + groupLen(i) - 1) % groupLen(i)));
  const nextStudy = () => setStudyIdx((i) => groupStart(i) + ((i - groupStart(i) + 1) % groupLen(i)));

  useEffect(() => {
    document.body.classList.toggle('ovl-lock', studyOpen);
    return () => document.body.classList.remove('ovl-lock');
  }, [studyOpen]);

  // jump back to the top of the case study whenever it opens or the surface changes
  useEffect(() => {
    ovlPanelRef.current?.scrollTo(0, 0);
  }, [studyOpen, studyIdx]);

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

  return (
    <div>
      {/* 01a · full-fold open */}
      <section className="tl-hero" data-ch="Intro">
        <div className="wrap tl-head">
          <p className="pol-kicker rv">Current Project · 2022 - now</p>
          <h2 className="pol-title rv d1">
            <span className="bt">{'Building'.split('').map((ch, i) => <b key={i}>{ch}</b>)}</span><br />
            <span className="pw">Polarin</span>
            <span className="tdots" aria-hidden="true"><i></i><i></i><i></i></span>
          </h2>
          <p className="pol-open-sub rv d2">a four-year build, still going - scroll the arc, in order</p>
        </div>
        <ScrollHint label="scroll the timeline" />
      </section>

      {/* 01b · the whole arc, as a timeline */}
      <section className="timeline-sec" data-ch="Timeline">
        {/* pinned scene: the rail + detail hold their place while scrolling
            moves the timeline one stop at a time. */}
        <div className="tl-scene" ref={sceneRef} style={{ '--beats': TIMELINE.length }}>
          <div className="tl-stage">
            <div className="tl-shell">
              <div className="tl-rail" style={{ '--tlp': (step + 0.5) / TIMELINE.length }}>
                {TIMELINE.map((t, i) => (
                  <button
                    key={t.nav}
                    type="button"
                    className={`tl-stop ${i === step ? 'on' : i < step ? 'done' : 'upcoming'}`}
                    onClick={() => goToStop(i)}
                    aria-current={i === step ? 'step' : undefined}
                  >
                    <span className="tl-dot" aria-hidden="true"></span>
                    <span className="tl-stop-txt"><b>{t.tag}</b>{t.nav}</span>
                  </button>
                ))}
              </div>

              <div className="tl-detail" key={step}>
                {step !== 0 && <h3>{TIMELINE[step].title}</h3>}

                {step === 0 && (
                  <>
                    <div className="tl-globe-sec" ref={globeSecRef}>
                      <svg className="tl-globe" ref={baseGlobeRef} viewBox="0 0 1000 480" aria-hidden="true">
                        <defs>
                          <clipPath id="tlDome"><rect x="0" y="0" width="1000" height="478" /></clipPath>
                        </defs>
                        <g clipPath="url(#tlDome)">
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
                      <svg className="tl-globe tl-globe-hi" ref={hiGlobeRef} viewBox="0 0 1000 480" aria-hidden="true">
                        <g clipPath="url(#tlDome)">
                          <circle className="g-line" cx="500" cy="480" r="400" />
                          <ellipse className="g-line" cx="500" cy="480" rx="280" ry="400" />
                          <ellipse className="g-line" cx="500" cy="480" rx="150" ry="400" />
                          <ellipse className="g-line" cx="500" cy="480" rx="40" ry="400" />
                          <path className="g-line" d="M132 420 Q 500 300 868 420" />
                          <path className="g-line" d="M196 300 Q 500 196 804 300" />
                          <path className="g-line" d="M300 190 Q 500 116 700 190" />
                        </g>
                      </svg>
                      <div className="tl-globe-copy">
                        <h3>{TIMELINE[0].title}</h3>
                        <p>Lightstorm&apos;s Network-as-a-Service platform - it connects data centers, clouds and SaaS apps like Microsoft 365 over private, low-latency links, provisioned in minutes through an API instead of a paperwork trail. Built on AWS Direct Connect, used from desktop or mobile.</p>
                        <button type="button" className="btn-ghost" onClick={() => goToStop(2)}>see how it&apos;s built →</button>
                      </div>
                    </div>
                  </>
                )}

                {step === 1 && (
                  <>
                    <p>Polarin was a name on a whiteboard, and I was its first designer - no telecom background, no template to copy. Ordering enterprise connectivity in India still meant phone calls, PDF forms and ~90 days of waiting.</p>

                    {/* the fog: the vocabulary of the domain, unreadable on day one,
                        resolving as it gets learned. */}
                    <div className="tl-fog">
                      <span className="tl-fog-l">day one, this was noise</span>
                      {FOG_WORDS.map((w, i) => (
                        <span className="tl-fog-w" key={w} style={{ animationDelay: `${260 + i * 120}ms` }}>{w}</span>
                      ))}
                    </div>
                    <p className="tl-fog-cap">four months later it was the vocabulary I designed in <b>·</b> figma stayed shut until then</p>

                    {/* three inputs converge into one artefact, then the first screen */}
                    <div className="tl-arc">
                      <div className="tl-arc-streams">
                        {LEARN_STREAMS.map((s, i) => (
                          <div className="tl-stream" key={s.t}>
                            <i>{`0${i + 1}`}</i>
                            <div>
                              <b>{s.t}</b>
                              <p>{s.p}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="tl-arc-join" aria-hidden="true">
                        <svg viewBox="0 0 54 120" preserveAspectRatio="none">
                          <path d="M0 18 C 26 18, 20 60, 40 60" />
                          <path d="M0 60 L 40 60" />
                          <path d="M0 102 C 26 102, 20 60, 40 60" />
                          <path className="lead" d="M40 60 L 54 60" />
                        </svg>
                      </div>

                      <div className="tl-arc-out">
                        <div className="tl-doc">
                          <span className="tl-doc-tag">what came out</span>
                          <b>one self-authored knowledge doc</b>
                          <p>no one had written the domain down yet - so the first thing I made wasn&apos;t a screen, it was the map everything else got drawn on.</p>
                        </div>
                        <p className="tl-then"><em>→</em> then the first screen</p>
                      </div>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <p>Five surfaces, one designer - a design system built first so screens could ship fast. Self-serve launched in 2023: 90 days of manual provisioning became 10 minutes.</p>
                    <div className="tl-stats" style={{ marginTop: '4px' }}>
                      <span><b>100+</b> reusable components</span>
                      <span><b>20+</b> design tokens</span>
                      <span><b>4 yrs</b> of solo delivery, scaled by it</span>
                    </div>
                    <div className="tl-cs-grid">
                      <article className="tl-cs-card" role="button" tabIndex={0} onClick={() => openStudy('Customer Portal')} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openStudy('Customer Portal'); } }}>
                        <span className="tl-cs-icon" aria-hidden="true">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                            <circle cx="5" cy="12" r="2.3" />
                            <circle cx="19" cy="12" r="2.3" />
                            <path d="M7.3 12h9.4" strokeDasharray="2.2 3">
                              <animate attributeName="stroke-dashoffset" from="10.4" to="0" dur="1.1s" repeatCount="indefinite" />
                            </path>
                          </svg>
                        </span>
                        <h4>Customer Portal</h4>
                        <div className="tl-cs-row"><span>about</span><p>the self-serve front door - order, manage, monitor connectivity</p></div>
                        <div className="tl-cs-row"><span>role</span><p>designed it 0 → 1 · now own its roadmap & ship its frontend</p></div>
                        <div className="tl-cs-foot"><span className="tl-cs-impact">3× <small>self-serve adoption</small></span><span className="tl-cs-link">Deep dive →</span></div>
                      </article>

                      <article className="tl-cs-card" role="button" tabIndex={0} onClick={() => openStudy('Admin Portal')} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openStudy('Admin Portal'); } }}>
                        <span className="tl-cs-icon" aria-hidden="true">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <g>
                              <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="7s" repeatCount="indefinite" />
                              <circle cx="12" cy="12" r="3.4" />
                              <path d="M12 3v2.4M12 18.6V21M21 12h-2.4M5.4 12H3M18.1 5.9l-1.7 1.7M7.6 16.5l-1.7 1.7M18.1 18.1l-1.7-1.7M7.6 7.5L5.9 5.9" />
                            </g>
                          </svg>
                        </span>
                        <h4>Admin Portal</h4>
                        <div className="tl-cs-row"><span>about</span><p>the internal ops console - user management, KYC, inventory, billing</p></div>
                        <div className="tl-cs-row"><span>role</span><p>understood internal users, defined & designed the flows - then built and deployed them</p></div>
                        <div className="tl-cs-foot"><span className="tl-cs-impact">faster <small>order → delivery cycle</small></span><span className="tl-cs-link">Deep dive →</span></div>
                      </article>

                      <article className="tl-cs-card" role="button" tabIndex={0} onClick={() => openStudy('Invoice Design')} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openStudy('Invoice Design'); } }}>
                        <span className="tl-cs-icon" aria-hidden="true">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 3h9l3 3v15H6z" />
                            <path d="M9 9h6M9 12.5h6M9 16h3.5" opacity="0.55" />
                            <path d="M14.3 15.2l1.8 1.8 3.3-3.7" strokeDasharray="8.4" strokeDashoffset="8.4">
                              <animate attributeName="stroke-dashoffset" values="8.4;0;0;8.4" keyTimes="0;.4;.8;1" dur="2.6s" repeatCount="indefinite" />
                            </path>
                          </svg>
                        </span>
                        <h4>Invoice Design</h4>
                        <div className="tl-cs-row"><span>about</span><p>transparency for high-ticket billing - clarity for every second billed</p></div>
                        <div className="tl-cs-row"><span>role</span><p>designed a template that adapts complicated billing to complicated products</p></div>
                        <div className="tl-cs-foot"><span className="tl-cs-impact">trust <small>transparent · scalable</small></span><span className="tl-cs-link">Deep dive →</span></div>
                      </article>
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <p>Same platform, different lens - PRDs, roadmaps, prioritisation, UAT testing, frontend deployment. AI runs the loop with me: quick real prototypes, not mockups, deployed end to end.</p>
                    <div className="side-skills" style={{ marginTop: '4px' }}>
                      <span className="chip">PRDs & roadmaps</span>
                      <span className="chip">Prioritisation</span>
                      <span className="chip">UAT testing</span>
                      <span className="chip">AI-assisted design</span>
                      <span className="chip">Frontend + deploy</span>
                    </div>
                    <div className="tl-cs-grid tl-cs-grid-2">
                      <article className="tl-cs-card" role="button" tabIndex={0} onClick={() => openStudy('Knowledge Base')} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openStudy('Knowledge Base'); } }}>
                        <span className="tl-cs-icon" aria-hidden="true">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 5.5h11M4 9.5h8M4 13.5h9" opacity="0.55" />
                            <g>
                              <animateTransform attributeName="transform" type="translate" values="-2 -1; 2 1; -2 -1" dur="3.2s" repeatCount="indefinite" />
                              <circle cx="14.6" cy="14.6" r="4.1" />
                              <line x1="17.6" y1="17.6" x2="21" y2="21" />
                            </g>
                          </svg>
                        </span>
                        <h4>Knowledge Base</h4>
                        <div className="tl-cs-row"><span>about</span><p>answers before tickets - self-help designed into the product</p></div>
                        <div className="tl-cs-row"><span>role</span><p>content architecture, design & frontend - findable, skimmable, honest</p></div>
                        <div className="tl-cs-foot"><span className="tl-cs-impact">deflect <small>fewer tickets</small></span><span className="tl-cs-link">Deep dive →</span></div>
                      </article>

                      <article className="tl-cs-card" role="button" tabIndex={0} onClick={() => openStudy('Developer Portal')} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openStudy('Developer Portal'); } }}>
                        <span className="tl-cs-icon" aria-hidden="true">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M8.5 6L3 12l5.5 6" />
                            <path d="M15.5 6L21 12l-5.5 6" />
                            <line x1="12" y1="7.5" x2="12" y2="16.5" strokeWidth="2">
                              <animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0;.45;.5;.95;1" dur="1.1s" repeatCount="indefinite" />
                            </line>
                          </svg>
                        </span>
                        <h4>Developer sandbox</h4>
                        <div className="tl-cs-row"><span>about</span><p>a live API test environment against UAT - try before you buy</p></div>
                        <div className="tl-cs-row"><span>role</span><p>DX design, docs & frontend · PRD + pricing framework · volumetrics with engineering</p></div>
                        <div className="tl-cs-foot"><span className="tl-cs-impact">revenue <small>in testing</small></span><span className="tl-cs-link">Deep dive →</span></div>
                      </article>
                    </div>
                  </>
                )}

                {step === 4 && (
                  <>
                    <p>An annual roadmap sets the direction; every two weeks is a sprint planned against it - backlog, new priorities a customer raised, major bugs, all weighed before the sprint gets scoped in Jira. AI runs through the day itself: planning priorities, drafting quick prototypes to test an idea. For the internal platform, frontend changes ship straight to production - via Git, previewed on Vercel - whenever new logic needs to go out.</p>
                    <div className="dv-pipe" style={{ marginTop: '18px' }}>
                      <span className="dvp"><b>Confluence</b></span><em>→</em>
                      <span className="dvp"><b>Jira</b></span><em>→</em>
                      <span className="dvp"><b>Figma</b></span><em>→</em>
                      <span className="dvp"><b>VS Code + Claude</b></span><em>→</em>
                      <span className="dvp"><b>Git</b></span><em>→</em>
                      <span className="dvp last"><b>Vercel</b><i>live</i></span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 05 · overall metrics */}
      <section data-ch="Metrics">
        <div className="wrap metrics-sec">
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
      <section className="still-sec" data-ch="Still Building">
        <div className="wrap" style={{ textAlign: 'center' }}>
          <h2 className="still-t rv">still building<i className="tcur"></i></h2>
          <div className="soon-bar rv d1" style={{ maxWidth: '280px', margin: '22px auto 0' }}><i></i></div>
          <div className="soon-ctas rv d2" style={{ justifyContent: 'center', marginTop: '34px' }}>
            <a className="btn-big" href="#/journey">The whole story - My Journey <span aria-hidden="true">→</span></a>
            <a className="btn-ghost" href="#/">Home</a>
          </div>
        </div>
      </section>

      {/* case study overlay */}
      <div className={`ovl ${studyOpen ? 'open' : ''}`} role="dialog" aria-modal="true" aria-labelledby="ovlTitle">
        <div className="ovl-scrim" onClick={closeStudy}></div>
        <button className="ovl-close" onClick={closeStudy} aria-label="Close">×</button>
        <div className="ovl-panel" ref={ovlPanelRef}>
          {SURFACES[studyIdx] === 'Customer Portal' ? (
            <CustomerPortalCaseStudy onPrev={prevStudy} onNext={nextStudy} idx={studyIdx - groupStart(studyIdx)} total={groupLen(studyIdx)} />
          ) : SURFACES[studyIdx] === 'Admin Portal' ? (
            <AdminPortalCaseStudy onPrev={prevStudy} onNext={nextStudy} idx={studyIdx - groupStart(studyIdx)} total={groupLen(studyIdx)} />
          ) : SURFACES[studyIdx] === 'Invoice Design' ? (
            <InvoiceCaseStudy onPrev={prevStudy} onNext={nextStudy} idx={studyIdx - groupStart(studyIdx)} total={groupLen(studyIdx)} />
          ) : SURFACES[studyIdx] === 'Developer Portal' ? (
            <DeveloperPortalCaseStudy onPrev={prevStudy} onNext={nextStudy} idx={studyIdx - groupStart(studyIdx)} total={groupLen(studyIdx)} />
          ) : (
            <KnowledgeBaseCaseStudy onPrev={prevStudy} onNext={nextStudy} idx={studyIdx - groupStart(studyIdx)} total={groupLen(studyIdx)} />
          )}
        </div>
      </div>
    </div>
  );
}
