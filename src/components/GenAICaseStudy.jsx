import CaseRoute from '../CaseRoute';
import { Shot, Clip } from '../CaseMedia';
import { useEffect, useRef, useState } from 'react';

/* ---- Polarin AI Assistance ----------------------------------------------
   An assistant for people who manage business network connections. The
   work here is product definition: what a good answer is, where the data
   comes from, what the thing may never do, and how you would know it
   worked - settled before a specialist AI team built the POC.

   Every beat below leads with the artifact. The prose is caption-length
   on purpose; the prop is the argument. Where the working prototype shows
   a point, the beat carries a frame of it (public/gax/, cut from the
   gitignored screen recordings) - sample data, simulated actions. */

/* the three questions the product exists to answer, in customers' words */
const Q_CLOUD = [
  { k: 'Performance', q: 'How is my network doing?' },
  { k: 'Support', q: 'What is happening with my ticket?' },
  { k: 'Visibility', q: 'Can I see everything in one view?' },
];

/* the journey before: five steps, and the customer joins them up */
const OLD_WAY = ['Open a service', 'Find the metrics', 'Check the dates', 'Compare the charts', 'Ask support'];

/* the discovery artifact - one row per real question, filled in by the
   teams who field them */
const SHEET = {
  q: 'What is happening with my ticket?',
  rows: [
    { k: 'Underlying need', v: 'Clarity on progress.' },
    { k: 'Useful answer', v: 'Status · last action · owner · expected resolution.' },
    { k: 'Source owner', v: 'Network operations / support.' },
    { k: 'If ambiguous', v: 'Ask for the ticket or the affected service.' },
  ],
  takeaway: 'Define a good answer before defining a feature.',
};

/* scope: one assistant, two journeys, and a conversation can cross between */
const SCOPE = [
  { i: '↗', t: 'Understand performance', p: 'What is healthy? What needs attention?' },
  { i: '↳', t: 'Get support', p: 'What is wrong? What happens next?' },
];
const EXCLUDE = ['No billing changes', 'No network changes', 'No pricing promises'];

/* six permitted sources - each settles a different question, each had a
   named owner before engineering started */
const SOURCES = [
  { t: 'Service inventory', p: 'which service is this?' },
  { t: 'Metrics & reports', p: 'what actually happened?' },
  { t: 'Service targets', p: 'was it inside the promise?' },
  { t: 'Tickets', p: 'is it already being handled?' },
  { t: 'Alerts & maintenance', p: 'is this a known event?' },
  { t: 'Knowledge base', p: 'can the customer safely resolve it?' },
];

/* the answer, as four stacked blocks - the order is the product */
const STACK = [
  { k: 'What should I know?', v: 'One port needs your attention.' },
  { k: 'What is the evidence?', v: '99.21%', sub: 'availability · target 99.70%', metric: true },
  { k: 'What does that mean?', v: 'The connection fell below its target.' },
  { k: 'What do I do next?', v: 'Review a ticket with evidence attached →', act: true },
];

/* question shape decides block structure */
const TEMPLATES = [
  { q: 'Compare services', v: 'Comparison table' },
  { q: 'Change over time', v: 'Trend card' },
  { q: 'Ticket status', v: 'Ticket card' },
  { q: 'Share an analysis', v: 'Report card' },
];

/* the six example ports, three shown - click a row for the meaning */
const PORTS = [
  { t: 'Bengaluru DC1', s: 'Below target', v: '99.21%', tone: 'bad', w: 65,
    d: '28 of the 31 connection drops occurred here, clustered in two windows. Next step: review a support ticket with these events attached.' },
  { t: 'Mumbai DC2', s: 'Watch closely', v: '99.72%', tone: 'watch', w: 85,
    d: 'Above the 99.70% target, but only by a small margin, and trending down since June. Keep watching this service.' },
  { t: 'Chennai DC1', s: 'Healthy', v: '99.99%', tone: 'good', w: 98,
    d: 'Above target with room to spare. No availability action is suggested for this service.' },
];

/* what the interface does between the screens */
const STATES = [
  { t: 'Answer appears', s: 'progressive response' },
  { t: 'Evidence opens', s: 'in-place detail' },
  { t: 'Data is missing', s: 'named, not a generic error' },
  { t: 'Customer confirms', s: 'a definite next step' },
];

/* the three judgment calls, each about trust */
const DECISIONS = [
  { n: '01', t: 'A workspace with room to think', p: 'comparisons, history and context needed a full page, not a chat bubble' },
  { n: '02', t: 'No evidence, no invented answer', p: 'if the data cannot be retrieved, say so and offer a route forward' },
  { n: '03', t: 'A handoff without starting over', p: 'the person taking over receives the conversation and the diagnostics' },
];

/* acceptance criteria - how the POC would be judged, written before it ran */
const CRITERIA = [
  { q: 'Can every number be trusted?', s: 'traceable to its source' },
  { q: 'Is the ticket ready for support?', s: 'essential evidence included' },
  { q: 'Does the handoff preserve the story?', s: 'no repeated explanation' },
];

const GENAI_ROUTE = ['Film', 'Problem', 'Discovery', 'Scope', 'Sources', 'The answer', 'Workspace', 'Interface', 'Proof'];

/* reveal-on-scroll for [data-rv] children, scoped to the overlay panel */
function useReveal(ref) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    const nodes = root.querySelectorAll('[data-rv]');
    if (typeof IntersectionObserver === 'undefined') {
      nodes.forEach((n) => n.classList.add('on'));
      return undefined;
    }
    const panel = document.querySelector('.ovl-panel');
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('on');
            obs.unobserve(e.target);
          }
        });
      },
      { root: panel || null, rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );
    nodes.forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, [ref]);
}

function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* ---- the ambient field ------------------------------------------------
   A procedural point cloud behind the whole study: it rotates on its own,
   leans toward the cursor, brightens where the cursor passes, and changes
   form as the reader moves between chapters - sphere, wave, disc. It is
   decoration, so it is drawn on a canvas that never takes pointer events
   and is switched off entirely under reduced motion.

   Every dot is one stamp of a pre-rendered glow sprite. Drawing a real
   shadowBlur per point is what makes a field this size crawl; stamping a
   32px gradient costs almost nothing and looks the same. */
function useCosmos(canvasRef, wrapRef) {
  useEffect(() => {
    const cv = canvasRef.current;
    const wrap = wrapRef.current;
    if (!cv || !wrap || prefersReducedMotion()) return undefined;
    const ctx = cv.getContext('2d');
    if (!ctx) return undefined;

    const sprite = (rgb) => {
      const s = document.createElement('canvas');
      s.width = 32; s.height = 32;
      const g = s.getContext('2d');
      const rad = g.createRadialGradient(16, 16, 0, 16, 16, 16);
      rad.addColorStop(0, `rgba(${rgb},1)`);
      rad.addColorStop(0.3, `rgba(${rgb},0.4)`);
      rad.addColorStop(1, `rgba(${rgb},0)`);
      g.fillStyle = rad;
      g.fillRect(0, 0, 32, 32);
      return s;
    };
    const TEAL = sprite('54,150,177');
    const ROSE = sprite('255,107,138');

    // a fibonacci sphere: even coverage without clumping at the poles
    const COUNT = window.innerWidth < 860 ? 240 : 560;
    const pts = Array.from({ length: COUNT }, (_, i) => {
      const y = 1 - (2 * (i + 0.5)) / COUNT;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const th = i * 2.399963;
      return { x: r * Math.cos(th), y, z: r * Math.sin(th), th };
    });

    let w = 0; let h = 0; let raf = null; let last = 0; let t = 0; let morph = 0;
    const ptr = { lean: 0, tilt: 0, cx: -9999, cy: -9999 };

    const size = () => {
      const r = cv.getBoundingClientRect();
      w = r.width; h = r.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // how far through the case study the reader is, 0..1 - the panel is the
    // scroll container, the window never moves while a study is open
    const progress = () => {
      const panel = document.querySelector('.ovl-panel');
      if (!panel) return 0;
      const top = wrap.getBoundingClientRect().top - panel.getBoundingClientRect().top + panel.scrollTop;
      const span = Math.max(1, wrap.offsetHeight - panel.clientHeight);
      return Math.min(1, Math.max(0, (panel.scrollTop - top) / span));
    };

    let client = { x: -9999, y: -9999 };
    const onMove = (e) => {
      if (e.pointerType === 'touch') return;
      client = { x: e.clientX, y: e.clientY };
      ptr.lean = (e.clientX / window.innerWidth - 0.5) * 0.5;
      ptr.tilt = (e.clientY / window.innerHeight - 0.5) * 0.3;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    const ro = new ResizeObserver(size);
    ro.observe(cv);
    size();

    const frame = (ts) => {
      raf = requestAnimationFrame(frame);
      // 30fps is plenty for a field this diffuse, and halves the cost
      if (document.hidden || ts - last < 33) return;
      const dt = Math.min(0.05, (ts - last) / 1000 || 0.016);
      last = ts;
      if (!w || !h) { size(); return; }
      // the study stays mounted while the overlay is shut - don't burn
      // frames painting something nobody can see
      if (!cv.offsetParent) return;
      t += dt;

      const rect = cv.getBoundingClientRect();
      ptr.cx = client.x - rect.left;
      ptr.cy = client.y - rect.top;

      // the form follows the chapter: each one eases into the next rather
      // than cutting, so the field reads as one object being turned
      morph += ((progress() * 7) - morph) * 0.05;
      const mode = morph % 3;
      const wave = mode < 1 ? mode : (mode < 2 ? 2 - mode : 0);
      const disc = mode > 2 ? Math.sin((mode - 2) * Math.PI) : 0;

      ctx.clearRect(0, 0, w, h);
      const cx = w * 0.5;
      const cy = h * 0.5;
      const radius = Math.min(w * 0.32, h * 0.42);
      const ang = t * 0.1 + ptr.lean;
      const co = Math.cos(ang);
      const si = Math.sin(ang);
      const ct = Math.cos(ptr.tilt);
      const st = Math.sin(ptr.tilt);

      const draw = [];
      for (let i = 0; i < pts.length; i++) {
        const q = pts[i];
        const breathe = Math.sin(q.th * 0.8 + t * 0.7) * 0.09;
        const x = q.x * (1 + breathe);
        const y = q.y * (1 - wave * 0.5) + Math.sin(q.x * 5 + t) * wave * 0.2;
        const z = q.z * (1 - disc * 0.65);
        const rx = x * co + z * si;
        const rz = -x * si + z * co;
        const ry = y * ct - rz * st;
        const sc = 2.9 / (2.9 - rz * 0.5);
        draw.push({ x: cx + rx * radius * sc, y: cy + ry * radius * sc, z: rz });
      }
      draw.sort((a, b) => a.z - b.z);

      // a faint ground glow, so the field sits in the page rather than on it
      const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.7);
      halo.addColorStop(0, 'rgba(54,150,177,0.055)');
      halo.addColorStop(0.55, 'rgba(255,107,138,0.028)');
      halo.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = halo;
      ctx.fillRect(cx - radius * 2, cy - radius * 2, radius * 4, radius * 4);

      // the cursor's reach is deliberately tight. a wide, strong bloom stops
      // reading as individual dots and turns into a smudge behind the text -
      // and this layer has to stay under body copy without fighting it.
      const REACH = 105 * 105;
      for (let i = 0; i < draw.length; i++) {
        const d = draw[i];
        const dx = d.x - ptr.cx;
        const dy = d.y - ptr.cy;
        const near = Math.max(0, 1 - (dx * dx + dy * dy) / REACH);
        const depth = (d.z + 1) * 0.5;
        const r = (1 + depth * 1.25) * (1 + near * 1.9);
        ctx.globalAlpha = Math.min(0.9, (0.11 + depth * 0.2) * (0.7 + near * 1.6));
        // teal is the field; rose is reserved for the few dots nearest the
        // cursor and the very front of the sphere, so it stays an accent
        ctx.drawImage(near > 0.62 || d.z > 0.78 ? ROSE : TEAL, d.x - r * 2.4, d.y - r * 2.4, r * 4.8, r * 4.8);

        // thread a few near neighbours together - enough to read as a
        // lattice, not so many that it turns into a mesh
        if (i % 5 === 0 && i + 1 < draw.length) {
          const n = draw[i + 1];
          const len = Math.hypot(d.x - n.x, d.y - n.y);
          if (len < radius * 0.22) {
            ctx.globalAlpha = (0.04 + depth * 0.05) * (1 + near * 2);
            ctx.strokeStyle = '#6E8FC8';
            ctx.beginPath();
            ctx.moveTo(d.x, d.y);
            ctx.lineTo(n.x, n.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
    };
    raf = requestAnimationFrame(frame);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
    };
  }, [canvasRef, wrapRef]);
}

/* pinned-beat reader, same contract as the other case studies' */
function useScrollBeat(ref, beats) {
  const [beat, setBeat] = useState(prefersReducedMotion() ? beats - 1 : 0);
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
      const pr = Math.min(1, Math.max(0, (panel.scrollTop - top) / span));
      setBeat(Math.min(beats - 1, Math.floor(pr * beats)));
    };
    const onScroll = () => { if (raf) return; raf = requestAnimationFrame(() => { raf = null; update(); }); };
    panel.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => panel.removeEventListener('scroll', onScroll);
  }, [ref, beats]);
  return beat;
}

/* ---- the interactive props -------------------------------------------- */

/* the evidence list: a row states the verdict, opening it gives the reason.
   the one genuinely explorable thing in the study - the same gesture the
   real answer offers a customer. */
function Ports() {
  const [open, setOpen] = useState(0);
  return (
    <div className="gax-ports">
      {PORTS.map((p, i) => (
        <div className={`gax-port ${p.tone}${open === i ? ' open' : ''}`} key={p.t}>
          <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
            <b>{p.t}</b>
            <span className="gax-port-s">{p.s}</span>
            <span className="gax-port-bar"><i style={{ '--w': `${p.w}%` }} /></span>
            <span className="gax-port-v">{p.v}</span>
            <i className="gax-port-x" aria-hidden="true">{open === i ? '−' : '+'}</i>
          </button>
          {open === i && <p>{p.d}</p>}
        </div>
      ))}
    </div>
  );
}

/* the workspace: history on the left, the answer in the middle, the
   context it used on the right. the argument is the three columns. */
function Workspace() {
  return (
    <div className="gax-ws-wrap">
      <div className="gax-ws">
        <div className="gax-ws-top"><b>polarin<i /></b><span>AI Assistant</span></div>
        <div className="gax-ws-body">
          <div className="gax-ws-rail">
            <b>＋ New conversation</b>
            <p>Monthly performance</p>
            <p>Bengaluru port issue</p>
            <p>Availability summary</p>
            <p>Saved reports</p>
          </div>
          <div className="gax-ws-main">
            <span className="gax-ws-q">How did my ports perform last month?</span>
            <h4>Five ports met their thresholds.<br /><em>One needs your attention.</em></h4>
            <div className="gax-ws-kpis">
              <div><small>Availability</small>99.94%</div>
              <div><small>Connection drops</small>31</div>
              <div className="att"><small>Needs attention</small>1 of 6</div>
            </div>
            <div className="gax-ws-bars">
              <div><i style={{ '--w': '65%' }} className="bad" /></div>
              <div><i style={{ '--w': '85%' }} /></div>
              <div><i style={{ '--w': '98%' }} /></div>
            </div>
          </div>
          <div className="gax-ws-ctx">
            <b>In this conversation</b>
            <p><span>Services</span>6 live ports</p>
            <p><span>Period</span>Last 30 days</p>
            <p><span>Sources</span>Metrics · Reports · Alerts</p>
          </div>
        </div>
      </div>
      <div className="gax-ws-labels"><span>01 / History</span><span>02 / Answer</span><span>03 / Context</span></div>
    </div>
  );
}

/* the launch film opens the study: it autoplays muted like every clip on
   the site, but it was cut with a soundtrack, so the reader can turn it on.
   it is the one clip here worth hearing, which is why it alone gets the
   control rather than Clip growing a prop nobody else needs. */
function LaunchFilm() {
  const vid = useRef(null);
  const [sound, setSound] = useState(false);
  const toggle = () => {
    const v = vid.current;
    if (!v) return;
    v.muted = sound;
    if (!sound) { v.currentTime = 0; v.play().catch(() => {}); }
    setSound(!sound);
  };
  return (
    <div className="gax-film">
      <span className="gax-eyebrow">The launch film · 45 seconds</span>
      <figure className="kbm-frame gax-film-frame">
        <video ref={vid} src="/gax/gax-launch.mp4" autoPlay muted loop playsInline preload="metadata" />
        <button type="button" className="gax-film-snd" aria-pressed={sound} onClick={toggle}>
          {sound ? 'Sound off' : 'Play with sound'}
        </button>
      </figure>
      <div className="gax-pills">
        <span>Ask once</span><span>Know what needs attention</span><span>Act without forms</span>
      </div>
    </div>
  );
}

/* one chapter: a run of pinned beats, one idea per screen. under reduced
   motion the whole run stacks and nothing is hidden. */
function Chapter({ beats }) {
  const ref = useRef(null);
  const beat = useScrollBeat(ref, beats.length);

  if (prefersReducedMotion()) return <div className="gax-static">{beats}</div>;

  return (
    <div className="oscn gax-oscn" ref={ref} style={{ '--beats': beats.length }}>
      <div className="oscn-stage gax-stage" key={beat}>{beats[beat]}</div>
    </div>
  );
}

/* ---- the eight chapters ----------------------------------------------- */

const PROBLEM = [
  <div className="gax-wide" key="cloud">
    <span className="gax-eyebrow">What customers actually ask</span>
    <div className="gax-cloud">
      {Q_CLOUD.map((x) => (
        <div className="gax-qcard" key={x.k}><small>{x.k}</small>{x.q}</div>
      ))}
    </div>
  </div>,
  <div className="gax-wide" key="ba">
    <div className="gax-ba">
      <div className="gax-ba-p">
        <span className="gax-ba-l">The existing journey</span>
        <div className="gax-route">{OLD_WAY.map((x) => <span key={x}>{x}</span>)}</div>
        <p className="cp-rose">The customer connects the dots.</p>
      </div>
      <div className="gax-ba-p on">
        <span className="gax-ba-l">The intended one</span>
        <div className="gax-ba-q">&quot;How is my network doing?&quot;</div>
        <div className="gax-ba-r">An answer. The evidence. A next step.</div>
        <p className="cp-up">The product connects the dots.</p>
      </div>
    </div>
  </div>,
  <h3 className="gax-big" key="gap">
    The data was there.<br /><em className="cp-rose">The answer wasn&apos;t.</em>
  </h3>,
];

const DISCOVERY = [
  <div className="gax-wide" key="sheet">
    <span className="gax-eyebrow">Discovery artifact · one row per real question</span>
    <div className="gax-sheet gax-tilt">
      <div className="gax-sheet-h"><span>Questionnaire</span><i>example entry</i></div>
      <p className="gax-sheet-q">&quot;{SHEET.q}&quot;</p>
      {SHEET.rows.map((r) => (
        <div className="gax-row" key={r.k}><span>{r.k}</span><b>{r.v}</b></div>
      ))}
      <div className="gax-takeaway">{SHEET.takeaway}</div>
    </div>
  </div>,
  <div className="gax-wide" key="ambig">
    <span className="gax-eyebrow">When &quot;Bengaluru&quot; matches two services</span>
    <div className="gax-vs">
      <div className="gax-vs-c bad"><span>The usual answer</span><p>&quot;Please clarify.&quot;</p></div>
      <div className="gax-vs-c good"><span>Ours</span><p>&quot;Two match. DC1 or DC2?&quot;</p></div>
    </div>
    <p className="gax-note">place, symptom and the word &quot;again&quot; all read as signals - so a clarification offers the likely choices rather than an empty prompt.</p>
  </div>,
  <Shot
    key="s-narrow"
    src="/gax/gax-narrow.jpg"
    alt="The assistant replying Let's narrow that down, with three suggested follow-ups as chips"
    eyebrow="In the prototype"
    note={{ title: 'A vague question gets three likely routes', body: 'Not an empty “please clarify”.' }}
  />,
  <div className="gax-wide" key="honest">
    <span className="gax-eyebrow">What the discovery was, and was not</span>
    <div className="gax-fact">
      <b>50 rows</b>
      <p>in the customer-questions workbook - <em className="cp-amber">pre-filled prompts, not 50 interviews.</em> Worth saying, because the difference changes how much the sheet can be leaned on.</p>
    </div>
  </div>,
];

const SCOPE_CH = [
  <div className="gax-wide" key="scope">
    <span className="gax-eyebrow">One assistant, two jobs</span>
    <div className="gax-scope gax-tilt">
      {SCOPE.map((x) => (
        <div className="gax-scope-c" key={x.t}>
          <i aria-hidden="true">{x.i}</i>
          <div><b>{x.t}</b><p>{x.p}</p></div>
        </div>
      ))}
    </div>
    <div className="gax-scope-note"><span>Performance question</span><i aria-hidden="true">⇄</i><span>Support journey</span></div>
  </div>,
  <div className="gax-wide" key="confirm">
    <span className="gax-eyebrow">It can explain and recommend. It cannot act.</span>
    <div className="gax-confirm gax-tilt">
      <div className="gax-confirm-h"><span>Recommended next step</span><i>confirmation required</i></div>
      <p className="gax-confirm-q">Raise a support ticket<br />for the Bengaluru port?</p>
      <p className="gax-confirm-e">Service identified. Diagnostics and timestamps attached.</p>
      <div className="gax-confirm-b">Customer confirms <i aria-hidden="true">→</i></div>
    </div>
  </div>,
  <Clip
    key="c-ticket"
    src="/gax/gax-ticket.mp4"
    eyebrow="“Raise a ticket”, typed"
    note={{ title: 'Evidence attached. Owner named. Nothing sent without a yes.', body: 'Simulated submission - no real ticket is created.' }}
  />,
  <div className="gax-wide" key="never">
    <span className="gax-eyebrow">Outside the boundary, permanently</span>
    <div className="gax-never">
      {EXCLUDE.map((x) => <span key={x}><i aria-hidden="true">✕</i>{x}</span>)}
    </div>
    <p className="gax-note">enforced in the integration layer rather than asked of the model - an assistant that can touch the network is a different risk class entirely.</p>
  </div>,
];

const SOURCES_CH = [
  <div className="gax-wide" key="src">
    <span className="gax-eyebrow">Six permitted sources, each settling one question</span>
    <div className="gax-src">
      {SOURCES.map((x) => (
        <div className="gax-src-c" key={x.t}><b>{x.t}</b><p>{x.p}</p></div>
      ))}
    </div>
  </div>,
  <h3 className="gax-big" key="own">
    Every field had an owner<br />before the build began.<br />
    <em className="cp-amber">The gaps surfaced on a page,<br />not in a demo.</em>
  </h3>,
];

const ANSWER_CH = [
  <div className="gax-wide" key="stack">
    <span className="gax-eyebrow">One answer, four blocks - the order is the product</span>
    <div className="gax-stack gax-tilt">
      {STACK.map((x) => (
        <div className={`gax-sblock${x.act ? ' act' : ''}`} key={x.k}>
          <small>{x.k}</small>
          {x.metric
            ? <div className="gax-sb-metric"><strong>{x.v}</strong><span>{x.sub}</span></div>
            : <b>{x.v}</b>}
        </div>
      ))}
    </div>
  </div>,
  <Clip
    key="c-ask"
    src="/gax/gax-ask.mp4"
    eyebrow="One tap → a working answer"
    note={{ title: 'Headline, evidence, meaning, next step', body: 'The four blocks, in that order, from the running prototype.' }}
  />,
  <div className="gax-wide" key="tpl">
    <span className="gax-eyebrow">The shape of the question picks the blocks</span>
    <div className="gax-tpl">
      {TEMPLATES.map((x) => (
        <div className="gax-tpl-r" key={x.q}><span>{x.q}</span><i aria-hidden="true">→</i><b>{x.v}</b></div>
      ))}
    </div>
    <p className="gax-note">a defined block library, so a new question reuses structure instead of earning a new screen.</p>
  </div>,
];

const WORKSPACE_CH = [
  <div className="gax-wide" key="ws"><Workspace /></div>,
  <div className="gax-wide" key="ports">
    <span className="gax-eyebrow">Open a service to see the reason behind the number</span>
    <Ports />
    <p className="gax-note">3 of 6 example ports. illustrative data from the POC specification.</p>
  </div>,
  <Clip
    key="c-evidence"
    src="/gax/gax-evidence.mp4"
    eyebrow="The number opens into its source"
    note={{ title: 'All six ports, the target, the verdict', body: 'Open a row for latency, flaps and optical power - or ask about it.' }}
  />,
];

const INTERFACE_CH = [
  <div className="gax-wide" key="states">
    <span className="gax-eyebrow">The states between the screens</span>
    <div className="gax-stream" aria-hidden="true"><i /><i /><i /></div>
    <div className="gax-states">
      {STATES.map((x) => (
        <div className="gax-state-r" key={x.t}><b>{x.t}</b><span>{x.s}</span></div>
      ))}
    </div>
  </div>,
  <Shot
    key="s-thinking"
    src="/gax/gax-thinking.jpg"
    alt="While answering, the assistant lists its steps: resolving services, reading samples, comparing against thresholds, finding patterns"
    eyebrow="While it works, it says what it is doing"
    note={{ title: 'Every step named, and ticked off', body: 'Waiting reads as progress, not a spinner.' }}
  />,
  <h3 className="gax-big" key="mem">
    &quot;What about Mumbai?&quot;<br /><em className="cp-up">Service, metric and period<br />carry forward.</em>
  </h3>,
];

const PROOF = [
  <div className="gax-wide" key="dec">
    <span className="gax-eyebrow">The judgment calls were all about trust</span>
    <div className="gax-grid3">
      {DECISIONS.map((x) => (
        <div className="gax-card" key={x.n}><span className="gax-n">{x.n}</span><b>{x.t}</b><p>{x.p}</p></div>
      ))}
    </div>
  </div>,
  <Shot
    key="s-diagnose"
    src="/gax/gax-diagnose.jpg"
    alt="A diagnosis of Bengaluru flapping: an availability trend, a likely physical-path cause marked confidence medium, not confirmed, and its sample sources"
    eyebrow="02 · in the prototype"
    note={{ title: 'A likely cause - marked “not confirmed”', body: 'Confidence and sources sit beside the claim.' }}
  />,
  <Shot
    key="s-handoff"
    src="/gax/gax-handoff.jpg"
    alt="Your handoff is prepared for the NOC, listing the full conversation, sample diagnostic results, checks already performed and attachments"
    eyebrow="03 · in the prototype"
    note={{ title: 'The NOC gets the whole story', body: 'Conversation, diagnostics and checks already run - nobody starts over.' }}
  />,
  <div className="gax-wide" key="crit">
    <span className="gax-eyebrow">How the POC would be judged - written before it ran</span>
    <div className="gax-crit">
      {CRITERIA.map((x) => (
        <div className="gax-crit-r" key={x.q}><strong>{x.q}</strong><span>{x.s}</span></div>
      ))}
    </div>
  </div>,
  <h3 className="gax-big" key="close">
    A good demo is a start.<br /><em className="cp-amber">Evidence is the test</em> - and<br />that test has not reported yet.
  </h3>,
];

const CHAPTERS = [PROBLEM, DISCOVERY, SCOPE_CH, SOURCES_CH, ANSWER_CH, WORKSPACE_CH, INTERFACE_CH, PROOF];

export default function GenAICaseStudy({ onPrev, onNext, idx, total }) {
  const wrap = useRef(null);
  const fx = useRef(null);
  const secs = useRef([]);
  const at = (i) => (el) => { secs.current[i] = el; };
  useReveal(wrap);
  useCosmos(fx, wrap);

  return (
    <div className="inv-wrap gax-wrap" ref={wrap}>
      <canvas className="gax-fx" ref={fx} aria-hidden="true" />
      <CaseRoute refs={secs} labels={GENAI_ROUTE} />
      <div className="inv-hero cs-hero">
        <div className="cp-logo-wrap">
          <img className="cp-logo" src="/polarin-logo.png" alt="Polarin, by Lightstorm" />
        </div>
        <h2>Less searching. <span className="cp-signal">More knowing.</span></h2>
        <p>An assistant for people who manage business network connections. The numbers already existed - what was missing was the answer. Frames here are from the working prototype, on sample data with simulated actions - no production result is claimed.</p>
        <div className="inv-meta">
          <div><span>My role</span><b>Product definition → frontend spec</b></div>
          <div><span>Built with</span><b>A specialist AI delivery team</b></div>
          <div><span>Status</span><b>Working prototype · verdict open</b></div>
        </div>
        <span className="cp-scroll" aria-hidden="true"><i></i>scroll</span>
      </div>

      <div ref={at(0)}><LaunchFilm /></div>

      {CHAPTERS.map((beats, i) => (
        <div ref={at(i + 1)} key={GENAI_ROUTE[i + 1]}><Chapter beats={beats} /></div>
      ))}

      <div className="ovl-nav">
        <button type="button" onClick={onPrev}>← Prev</button>
        <span className="ovl-count"><b>{idx + 1}</b> / {total} surfaces</span>
        <button type="button" onClick={onNext}>Next →</button>
      </div>
    </div>
  );
}
