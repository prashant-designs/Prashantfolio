import { useEffect, useRef, useState } from 'react';

const prefersReducedMotion = typeof window !== 'undefined'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const CJ_STEPS = [
  { d: 0, i: '📢', t: 'the need', x: 'Ananya needs to connect her new Mumbai datacenter to AWS ap-south-1.', w: '' },
  { d: 3, i: '🔍', t: 'research vendors', x: 'Googling begins. Every pricing page says "Contact Sales."', w: 'no way to compare options, pricing or availability in one place' },
  { d: 10, i: '📞', t: 'call vendor #1', x: 'Transferred 3 times. Finally a rep - who asks for a Letter of Authorization and a site survey.', w: '47-minute average hold time · no self-serve · no portal' },
  { d: 14, i: '📞', t: 'call vendor #2', x: 'A backup quote from another carrier. Different process, different forms, different timelines.', w: 'every vendor has its own workflow - nothing is standardised' },
  { d: 16, i: '📝', t: 'fill out forms', x: 'PDF order forms over email. Circuit IDs, cross-connects, billing codes - typed by hand.', w: '~34% error rate in manual forms · one typo = weeks of delay' },
  { d: 21, i: '💰', t: 'negotiate pricing', x: 'A quote arrives. Ananya asks for a discount - forwarded to "the commercial team." Email chains.', w: 'pricing is opaque · no benchmarks · no market visibility' },
  { d: 66, i: '⏳', t: 'wait', x: 'Order placed. ETA? "4–6 weeks." Then… silence.', w: 'zero real-time visibility · status updates by email, if at all' },
  { d: 80, i: '🔧', t: 'installation day', x: 'A technician arrives - but the form had a typo in the rack ID. The technician leaves.', w: 'a new ticket is raised · back in the queue' },
  { d: 90, i: '🔁', t: 'start over', x: 'Three months in. The circuit still is not live. Ananya picks up the phone again.', w: 'the entire cycle repeats - for every single connection' },
];

const AUDIT = [
  { name: 'Megaport', serve: 'strong', onboard: 'complex', india: '✕' },
  { name: 'Console Connect', serve: 'partial', onboard: 'dev only', india: '✕' },
  { name: 'PacketFabric', serve: 'API-first', onboard: 'dev only', india: '✕' },
  { name: 'Equinix Fabric', serve: 'partial', onboard: 'moderate', india: 'limited' },
];

// the same four names as AUDIT, replotted on one chart instead of a table -
// reach vs. built-for-India, illustrative placement (same convention as
// EFFORT_MAP below) rather than a literal published metric. the four global
// platforms cluster on reach with little to no India fit; Polarin sits in
// the opposite corner entirely - not a closer competitor on the same axis,
// a different bet altogether.
const LANDSCAPE = [
  { name: 'Megaport', reach: 82, india: 40 },
  { name: 'Console Connect', reach: 38, india: 18 },
  { name: 'PacketFabric', reach: 64, india: 58 },
  { name: 'Equinix Fabric', reach: 62, india: 30 },
];

const AUDIT_GAPS = [
  { gap: 'network monitoring', found: 'no live visibility', built: 'per-circuit health - availability, loss, jitter, latency' },
  { gap: 'plan flexibility', found: 'locked to what you ordered', built: 'upgrade or downgrade without a ticket' },
  { gap: 'payment terms', found: 'one rigid model', built: 'flexible terms at checkout' },
  { gap: 'multi-location billing', found: 'no GST input-credit rollup', built: 'billing that rolls up the way Indian tax filing needs' },
  { gap: 'API sandbox', found: 'nothing to test first', built: 'a live sandbox - try before you buy' },
  { gap: 'assisted ordering', found: 'reps had no tool', built: 'sales places and manages orders for a customer' },
];

const SHOTS = {
  globe: { src: 'https://framerusercontent.com/images/iNQgdhiTrGehsbW3uNIK6gccao.gif', cap: "the customer's network, alive - global connections, regions & performance alerts at a glance", label: '3D globe' },
  map: { src: 'https://framerusercontent.com/images/N28toXGNVp0F6zjQVyvnzOtfPp4.gif', cap: 'the flat view - service locations, active connections & alerts, manageable at a glance', label: '2D map' },
  order: { src: 'https://framerusercontent.com/images/fI6NHQWcKIbiG4ZvJjYJfmjLPYY.gif', cap: 'pick both endpoints, check committed availability upfront - feasibility before commitment', label: 'order flow' },
  services: { src: 'https://framerusercontent.com/images/qOOUZKo67cDJ1Gv7BzoImGUWtkU.gif', cap: 'the full connectivity portfolio - explore, understand use cases, choose the right service', label: 'all services' },
};
const SHOT_ORDER = ['globe', 'map', 'order', 'services'];

// the case study's own eleven .inv-section stops, short enough to read as a
// corner index rather than a repeat of each section's own .inv-step-tag text.
// no separate "Overview" stop - the hero fold above these already carries
// that job (wordmark, headline, role/team/devices, a lead paragraph), so a
// second summary immediately under it was the same job done twice.
const CP_SECTIONS = [
  'Problem', 'Solution', 'Approach', 'Research', 'IA & flows', 'Exploration', 'Design system', 'Screens', 'Impact', 'Learnings', 'Still building',
];

// text is the contrast pick for each hex, not a computed one - five colors is
// few enough to eyeball once rather than run a luminance formula for.
const LEARNED = [
  { t: 'simplicity is a decision', p: "complexity doesn't simplify itself - someone does that work, and it's invisible to the person who benefits" },
  { t: 'visibility is a feature', p: 'when enterprises can watch their network work in real time, they relax - visual feedback builds trust' },
  { t: 'systems are the product', p: 'screens age and get replaced; the system built in month one is what made four years of solo delivery possible' },
];

/* generic pinned-scroll-scene reader: given a container ref and number of
   beats, tracks scroll progress through the container (relative to the
   nearest scrolling ancestor, the overlay panel) and returns the active
   beat index, plus a jump(beat) helper for click-to-scroll nav. */
function useScrollBeat(ref, beats) {
  const [beat, setBeat] = useState(prefersReducedMotion ? beats - 1 : 0);

  useEffect(() => {
    const panel = document.querySelector('.ovl-panel');
    const el = ref.current;
    if (!panel || !el) return undefined;
    let raf = null;

    const update = () => {
      const stage = el.firstElementChild;
      if (!stage) return;
      const top = el.getBoundingClientRect().top - panel.getBoundingClientRect().top + panel.scrollTop;
      const span = el.offsetHeight - stage.offsetHeight;
      if (span <= 0) return;
      const p = Math.min(1, Math.max(0, (panel.scrollTop - top) / span));
      setBeat(Math.min(beats - 1, Math.floor(p * beats)));
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { raf = null; update(); });
    };
    panel.addEventListener('scroll', onScroll);
    update();
    return () => panel.removeEventListener('scroll', onScroll);
  }, [ref, beats]);

  const jump = (b) => {
    const panel = document.querySelector('.ovl-panel');
    const el = ref.current;
    if (!panel || !el) return;
    const stage = el.firstElementChild;
    const top = el.getBoundingClientRect().top - panel.getBoundingClientRect().top + panel.scrollTop;
    const span = el.offsetHeight - stage.offsetHeight;
    panel.scrollTo({ top: top + ((b + 0.5) / beats) * span, behavior: 'smooth' });
  };

  return [beat, jump];
}

/* the top route line - the same "where am I" mechanism the site's own nav
   uses on every page (App.jsx's #routeLine: a gradient fill, a caret with a
   running head, ruler-mark ticks), reused here rather than the standalone
   right-corner list this replaced, so the one case study long enough to
   need an index (11 sections, several of them their own pinned scroll-
   scenes) still looks like part of the same site instead of a bespoke
   widget. the
   site's version drives off window.scrollY and document.documentElement;
   this one can't reuse it directly because the case study scrolls inside
   .ovl-panel, its own scroll container, not the window - so it's the same
   math (fill % from scrollTop/scrollable range, tick left% from each
   section's real offset within that range), rerun against the panel.

   position is measured off .ovl-panel's own rect rather than expressed in
   CSS, because .ovl-panel is centred with a max-width (1320px) - past that
   width a CSS clamp() keyed to the viewport edge drifts away from the
   panel's real edge, exactly where every desktop viewport this site is
   actually tested at (1512px and up) sits. re-measured on resize. the bar
   sits flush at the panel's own top edge, sharing .ovl-close's row rather
   than dropping below it - its width stops short of the close button's own
   left edge (read live off the button's rect, since the button's own
   right-inset is a clamp() that moves with viewport width) instead.

   "active" is a scrollspy read - the LAST section whose heading has scrolled
   up past a fixed line near the panel's top - PLUS an explicit pin set by
   jump() itself. the plain scrollspy rule alone can't tell "Learnings" and
   "Still building" (the last two stops) apart: both sit close enough to the
   very end of the document that clicking either one clamps the panel to the
   exact same maximum scrollTop (there's only .ovl-nav after "Still
   building", and only "Still building" after "Learnings" - neither leaves
   enough room below to drag its own heading up to the line). two different
   clicks producing an IDENTICAL final scroll position means no amount of
   reading that position can recover which one was actually clicked - the
   geometry alone has already lost the information by the time update() runs.
   so jump() records which index it sent the panel to and the scrollTop that
   landed at; update() defers to that pin as long as the panel is still
   sitting at the position the jump left it at, and only falls back to
   reading heading positions once the user's own scrolling has actually moved
   it somewhere else. an area-based read (compare intersectionRatio, take the
   largest) was tried instead and reverted for a different reason: a short
   section (e.g. "Design system", just a stats card) can lose the area
   contest to a taller neighbour the instant it's scrolled to the top, even
   though it's unambiguously the one just navigated to - comparing heading
   position rather than area avoids that, since a short section wins outright
   the moment its own heading crosses the line regardless of how little of
   the panel it fills.

   tick left% is a separate measurement from the active-line check above,
   despite both reading section positions - active-detection only needs
   ordering (which section's heading has passed a fixed line), but a tick's
   left% needs each section's actual offset as a fraction of the whole
   scrollable range, the same thing the site's own placeTicks() computes
   against document height. it only needs recomputing on resize (layout),
   not on every scroll tick like progress/active do. */
function useSectionIndex(count) {
  const refs = useRef([]);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [pos, setPos] = useState(null);
  const [tickLeft, setTickLeft] = useState([]);
  const [panelRect, setPanelRect] = useState(null);
  const pinnedIndex = useRef(null);
  const pinnedTop = useRef(null);

  useEffect(() => {
    const panel = document.querySelector('.ovl-panel');
    if (!panel) return undefined;
    let raf = null;

    // a plain mount-time measurement races .ovl-panel's own open transition -
    // the element exists in the DOM the instant this effect runs, but it can
    // still be mid-transform with a zero-ish rect, and a one-shot read never
    // gets a second chance. ResizeObserver fires once with the panel's real
    // size the moment it has one, and again on every genuine resize after -
    // one mechanism instead of an initial call plus a window listener.
    const place = () => {
      const r = panel.getBoundingClientRect();
      setPanelRect({ top: r.top, left: r.left, width: r.width, height: r.height });
      // sits at the panel's own top edge, not dropped below .ovl-close - the
      // close button's left edge (read live, since its own right-inset is a
      // clamp() that moves with viewport width) is what the bar's width
      // stops short of instead, so the two share the same row rather than
      // the bar giving up the whole top strip to dodge the button vertically.
      const closeBtn = document.querySelector('.ovl-close');
      const closeLeft = closeBtn ? closeBtn.getBoundingClientRect().left : r.right - 28;
      setPos({ top: r.top, left: r.left + 28, width: Math.max(120, closeLeft - r.left - 28 - 14) });
      const scrollable = panel.scrollHeight - panel.clientHeight;
      setTickLeft(refs.current.map((el) => {
        if (!el || scrollable <= 0) return 0;
        const top = el.getBoundingClientRect().top - r.top + panel.scrollTop;
        return Math.min(100, Math.max(0, (top / scrollable) * 100));
      }));
    };
    // the line a heading has to cross, in px from the panel's own top edge -
    // generous enough that a section registers as soon as it's meaningfully
    // in view, not only once perfectly flush with the top.
    const LINE = 120;
    const bottomedOut = () => panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 4;
    const update = () => {
      const scrollable = panel.scrollHeight - panel.clientHeight;
      setProgress(scrollable > 0 ? Math.min(100, (panel.scrollTop / scrollable) * 100) : 0);

      // still sitting where the last jump() left it - trust the click over
      // the geometry, see the block comment above for why the geometry
      // itself can't distinguish the last couple of stops.
      if (pinnedIndex.current !== null && Math.abs(panel.scrollTop - pinnedTop.current) < 2) {
        setActive(pinnedIndex.current);
        return;
      }
      pinnedIndex.current = null;
      const panelTop = panel.getBoundingClientRect().top;
      let i = 0;
      for (let j = 0; j < refs.current.length; j++) {
        const el = refs.current[j];
        if (!el) continue;
        if (el.getBoundingClientRect().top - panelTop <= LINE) i = j;
        else break;
      }
      // an organic scroll to the panel's true bottom - as opposed to a jump
      // clamped there by lack of room - unambiguously means the last section,
      // even when its own heading hasn't reached the line.
      if (bottomedOut()) i = count - 1;
      setActive(i);
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { raf = null; update(); });
    };
    panel.addEventListener('scroll', onScroll, { passive: true });

    // this component stays mounted (SURFACES[studyIdx] governs which case
    // study renders, not studyOpen) even while the overlay itself is closed -
    // .ovl is display:none until .open, so the very first update() above can
    // run against a panel that's genuinely 0×0, and the bottomed-out check
    // reads that as "scrolled to the end" before the reader has opened
    // anything. the resize from 0 to the panel's real size, when .open
    // actually lands, is a real ResizeObserver-worthy event - re-running
    // update() there (not just place()) is what corrects the guess once
    // there's real geometry to read.
    const ro = new ResizeObserver(() => { place(); update(); });
    ro.observe(panel);
    update();

    return () => {
      ro.disconnect();
      panel.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [count]);

  // always instant, never 'smooth' - this case study's own pinned scroll-
  // scenes (.oscn/.cjx) each span several viewport heights, so the real
  // distance between two stops can be tens of thousands of pixels. native
  // smooth-scroll eases at a roughly constant perceptual speed rather than
  // scaling duration down for a short hop, so a "smooth" jump across the
  // whole case study takes several real seconds - which both defeats the
  // point of a quick index and drags the reader through every pinned scene
  // in between, firing their reveals along the way. an instant jump is the
  // one that actually behaves like an index.
  const jump = (i) => {
    const panel = document.querySelector('.ovl-panel');
    refs.current[i]?.scrollIntoView({ block: 'start', behavior: 'auto' });
    if (panel) { pinnedIndex.current = i; pinnedTop.current = panel.scrollTop; }
    setActive(i);
  };

  return [refs, active, pos, jump, progress, tickLeft, panelRect];
}

// reveal-on-scroll for [data-rv] children, scoped to the overlay panel - same
// pattern as Invoice/Knowledge Base/GenAI (copied per-file, not shared, so one
// case study's triggers never race another's). only touches the plain static
// content below (step-tags, headings, paragraphs, card grids); the hero and
// the pinned scroll-scenes (AlexJourney, TheBetScene, AuditScene,
// ScreensScene) already reveal themselves via their own obeat progression.
function useBlockReveal(ref) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    const nodes = root.querySelectorAll('[data-rv]');
    if (typeof IntersectionObserver === 'undefined') {
      nodes.forEach((n) => n.classList.add('on'));
      return undefined;
    }
    const panel = root.closest('.ovl-panel') || document.querySelector('.ovl-panel');
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('on');
            obs.unobserve(e.target);
          }
        });
      },
      // a shallower -8% bottom margin fired the reveal the instant an element's
      // top pixel peeked into the panel - by the time a reader's eye actually
      // reached it, the transition had already finished off-screen and it just
      // looked pre-rendered. -28% holds it off until the element is well into
      // the panel's real reading area, so there's real runway left for the
      // slide/blur/scale to still be running while it crosses into view -
      // visibly arriving, not already sitting there.
      { root: panel || null, rootMargin: '0px 0px -28% 0px', threshold: 0.15 },
    );
    nodes.forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, [ref]);
}

// the hook phase is four scroll beats, not one static screen: a time-jump
// back to 2022 first (a narrator's aside, not the persona's own voice - the
// one line in the whole sequence that isn't bold sans, so it reads as
// stepping out of the case study rather than into it), then why a persona (a
// method, not yet a name), who she is, then the one thing she's trying to do
// - each its own small graphic rather than a paragraph of setup, so the
// reader arrives at "day 0" already knowing what they're watching happen.
const HOOK_BEATS = 4;

function AlexJourney() {
  const ref = useRef(null);
  const [beat, jump] = useScrollBeat(ref, CJ_STEPS.length + HOOK_BEATS);
  const stepIdx = beat - HOOK_BEATS; // < 0 = hook screen, hook beat = beat itself
  const [displayDay, setDisplayDay] = useState(0);
  const prevDay = useRef(0);
  const [flashKey, setFlashKey] = useState(0);

  useEffect(() => {
    if (stepIdx < 0) { setDisplayDay(0); prevDay.current = 0; return undefined; }
    const target = CJ_STEPS[stepIdx].d;
    const from = prevDay.current;
    const t0 = performance.now();
    const dur = 550;
    let raf;
    const step = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - (1 - p) ** 3;
      setDisplayDay(Math.round(from + (target - from) * eased));
      if (p < 1) raf = requestAnimationFrame(step);
      else prevDay.current = target;
    };
    raf = requestAnimationFrame(step);
    setFlashKey((k) => k + 1);
    return () => cancelAnimationFrame(raf);
  }, [stepIdx]);

  const heat = stepIdx >= 7 ? '2' : stepIdx >= 4 ? '1' : '0';
  const current = stepIdx >= 0 ? CJ_STEPS[stepIdx] : null;

  if (prefersReducedMotion) {
    return (
      <div className="cj-timeline">
        {CJ_STEPS.map((s) => (
          <div className="cj" key={s.t}>
            <div className="cj-top"><div className="cj-day">day <b>{s.d}</b></div></div>
            <div className="cj-body">
              <span className="cj-ico">{s.i}</span>
              <div>
                <b className="cj-t">{s.t}</b>
                <p className="cj-x">{s.x}</p>
                {s.w ? <p className="cj-w">⚠ {s.w}</p> : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="cjx" ref={ref} style={{ '--beats': CJ_STEPS.length + HOOK_BEATS }}>
      <div className="cjx-stage" data-heat={heat}>
        {!current ? (
          <div className="cjx-hook" key={beat}>
            {beat === 0 && (
              <p className="cjx-flash">Now, let&apos;s go back to 2022…</p>
            )}
            {beat === 1 && (
              <>
                <svg className="cjx-hook-ico" viewBox="0 0 96 96" aria-hidden="true">
                  <defs>
                    <radialGradient id="cpLensGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#FF6B8A" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#FF6B8A" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="cpLensStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FF6B8A" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#FF6B8A" stopOpacity="0.4" />
                    </linearGradient>
                  </defs>
                  {/* red, not --mute like the rest of the hook's icons - this
                      is the one beat naming the problem itself, and the lens
                      glowing the same colour as the word makes that the
                      icon's whole point instead of a generic magnifier. */}
                  <circle cx="40" cy="40" r="32" fill="url(#cpLensGlow)" />
                  <circle cx="40" cy="40" r="25" fill="none" stroke="url(#cpLensStroke)" strokeWidth="3" />
                  <circle cx="40" cy="40" r="17" fill="none" stroke="url(#cpLensStroke)" strokeWidth="1" opacity="0.45" />
                  <circle cx="40" cy="40" r="7" fill="#FF6B8A" opacity="0.9" />
                  <line x1="59" y1="59" x2="82" y2="82" stroke="url(#cpLensStroke)" strokeWidth="3.6" strokeLinecap="round" />
                </svg>
                <p className="cjx-q">A persona will walk us<br />through <em className="cp-problem">the problem</em>.</p>
              </>
            )}
            {beat === 2 && (
              <>
                <img className="ana-portrait" src="/Ananya.png" alt="Ananya" />
                <p className="cjx-name">Ananya</p>
                <p className="cjx-q">VP of Infrastructure<br />at a Mumbai fintech.</p>
              </>
            )}
            {beat === 3 && (
              <>
                <svg className="cjx-hook-ico" viewBox="0 0 96 48" aria-hidden="true">
                  <defs>
                    <linearGradient id="cpNodeStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3696B1" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#3696B1" stopOpacity="0.55" />
                    </linearGradient>
                  </defs>
                  <circle cx="14" cy="24" r="9" fill="none" stroke="url(#cpNodeStroke)" strokeWidth="2.6" />
                  <circle cx="14" cy="24" r="3" fill="#3696B1" />
                  <circle cx="82" cy="24" r="9" fill="none" stroke="url(#cpNodeStroke)" strokeWidth="2.6" />
                  <circle cx="82" cy="24" r="3" fill="#3696B1" />
                  <line x1="23" y1="24" x2="73" y2="24" stroke="url(#cpNodeStroke)" strokeWidth="2" strokeDasharray="4 5" />
                  <path d="M66 17l8 7-8 7" fill="none" stroke="url(#cpNodeStroke)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="cjx-q">Needs <em>one</em> connection:<br />datacenter → AWS ap-south-1.</p>
              </>
            )}
            <span className="cjx-cue">scroll to watch the days pile up →</span>
          </div>
        ) : (
          <div className="cjx-step flash" key={flashKey}>
            <div className="cj-top">
              <div className="cj-day">day <b>{displayDay}</b></div>
              <div className="cj-dots">
                {CJ_STEPS.map((s, i) => (
                  <i key={s.t} className={i <= stepIdx ? 'on' : ''} onClick={() => jump(i + HOOK_BEATS)} />
                ))}
              </div>
            </div>
            <div className="cj-body">
              <span className="cj-ico">{current.i}</span>
              <div>
                <b className="cj-t">{current.t}</b>
                <p className="cj-x">{current.x}</p>
                {current.w ? <p className="cj-w">⚠ {current.w}</p> : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TheBetScene() {
  const ref = useRef(null);
  const [beat] = useScrollBeat(ref, 7);
  const on = (b) => `obeat ${beat >= b ? 'on' : ''}`;

  return (
    <div className="oscn bet-oscn" ref={ref} style={{ '--beats': 7 }}>
      <div className="oscn-stage bet-stage" key={beat < 2 ? beat : beat === 7 ? 'map' : 'combo'}>
        {beat === 0 && (
          <>
            <div className="cj-result obeat on">
              <span><b>~90</b> days to provision</span>
              <span><b>5+</b> vendors contacted</span>
              <span><b>34%</b> form error rate</span>
              <span><b>0</b> visibility into status</span>
            </div>
            <p className="dv-p dim obeat on">this was the standard. for decades.</p>
          </>
        )}

        {beat === 1 && (
          <>
            <div className="inv-step-tag obeat on"><i></i>Solution</div>
            <h3 className="plain obeat on">What happens instead</h3>
            <p className="dv-p obeat on">A Network-as-a-Service platform, pre-connected everywhere Ananya needs. Keep scrolling:</p>
          </>
        )}

        {/* Ananya opens Polarin → the swaps: builds up as one combined scene,
            each piece staying visible as the next fades in - not a replace. */}
        {beat >= 2 && (beat < 7 || prefersReducedMotion) && (
          <>
            <p className={`bet-l1 ${on(2)}`}>Ananya doesn&apos;t call anyone.</p>
            <p className={`bet-l2 ${on(3)}`}>She opens <em>Polarin.</em></p>
            <div className={`dv-pipe bet-pipe ${on(4)}`}>
              <span className="dvp"><b>discover</b></span><em>→</em>
              <span className="dvp"><b>compare</b></span><em>→</em>
              <span className="dvp"><b>order</b></span><em>→</em>
              <span className="dvp"><b>provision</b></span><em>→</em>
              <span className="dvp last"><b>manage</b><i>live</i></span>
            </div>
            <p className={`bet-90 ${on(5)}`}><s className="from">~90 days</s><span className="arr">→</span><b className="to">10 minutes.</b></p>
            <div className={`bet-swaps ${on(6)}`}>
              <span><s>5+ vendor calls</s><b>1 platform</b></span>
              <span><s>PDF order forms</s><b>self-serve</b></span>
              <span><s>zero visibility</s><b>real-time tracking</b></span>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

function AuditScene() {
  const ref = useRef(null);
  const [beat] = useScrollBeat(ref, 10);
  const on = (b) => (beat >= b ? 'on' : '');
  // two acts, not one accumulating pile: the benchmark (table + what it
  // found) and then the gap list. stacking all ten beats into .oscn-stage's
  // fixed 74vh box overflowed it by ~150px, and flexbox answered that by
  // shrinking the one child that could shrink - the audit table - which its
  // own overflow:hidden then cropped from six rows to a 104px sliver. the
  // same reason ExploreScene swaps one beat's content at a time.
  // useScrollBeat starts at the LAST beat under prefersReducedMotion, which
  // with a two-act split would have hidden act one - i.e. the benchmark
  // table itself - from exactly the readers who never scroll it into view.
  // there, both acts render stacked; the stage's own overflow-y handles it.
  const act2 = beat >= 8;
  const showA1 = !act2 || prefersReducedMotion;
  const showA2 = act2 || prefersReducedMotion;

  return (
    <div className="oscn" ref={ref} style={{ '--beats': 10 }}>
      <div className={`oscn-stage aud-stage ${prefersReducedMotion ? 'aud-stage-stack' : ''}`}>
        <div className={`aud-act ${showA1 ? '' : 'aud-act-out'}`}>
          <p className={`aud-lead obeat ${on(0)}`}><b className="cp-signal">4 global platforms</b>, audited feature by feature. every gap became a requirement:</p>
          <div className="aud">
            <div className={`aud-r aud-h obeat ${on(0)}`}><span>platform</span><span>self-serve</span><span>onboarding</span><span>india</span></div>
            {AUDIT.map((a, i) => (
              <div className={`aud-r obeat ${on(i + 1)}`} key={a.name}><span>{a.name}</span><span>{a.serve}</span><span>{a.onboard}</span><span>{a.india}</span></div>
            ))}
            <div className={`aud-r aud-p obeat ${on(5)}`}><span>Polarin →</span><span>full</span><span>15 minutes</span><span>native</span></div>
          </div>

          <p className={`aud-finding obeat ${on(6)}`}><b className="cp-rose">None run end-to-end in India.</b> <em className="cp-up">Polarin would be the first.</em></p>

          <p className={`aud-insight obeat ${on(7)}`}>the person approving <em className="cp-amber">₹50L</em> <em className="cp-rose">can&apos;t order without help.</em></p>
        </div>

        <div className={`aud-act ${showA2 ? '' : 'aud-act-out'}`}>
          <div className={`aud-gaps obeat ${showA2 ? 'on' : ''}`}>
            <p className="aud-gaps-lead">six gaps, six things built:</p>
            <div className="aud-gap-grid">
              {AUDIT_GAPS.map((g) => (
                <div className="aud-gap" key={g.gap}>
                  <b>{g.gap}</b>
                  <p><span className="aud-gap-found">{g.found}</span> <span className="aud-gap-arrow">→</span> {g.built}</p>
                </div>
              ))}
            </div>
          </div>

          <p className={`aud-next obeat ${on(9)}`}>tracked <em className="cp-signal">every quarter</em> - competitors ship, expectations move.</p>
        </div>
      </div>
    </div>
  );
}

// where effort met impact, plotted per module - the five in the top-left
// (low effort, high impact) are what actually shipped first; the rest were
// real modules too, just further down the map. static now (the "Information
// architecture" section renders it directly, no scroll-beat reveal) - it
// used to live inside a pinned scroll scene that also carried the seven-step
// research walkthrough and the design-system hand-off note, both of which
// now have their own dedicated sections ("Desk research" and "Design
// system") instead of sharing this one's screen time.
const EFFORT_MAP = [
  { m: 'KYC / org verification', effort: 20, impact: 86, first: true, weeks: '2-3 wks', value: 'no KYC, no contract - it gates every order' },
  { m: 'User management', effort: 30, impact: 76, first: true, weeks: '3-4 wks', value: 'a team shares an account without sharing a password' },
  { m: 'Order journey', effort: 58, impact: 94, first: true, weeks: '7-8 wks', value: 'the product itself - 90 days down to 10 minutes' },
  { m: 'Service details', effort: 36, impact: 66, first: true, weeks: '4 wks', value: "answers 'is it up?' without a support call" },
  { m: 'Activity logs', effort: 24, impact: 52, first: true, weeks: '2 wks', value: 'the audit trail procurement asks for' },
  { m: 'Billing & invoicing', effort: 74, impact: 62, first: false, weeks: '10 wks', value: "GST input credit, or finance won't sign" },
  { m: 'Health monitoring', effort: 82, impact: 80, first: false, weeks: '12 wks', value: "evidence for the customer's own SLA review" },
];

// the real Polarin palette, sampled off the product screenshots rather than
// recalled - the placeholder set this replaced had invented names and a dark
// surface, and Polarin is a light product built on teal. `key` is what ties
// a token to the specimens built out of it, further down.
const DS_COLORS = [
  { key: 'teal', hex: '#00828F', name: 'Teal 600', role: 'primary action, active state', ink: '#FFFFFF' },
  { key: 'deep', hex: '#003A56', name: 'Deep 900', role: 'hero surfaces', ink: '#FFFFFF' },
  { key: 'ink', hex: '#003350', name: 'Ink', role: 'body text, values', ink: '#FFFFFF' },
  { key: 'blue', hex: '#0386FF', name: 'Blue 500', role: 'links, inline answers', ink: '#FFFFFF' },
  { key: 'live', hex: '#19AD52', name: 'Live 600', role: 'healthy, online, saving', ink: '#FFFFFF' },
  { key: 'page', hex: '#F7F9FC', name: 'Page', role: 'the ground everything sits on', ink: '#003350', light: true },
  { key: 'surface', hex: '#FFFFFF', name: 'Surface', role: 'cards, inputs', ink: '#003350', light: true },
  { key: 'line', hex: '#E3E8EF', name: 'Hairline', role: 'borders, dividers', ink: '#003350', light: true },
];

const DS_TYPE = [
  { px: 26, w: 650, label: 'Page title', sample: 'Create Data Center Interconnect' },
  { px: 17, w: 650, label: 'Section', sample: 'Subscription Term' },
  { px: 14, w: 400, label: 'Body', sample: 'Choose the term that best fits your needs' },
  { px: 12, w: 400, label: 'Caption', sample: 'Available Rate Limit: 6.9 Gbps' },
];

const DS_STEPS = ['Port Selection', 'Configure', 'Add Ons', 'Checkout'];
// the two real term/price pairs off the Configure screen - the specimen
// swaps between them so the price is seen recalculating rather than sitting
// there as a number, which is the only part of it that's actually a system
// behaviour rather than a layout.
const DS_TERMS = [
  { term: 'PAYG', sub: 'Pay as you go', price: '₹10,032.00', off: null, was: null },
  { term: '24 Months', sub: 'Better savings', price: '₹9,028.80', off: '10% off', was: '₹10,032.00' },
];

// one slow clock drives the whole section: which token is lit, how far the
// step indicator has walked, and which term the price is showing. they run
// on different divisors so the canvas never looks like a single thing
// blinking in unison. paused whenever the section is off screen, and never
// started at all under prefersReducedMotion - the components below are the
// content here, so they still render, just holding still.
function useDsClock(ref) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (prefersReducedMotion || !ref.current) return undefined;
    let id = null;
    const start = () => { if (id === null) id = setInterval(() => setT((n) => n + 1), 1900); };
    const stop = () => { if (id !== null) { clearInterval(id); id = null; } };
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0.15 });
    io.observe(ref.current);
    return () => { stop(); io.disconnect(); };
  }, [ref]);
  return t;
}

// the components, rendered as live DOM rather than shown as cropped
// screenshots. every specimen is built out of the tokens declared once on
// the tile, and lighting a token in the colour tile dims everything
// that isn't made of it - which is the claim this section exists to make,
// demonstrated instead of asserted.
// the five stages this case study is organised into, each already its own
// section further down - the chips jump there rather than restating them.
const APPROACH_STAGES = [
  { label: 'Desk research', to: 3 },
  { label: 'Information architecture', to: 4 },
  { label: 'Exploration', to: 5 },
  { label: 'Design system', to: 6 },
  { label: 'Screens', to: 7 },
];

const APPROACH_INPUTS = [
  { k: 'Architects', n: '4 months', v: 'embedded with the network team' },
  { k: 'Sales & ops', n: 'Interviews', v: 'what gets asked, what gets stuck' },
  { k: 'Public record', n: 'Everything', v: 'filings, pricing, NaaS docs' },
];

// the portal's real taxonomy, straight off the product's own navigation: a
// fixed app shell, and underneath it a catalogue grouped by what a buyer is
// trying to connect rather than by the technology that does it.
const IA_SHELL = ['Dashboard', 'Services', 'Settings', 'Invoices', 'Help'];
const IA_CATALOGUE = [
  { group: 'Cloud Connect', items: ['Cloud-to-Cloud', 'DC to Cloud'] },
  { group: 'Global DCI', items: ['DCI Wave', 'DCI Layer 2'] },
  { group: 'Internet', items: ['Internet Exchange'] },
  { group: 'Core Products', items: ['Port', 'Virtual Router'] },
];

// one idea per beat, centred, the same shape Problem and Solution use - a
// reader should take a screen in within a second or two and keep scrolling,
// so nothing here carries more than a line or two. the research section is
// the deliberate exception: that one earns its density.
// one idea per beat, centred, the same shape Problem and Solution use - a
// reader should take a screen in within a second or two and keep scrolling,
// so nothing here carries more than a line or two. the research section is
// the deliberate exception: that one earns its density.
//
// each beat is a function so prefersReducedMotion can render the whole set
// stacked: useScrollBeat parks that mode on the LAST beat, which with a
// `beat === n &&` structure would show a reader the closing slide and
// nothing that led to it.
function ApproachScene({ jump }) {
  const ref = useRef(null);
  const [beat] = useScrollBeat(ref, 5);

  const beats = [
    <div className="apr-briefwrap" key="brief">
      <span className="apr-eyebrow obeat on">The brief</span>
      <blockquote className="apr-brief obeat on">
        &quot;Make ordering connectivity <em className="cp-signal">self-serve</em> - where nobody had.&quot;
      </blockquote>
    </div>,
    <h3 className="apr-big obeat on" key="notemplate">
      No template to copy.<br /><em className="cp-rose">None of them ran in India.</em>
    </h3>,
    <div key="inputs">
      <span className="apr-eyebrow obeat on">Where the understanding came from</span>
      <div className="apr-inputs obeat on">
        {APPROACH_INPUTS.map((i) => (
          <div className="apr-input" key={i.k}>
            <b className="cp-signal">{i.n}</b>
            <span>{i.k}</span>
          </div>
        ))}
      </div>
    </div>,
    <h3 className="apr-big obeat on" key="doc">
      The first thing I made<br />wasn&apos;t a screen. It was <em className="cp-up">the document</em>.
    </h3>,
    <div key="stages">
      <p className="apr-willsee obeat on">In this case study we will see</p>
      <div className="apr-stages obeat on">
        {APPROACH_STAGES.map((st) => (
          <button type="button" key={st.label} onClick={() => jump(st.to)}>{st.label}</button>
        ))}
      </div>
    </div>,
  ];

  if (prefersReducedMotion) {
    return <div className="apr-static">{beats}</div>;
  }

  return (
    <div className="oscn apr-oscn" ref={ref} style={{ '--beats': beats.length }}>
      <div className="oscn-stage apr-stage" key={beat}>{beats[beat]}</div>
    </div>
  );
}

function IAScene() {
  const ref = useRef(null);
  const [beat] = useScrollBeat(ref, 4);

  const beats = [
    <h3 className="apr-big obeat on" key="intent">
      Engineering sees <em className="cp-rose">transport</em>.<br />A buyer sees <em className="cp-up">a rack here, a cloud there</em>.
    </h3>,
    <div key="tree">
      <span className="apr-eyebrow obeat on">Grouped by intent, not by transport</span>
      <div className="ia-tree obeat on">
        <div className="ia-shell-row">
          {IA_SHELL.map((n) => <span className="ia-nav" key={n}>{n}</span>)}
        </div>
        <div className="ia-cat-grid">
          {IA_CATALOGUE.map((g) => (
            <div className="ia-group" key={g.group}>
              <b>{g.group}</b>
              <ul>{g.items.map((i) => <li key={i}>{i}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>
    </div>,
    <h3 className="apr-big obeat on" key="seven">
      <em className="cp-amber">Seven modules, one designer.</em><br />Cheap and unskippable <em className="cp-up">shipped first</em>.
    </h3>,
    <div className="ia-effort" key="effort">
      <span className="apr-eyebrow obeat on">Effort against impact</span>
      <div className="eff-map obeat on">
        <span className="eff-axis-y">impact →</span>
        <span className="eff-axis-x">effort →</span>
        {EFFORT_MAP.map((m) => (
          <div
            className={`eff-dot ${m.first ? 'first' : ''} ${m.effort > 55 ? 'flip' : ''} ${m.impact > 72 ? 'vflip' : ''}`}
            key={m.m}
            style={{ left: `${m.effort}%`, bottom: `${m.impact}%` }}
            tabIndex={0}
          >
            <i />
            <b className="eff-name">{m.m}</b>
            <div className="eff-pop">
              <span className="eff-pop-w">{m.weeks} to build</span>
              <span className="eff-pop-v">{m.value}</span>
            </div>
          </div>
        ))}
      </div>
      <p className="apr-cap obeat on">filled = shipped in the first release</p>
    </div>,
  ];

  if (prefersReducedMotion) {
    return <div className="apr-static">{beats}</div>;
  }

  return (
    <div className="oscn ia-oscn" ref={ref} style={{ '--beats': beats.length }}>
      <div className="oscn-stage ia-stage" key={beat}>{beats[beat]}</div>
    </div>
  );
}

// the products the same four-step skeleton carries - only the Configure
// step's fields differ between them, which is the whole argument.
const DS_PRODUCTS = [
  { name: 'DCI Layer 2', field: 'MACSec · rate limit' },
  { name: 'Port', field: 'bandwidth · LAG' },
  { name: 'Virtual Router', field: 'ASN · peering' },
  { name: 'Internet Exchange', field: 'peer · prefix limit' },
];

// the section as four cinematic tiles rather than a spec sheet: each one is
// a moment of the system moving, on a shared slow clock, so the reader sees
// the system behave rather than reads a list of what it contains.
function DesignSystemScene() {
  const ref = useRef(null);
  const t = useDsClock(ref);
  const [pick, setPick] = useState(null);
  const auto = DS_COLORS[t % DS_COLORS.length];
  const tok = pick ? DS_COLORS.find((c) => c.key === pick) : auto;
  const typeStep = prefersReducedMotion ? DS_TYPE.length - 1 : t % DS_TYPE.length;
  const step = prefersReducedMotion ? 1 : t % DS_STEPS.length;
  const prod = DS_PRODUCTS[prefersReducedMotion ? 0 : Math.floor(t / 2) % DS_PRODUCTS.length];
  const term = DS_TERMS[prefersReducedMotion ? 1 : Math.floor(t / 3) % DS_TERMS.length];

  return (
    <div className="ds" ref={ref}>
      <div className="ds-head cps-rv" data-rv>
        <h3 className="ds-h">One system. Every <em className="cp-signal">product</em>.</h3>
        <p className="ds-lede">A growing product line and one designer. That only works if a new product is an assembly job.</p>
      </div>

      <div className="ds-reel cps-rv" data-rv style={{ '--d': '60ms' }}>
        {/* 1 - colour. the lit token drives the swatch stack and names itself. */}
        <div className="ds-tile ds-tile-col" style={{ '--glow': tok.hex }}>
          <span className="ds-tile-t">Colour</span>
          <div className="ds-stack">
            {DS_COLORS.map((c) => (
              <button
                type="button"
                key={c.key}
                className={`ds-band${tok.key === c.key ? ' on' : ''}`}
                style={{ background: c.hex }}
                onClick={() => setPick(pick === c.key ? null : c.key)}
                aria-label={c.name}
              />
            ))}
          </div>
          <div className="ds-tile-read" key={tok.key}>
            <b>{tok.name}</b>
            <span>{tok.hex} · {tok.role}</span>
          </div>
        </div>

        {/* 2 - type. the ramp reveals a step at a time, largest first. */}
        <div className="ds-tile ds-tile-type">
          <span className="ds-tile-t">Type</span>
          <div className="ds-ramp">
            {DS_TYPE.map((ty, i) => (
              <span
                key={ty.label}
                className={`ds-ramp-l${i === typeStep ? ' on' : ''}${i < typeStep ? ' past' : ''}`}
                style={{ fontSize: `${ty.px}px`, fontWeight: ty.w }}
              >
                {ty.sample}
              </span>
            ))}
          </div>
          <div className="ds-tile-read" key={DS_TYPE[typeStep].label}>
            <b>{DS_TYPE[typeStep].label}</b>
            <span>{DS_TYPE[typeStep].px}px · {DS_TYPE[typeStep].w}</span>
          </div>
        </div>

        {/* 3 - components, actually running. */}
        <div className="ds-tile ds-tile-comp">
          <span className="ds-tile-t">Components</span>
          <div className="ds-comp">
            <div className="ds-comp-row">
              <button type="button" className="ds-btn ds-btn-p">Upgrade</button>
              <span className="ds-badge ds-badge-live"><i className="ds-dot" />Live</span>
            </div>
            <div className="ds-comp-row">
              <span className="ds-chip">All <b>17</b></span>
              <span className="ds-chip ds-chip-on">Live <b>6</b></span>
            </div>
            <div className="ds-money">
              <span className="ds-price-v" key={term.price}>{term.price}</span>
              {term.off && <span className="ds-off">{term.off}</span>}
            </div>
          </div>
          <div className="ds-tile-read"><b>Built once</b><span>states, not screenshots</span></div>
        </div>

        {/* 4 - the shape that does not change, and the one step that does. */}
        <div className="ds-tile ds-tile-shape">
          <span className="ds-tile-t">One shape</span>
          <div className="ds-shape">
            <span className="ds-shape-p" key={prod.name}>{prod.name}</span>
            <ol className="ds-steps">
              {DS_STEPS.map((sname, i) => (
                <li key={sname} className={i === step ? 'on' : i < step ? 'done' : ''}>
                  <i>{i < step ? '✓' : i + 1}</i>{sname}
                </li>
              ))}
            </ol>
            <span className="ds-shape-f" key={prod.field}>Configure: {prod.field}</span>
          </div>
          <div className="ds-tile-read"><b>Only step 2 changes</b><span>a new product is one step&apos;s fields</span></div>
        </div>
      </div>

      <p className="ds-foot cps-rv" data-rv style={{ '--d': '180ms' }}>
        four years of solo output, because a new product doesn&apos;t get a new design - it gets <em className="cp-up">one step&apos;s worth of fields</em>.
      </p>
    </div>
  );
}

function ScreensScene() {
  const ref = useRef(null);
  const [beat, jump] = useScrollBeat(ref, 4);
  const [imgOk, setImgOk] = useState(true);
  const key = SHOT_ORDER[beat];
  const sh = SHOTS[key];

  return (
    <div className="oscn" ref={ref} style={{ '--beats': 4 }}>
      <div className="oscn-stage shots-stage">
        <div className="cs-tabs">
          {SHOT_ORDER.map((k, i) => (
            <button key={k} type="button" className={key === k ? 'on' : ''} onClick={() => jump(i)}>{SHOTS[k].label}</button>
          ))}
        </div>
        <figure className="cs-shot">
          <div className="cs-shot-frame">
            {imgOk ? (
              <img key={key} src={sh.src} alt="Polarin customer portal screen" loading="lazy" onError={() => setImgOk(false)} />
            ) : (
              <div className="dv-shot" aria-hidden="true" style={{ marginTop: 0 }}>
                <div className="shot-bar"><i></i><i></i><i></i><em></em></div>
                <div className="shot-body">
                  <div className="shot-side"><i></i><i className="on"></i><i></i><i></i><i></i></div>
                  <div className="shot-main">
                    <div className="shot-code"><i style={{ '--w': '68%' }}></i><i style={{ '--w': '48%' }}></i><i style={{ '--w': '58%' }}></i></div>
                    <div className="shot-run"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <figcaption key={`${key}-cap`}>{sh.cap}</figcaption>
        </figure>
      </div>
    </div>
  );
}


// the Exploration section's own framework, not a one-off scene: each real
// exploration gets its own "chapter" - a title beat, then the same shape
// every time (the challenge, the objective, how it was explored, what was
// asked, what it taught, the final experience, the outcome) - so a reader
// learns the shape once and can skim every chapter after that the same way.
// chapter 1 (the order journey) is real; chapter 2 is a placeholder tag,
// same convention as the other sections still being rebuilt one at a time.
// the beats live in one array, not inline per-beat JSX in the render -
// EXPLORE_BEATS[beat] is the scroll-driven view (one beat mounted at a time,
// see the note below), and the same array maps straight down the page for
// prefersReducedMotion,
// so neither path can drift out of sync with the other.
// the buyer's own questions, in their words and in the order they ask them
// - kept short on purpose. these are scattered raw on the Exploration beat
// (what came out of the conversations) and then bracketed into three steps
// on the beat after it (what we did with them), so the pair reads as before
// and after rather than as a list plus a summary of the list.
const EXPLORE_THOUGHTS = [
  'Are you even in my DC?',
  'Can I get this bandwidth?',
  'For how long?',
  'What does it cost?',
  'Where does it get billed?',
  'How do I want to pay?',
];

// the customer's six questions were only the first pass - each one had to be
// answered by a team that owns a different part of the product's life, and
// each of those teams added requirements the customer never mentions. this
// beat is deliberately text-only: it's the one part of the process that
// never had a screen, and inventing one would misrepresent it.
const EXPLORE_VALIDATION = [
  {
    who: 'Network engineering',
    q: 'Can the platform actually provision this?',
    got: ['A-end and Z-end, exactly', 'MACSec, tagging, rate limit', 'what the router config needs'],
  },
  {
    who: 'Delivery',
    q: 'Can we actually deliver what was ordered?',
    got: ['which DC, which rack', 'realistic lead times to promise', 'who signs off at each end'],
  },
  {
    who: 'Sales',
    q: 'Is this organisation allowed to order?',
    got: ['KYC on the organisation', 'the legal entity being billed', 'credit terms before checkout'],
  },
];

// paper first. three of the versions the four steps went through before any
// of it became a screen - drawn as sketches rather than shown as clean
// wireframes, because the point of this beat is that the shape was argued
// over on paper, and a tidy vector would hide exactly that.
function ExplSketches() {
  return (
    <div className="expl-sketches">
      <figure className="expl-sketch">
        <svg viewBox="0 0 150 170" role="img" aria-label="First sketch: every field in one long form">
          <path d="M9 8 L141 10 L140 161 L10 159 Z" />
          <path d="M20 26 L96 27M20 40 L128 41M20 54 L128 55M20 68 L128 69M20 82 L128 83M20 96 L128 97M20 110 L128 111M20 124 L128 125M20 138 L104 139" />
          <path className="expl-sketch-x" d="M26 22 L126 146M126 22 L26 146" />
        </svg>
        <figcaption>v1 — one long form. too much at once.</figcaption>
      </figure>
      <figure className="expl-sketch">
        <svg viewBox="0 0 150 170" role="img" aria-label="Second sketch: fields split across tabs">
          <path d="M9 9 L141 8 L141 160 L9 161 Z" />
          <path d="M10 34 L140 33" />
          <path d="M22 20 L48 21M62 20 L88 21M102 20 L128 21" />
          <path d="M22 50 L128 51M22 66 L128 67M22 82 L96 83" />
          <path d="M22 104 L128 105M22 120 L128 121M22 136 L96 137" />
          <path className="expl-sketch-note" d="M96 148 L134 149" />
        </svg>
        <figcaption>v2 — tabs. people missed the ones they hadn&apos;t opened.</figcaption>
      </figure>
      <figure className="expl-sketch expl-sketch-win">
        <svg viewBox="0 0 150 170" role="img" aria-label="Third sketch: a four-step flow with a running price panel">
          <path d="M9 8 L141 9 L140 160 L10 161 Z" />
          <circle cx="28" cy="26" r="6" /><circle cx="58" cy="27" r="6" /><circle cx="88" cy="26" r="6" /><circle cx="118" cy="27" r="6" />
          <path d="M34 26 L52 27M64 27 L82 26M94 26 L112 27" />
          <path d="M22 48 L92 49M22 64 L92 65M22 80 L92 81M22 96 L74 97" />
          <path d="M102 44 L132 45 L131 122 L101 121 Z" />
          <path d="M108 58 L126 59M108 70 L124 71M108 84 L126 85" />
          <path d="M22 130 L58 131M96 130 L132 131" />
        </svg>
        <figcaption>v3 — four steps, price always on screen. this one held up.</figcaption>
      </figure>
    </div>
  );
}

// the finished Configure step, read region by region - percentages, not
// pixels, so the spotlight tracks the screenshot at whatever width the
// column gives it. coordinates measured off the 1400x771 source.
const ANATOMY = [
  {
    box: { left: 31.8, top: 1, width: 39.6, height: 5.2 },
    title: 'You always know how much is left.',
    body: 'the same four steps for every product, always visible, never branching - so nobody commits to step one without seeing what step four asks for.',
  },
  {
    box: { left: 32.1, top: 25.9, width: 65.7, height: 19.5 },
    title: 'The answer sits beside the question.',
    body: 'available rate limit is live inventory for the exact pair of ports already chosen. no one has to go and ask what capacity exists before typing a number into the field.',
  },
  {
    box: { left: 32.5, top: 50.3, width: 36.8, height: 15.3 },
    title: 'Commitment, shown as value.',
    body: 'pay as you go, short term, or 24 months - with the saving marked on the option itself rather than revealed in a total further down.',
  },
  {
    box: { left: 32.5, top: 69, width: 38.9, height: 15.6 },
    title: 'Finance decides this, not the form.',
    body: 'some buyers pay everything upfront for the discount, some need it monthly. the form asks how they already pay instead of assuming one answer.',
  },
  {
    box: { left: 1, top: 55.8, width: 28.6, height: 37.6 },
    title: 'Price never arrives as a surprise.',
    body: 'on screen the whole time, recalculating as the term and payment split change - upfront, monthly and total commitment all readable before checkout is reached.',
  },
];

// the walkthrough itself. all five beats render this same component under one
// key, so React keeps the node mounted and only the `i` prop changes - which
// is what lets the highlight glide from region to region instead of cutting.
// the dimming is one element: a small transparent box with a very large
// spread shadow, clipped by the frame's overflow, so the "hole" is the box
// itself and there's no second mask to keep in sync.
function ExplAnatomy({ i, stops = ANATOMY, src = '/dci-form-steps.png', alt, eyebrow = 'Anatomy of the screen' }) {
  const h = stops[i];
  return (
    <>
      <span className="expl-eyebrow">{eyebrow}</span>
      {/* full width rather than the usual half-and-half split: the region
          being explained has to stay readable, and at half a column the
          highlighted text is too small to make the point. */}
      <div className="expl-anat">
        <div className="expl-spot">
          <img src={src} alt={alt ?? 'The finished Configure Connection screen, with the rate limit, subscription term, payment options and running price summary'} />
          <span
            className="expl-spot-hole"
            style={{ left: `${h.box.left}%`, top: `${h.box.top}%`, width: `${h.box.width}%`, height: `${h.box.height}%` }}
          />
        </div>
        <div className="expl-anat-copy">
          <div>
            <span className="expl-count">{i + 1} / {stops.length}</span>
            <h3 className="expl-h">{h.title}</h3>
          </div>
          <p className="expl-note">{h.body}</p>
        </div>
      </div>
    </>
  );
}

// the three steps those six questions collapsed into, with the row span each
// one brackets in ExplFlowViz - grouped by decision, and ordered so each
// answer is available before the next question needs it (no price before a
// port, no tax treatment before a price).
const EXPLORE_GROUPS = [
  { label: 'Location & inventory', rows: [0, 1] },
  { label: 'Term & price', rows: [2, 3] },
  { label: 'Billing & payment', rows: [4, 5] },
];

// the wireframe the six questions became: one field per question, bracketed
// into the three ordered steps. drawn rather than screenshotted because this
// is the shaping stage - the point is the grouping, not the finished UI, and
// a wireframe says "this was a decision" where a polished screen wouldn't.
function ExplFlowViz() {
  const rowY = (i) => 56 + i * 40;
  return (
    <svg className="expl-wire" viewBox="0 0 460 300" role="img" aria-label="Wireframe of the order form: six fields bracketed into three steps - location and inventory, term and price, billing and payment">
      <rect x="10" y="10" width="250" height="282" rx="10" fill="var(--ink2)" stroke="var(--line2)" />
      <line x1="10" y1="38" x2="260" y2="38" stroke="var(--line2)" />
      <rect x="24" y="20" width="42" height="8" rx="4" fill="var(--line2)" />
      {EXPLORE_THOUGHTS.map((q, i) => (
        <g key={q}>
          <rect x="26" y={rowY(i) - 12} width="46" height="5" rx="2.5" fill="var(--line2)" />
          <rect x="26" y={rowY(i)} width="206" height="18" rx="4" fill="var(--raise2)" stroke="var(--line2)" />
        </g>
      ))}
      {EXPLORE_GROUPS.map((g, gi) => {
        const top = rowY(g.rows[0]) - 16;
        const bottom = rowY(g.rows[1]) + 22;
        const mid = (top + bottom) / 2;
        return (
          <g key={g.label}>
            <path
              d={`M274 ${top} h8 v${bottom - top} h-8`}
              fill="none"
              stroke={gi === 1 ? '#E8A33D' : '#3696B1'}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path d={`M282 ${mid} h7`} stroke={gi === 1 ? '#E8A33D' : '#3696B1'} strokeWidth="1.5" strokeLinecap="round" />
            <text x="297" y={mid + 4} className="expl-wire-t">{g.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

// the ten real rail steps, walked left to right: which stop is "on" is
// baked into each EXPLORE_BEATS entry as a plain number, not read from live
// scroll state - the rail has to render identically whether it's the one
// active beat on screen (normal scroll) or one of nine stacked cards
// (prefersReducedMotion), and a fixed index is the only thing that means the
// same thing in both places. the filled-in stops behind it are the
// "building" cue the chapter asked for - progress accumulating stop by stop
// reads as construction, not just a location marker. Outcome isn't a rail
// stop - it closes the chapter as its own full-screen beat, the same
// treatment the opening "Chapter 1" title gets, once Final is behind it.
// Inputs/Simplify/Scale sit between Exploration and Asked - the actual form-
// design work (what the API needed, how that got simplified, how it stayed
// reusable across products) rather than a summary of it.
// beats name the stop they belong to rather than mapping to it one-for-one:
// the Anatomy walkthrough is five beats under a single stop, so the rail
// holds "Anatomy" lit while the highlight moves across the screen instead of
// sprouting five near-identical stops.
const EXPLORE_STEPS = ['Challenge', 'Objective', 'Exploration', 'Validate', 'Sketches', 'The flow', 'Simplify', 'Scale', 'Anatomy', 'Asked', 'Learned', 'Final'];

function ExplRail({ step, steps = EXPLORE_STEPS, chapter = 'Chapter 1' }) {
  const lastIdx = steps.length - 1;
  return (
    <div className="expl-rail" aria-hidden="true">
      <span className="expl-rail-ch">{chapter}</span>
      {steps.map((label, i) => {
        // the last stop reaching "on" IS the chapter finishing, not one more
        // thing still loading - an open-ended spinner there undersold that,
        // so it gets "final" too, swapping the spinner for a real checkmark
        // (see .expl-rail-stop.on.final in the CSS) - an actual <svg> tick
        // rather than a CSS border-triangle hack, since that read as a
        // crude diagonal blob rather than a checkmark at this small a size.
        const isFinalOn = i === step && i === lastIdx;
        const cls = ['expl-rail-stop', i < step && 'done', i === step && 'on', isFinalOn && 'final']
          .filter(Boolean).join(' ');
        return (
          <div className={cls} key={label}>
            <i>
              {isFinalOn && (
                <svg className="expl-rail-tick" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 12.5l5 5L20 6" pathLength="1" fill="none" stroke="#0A0D1A" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </i>
            <span>{label}</span>
          </div>
        );
      })}
    </div>
  );
}

// one gradient glow-badge icon per beat, all built from the same recipe
// AlexJourney's own hook icons use (a soft radial glow behind a gradient-
// stroked glyph) so the new graphics read as part of the same visual
// language rather than a bolted-on icon set. colour carries meaning: rose
// for the problem, teal for the plan and its execution, amber for the
// research beats, green for the payoff - the same palette this case study
// already uses everywhere else (.cp-problem, .cp-signal, .cp-up).
function ExplIcon({ variant }) {
  if (variant === 'challenge') {
    return (
      <svg className="expl-icon" viewBox="0 0 96 96" aria-hidden="true">
        <defs>
          <radialGradient id="explRoseGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF6B8A" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#FF6B8A" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="explRose" gradientUnits="userSpaceOnUse" x1="4" y1="4" x2="92" y2="92">
            <stop offset="0%" stopColor="#FF6B8A" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#FF6B8A" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <circle cx="48" cy="48" r="44" fill="url(#explRoseGlow)" />
        {/* two tangled lines resolving into one straight one - complexity,
            then the simplification the whole chapter is about. */}
        <path d="M14 32q10-14 20 0t20 0q10-14 20 0" fill="none" stroke="url(#explRose)" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        <path d="M14 46q7-10 14 0t14 0 14 0 14 0" fill="none" stroke="url(#explRose)" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
        <path d="M14 66h60" fill="none" stroke="url(#explRose)" strokeWidth="3" strokeLinecap="round" />
        <circle cx="80" cy="66" r="4.5" fill="#FF6B8A" />
      </svg>
    );
  }
  if (variant === 'objective') {
    return (
      <svg className="expl-icon" viewBox="0 0 96 96" aria-hidden="true">
        <defs>
          <radialGradient id="explTealGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3696B1" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3696B1" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="explTeal" gradientUnits="userSpaceOnUse" x1="4" y1="4" x2="92" y2="92">
            <stop offset="0%" stopColor="#3696B1" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#3696B1" stopOpacity="0.45" />
          </linearGradient>
        </defs>
        <circle cx="48" cy="48" r="44" fill="url(#explTealGlow)" />
        <circle cx="48" cy="48" r="30" fill="none" stroke="url(#explTeal)" strokeWidth="1.8" opacity="0.5" />
        <circle cx="48" cy="48" r="18" fill="none" stroke="url(#explTeal)" strokeWidth="2.4" opacity="0.85" />
        <circle cx="48" cy="48" r="6" fill="#3696B1" />
        <line x1="48" y1="2" x2="48" y2="14" stroke="url(#explTeal)" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    );
  }
  if (variant === 'ask') {
    return (
      <svg className="expl-icon" viewBox="0 0 96 96" aria-hidden="true">
        <defs>
          <radialGradient id="explAmberGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E8A33D" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#E8A33D" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="explAmber" gradientUnits="userSpaceOnUse" x1="4" y1="4" x2="92" y2="92">
            <stop offset="0%" stopColor="#E8A33D" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#E8A33D" stopOpacity="0.45" />
          </linearGradient>
        </defs>
        <circle cx="48" cy="48" r="44" fill="url(#explAmberGlow)" />
        <path d="M20 28h56a6 6 0 016 6v20a6 6 0 01-6 6H46l-14 12V60H20a6 6 0 01-6-6V34a6 6 0 016-6z" fill="none" stroke="url(#explAmber)" strokeWidth="2.2" />
        <text x="47" y="52" fontSize="22" fontWeight="700" fill="#E8A33D" textAnchor="middle" fontFamily="Arial, sans-serif">?</text>
      </svg>
    );
  }
  if (variant === 'learned') {
    return (
      <svg className="expl-icon" viewBox="0 0 96 96" aria-hidden="true">
        <defs>
          <radialGradient id="explAmberGlow2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E8A33D" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#E8A33D" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="explAmber2" gradientUnits="userSpaceOnUse" x1="4" y1="4" x2="92" y2="92">
            <stop offset="0%" stopColor="#E8A33D" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#E8A33D" stopOpacity="0.45" />
          </linearGradient>
        </defs>
        <circle cx="48" cy="48" r="44" fill="url(#explAmberGlow2)" />
        <path d="M48 18a19 19 0 00-11 34c2.4 1.7 3.5 3.9 3.5 6.5v3h15v-3c0-2.6 1.1-4.8 3.5-6.5a19 19 0 00-11-34z" fill="none" stroke="url(#explAmber2)" strokeWidth="2.2" />
        <line x1="40.5" y1="68" x2="55.5" y2="68" stroke="url(#explAmber2)" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="42.5" y1="74" x2="53.5" y2="74" stroke="url(#explAmber2)" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="48" y1="4" x2="48" y2="11" stroke="url(#explAmber2)" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        <line x1="22" y1="21" x2="27" y2="26" stroke="url(#explAmber2)" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
        <line x1="74" y1="21" x2="69" y2="26" stroke="url(#explAmber2)" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
      </svg>
    );
  }
  if (variant === 'final') {
    return (
      <svg className="expl-icon" viewBox="0 0 96 96" aria-hidden="true">
        <defs>
          <radialGradient id="explTealGlow3" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3696B1" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3696B1" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="explTeal3" gradientUnits="userSpaceOnUse" x1="4" y1="4" x2="92" y2="92">
            <stop offset="0%" stopColor="#3696B1" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#3696B1" stopOpacity="0.45" />
          </linearGradient>
        </defs>
        <circle cx="48" cy="48" r="44" fill="url(#explTealGlow3)" />
        <circle cx="18" cy="52" r="6.5" fill="none" stroke="url(#explTeal3)" strokeWidth="2" />
        <circle cx="46" cy="28" r="6.5" fill="none" stroke="url(#explTeal3)" strokeWidth="2" />
        <circle cx="74" cy="52" r="6.5" fill="none" stroke="url(#explTeal3)" strokeWidth="2" />
        <circle cx="46" cy="72" r="7.5" fill="#3696B1" />
        <path d="M24 48l16-14M52 24l16 22M46 62V38" fill="none" stroke="url(#explTeal3)" strokeWidth="1.8" strokeDasharray="3 4" />
      </svg>
    );
  }
  return (
    <svg className="expl-icon" viewBox="0 0 96 96" aria-hidden="true">
      <defs>
        <radialGradient id="explUpGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7DF9A6" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#7DF9A6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="explUp" gradientUnits="userSpaceOnUse" x1="4" y1="4" x2="92" y2="92">
          <stop offset="0%" stopColor="#7DF9A6" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#7DF9A6" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <circle cx="48" cy="48" r="44" fill="url(#explUpGlow)" />
      <path d="M14 62l19-19 13 11 26-29" fill="none" stroke="url(#explUp)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M60 22h14v14" fill="none" stroke="url(#explUp)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// the three bookend beats' inner content, each named so the live scroll
// path and the prefersReducedMotion static path can both render the exact
// same JSX without copy-pasting it twice.
const CH1_CONTENT = (
  <>
    <span className="expl-ch-n">Chapter 1</span>
    <p className="cjx-flash expl-ch-t">An order journey that makes networks feel simple</p>
  </>
);
const OUTCOME_CONTENT = (
  <>
    <span className="expl-ch-n">The outcome</span>
    <p className="cjx-flash expl-ch-t">Less network knowledge. <em className="cp-up">More user confidence.</em></p>
    <div className="eff-first-grid" style={{ justifyContent: 'center', marginTop: '24px' }}>
      <span>guided four-step flow</span>
      <span>progressive disclosure</span>
      <span>live availability</span>
      <span>persistent price &amp; commitment</span>
      <span>clear next actions</span>
      <span>a reusable pattern</span>
    </div>
  </>
);
const CH2_CONTENT = (
  <>
    <span className="expl-ch-n">Chapter 2</span>
    <h2 className="expl-ch-t">Managing what&apos;s already live</h2>
  </>
);

const CH2_OUTCOME = (
  <>
    <span className="expl-ch-n">Chapter 2 - outcome</span>
    <h2 className="expl-ch-t">Seventeen circuits, one page, no phone call</h2>
  </>
);

// the six rail-step beats' inner content only - no rail, no .expl-main
// wrapper. kept separate from EXPLORE_BEATS below for the same reason the
// bookends are named consts: the live scroll path needs to swap just this
// part (see the "blink" note on ExploreScene) while the rail stays mounted
// and merely updates which stop is "on".
const EXPLORE_CONTENT = [
  {
    step: 'Challenge',
    node: (
      <>
      <ExplIcon variant="challenge" />
      <span className="expl-eyebrow">The challenge</span>
      <h3 className="expl-h">Connectivity is <em className="cp-rose">complex</em>. The experience shouldn&apos;t be.</h3>
      <blockquote className="expl-quote">&quot;I know what I need to connect. I shouldn&apos;t need to understand the entire network behind it.&quot;</blockquote>
      </>
    ),
  },
  {
    step: 'Objective',
    node: (
      <>
      <ExplIcon variant="objective" />
      <span className="expl-eyebrow">The objective</span>
      <h3 className="expl-h">From intent to <em className="cp-signal">live network</em>, in minutes - not handoffs.</h3>
      <div className="cj-result">
        <span><b>10 min</b> target time for eligible connections</span>
        <span><b>4 steps</b> one guided path, port to checkout</span>
        <span><b className="cp-up">Live</b> visibility from order to connection live</span>
      </div>
      </>
    ),
  },
  {
    step: 'Exploration',
    node: (
      <>
      <span className="expl-eyebrow">Exploration</span>
      <div className="expl-split">
        <div className="expl-viz">
          <div className="expl-scatter">
            {EXPLORE_THOUGHTS.map((q) => <span key={q}>{q}</span>)}
          </div>
          <p className="expl-cap">what buyers actually asked - in their words, before any of it was a screen.</p>
        </div>
        <div className="expl-copy">
          <h3 className="expl-h">They arrive with <em className="cp-rose">six questions</em>.</h3>
          <p className="expl-note">already in a data centre. already have a router. the flow only has to answer what they walked in asking.</p>
        </div>
      </div>
      </>
    ),
  },
  {
    step: 'Validate',
    node: (
      <>
      <span className="expl-eyebrow">Validating it</span>
      <h3 className="expl-h">Six questions in. <em className="cp-signal">Three teams</em> answered back.</h3>
      <div className="expl-cols">
        {EXPLORE_VALIDATION.map((v) => (
          <div className="expl-col" key={v.who}>
            <span className="expl-col-who">{v.who}</span>
            <p className="expl-col-q">{v.q}</p>
            <ul>
              {v.got.map((g) => <li key={g}>{g}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <p className="expl-note expl-note-wide">the customer never mentions KYC, or a lead time, or a rate limit. every one of them still has to be on the form - or somebody downstream cannot do their job.</p>
      </>
    ),
  },
  {
    step: 'Sketches',
    node: (
      <>
      <span className="expl-eyebrow">Iterating on paper</span>
      <div className="expl-split">
        <div className="expl-viz">
          <ExplSketches />
        </div>
        <div className="expl-copy">
          <h3 className="expl-h">Argued out on <em className="cp-up">paper</em> first.</h3>
          <p className="expl-note">cheap to draw, cheap to throw away. the version that survived wasn&apos;t the prettiest one - it was the one where nothing important could be missed by not clicking on it.</p>
        </div>
      </div>
      </>
    ),
  },
  {
    step: 'The flow',
    node: (
      <>
      <span className="expl-eyebrow">Shaping the flow</span>
      <div className="expl-split">
        <div className="expl-viz">
          <ExplFlowViz />
          <p className="expl-cap">one field per question, bracketed into three steps.</p>
        </div>
        <div className="expl-copy">
          <h3 className="expl-h">Grouped into <em className="cp-signal">steps</em>, then made a process.</h3>
          <ul className="expl-pills">
            <li className="expl-pill">Grouped by decision</li>
            <li className="expl-pill">Ordered by dependency</li>
            <li className="expl-pill">Every answer inline</li>
          </ul>
          <p className="expl-note">a missing data centre becomes a request, not a dead end. billing is tagged per state, for GST - not wherever the order was placed.</p>
        </div>
      </div>
      </>
    ),
  },
  {
    step: 'Simplify',
    node: (
      <>
      <span className="expl-eyebrow">Simplifying the input</span>
      <div className="expl-split">
        <div className="expl-viz">
          <img src="/dci-form-simple.png" alt="Port selection, showing a real vendor, location and live availability for the A-End and Z-End ports" />
          <p className="expl-cap">a real vendor, a real location, a live availability count - not a port ID.</p>
        </div>
        <div className="expl-copy">
          <h3 className="expl-h">Then said in the <em className="cp-up">plainest words</em>.</h3>
          <ul className="expl-pills">
            <li className="expl-pill">Advanced off by default</li>
            <li className="expl-pill">One decision at a time</li>
            <li className="expl-pill">Numbers where they&apos;re needed</li>
          </ul>
          <p className="expl-note">still collects everything the API needs. never asks the buyer to speak network first.</p>
        </div>
      </div>
      </>
    ),
  },
  {
    step: 'Scale',
    node: (
      <>
      <span className="expl-eyebrow">Designing for scale</span>
      <div className="expl-split">
        <div className="expl-viz">
          <img src="/dci-form-steps.png" alt="The Configure Connection step with the live price summary panel and the shared four-step indicator" />
          <p className="expl-cap">the same four steps and the same live price panel, whichever product is being ordered.</p>
        </div>
        <div className="expl-copy">
          <h3 className="expl-h">One shape, <em className="cp-rose">reused</em>.</h3>
          <ul className="expl-pills">
            <li className="expl-pill">One four-step skeleton</li>
            <li className="expl-pill">Only Configure changes</li>
            <li className="expl-pill">New product, one step</li>
          </ul>
          <p className="expl-note">what made four years of solo output possible - a new product needs one step&apos;s fields, not a new form.</p>
        </div>
      </div>
      </>
    ),
  },
  // one entry per highlighted region, all under the same rail stop and the
  // same React key - see the note on ExplAnatomy for why the key matters.
  ...ANATOMY.map((_, i) => ({ step: 'Anatomy', key: 'anatomy', node: <ExplAnatomy i={i} /> })),
  {
    step: 'Asked',
    node: (
      <>
      <ExplIcon variant="ask" />
      <span className="expl-eyebrow">What we asked</span>
      <h3 className="expl-h">Could a first-time user complete the task <em className="cp-rose">without an expert</em>?</h3>
      <ul className="expl-bullets">
        <li>what would you expect to select first when connecting two locations?</li>
        <li>would A-End and Z-End make sense without context?</li>
        <li>what information would help you trust a port choice?</li>
        <li>what would you need to understand before committing to a price?</li>
        <li>what should happen when an order is delayed, or needs a purchase order?</li>
        <li>how would you know when the connection is actually live?</li>
      </ul>
      </>
    ),
  },
  {
    step: 'Learned',
    node: (
      <>
      <ExplIcon variant="learned" />
      <span className="expl-eyebrow">What we learned</span>
      <h3 className="expl-h">Users understand the <em className="cp-up">outcome</em> before they understand the architecture.</h3>
      <ul className="expl-bullets">
        <li>lead with &quot;connect two places,&quot; not network terminology</li>
        <li>show availability, location and speed at the decision point</li>
        <li>keep price and commitment visible through the whole flow</li>
        <li>explain exceptions inside the product, not through support</li>
        <li>make every state actionable - what happened, what&apos;s next, who owns it</li>
      </ul>
      </>
    ),
  },
  {
    step: 'Final',
    node: (
      <>
      <ExplIcon variant="final" />
      <span className="expl-eyebrow">The final experience</span>
      <h3 className="expl-h">A guided path from port to <em className="cp-up">live</em>.</h3>
      <p className="dv-p dim">progressive disclosure - each screen answers one decision, while a step indicator and a live price summary keep the user oriented.</p>
      {/* autoPlay/loop only without prefersReducedMotion - an autoplaying
          video is exactly the unrequested motion that setting exists to
          suppress. controls stay either way, so it's still one click to
          watch it - the poster frame (the real Port Selection screen, not a
          black box) is what shows until then. */}
      <video
        className="expl-video"
        src="/dci-l2-order-flow.mp4"
        poster="/dci-l2-order-flow-poster.png"
        autoPlay={!prefersReducedMotion}
        loop={!prefersReducedMotion}
        muted
        playsInline
        controls
        preload="metadata"
      >
        order journey walkthrough - DCI Layer 2 order flow
      </video>
      </>
    ),
  },
];

// ---- Chapter 2: the service, once it's running ----------------------------
// ordering is one afternoon; running the circuit is every day after it. these
// are the questions that replace the six ordering ones the moment a service
// goes live - same treatment as Chapter 1's scatter, deliberately, because
// they came out of the same conversations.
const SERVICES_QUESTIONS = [
  'Is it up right now?',
  'Was it up all week?',
  'Can I prove that to my boss?',
  'What am I locked into?',
  'What will I be billed?',
  'Can I get more bandwidth today?',
];

// the page's own shape, drawn rather than screenshotted: a product rail, a
// filterable list of every service, and one service in detail behind four
// tabs. the badges key to the legend beside it.
const SERVICES_SHAPE_LEGEND = [
  'every service, filtered by state',
  'one service, always identified',
  'four questions, four tabs',
];

function ServicesShapeViz() {
  return (
    <>
      <svg className="expl-wire" viewBox="0 0 312 300" role="img" aria-label="Wireframe of the services page: a product rail, a filterable service list, and one service in detail behind four tabs">
      <rect x="10" y="10" width="290" height="280" rx="10" fill="var(--ink2)" stroke="var(--line2)" />
      <line x1="10" y1="42" x2="300" y2="42" stroke="var(--line2)" />
      <rect x="22" y="21" width="40" height="8" rx="4" fill="var(--line2)" />
      {/* product rail */}
      <line x1="52" y1="42" x2="52" y2="290" stroke="var(--line2)" />
      {[58, 76, 94, 112, 130].map((y) => <rect key={y} x="20" y={y} width="24" height="5" rx="2.5" fill="var(--line2)" />)}
      {/* the list column */}
      <line x1="140" y1="42" x2="140" y2="290" stroke="var(--line2)" />
      <rect x="62" y="56" width="68" height="14" rx="7" fill="none" stroke="var(--line2)" />
      <rect x="62" y="78" width="20" height="10" rx="5" fill="#3696B1" opacity="0.5" />
      <rect x="86" y="78" width="20" height="10" rx="5" fill="none" stroke="var(--line2)" />
      <rect x="110" y="78" width="20" height="10" rx="5" fill="none" stroke="var(--line2)" />
      {[100, 148, 196, 244].map((y, k) => (
        <rect key={y} x="62" y={y} width="68" height="40" rx="5" fill={k === 0 ? 'rgba(54,150,177,0.14)' : 'var(--raise2)'} stroke={k === 0 ? '#3696B1' : 'var(--line2)'} />
      ))}
      {/* the detail pane */}
      <rect x="152" y="56" width="80" height="9" rx="4.5" fill="var(--line2)" />
      <rect x="152" y="72" width="46" height="12" rx="6" fill="none" stroke="var(--line2)" />
      <rect x="204" y="72" width="46" height="12" rx="6" fill="none" stroke="var(--line2)" />
      <line x1="140" y1="96" x2="300" y2="96" stroke="var(--line2)" />
      {[152, 188, 224, 260].map((x, k) => (
        <rect key={x} x={x} y="102" width="32" height="12" rx="6" fill={k === 0 ? '#3696B1' : 'none'} opacity={k === 0 ? 0.55 : 1} stroke={k === 0 ? 'none' : 'var(--line2)'} />
      ))}
      <rect x="152" y="128" width="136" height="42" rx="5" fill="rgba(54,150,177,0.16)" stroke="#3696B1" />
      {[182, 226].map((y) => <rect key={y} x="152" y={y} width="136" height="34" rx="5" fill="var(--raise2)" stroke="var(--line2)" />)}
      {/* badges keyed to the legend rendered below - the labels live in HTML
          rather than as <text>, where they'd have to fit the viewBox and
          would be clipped by it the moment one of them got longer. */}
      {[{ n: 1, x: 96, y: 92 }, { n: 2, x: 244, y: 52 }, { n: 3, x: 296, y: 108 }].map((b) => (
        <g key={b.n}>
          <circle cx={b.x} cy={b.y} r="9" fill="#E8A33D" />
          <text x={b.x} y={b.y + 4} className="expl-wire-n">{b.n}</text>
        </g>
      ))}
      </svg>
      <ol className="expl-legend">
        {SERVICES_SHAPE_LEGEND.map((t, k) => (
          <li key={t}><span>{k + 1}</span>{t}</li>
        ))}
      </ol>
    </>
  );
}

// regions of the Overview tab, measured off the 1600x885 screenshot.
const SERVICES_ANATOMY = [
  {
    box: { left: 12.9, top: 9.7, width: 22.7, height: 88.5 },
    title: 'Every service, and which ones need you.',
    body: 'seventeen connections, counted by state before anything else - six live, none down, six still in design. the filter is the first thing on the page because "which one is broken" is the first thing asked of it.',
  },
  {
    box: { left: 36.8, top: 11.5, width: 30, height: 16.5 },
    title: 'Identity, status, and the two ways out.',
    body: 'name, service ID and live state stay pinned above the tabs - and the two actions anyone actually arrives wanting, raise a ticket or upgrade, sit beside them rather than behind a menu.',
  },
  {
    box: { left: 36.8, top: 29.2, width: 30.5, height: 5 },
    title: 'Four questions, four tabs.',
    body: 'is it up, was it healthy, what am I committed to, what will I pay. tabs rather than separate pages, so the service stays in focus and nothing needs re-finding between answers.',
  },
  {
    box: { left: 37, top: 36.6, width: 60.3, height: 19.6 },
    title: 'Capacity, and the way to more of it.',
    body: 'the effective rate limit is the number customers ring up about. it leads the tab, with the base rate, any temporary add-on, and the upgrade path all readable without leaving the page.',
  },
  {
    box: { left: 37, top: 60.5, width: 60.3, height: 16 },
    title: 'Health, at a glance, with a timestamp.',
    body: 'flaps, latency and availability for the last 24 hours - and the time the numbers were last updated, because a health figure without a timestamp is not evidence of anything.',
  },
];

const SERVICES_STEPS = ['Challenge', 'Questions', 'The shape', 'Anatomy', 'Performance', 'Subscription', 'Invoices'];

const SERVICES_CONTENT = [
  {
    step: 'Challenge',
    node: (
      <>
        <span className="expl-eyebrow">The challenge</span>
        <h3 className="expl-h">Ordering happens once. <em className="cp-rose">Running it</em> never stops.</h3>
        <blockquote className="expl-quote">&quot;The order was the easy part. Now I have seventeen of these, and no idea which one is down.&quot;</blockquote>
        <p className="expl-note expl-note-wide">before this, the answer lived in an email thread or a call to the NOC - which meant the customer only found out how their network was doing by asking someone.</p>
      </>
    ),
  },
  {
    step: 'Questions',
    node: (
      <>
        <span className="expl-eyebrow">Questions after go-live</span>
        <div className="expl-split">
          <div className="expl-viz">
            <div className="expl-scatter">
              {SERVICES_QUESTIONS.map((q) => <span key={q}>{q}</span>)}
            </div>
            <p className="expl-cap">the six ordering questions are gone. these replace them, permanently.</p>
          </div>
          <div className="expl-copy">
            <h3 className="expl-h">A different <em className="cp-signal">six questions</em>.</h3>
            <p className="expl-note">nobody asks about MACSec again after go-live. they ask whether it&apos;s up, whether it stayed up, and what it is going to cost them this month.</p>
          </div>
        </div>
      </>
    ),
  },
  {
    step: 'The shape',
    node: (
      <>
        <span className="expl-eyebrow">Shaping the page</span>
        <div className="expl-split">
          <div className="expl-viz">
            <ServicesShapeViz />
          </div>
          <div className="expl-copy">
            <h3 className="expl-h">One list, one service, <em className="cp-up">four tabs</em>.</h3>
            <ul className="expl-pills">
              <li className="expl-pill">State before detail</li>
              <li className="expl-pill">One service in focus</li>
              <li className="expl-pill">Tabs, not pages</li>
            </ul>
            <p className="expl-note">the list never goes away. whichever tab is open, the next service is one click sideways - because troubleshooting is rarely about only one circuit.</p>
          </div>
        </div>
      </>
    ),
  },
  ...SERVICES_ANATOMY.map((_, i) => ({
    step: 'Anatomy',
    key: 'services-anatomy',
    node: (
      <ExplAnatomy
        i={i}
        stops={SERVICES_ANATOMY}
        src="/services-overview.png"
        alt="The Services page Overview tab, showing the filtered connection list, service status, effective rate limit and 24-hour performance"
        eyebrow="Anatomy of the page"
      />
    ),
  })),
  {
    step: 'Performance',
    node: (
      <>
        <span className="expl-eyebrow">Performance</span>
        <div className="expl-split">
          <div className="expl-viz">
            <img src="/services-performance.png" alt="The Performance tab, showing traffic in and out over a selectable time range" />
            <p className="expl-cap">traffic in and out, over whatever window the question needs.</p>
          </div>
          <div className="expl-copy">
            <h3 className="expl-h">Proof, not <em className="cp-signal">reassurance</em>.</h3>
            <ul className="expl-pills">
              <li className="expl-pill">Their window, not ours</li>
              <li className="expl-pill">Chart or table</li>
              <li className="expl-pill">Exportable</li>
            </ul>
            <p className="expl-note">an IT manager asked about last Tuesday needs to answer with a chart, not with what support told them. so the range is theirs to set, and the data leaves the page.</p>
          </div>
        </div>
      </>
    ),
  },
  {
    step: 'Subscription',
    node: (
      <>
        <span className="expl-eyebrow">Subscription</span>
        <div className="expl-split">
          <div className="expl-viz">
            <img src="/services-subscription.png" alt="The Subscription tab, showing term, dates, billing profile, billing cycle and active add-ons" />
            <p className="expl-cap">term, dates, billing profile and add-ons - the Chapter 1 decisions, now as live state.</p>
          </div>
          <div className="expl-copy">
            <h3 className="expl-h">What was agreed, still <em className="cp-up">visible</em>.</h3>
            <ul className="expl-pills">
              <li className="expl-pill">Term and dates up front</li>
              <li className="expl-pill">Billing profile per entity</li>
              <li className="expl-pill">Add-ons listed, not buried</li>
            </ul>
            <p className="expl-note">the billing profile chosen at order time for GST reasons is the same one shown here - so the reason the circuit bills to that state never has to be reconstructed later.</p>
          </div>
        </div>
      </>
    ),
  },
  {
    step: 'Invoices',
    node: (
      <>
        <span className="expl-eyebrow">Invoices &amp; payments</span>
        <div className="expl-split">
          <div className="expl-viz">
            <img src="/services-invoices.png" alt="The Invoices and Payments tab, showing total monthly charge, next invoice date and a breakdown of base and add-on amounts" />
            <p className="expl-cap">the next invoice, before it arrives - with the date it will generate on.</p>
          </div>
          <div className="expl-copy">
            <h3 className="expl-h">The bill, before the <em className="cp-rose">bill</em>.</h3>
            <ul className="expl-pills">
              <li className="expl-pill">Total monthly, up top</li>
              <li className="expl-pill">Base and add-ons split</li>
              <li className="expl-pill">Next invoice dated</li>
            </ul>
            <p className="expl-note">finance teams don&apos;t like surprises more than engineers do. the amount, the split and the date it lands are all on the page before an invoice is ever raised.</p>
          </div>
        </div>
      </>
    ),
  },
];

// prefersReducedMotion's own flat list - every beat stacked plainly, each
// rail-step beat carrying its own baked-in rail (safe here: nothing here
// ever remounts on scroll, so there's no "blink" risk the live path had).
function chapterBeats({ chapter, steps, content, open, close }) {
  return [
    <div className="expl-ch" key="open">{open}</div>,
    ...content.map((entry, i) => (
      <div className="expl-layout" key={i}>
        <ExplRail step={steps.indexOf(entry.step)} steps={steps} chapter={chapter} />
        <div className="expl-main">{entry.node}</div>
      </div>
    )),
    // the chapter's own close, not one more rail stop - same full-width,
    // no-rail treatment as the title screen it echoes, so a chapter reads as
    // opening and closing on the same kind of beat, with the worked steps
    // running between them.
    ...close.map((node, i) => <div className="expl-ch" key={`close${i}`}>{node}</div>),
  ];
}

// one scroll scene, driven by a chapter's own rail steps and beats - both
// chapters run through this rather than each keeping its own copy of the
// pinning, beat-swapping and bookend logic.
function ChapterScene({ chapter, steps, content, open, close }) {
  const ref = useRef(null);
  const beats = chapterBeats({ chapter, steps, content, open, close });
  const [beat] = useScrollBeat(ref, beats.length);

  if (prefersReducedMotion) {
    return <div className="expl-static">{beats}</div>;
  }

  // one beat's content in the DOM at a time, not an AuditScene-style
  // cumulative build-up - a chapter is meant to be read as a slide deck (see
  // the reference this was modelled on), and stacking every beat into
  // .oscn-stage's fixed 74vh box would have clipped the earliest ones the
  // moment total content outgrew the box, since overflow:hidden + a centred
  // flex column crops symmetrically as height grows, not from the bottom only.
  //
  // key={beat} used to sit on .expl-stage itself, which remounted the RAIL
  // along with the content on every single beat change - the rail's own
  // dots don't need to (and visually shouldn't) disappear and refade every
  // time in a row just because the copy beside them changed; that's the
  // "blink" this was rewritten to fix. now key={beat} sits only on the
  // swapped content (.expl-main for a rail beat, .expl-ch for a bookend),
  // so the rail mounts once and simply re-renders with a new `step` prop -
  // its dots transition their own colour/border smoothly via the plain CSS
  // transitions already on .expl-rail-stop, never touching the DOM node.
  const beatIdx = beat - 1;
  const showRail = beatIdx >= 0 && beatIdx < content.length;
  const entry = showRail ? content[beatIdx] : null;
  const bookend = beat === 0 ? open : close[beat - content.length - 1] ?? null;

  return (
    <div className="oscn expl-oscn" ref={ref} style={{ '--beats': beats.length }}>
      <div className="oscn-stage expl-stage">
        {showRail ? (
          <div className="expl-layout">
            <ExplRail step={steps.indexOf(entry.step)} steps={steps} chapter={chapter} />
            {/* entry.key, where a run of beats shares one: the node stays
                mounted across them, so the highlight animates between
                regions rather than the whole panel refading each time. */}
            <div className="expl-main expl-fade" key={entry.key ?? beat}>{entry.node}</div>
          </div>
        ) : (
          <div className="expl-ch expl-fade" key={beat}>{bookend}</div>
        )}
      </div>
    </div>
  );
}

export default function CustomerPortalCaseStudy({ onPrev, onNext, idx, total }) {
  const [sectionRefs, activeSection, routePos, jumpToSection, routeProgress, tickLeft, panelRect] = useSectionIndex(CP_SECTIONS.length);
  const at = (i) => (el) => { sectionRefs.current[i] = el; };
  const wrap = useRef(null);
  useBlockReveal(wrap);

  return (
    <div className="inv-wrap cp-wrap" ref={wrap}>
      {/* fixed to the panel's own rect (not .cp-wrap's own absolute
          background, which scrolled with the tens-of-thousands-of-px-tall
          content and could only ever fade near its very top or bottom edge)
          - this one stays visually pinned to the panel while the actual
          sections scroll underneath it, so the same "grid fading to plain
          background" spotlight is what's on screen at every scroll
          position, not just once near the start of the page. */}
      {panelRect && (
        <div
          className="cp-grid-fixed"
          style={{ top: panelRect.top, left: panelRect.left, width: panelRect.width, height: panelRect.height }}
        ></div>
      )}
      {routePos && (
        <div className="cp-route-wrap" style={{ top: routePos.top, left: routePos.left, width: routePos.width }}>
          <div className="route-line" aria-label="Jump to section">
            <div className="route-fill" style={{ width: `${routeProgress}%` }}></div>
            <div className="route-packet" style={{ left: `${routeProgress}%` }}>
              <span className="route-now" style={{ transform: `translateX(-${routeProgress}%)` }}>
                <i>{String(activeSection + 1).padStart(2, '0')}</i>{CP_SECTIONS[activeSection]}
              </span>
            </div>
            {CP_SECTIONS.map((label, i) => (
              <button
                key={label}
                type="button"
                className={`route-tick ${i === activeSection ? 'on' : ''}`}
                data-cp-ch={label}
                aria-label={`Jump to ${label}`}
                style={{ left: `${tickLeft[i] || 0}%` }}
                onClick={() => jumpToSection(i)}
              />
            ))}
          </div>
        </div>
      )}
      <div className="inv-hero cp-hero">
        <div className="cp-logo-wrap">
          <img className="cp-logo" src="/polarin-logo.png" alt="Polarin, by Lightstorm" />
        </div>
        <h2>Ordering connectivity, <span className="cp-signal">without picking up the phone.</span></h2>
        <p>Polarin was a name on a whiteboard in 2022. I was Lightstorm&apos;s first designer, no telecom background, no template to copy. Four years later it&apos;s live, trusted, and I&apos;ve gone from designing it to running it.</p>
        <div className="inv-meta">
          <div><span>My role</span><b>First designer, 0 → 1 → now Product Manager</b></div>
          <div><span>Team</span><b>1 designer · 3 PMs · 12 devs</b></div>
          <div>
            <span>Devices</span>
            <b className="inv-meta-devices">
              <svg viewBox="0 0 32 20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="1" width="19" height="12.5" rx="1.6" />
                <rect x="23" y="3.5" width="8" height="15" rx="2" />
                <circle cx="27" cy="16" r="0.7" fill="currentColor" stroke="none">
                  <animate attributeName="opacity" values="1;0.15;1" dur="1.8s" repeatCount="indefinite" />
                </circle>
              </svg>
              responsive - desktop & mobile
            </b>
          </div>
        </div>
        {/* the fold used to simply stop under the spec strip, which left the
            bottom third of a tall window empty with nothing saying there was
            more below it. */}
        <span className="cp-scroll" aria-hidden="true"><i></i>scroll</span>
      </div>

      <div className="inv-section" ref={at(0)}>
        <AlexJourney />
      </div>

      <div className="inv-section" ref={at(1)}>
        <TheBetScene />
      </div>

      {/* sections 2-6 (Approach through Design system) are placeholders,
          content stripped deliberately - the old copy/scenes/charts here were
          replaced piece by piece as each one gets rebuilt for real, one
          section at a time, rather than rewritten in one pass. AuditScene,
          LANDSCAPE and EFFORT_MAP stay defined further up (not
          deleted): each is reference material for rebuilding its own section,
          not dead code from a direction that got abandoned. */}
      <div className="inv-section" ref={at(2)}>
        <div className="inv-step-tag cps-rv" data-rv><i></i>How we achieved it</div>
        <ApproachScene jump={jumpToSection} />
      </div>

      <div className="inv-section" ref={at(3)}>
        <div className="inv-step-tag cps-rv" data-rv><i></i>Desk research</div>
        <AuditScene />
      </div>

      <div className="inv-section" ref={at(4)}>
        <div className="inv-step-tag cps-rv" data-rv><i></i>Information architecture</div>
        <IAScene />
      </div>

      <div className="inv-section" ref={at(5)}>
        <div className="inv-step-tag cps-rv" data-rv><i></i>Exploration</div>
        {/* two chapters, one after the other: ordering the service, then
            living with it. each is its own pinned scene with its own rail. */}
        <ChapterScene
          chapter="Chapter 1"
          steps={EXPLORE_STEPS}
          content={EXPLORE_CONTENT}
          open={CH1_CONTENT}
          close={[OUTCOME_CONTENT]}
        />
        <ChapterScene
          chapter="Chapter 2"
          steps={SERVICES_STEPS}
          content={SERVICES_CONTENT}
          open={CH2_CONTENT}
          close={[CH2_OUTCOME]}
        />
      </div>

      <div className="inv-section" ref={at(6)}>
        <div className="inv-step-tag cps-rv" data-rv><i></i>Design system</div>
        <DesignSystemScene />
      </div>

      <div className="inv-section" ref={at(7)}>
        <div className="inv-step-tag cps-rv" data-rv><i></i>Major screens</div>
        <h3 className="dv-h cps-rv" data-rv style={{ '--d': '90ms' }}>Scroll through the product</h3>
        <ScreensScene />
      </div>

      <div className="inv-section" ref={at(8)}>
        <div className="inv-step-tag cps-rv" data-rv><i></i>What moved</div>
        <h3 className="dv-h cps-rv" data-rv style={{ '--d': '90ms' }}>Impact</h3>
        <div className="ivx-principles dv4 cps-stagger" data-rv style={{ '--d': '160ms' }}>
          <div className="ivp"><b className="cp-up">95% faster</b><p>onboarding & deployment - 5–7 days → 15 minutes</p></div>
          <div className="ivp"><b className="cp-signal">3× self-serve</b><p>non-technical users now order & manage independently</p></div>
          <div className="ivp"><b className="cp-signal">40% handoff cut</b><p>design-to-dev time reduced by the system</p></div>
          <div className="ivp"><b className="cp-up">CSAT 6.2 → 9.1</b><p>enterprise customers rate the experience</p></div>
        </div>
      </div>

      <div className="inv-section" ref={at(9)}>
        <div className="inv-step-tag cps-rv" data-rv><i></i>What I learned</div>
        <h3 className="dv-h cps-rv" data-rv style={{ '--d': '90ms' }}>Three things I know for sure</h3>
        <div className="inv-learn cps-stagger" data-rv style={{ '--d': '160ms' }}>
          {LEARNED.map((l) => (
            <div className="inv-learn-card" key={l.t}><h4>{l.t}</h4><p>{l.p}</p></div>
          ))}
        </div>
      </div>

      <div className="inv-section" ref={at(10)}>
        <div className="inv-step-tag cps-rv" data-rv><i></i>Still building</div>
        <h3 className="plain cps-rv" data-rv style={{ '--d': '90ms' }}>What changed, and what&apos;s next</h3>
        <div className="inv-result cps-rv" data-rv style={{ '--d': '160ms' }}><span className="cp-signal">3× self-serve</span> adoption · 90 days → <span className="cp-up">10 minutes</span> · India&apos;s <span className="cp-rose">first</span> self-serve NaaS platform.</div>
        <p className="dv-p dim cps-rv" data-rv style={{ marginTop: '20px', '--d': '240ms' }}>still building - new modules ship every quarter, and the system built in month one is what lets one designer keep pace with them.</p>
      </div>

      <div className="ovl-nav">
        <button type="button" onClick={onPrev}>← Prev</button>
        <span className="ovl-count"><b>{idx + 1}</b> / {total} surfaces</span>
        <button type="button" onClick={onNext}>Next →</button>
      </div>
    </div>
  );
}
