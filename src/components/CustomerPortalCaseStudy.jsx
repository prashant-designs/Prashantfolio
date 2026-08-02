import { useEffect, useRef, useState } from 'react';

const prefersReducedMotion = typeof window !== 'undefined'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const CJ_STEPS = [
  { d: 0, i: '📢', t: 'the need', x: 'Alex needs to connect their new Mumbai datacenter to AWS ap-south-1.', w: '' },
  { d: 3, i: '🔍', t: 'research vendors', x: 'Googling begins. Every pricing page says "Contact Sales."', w: 'no way to compare options, pricing or availability in one place' },
  { d: 10, i: '📞', t: 'call vendor #1', x: 'Transferred 3 times. Finally a rep - who asks for a Letter of Authorization and a site survey.', w: '47-minute average hold time · no self-serve · no portal' },
  { d: 14, i: '📞', t: 'call vendor #2', x: 'A backup quote from another carrier. Different process, different forms, different timelines.', w: 'every vendor has its own workflow - nothing is standardised' },
  { d: 16, i: '📝', t: 'fill out forms', x: 'PDF order forms over email. Circuit IDs, cross-connects, billing codes - typed by hand.', w: '~34% error rate in manual forms · one typo = weeks of delay' },
  { d: 21, i: '💰', t: 'negotiate pricing', x: 'A quote arrives. Alex asks for a discount - forwarded to "the commercial team." Email chains.', w: 'pricing is opaque · no benchmarks · no market visibility' },
  { d: 66, i: '⏳', t: 'wait', x: 'Order placed. ETA? "4–6 weeks." Then… silence.', w: 'zero real-time visibility · status updates by email, if at all' },
  { d: 80, i: '🔧', t: 'installation day', x: 'A technician arrives - but the form had a typo in the rack ID. The technician leaves.', w: 'a new ticket is raised · back in the queue' },
  { d: 90, i: '🔁', t: 'start over', x: 'Three months in. The circuit still is not live. Alex picks up the phone again.', w: 'the entire cycle repeats - for every single connection' },
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
            <p className="cjx-q">How hard can it be<br />to connect <em>one</em> datacenter?</p>
            <span className="cjx-cue">scroll to walk Alex&apos;s 90 days →</span>
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
            <p className="dv-p obeat on">A Network-as-a-Service platform with pre-established NNIs across datacenters, cloud on-ramps and PoPs - the fabric already connects everywhere Alex needs. Keep scrolling:</p>
          </>
        )}

        {/* Alex opens Polarin → the swaps: builds up as one combined scene,
            each piece staying visible as the next fades in - not a replace. */}
        {beat >= 2 && (
          <>
            <p className={`bet-l1 ${on(2)}`}>Alex doesn&apos;t call anyone.</p>
            <p className={`bet-l2 ${on(3)}`}>He opens <em>Polarin.</em></p>
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
  const [beat] = useScrollBeat(ref, 9);
  const on = (b) => (beat >= b ? 'on' : '');

  return (
    <div className="oscn" ref={ref} style={{ '--beats': 9 }}>
      <div className="oscn-stage aud-stage">
        <p className={`aud-lead obeat ${on(0)}`}>4 global platforms audited feature-by-feature - every gap became a design requirement:</p>
        <div className="aud">
          <div className={`aud-r aud-h obeat ${on(0)}`}><span>platform</span><span>self-serve</span><span>onboarding</span><span>india</span></div>
          {AUDIT.map((a, i) => (
            <div className={`aud-r obeat ${on(i + 1)}`} key={a.name}><span>{a.name}</span><span>{a.serve}</span><span>{a.onboard}</span><span>{a.india}</span></div>
          ))}
          <div className={`aud-r aud-p obeat ${on(5)}`}><span>Polarin →</span><span>full</span><span>15 minutes</span><span>native</span></div>
        </div>
        <p className={`aud-insight obeat ${on(6)}`}>every one of them chose engineering power over buyer accessibility. the person who approves a ₹50L contract <em>can&apos;t place an order without help.</em> that&apos;s the gap Polarin closes.</p>

        <div className={`aud-gaps obeat ${on(7)}`}>
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

        <p className={`aud-next obeat ${on(8)}`}>next: benchmarking doesn&apos;t stop at features - it&apos;s extending to the experience itself, tracked every quarter as competitors ship and expectations move.</p>
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

function ProcessScene() {
  const ref = useRef(null);
  const [beat] = useScrollBeat(ref, 9);
  const on = (b) => (beat >= b ? 'on' : '');
  const stepIdx = Math.min(beat, PROCESS_STEPS.length - 1);
  const step = PROCESS_STEPS[stepIdx];

  return (
    <div className="oscn" ref={ref} style={{ '--beats': 9 }}>
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
        ) : (
          <div>
            <p className="dv-p">seven stages in, one thing was obvious: a solo designer against 12 developers doesn&apos;t scale on screens alone. before the final designs shipped, a design system came first - not for visual polish, but for build speed: a component library so consistency, uniformity and look-and-feel didn&apos;t depend on reviewing every PR.</p>
            <p className={`dv-p dim obeat ${on(8)}`} style={{ marginTop: '16px' }}>the vertical is design - four years deep, screens to systems to interaction. AI stretched the horizontal wide enough to run discovery, PRDs, frontend and deploys alone, without diluting the vertical.</p>
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

export default function CustomerPortalCaseStudy({ onPrev, onNext, idx, total }) {
  return (
    <div className="inv-wrap">
      <div className="inv-hero">
        <p className="eyebrow">Polarin · Customer Portal</p>
        <h2>90 days → 10 minutes.</h2>
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

      <div className="inv-section">
        <div className="inv-step-tag"><i></i>Meet Alex</div>
        <h3 className="plain">What &quot;before&quot; felt like</h3>
        <p className="dv-p">A VP of Infrastructure at a Mumbai fintech needs one connection: datacenter → AWS ap-south-1. Keep scrolling - and watch the days pile up.</p>
        <AlexJourney />
      </div>

      <div className="inv-section">
        <TheBetScene />
      </div>

      <div className="inv-section">
        <div className="inv-step-tag"><i></i>Discovery</div>
        <h3 className="dv-h" style={{ marginTop: '10px' }}>4 months before touching Figma</h3>
        <div className="ivx-principles">
          <div className="ivp"><b>technical immersion</b><p>learned networking from the architects - L1/L2/L3, ports, VRs, VCs - sat in sales calls, walked the manual provisioning workflows</p></div>
          <div className="ivp"><b>12 user interviews</b><p>IT managers, network engineers, enterprise buyers - mapped where every competitor demo broke</p></div>
          <div className="ivp"><b>competitive audit</b><p>4 global NaaS platforms - every UX gap became a design requirement</p></div>
        </div>
        <AuditScene />
      </div>

      <div className="inv-section">
        <div className="inv-step-tag"><i></i>Process</div>
        <h3 className="dv-h" style={{ marginTop: '10px' }}>From research to first pixel</h3>
        <p className="dv-p">Desk research, primary research, benchmarking, quick prototypes, internal review, feedback, then final designs - seven stages, each shaping the next. Scroll through it:</p>
        <ProcessScene />
      </div>

      <div className="inv-section">
        <div className="inv-step-tag"><i></i>The screens</div>
        <h3 className="dv-h" style={{ marginTop: '10px' }}>Scroll through the product</h3>
        <ScreensScene />
      </div>

      <div className="inv-section">
        <div className="inv-step-tag"><i></i>Why solo scaled</div>
        <h3 className="dv-h" style={{ marginTop: '10px' }}>The system before the screens</h3>
        <p className="dv-p">With 12 developers and 3 PMs shipping against one designer, consistency wasn&apos;t optional - it was survival. Before a single product screen, I built the design system:</p>
        <div className="cj-result" style={{ marginTop: '16px' }}>
          <span><b>100+</b> reusable components</span>
          <span><b>20+</b> design tokens</span>
          <span><b>4 yrs</b> of solo delivery, scaled by it</span>
        </div>
        <p className="dv-p dim">systems are the real product - screens age and get replaced; the system is what made four years of great screens fast to build.</p>
      </div>

      <div className="inv-section">
        <div className="inv-step-tag"><i></i>What moved</div>
        <h3 className="dv-h" style={{ marginTop: '10px' }}>Impact</h3>
        <div className="ivx-principles dv4">
          <div className="ivp"><b>95% faster</b><p>onboarding & deployment - 5–7 days → 15 minutes</p></div>
          <div className="ivp"><b>3× self-serve</b><p>non-technical users now order & manage independently</p></div>
          <div className="ivp"><b>40% handoff cut</b><p>design-to-dev time reduced by the system</p></div>
          <div className="ivp"><b>CSAT 6.2 → 9.1</b><p>enterprise customers rate the experience</p></div>
        </div>
      </div>

      <div className="inv-section">
        <div className="inv-step-tag"><i></i>Four years</div>
        <h3 className="dv-h" style={{ marginTop: '10px' }}>Three things I know for sure</h3>
        <div className="inv-learn">
          {LEARNED.map((l) => (
            <div className="inv-learn-card" key={l.t}><h4>{l.t}</h4><p>{l.p}</p></div>
          ))}
        </div>
      </div>

      <div className="inv-section">
        <div className="inv-step-tag"><i></i>Final result</div>
        <h3 className="plain">What changed</h3>
        <div className="inv-result">3× self-serve adoption · 90 days → 10 minutes · India&apos;s first self-serve NaaS platform.</div>
      </div>

      <div className="ovl-nav">
        <button type="button" onClick={onPrev}>← Prev</button>
        <span className="ovl-count"><b>{idx + 1}</b> / {total} surfaces</span>
        <button type="button" onClick={onNext}>Next →</button>
      </div>
    </div>
  );
}
