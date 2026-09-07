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
  { gap: 'network monitoring', found: 'no live visibility into availability, packet loss, jitter or latency once a circuit went live', built: 'a per-circuit health dashboard - availability, packets in/out, traffic in/out, jitter & latency' },
  { gap: 'plan flexibility', found: 'locked into whatever was ordered, no self-serve way to scale', built: 'upgrade or downgrade an active service without raising a ticket' },
  { gap: 'payment terms', found: 'one rigid payment model, take it or leave it', built: 'flexible payment terms and options at checkout' },
  { gap: 'multi-location billing', found: 'no way to consolidate spend across locations for GST input-credit claims', built: 'billing that rolls up multi-location purchases the way Indian tax filing actually needs' },
  { gap: 'API sandbox', found: 'nothing to test before committing budget', built: 'a live sandbox - try the API before you buy' },
  { gap: 'assisted ordering', found: 'enterprise buyers still needed a human, but reps had no tool to help them', built: "a sales-assist flow - our team places and manages orders on a customer's behalf" },
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
const SYS_COLORS = [
  { name: 'Ink Navy', hex: '#0B1220', role: 'surface / base', text: '#EDEFF7' },
  { name: 'Signal Blue', hex: '#2F6FED', role: 'primary action', text: '#FFFFFF' },
  { name: 'Live Green', hex: '#22C55E', role: 'healthy · online', text: '#06210F' },
  { name: 'Alert Amber', hex: '#F5A524', role: 'warnings', text: '#241300' },
  { name: 'Fault Red', hex: '#EF4444', role: 'errors · down', text: '#2A0505' },
];

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
// the pinned scroll-scenes (AlexJourney, TheBetScene, AuditScene, SysScene,
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
                <svg className="ana-portrait" viewBox="0 0 96 96" aria-hidden="true">
                  <circle cx="48" cy="48" r="47" fill="none" stroke="currentColor" strokeOpacity="0.18" />
                  {/* blazer shoulders with an open collar (two lapel lines),
                      not a plain rounded body - "corporate", not generic. */}
                  <path d="M18 84c2-17 13-28 30-28s28 11 30 28" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                  <path d="M40 58l8 11 8-11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  {/* hair: one bob-shaped silhouette behind an opaque face
                      circle, not an outline wrapped over it - only the
                      crown and two shoulder-length side panels end up
                      showing, framing the face the way a real bob cut
                      does, rather than reading as a helmet. #0A0D1A is
                      --ink2, .ovl-panel's own background - .cjx-stage
                      carries no gradient of its own to fight, so a flat
                      hex here sits flush against the real backdrop. */}
                  <path d="M48 18c-13 0-21 10-21 23 0 9 2 19 4 27 2 1 4 1 5 0-1-6-1-19-1-23 0-2 0-9 1-13 3 6 8 10 12 10s9-4 12-10c1 4 1 11 1 13 0 4 0 17-1 23 1 1 3 1 5 0 2-8 4-18 4-27 0-13-8-23-21-23z" fill="currentColor" fillOpacity="0.92" stroke="none" />
                  <circle cx="48" cy="40" r="14" fill="#0A0D1A" stroke="currentColor" strokeWidth="2.2" />
                  <circle cx="43" cy="40" r="1.3" fill="currentColor" stroke="none" />
                  <circle cx="53" cy="40" r="1.3" fill="currentColor" stroke="none" />
                  {/* ID badge on a lanyard, not floating on the chest alone */}
                  <path d="M48 54v6" stroke="currentColor" strokeWidth="1.6" />
                  <rect x="42" y="60" width="12" height="8" rx="1.8" fill="none" stroke="currentColor" strokeWidth="1.8" />
                </svg>
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
      <div className="oscn-stage bet-stage" key={beat < 2 ? beat : 'combo'}>
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
        {beat >= 2 && (
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

  return (
    <div className="oscn" ref={ref} style={{ '--beats': 10 }}>
      <div className="oscn-stage aud-stage">
        <p className={`aud-lead obeat ${on(0)}`}>weeks of desk research first - regulatory filings, market maps, every public pricing page. then 4 global platforms audited feature-by-feature, every gap turned into a design requirement:</p>
        <div className="aud">
          <div className={`aud-r aud-h obeat ${on(0)}`}><span>platform</span><span>self-serve</span><span>onboarding</span><span>india</span></div>
          {AUDIT.map((a, i) => (
            <div className={`aud-r obeat ${on(i + 1)}`} key={a.name}><span>{a.name}</span><span>{a.serve}</span><span>{a.onboard}</span><span>{a.india}</span></div>
          ))}
          <div className={`aud-r aud-p obeat ${on(5)}`}><span>Polarin →</span><span>full</span><span>15 minutes</span><span>native</span></div>
        </div>

        <p className={`aud-finding obeat ${on(6)}`}><b>the output of that benchmark:</b> not one of the four runs end-to-end in India - two don&apos;t operate here at all, one is limited. <em className="cp-signal">Polarin would be the first self-serve NaaS platform built for the Indian market.</em></p>

        <p className={`aud-insight obeat ${on(7)}`}>every one of them chose engineering power over buyer accessibility. the person who approves a ₹50L contract <em>can&apos;t place an order without help.</em> that&apos;s the gap Polarin closes.</p>

        <div className={`aud-gaps obeat ${on(8)}`}>
          <p className="aud-gaps-lead">the audit went past onboarding - every feature area, across all four:</p>
          <div className="aud-gap-grid">
            {AUDIT_GAPS.map((g) => (
              <div className="aud-gap" key={g.gap}>
                <b>{g.gap}</b>
                <p><span className="aud-gap-found">{g.found}</span><span className="aud-gap-arrow">→ built:</span> {g.built}</p>
              </div>
            ))}
          </div>
        </div>

        <p className={`aud-next obeat ${on(9)}`}>next: benchmarking doesn&apos;t stop at features - it&apos;s extending to the experience itself, tracked every quarter as competitors ship and expectations move.</p>
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
  { m: 'KYC / org profile verification', effort: 20, impact: 86, first: true },
  { m: 'user management', effort: 30, impact: 76, first: true },
  { m: 'order journey', effort: 58, impact: 94, first: true },
  { m: 'service details', effort: 36, impact: 66, first: true },
  { m: 'activity logs', effort: 24, impact: 52, first: true },
  { m: 'billing & invoicing', effort: 74, impact: 62, first: false },
  { m: 'network health monitoring', effort: 82, impact: 80, first: false },
];

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

// the design-system tokens as a full-bleed swatch per scroll beat, not a
// bordered card grid - a color is a claim about the whole screen, and a
// small chip never makes that claim. one beat per color, then a beat for the
// type scale; the last beat's font-size is the one real measurement here,
// everything else about that beat is a caption underneath it.
function SysScene() {
  const ref = useRef(null);
  const [beat] = useScrollBeat(ref, SYS_COLORS.length + 1);
  const isType = beat >= SYS_COLORS.length;
  const c = SYS_COLORS[Math.min(beat, SYS_COLORS.length - 1)];

  return (
    <div className="oscn sys-oscn" ref={ref} style={{ '--beats': SYS_COLORS.length + 1 }}>
      <div className="oscn-stage sys-stage">
        {!isType ? (
          <div className="sys-full" style={{ background: c.hex, color: c.text }} key={c.name}>
            <span className="sys-full-name">{c.name}</span>
            <span className="sys-full-role">{c.role}</span>
          </div>
        ) : (
          <div className="sys-full sys-full-type">
            <span className="sys-full-sample">Order journey</span>
            <span className="sys-full-cap">Semibold · 32px · -1% tracking</span>
          </div>
        )}
      </div>
    </div>
  );
}

// the Exploration section's own framework, not a one-off scene: each real
// exploration gets its own "chapter" - a title beat, then the same five
// beats every time (objective/metric, versions tried, how it was tested,
// what was asked, what it taught) - so a reader learns the shape once and
// can skim every chapter after that the same way. chapter 1 (the order
// journey) is real; chapter 2 is a placeholder tag, same convention as the
// other sections still being rebuilt one at a time. the seven beats live in
// one array, not inline per-beat JSX in the render - EXPLORE_BEATS[beat] is
// the scroll-driven view (one beat mounted at a time, see the note below),
// and the same array maps straight down the page for prefersReducedMotion,
// so neither path can drift out of sync with the other.
const EXPLORE_BEATS = [
  <div className="expl-ch" key="ch1">
    <span className="expl-ch-n">Chapter 1</span>
    <p className="cjx-flash expl-ch-t">Designing the order journey</p>
  </div>,
  <div className="expl-cols" key="obj">
    <div>
      <span className="expl-eyebrow">Objective</span>
      <h3 className="plain">Get from browsing to a live order, alone.</h3>
    </div>
    <div>
      <span className="expl-eyebrow">Success metric</span>
      <p className="bet-90"><s className="from">~90 days</s><span className="arr">→</span><b className="to">10 minutes.</b></p>
    </div>
  </div>,
  <div key="versions">
    <span className="expl-eyebrow">Versions explored</span>
    <div className="ivx-principles">
      <div className="ivp"><b>v1 · dashboard-first</b><p>led with network health - buyers wanted to order before they wanted to monitor. dropped.</p></div>
      <div className="ivp"><b>v2 · wizard-only</b><p>a linear step-by-step order flow - too rigid for enterprise buyers comparing options. dropped.</p></div>
      <div className="ivp"><b>v3 · explore, then commit</b><p>browse services and check feasibility before ordering, self-serve the whole way. shipped.</p></div>
    </div>
  </div>,
  <div key="testing">
    <span className="expl-eyebrow">Prototype testing</span>
    <h3 className="plain">Internally first, then a handful of approachable customers.</h3>
    <p className="dv-p dim">not a formal panel - real accounts, people who&apos;d actually place this order.</p>
  </div>,
  <div key="ask">
    <span className="expl-eyebrow">What we asked</span>
    <div className="expl-ask">
      <p>&quot;find and order [a service] without any help.&quot;</p>
      <p>&quot;where did you pause, or want to double-check something?&quot;</p>
      <p>&quot;would you trust this enough to skip the phone call?&quot;</p>
    </div>
  </div>,
  <div key="insights">
    <span className="expl-eyebrow">Insights</span>
    <div className="inv-learn">
      <div className="inv-learn-card"><h4>trust comes before speed</h4><p>hesitation was never about the UI - it was &quot;can I really do this without a person?&quot;</p></div>
      <div className="inv-learn-card"><h4>comparison beats a fast wizard</h4><p>buyers wanted options side by side before committing, not to be rushed through one path</p></div>
      <div className="inv-learn-card"><h4>plain language, not clever copy</h4><p>simple pricing and status language beat every shortcut we tried</p></div>
    </div>
  </div>,
  <div className="expl-ch" key="ch2">
    <span className="expl-ch-n">Chapter 2</span>
    <span className="cp-wip"><i></i>in progress</span>
  </div>,
];

function ExploreScene() {
  const ref = useRef(null);
  const [beat] = useScrollBeat(ref, EXPLORE_BEATS.length);

  if (prefersReducedMotion) {
    return <div className="expl-static">{EXPLORE_BEATS}</div>;
  }

  // one beat's content in the DOM at a time, not an AuditScene-style
  // cumulative build-up - a chapter is meant to be read as a slide deck (see
  // the reference this was modelled on), and stacking all seven beats into
  // .oscn-stage's fixed 74vh box would have clipped the earliest ones the
  // moment total content outgrew the box, since overflow:hidden + a centred
  // flex column crops symmetrically as height grows, not from the bottom only.
  return (
    <div className="oscn expl-oscn" ref={ref} style={{ '--beats': EXPLORE_BEATS.length }}>
      <div className="oscn-stage expl-stage" key={beat}>
        {EXPLORE_BEATS[beat]}
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
        {/* globe centred behind the wordmark, not floated separately in a
            corner - a large shape off on its own read as unbalanced no
            matter how it was sized or faded; orbiting the one thing every
            other element in this fold is already centred around fixes that
            for free, since the wrapper's own centring is the same centring
            everything else here uses. */}
        <div className="cp-logo-wrap">
          <svg className="cp-globe" viewBox="0 0 400 400" aria-hidden="true">
            <defs>
              <radialGradient id="cpGlobeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#3696B1" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#3696B1" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="cpGlobeLine" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3696B1" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#3696B1" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            {/* a soft glow behind the wireframe, not just the wireframe alone -
                a flat single-colour outline read as a technical diagram; the
                radial fill underneath is what makes it read as something lit
                from within instead. */}
            <circle cx="200" cy="200" r="180" fill="url(#cpGlobeGlow)" />
            <circle cx="200" cy="200" r="150" fill="none" stroke="url(#cpGlobeLine)" strokeWidth="1.2" />
            <ellipse cx="200" cy="200" rx="150" ry="38" fill="none" stroke="url(#cpGlobeLine)" strokeWidth="0.8" />
            <ellipse cx="200" cy="200" rx="150" ry="80" fill="none" stroke="url(#cpGlobeLine)" strokeWidth="0.8" />
            <ellipse cx="200" cy="200" rx="150" ry="120" fill="none" stroke="url(#cpGlobeLine)" strokeWidth="0.8" />
            <ellipse cx="200" cy="200" rx="38" ry="150" fill="none" stroke="url(#cpGlobeLine)" strokeWidth="0.8" />
            <ellipse cx="200" cy="200" rx="95" ry="150" fill="none" stroke="url(#cpGlobeLine)" strokeWidth="0.8" />
            <line x1="50" y1="200" x2="350" y2="200" stroke="url(#cpGlobeLine)" strokeWidth="1" />
            {/* three nodes, arced connections between each pair - the same
                "network across the globe" idea the case study itself is
                about, not a literal map. */}
            <path d="M120 140 Q200 40 290 130" fill="none" stroke="url(#cpGlobeLine)" strokeWidth="1.4" strokeDasharray="3 5" />
            <path d="M290 130 Q330 240 210 300" fill="none" stroke="url(#cpGlobeLine)" strokeWidth="1.4" strokeDasharray="3 5" />
            <path d="M210 300 Q100 260 120 140" fill="none" stroke="url(#cpGlobeLine)" strokeWidth="1.4" strokeDasharray="3 5" />
            <circle cx="120" cy="140" r="5" fill="#3696B1" stroke="none" />
            <circle cx="290" cy="130" r="5" fill="#3696B1" stroke="none" />
            <circle cx="210" cy="300" r="5" fill="#3696B1" stroke="none" />
          </svg>
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
          SysScene, LANDSCAPE and EFFORT_MAP stay defined further up (not
          deleted): each is reference material for rebuilding its own section,
          not dead code from a direction that got abandoned. */}
      <div className="inv-section" ref={at(2)}>
        <div className="inv-step-tag cps-rv" data-rv><i></i>How we achieved it</div>
        <span className="cp-wip cps-rv" data-rv style={{ '--d': '90ms' }}><i></i>in progress</span>
      </div>

      <div className="inv-section" ref={at(3)}>
        <div className="inv-step-tag cps-rv" data-rv><i></i>Desk research</div>
        <span className="cp-wip cps-rv" data-rv style={{ '--d': '90ms' }}><i></i>in progress</span>
      </div>

      <div className="inv-section" ref={at(4)}>
        <div className="inv-step-tag cps-rv" data-rv><i></i>Information architecture</div>
        <span className="cp-wip cps-rv" data-rv style={{ '--d': '90ms' }}><i></i>in progress</span>
      </div>

      <div className="inv-section" ref={at(5)}>
        <div className="inv-step-tag cps-rv" data-rv><i></i>Exploration</div>
        <ExploreScene />
      </div>

      <div className="inv-section" ref={at(6)}>
        <div className="inv-step-tag cps-rv" data-rv><i></i>Design system</div>
        <span className="cp-wip cps-rv" data-rv style={{ '--d': '90ms' }}><i></i>in progress</span>
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
