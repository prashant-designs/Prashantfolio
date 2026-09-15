import { useEffect, useRef, useState } from 'react';
import CaseRoute from '../CaseRoute';
import { Shot, Clip } from '../CaseMedia';

/* ---- Polarin Developer Portal -----------------------------------------
   Polarin had APIs and no way in: a bare Swagger page where every test
   call hit live production. This is the run from the first customer
   conversation to a deployed frontend - the PRD, the decisions inside it,
   and the portal those decisions turned into.

   Built as pinned chapters, the same shape GenAICaseStudy uses, because
   this was the one case study still running as flat scrolling sections. */

/* the five glyphs the media annotations use. same language as the other
   case studies' icon sets: 24x24, no fill, currentColor stroke at 1.6,
   round caps and joins. */
const DV_ICONS = {
  book: <><path d="M4 5.2c2.6-1.2 5.4-1.2 8 0v13.6c-2.6-1.2-5.4-1.2-8 0z" /><path d="M20 5.2c-2.6-1.2-5.4-1.2-8 0v13.6c2.6-1.2 5.4-1.2 8 0z" /></>,
  key: <><circle cx="8.4" cy="12" r="3.6" /><path d="M12 12h8" /><path d="M17.4 12v3.1" /><path d="M20 12v2.2" /></>,
  lock: <><rect x="4.6" y="10.2" width="14.8" height="9.6" rx="2.4" /><path d="M8.2 10.2V7.6a3.8 3.8 0 0 1 7.6 0v2.6" /></>,
  play: <><circle cx="12" cy="12" r="8.4" /><path d="M10.2 8.9l5 3.1-5 3.1z" /></>,
  alert: <><path d="M12 4.4l8.2 14.2H3.8z" /><path d="M12 10v3.6" /><path d="M12 16.4h.01" /></>,
};

function DvIco({ name }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {DV_ICONS[name]}
    </svg>
  );
}

const PIPELINE = ['requirements', 'PRD', 'DX design', 'frontend build', 'deploy'];

/* the current state, written as the responses a developer actually got */
const FAILS = [
  { code: 'GET /safe-test-environment', status: '500', body: 'every test call hits live production - one wrong call is a real order' },
  { code: 'GET /api-key', status: '403', body: '"contact Lightstorm support" - days of delay for a two-minute task' },
  { code: 'GET /change-bandwidth', status: '404', body: 'lost in hundreds of endpoints organised by tech, not by task' },
  { code: 'GET /breaking-changes', status: '410', body: 'customers find out an API changed when their integration breaks' },
];

const PRINCIPLES = [
  { t: 'a UAT twin', p: 'full sandbox - demo circuits, a mock write layer, nightly reset. responses field-identical to production; nothing real ever happens' },
  { t: 'tasks, not endpoints', p: '236 endpoints organised into plain-english modules - ordering, MACD, monitoring, billing, support…' },
  { t: 'self-serve keys', p: 'generate, rotate & revoke without a human - rotation overlap so live integrations never break' },
  { t: 'a 180-day promise', p: 'max 2 live versions, migration guides, deprecation notices - no surprise breakage, ever' },
];

/* a PRD is a stack of arguments settled one by one. these are the ones
   that shaped the portal. */
const LEDGER = [
  { q: 'Where do requirements come from?', a: 'journeys, not wishlists', d: 'two journeys wrote the PRD - a network engineer wiring Grafana, an IT team automating operations. every requirement had to serve one of them, benchmarked against the best developer platforms.' },
  { q: 'UAT data - shared demo or per-customer snapshots?', a: 'shared · phase 1', d: 'shared demo circuits with a nightly reset ship faster and answer every integration question. per-customer production snapshots flagged for phase 2 - richer, not required for launch.' },
  { q: 'Docs - public or behind login?', a: 'public · recommended', d: 'like the platforms developers already trust: docs, reference & Postman collection open to read, so integration code gets written in parallel with procurement. keys still require full Lightstorm onboarding & KYC.' },
  { q: 'Key rotation - how long do old keys live?', a: 'overlap window', d: 'old key stays valid through a fixed overlap after rotation, so a live Grafana board never goes dark mid-swap. revoke is instant when a key is compromised.' },
];

const DEV_ROUTE = ['Problem', 'The PRD', 'The portal', 'Result'];

function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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

/* ---- the four chapters ------------------------------------------------ */

const PROBLEM = [
  <h3 className="gax-big" key="had">
    Polarin had APIs.<br /><em className="cp-rose">Nobody could safely call them.</em>
  </h3>,
  <div className="gax-wide" key="fails">
    <span className="gax-eyebrow">The current state, as a developer met it</span>
    <div className="dv-fails">
      {FAILS.map((f) => (
        <div className="dvf" key={f.code}>
          <code>{f.code}</code>
          <span className="dvf-code">{f.status}</span>
          <p>{f.body}</p>
        </div>
      ))}
    </div>
  </div>,
  <h3 className="gax-big" key="support">
    Customers who wanted to<br />automate <em className="cp-amber">still called support.</em>
  </h3>,
];

const PRD = [
  <div className="gax-wide" key="pipe">
    <span className="gax-eyebrow">One pair of hands, every stage</span>
    <div className="dv-pipe">
      {PIPELINE.map((p, i) => (
        <span key={p} className={`dvp ${i === PIPELINE.length - 1 ? 'last' : ''}`}>
          <b>{p}</b>{i === PIPELINE.length - 1 ? <i>201</i> : <i>200</i>}
        </span>
      ))}
    </div>
    <p className="gax-note">requirements came from shadowing support tickets and sitting with CX, sales and engineering - then anchored on two customers: network-ops pulling metrics into Grafana, and enterprise IT automating orders.</p>
  </div>,
  <div className="gax-wide" key="principles">
    <span className="gax-eyebrow">The four calls the PRD made</span>
    <div className="ivx-principles dv4">
      {PRINCIPLES.map((pr) => (
        <div className="ivp" key={pr.t}><b>{pr.t}</b><p>{pr.p}</p></div>
      ))}
    </div>
  </div>,
  <div className="gax-wide" key="ledger">
    <span className="gax-eyebrow">A PRD is arguments, settled one by one</span>
    <div className="dv-ledger">
      {LEDGER.map((l) => (
        <div className="li" key={l.q} tabIndex={0}>
          <div className="li-row dvl-row"><span className="li-name">{l.q}</span><b>{l.a}</b></div>
          <div className="li-detail">{l.d}</div>
        </div>
      ))}
    </div>
  </div>,
];

const PORTAL = [
  <h3 className="gax-big" key="built">
    Then I designed the experience<br />and <em className="cp-signal">built the frontend myself.</em>
  </h3>,
  <Shot
    key="m-welcome"
    src="/dp/dp-welcome.jpg"
    alt="The Polarin developer portal landing page, with a search bar reading 236 endpoints and a three-step how-it-works"
    eyebrow="One front door"
    icon={<DvIco name="book" />}
    note={{
      title: 'One front door, 236 endpoints behind it',
      body: 'Get access, authenticate, call the APIs - the three steps of the PRD, made the first thing on the page. The search counts what it covers, because the old Swagger page never told you how much there was.',
    }}
  />,
  <Shot
    key="m-access"
    src="/dp/dp-access.jpg"
    alt="The Getting Access page: five numbered steps ending in a note that the first API call takes under thirty minutes"
    eyebrow="The 30-minute promise"
    icon={<DvIco name="key" />}
    note={{
      title: 'A claim in the PRD, turned into five steps',
      body: 'Register, KYC, activation, email, then UAT. The PRD promised a developer could go from activation to first successful call in under half an hour; this is that promise written as something someone can follow.',
    }}
  />,
  <Shot
    key="m-auth"
    src="/dp/dp-auth.jpg"
    alt="The authentication guide explaining access tokens and refresh tokens side by side, with a step-by-step walkthrough"
    eyebrow="Auth, before it is demanded"
    icon={<DvIco name="lock" />}
    note={{
      title: 'The question support answered most, answered once',
      body: 'Short-lived access token, long-lived refresh token, and the whole lifecycle including the 401 retry - on a page, instead of in a ticket.',
    }}
  />,
  <Clip
    key="m-try"
    src="/dp/dp-try.mp4"
    eyebrow="Executable, not just readable"
    icon={<DvIco name="play" />}
    note={{
      title: 'Every endpoint runs against the sandbox',
      body: 'Fill the parameters, send, read the real response - here a 400 with the error code and the field that caused it. The mock layer behind UAT was the riskiest ask in the PRD, and this is what it bought.',
    }}
  />,
  <div className="gax-wide" key="m-env">
    <span className="gax-eyebrow">The same page, two environments</span>
    <div className="dv-env">
      <Shot
        src="/dp/dp-uat.jpg"
        alt="An endpoint page in the UAT environment, with a green UAT badge and a uat-api base URL"
        note={{ title: 'UAT', body: 'nothing real happens' }}
      />
      <Shot
        src="/dp/dp-prod.jpg"
        alt="The same endpoint page switched to production, with a red badge and the production base URL"
        note={{ title: 'Production', body: 'live and billable' }}
      />
    </div>
    <p className="gax-note">one switch rewrites every base URL and every curl example on the page, so a sandbox call can never be copied and fired at production by accident.</p>
  </div>,
  <Shot
    key="m-alerts"
    src="/dp/dp-alerts.jpg"
    alt="The API alerts page showing a critical suspended-endpoint notice and a deprecation warning, each with a required action"
    eyebrow="Breaking changes get a surface"
    icon={<DvIco name="alert" />}
    note={{
      title: 'The 180-day promise, given somewhere to live',
      body: 'Suspensions and deprecations each carry the affected module, the action required and a deadline - so an integration finds out before it breaks, not after.',
    }}
  />,
];

const RESULT = [
  <h3 className="gax-big" key="close">
    From the PRD to the frontend.<br /><em className="cp-up">One pair of hands.</em>
  </h3>,
  <div className="gax-wide" key="result">
    <span className="gax-eyebrow">Where it stands</span>
    <div className="inv-result">Revenue in testing with first users - opening segments running in-house NMS tools, and making every integration sticky the moment it&apos;s live.</div>
  </div>,
];

const CHAPTERS = [PROBLEM, PRD, PORTAL, RESULT];

export default function DeveloperPortalCaseStudy({ onPrev, onNext, idx, total }) {
  const secs = useRef([]);
  const at = (i) => (el) => { secs.current[i] = el; };

  return (
    <div className="inv-wrap">
      <CaseRoute refs={secs} labels={DEV_ROUTE} />
      <div className="inv-hero cs-hero">
        <div className="cp-logo-wrap">
          <img className="cp-logo" src="/polarin-logo.png" alt="Polarin, by Lightstorm" />
        </div>
        <h2>A network that provisions <span className="cp-signal">like an API call.</span></h2>
        <p>Polarin had APIs - a bare Swagger page where every test call hit live production, so customers who wanted to automate still called support. I took the developer portal from the first customer conversation to a deployed frontend, one pair of hands at every stage.</p>
        <div className="inv-meta">
          <div><span>My role</span><b>PRD → DX design → frontend</b></div>
          <div><span>Output</span><b>236 endpoints, live portal</b></div>
          <div><span>Status</span><b>In testing · revenue expected</b></div>
        </div>
        <span className="cp-scroll" aria-hidden="true"><i></i>scroll</span>
      </div>

      {CHAPTERS.map((beats, i) => (
        <div ref={at(i)} key={DEV_ROUTE[i]}><Chapter beats={beats} /></div>
      ))}

      <div className="ovl-nav">
        <button type="button" onClick={onPrev}>← Prev</button>
        <span className="ovl-count"><b>{idx + 1}</b> / {total} surfaces</span>
        <button type="button" onClick={onNext}>Next →</button>
      </div>
    </div>
  );
}
