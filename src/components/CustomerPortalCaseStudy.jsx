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

// the case study's own nine .inv-section stops, short enough to read as a
// corner index rather than a repeat of each section's own .inv-step-tag text.
const CP_SECTIONS = [
  'Ananya', 'The bet', 'Discovery', 'Process', 'Screens', 'System', 'Impact', 'Lessons', 'Result',
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

/* the corner index. this is the one case study long enough (9 sections, four
   of them their own pinned scroll-scenes) that a reader can lose their place,
   so it's the only one that gets a jump-nav - not a site-wide pattern, a
   answer to this component's own length.

   position is measured off .ovl-panel's own rect rather than expressed in
   CSS, because .ovl-panel is centred with a max-width (1320px) - past that
   width a CSS clamp() keyed to the viewport edge drifts away from the
   panel's real edge, exactly where every desktop viewport this site is
   actually tested at (1512px and up) sits. re-measured on resize.

   "active" is a scrollspy read - the LAST section whose heading has scrolled
   up past a fixed line near the panel's top - PLUS an explicit pin set by
   jump() itself. the plain scrollspy rule alone can't tell "Lessons" and
   "Result" (the last two stops) apart: both sit close enough to the very end
   of the document that clicking either one clamps the panel to the exact
   same maximum scrollTop (there's only .ovl-nav after Result, and only
   Result after Lessons - neither leaves enough room below to drag its own
   heading up to the line). two different clicks producing an IDENTICAL final
   scroll position means no amount of reading that position can recover which
   one was actually clicked - the geometry alone has already lost the
   information by the time update() runs. so jump() records which index it
   sent the panel to and the scrollTop that landed at; update() defers to
   that pin as long as the panel is still sitting at the position the jump
   left it at, and only falls back to reading heading positions once the
   user's own scrolling has actually moved it somewhere else. an area-based
   read (compare intersectionRatio, take the largest) was tried instead and
   reverted for a different reason: a short section (e.g. "System", just a
   stats card) can lose the area contest to a taller neighbour the instant
   it's scrolled to the top, even though it's unambiguously the one just
   navigated to - comparing heading position rather than area avoids that,
   since a short section wins outright the moment its own heading crosses the
   line regardless of how little of the panel it fills. */
function useSectionIndex(count) {
  const refs = useRef([]);
  const [active, setActive] = useState(0);
  const [pos, setPos] = useState(null);
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
      setPos({ top: r.top + 70, right: window.innerWidth - r.right + 22 });
    };
    // the line a heading has to cross, in px from the panel's own top edge -
    // generous enough that a section registers as soon as it's meaningfully
    // in view, not only once perfectly flush with the top.
    const LINE = 120;
    const bottomedOut = () => panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 4;
    const update = () => {
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

  return [refs, active, pos, jump];
}

function AlexJourney() {
  const ref = useRef(null);
  const [beat, jump] = useScrollBeat(ref, CJ_STEPS.length + 1);
  const stepIdx = beat - 1; // -1 = hook screen
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
    <div className="cjx" ref={ref}>
      <div className="cjx-stage" data-heat={heat}>
        {!current ? (
          <div className="cjx-hook">
            <svg className="ana-portrait" viewBox="0 0 96 96" aria-hidden="true">
              <circle cx="48" cy="48" r="47" fill="none" stroke="currentColor" strokeOpacity="0.18" />
              <path d="M22 82c2-16 11-25 26-25s24 9 26 25" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
              <circle cx="48" cy="38" r="16" fill="none" stroke="currentColor" strokeWidth="2.4" />
              <path d="M33 33c1-9 7-15 15-15s14 6 15 15c-5 1-9-1-11-4-2 4-9 6-19 4z" fill="currentColor" fillOpacity="0.9" stroke="none" />
              <path d="M33 34c-1 6 0 11 3 15M63 34c1 6 0 11-3 15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
              <rect x="41" y="60" width="14" height="9" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="48" cy="65" r="1.4" fill="currentColor" stroke="none" />
            </svg>
            <p className="cjx-name">Ananya</p>
            <p className="cjx-q">VP of Infrastructure.<br />Needs <em>one</em> connection.</p>
            <span className="cjx-cue">scroll to watch the days pile up →</span>
          </div>
        ) : (
          <div className="cjx-step flash" key={flashKey}>
            <div className="cj-top">
              <div className="cj-day">day <b>{displayDay}</b></div>
              <div className="cj-dots">
                {CJ_STEPS.map((s, i) => (
                  <i key={s.t} className={i <= stepIdx ? 'on' : ''} onClick={() => jump(i + 1)} />
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
            <div className="inv-step-tag obeat on"><i></i>The bet</div>
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

const PROCESS_STEPS = [
  { i: '📚', t: 'desk research', x: 'regs, market maps, competitor docs' },
  { i: '🗣️', t: 'primary research', x: '12 interviews - users + internal stakeholders' },
  { i: '📊', t: 'benchmarking', x: '4 platforms, feature-by-feature' },
  { i: '⚡', t: 'quick prototypes', x: 'low-fi Figma, built fast' },
  { i: '👀', t: 'internal review', x: 'sales, ops, engineering - before shipping' },
  { i: '🔁', t: 'feedback loop', x: 'three rounds, before "final"' },
  { i: '✅', t: 'final designs', x: 'evidence-backed - the easy part, by now' },
];

// where effort met impact, plotted per module - the five in the top-left
// (low effort, high impact) are what actually shipped first; the rest were
// real modules too, just further down the map.
const EFFORT_MAP = [
  { m: 'KYC / org profile verification', effort: 20, impact: 86, first: true },
  { m: 'user management', effort: 30, impact: 76, first: true },
  { m: 'order journey', effort: 58, impact: 94, first: true },
  { m: 'service details', effort: 36, impact: 66, first: true },
  { m: 'activity logs', effort: 24, impact: 52, first: true },
  { m: 'billing & invoicing', effort: 74, impact: 62, first: false },
  { m: 'network health monitoring', effort: 82, impact: 80, first: false },
];

function ProcessScene() {
  const ref = useRef(null);
  const [beat] = useScrollBeat(ref, 11);
  const on = (b) => (beat >= b ? 'on' : '');
  const stepIdx = Math.min(beat, PROCESS_STEPS.length - 1);
  const step = PROCESS_STEPS[stepIdx];

  return (
    <div className="oscn" ref={ref} style={{ '--beats': 11 }}>
      <div className="oscn-stage">
        {beat < PROCESS_STEPS.length ? (
          <div className="cj cj-process">
            <div className="cj-track" aria-hidden="true">
              <i style={{ width: `${((stepIdx + 1) / PROCESS_STEPS.length) * 100}%` }}></i>
            </div>
            <div className="cj-body">
              <span className="cj-ico">{step.i}</span>
              <span className="cj-day">step {String(stepIdx + 1).padStart(2, '0')} / 07</span>
              <b className="cj-t">{step.t}</b>
              <p className="cj-x">{step.x}</p>
            </div>
          </div>
        ) : beat < 9 ? (
          <div className="eff-wrap">
            <p className="dv-p">seven stages in, before a single final screen: effort mapped against impact across the whole platform - what to build first, and why.</p>
            <div className="eff-map">
              <span className="eff-axis-y">impact</span>
              <span className="eff-axis-x">effort</span>
              {EFFORT_MAP.map((m) => (
                <div key={m.m} className={`eff-dot ${m.first ? 'first' : ''}`} style={{ left: `${m.effort}%`, bottom: `${m.impact}%` }}>
                  <i></i><span>{m.m}</span>
                </div>
              ))}
            </div>
            <div className={`eff-first obeat ${on(8)}`}>
              <p className="eff-first-lead">five modules shipped first:</p>
              <div className="eff-first-grid">
                {EFFORT_MAP.filter((m) => m.first).map((m) => <span key={m.m}>{m.m}</span>)}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <p className="dv-p">one thing was obvious by then: a solo designer against 12 developers doesn&apos;t scale on screens alone. before the modules above got a single final pixel, a design system came first - not for visual polish, but for build speed: a component library so consistency, uniformity and look-and-feel didn&apos;t depend on reviewing every PR.</p>
            <p className={`dv-p dim obeat ${on(10)}`} style={{ marginTop: '16px' }}>the vertical is design - four years deep, screens to systems to interaction. AI stretched the horizontal wide enough to run discovery, PRDs, frontend and deploys alone, without diluting the vertical.</p>
          </div>
        )}
      </div>
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

export default function CustomerPortalCaseStudy({ onPrev, onNext, idx, total }) {
  const [sectionRefs, activeSection, indexPos, jumpToSection] = useSectionIndex(CP_SECTIONS.length);
  const at = (i) => (el) => { sectionRefs.current[i] = el; };

  return (
    <div className="inv-wrap">
      {indexPos && (
        <nav className="cp-index" style={{ top: indexPos.top, right: indexPos.right }} aria-label="Jump to section">
          {CP_SECTIONS.map((label, i) => (
            <button
              key={label}
              type="button"
              className={i === activeSection ? 'on' : ''}
              onClick={() => jumpToSection(i)}
            >
              {label}
            </button>
          ))}
        </nav>
      )}
      <div className="inv-hero">
        <p className="eyebrow">Polarin · Customer Portal</p>
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
        <div className="inv-step-tag"><i></i>Meet Ananya</div>
        <AlexJourney />
      </div>

      <div className="inv-section" ref={at(1)}>
        <TheBetScene />
      </div>

      <div className="inv-section" ref={at(2)}>
        <div className="inv-step-tag"><i></i>Discovery</div>
        <h3 className="dv-h">4 months before touching Figma</h3>
        <div className="ivx-principles">
          <div className="ivp"><b>technical immersion</b><p>learned networking from the architects - L1/L2/L3, ports, VRs, VCs - sat in sales calls, walked the manual provisioning workflows</p></div>
          <div className="ivp"><b>12 user interviews</b><p>IT managers, network engineers, enterprise buyers - mapped where every competitor demo broke</p></div>
          <div className="ivp"><b>competitive audit</b><p>4 global NaaS platforms - every UX gap became a design requirement</p></div>
        </div>
        <AuditScene />
      </div>

      <div className="inv-section" ref={at(3)}>
        <div className="inv-step-tag"><i></i>Process</div>
        <h3 className="dv-h">From research to first pixel</h3>
        <p className="dv-p">Seven stages, each shaping the next. Scroll through it:</p>
        <ProcessScene />
      </div>

      <div className="inv-section" ref={at(4)}>
        <div className="inv-step-tag"><i></i>The screens</div>
        <h3 className="dv-h">Scroll through the product</h3>
        <ScreensScene />
      </div>

      <div className="inv-section" ref={at(5)}>
        <div className="inv-step-tag"><i></i>Why solo scaled</div>
        <h3 className="dv-h">The system before the screens</h3>
        <div className="cj-result">
          <span><b>100+</b> reusable components</span>
          <span><b>20+</b> design tokens</span>
          <span><b>4 yrs</b> of solo delivery, scaled by it</span>
        </div>
        <SysScene />
        <p className="dv-p dim">one Figma library, one synced code component set - the system, not the screens, is what made four years of solo delivery possible.</p>
      </div>

      <div className="inv-section" ref={at(6)}>
        <div className="inv-step-tag"><i></i>What moved</div>
        <h3 className="dv-h">Impact</h3>
        <div className="ivx-principles dv4">
          <div className="ivp"><b className="cp-up">95% faster</b><p>onboarding & deployment - 5–7 days → 15 minutes</p></div>
          <div className="ivp"><b className="cp-signal">3× self-serve</b><p>non-technical users now order & manage independently</p></div>
          <div className="ivp"><b className="cp-signal">40% handoff cut</b><p>design-to-dev time reduced by the system</p></div>
          <div className="ivp"><b className="cp-up">CSAT 6.2 → 9.1</b><p>enterprise customers rate the experience</p></div>
        </div>
        <p className="dv-p dim" style={{ marginTop: '20px' }}>still building - new modules ship every quarter, and the system above is what lets one designer keep pace with them.</p>
      </div>

      <div className="inv-section" ref={at(7)}>
        <div className="inv-step-tag"><i></i>Four years</div>
        <h3 className="dv-h">Three things I know for sure</h3>
        <div className="inv-learn">
          {LEARNED.map((l) => (
            <div className="inv-learn-card" key={l.t}><h4>{l.t}</h4><p>{l.p}</p></div>
          ))}
        </div>
      </div>

      <div className="inv-section" ref={at(8)}>
        <div className="inv-step-tag"><i></i>Final result</div>
        <h3 className="plain">What changed</h3>
        <div className="inv-result"><span className="cp-signal">3× self-serve</span> adoption · 90 days → <span className="cp-up">10 minutes</span> · India&apos;s <span className="cp-rose">first</span> self-serve NaaS platform.</div>
      </div>

      <div className="ovl-nav">
        <button type="button" onClick={onPrev}>← Prev</button>
        <span className="ovl-count"><b>{idx + 1}</b> / {total} surfaces</span>
        <button type="button" onClick={onNext}>Next →</button>
      </div>
    </div>
  );
}
