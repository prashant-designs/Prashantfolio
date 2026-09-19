import { useEffect, useRef, useState } from 'react';
import CaseRoute from '../CaseRoute';
import { Shot, Clip } from '../CaseMedia';

/* ---- Polarin Developer Portal -----------------------------------------
   Polarin never set out to sell an API. We built one because the platform
   needed it. Then customers running their own network management systems
   started asking to drive Polarin services from inside their tooling -
   and the decision to productise that is what this case study is about.

   Built as pinned chapters, the same shape GenAICaseStudy uses. */

/* the glyphs the media annotations use. same language as the other case
   studies' icon sets: 24x24, no fill, currentColor stroke at 1.6, round
   caps and joins. */
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

/* what customers actually asked for. they were not asking for an API -
   they were asking to stop leaving the tool they already live in. */
const ASKS = [
  { n: '01', t: 'Pull our metrics into their NMS', p: 'network-ops teams already watch one screen all day. they wanted Polarin performance on it, not in another tab.' },
  { n: '02', t: 'Place and change orders from code', p: 'provision a port, change a bandwidth, run a MACD - without a human opening the portal to do it.' },
  { n: '03', t: 'Everything the portal can do', p: 'parity, not a convenient subset. a partial API just moves the dead end somewhere less obvious.' },
];

/* the four calls that turned platform plumbing into something sellable */
const DECISIONS = [
  { t: 'Free to call', p: 'no per-call charge. Lightstorm earns from the services, not the requests - so nothing we charge for discourages the integration we want.' },
  { t: 'A ceiling, not a bill', p: 'limits sit at the gateway so heavy polling cannot choke the platform. nobody has to model a cost before they integrate.' },
  { t: 'Both surfaces stay in sync', p: 'an order placed by API still appears on the portal and still sends the email.' },
  { t: 'A UAT twin', p: 'demo circuits, a mock write layer, a nightly reset, responses field-identical to production. nothing real ever happens.' },
];

/* a product definition is arguments settled one by one. these are the ones
   that decided what the thing actually was. */
const LEDGER = [
  { q: 'Where did the requirement come from?', a: 'customers, not a roadmap', d: 'teams already running an in-house NMS asked for it directly. the API existed as platform plumbing long before that - the product was the decision to sell it, and that decision came from demand rather than from a planning cycle.' },
  { q: 'Charge per call?', a: 'no - free', d: 'metering an ordering API puts friction in front of our own revenue. calls are free and the ceiling sits at the gateway instead, so a customer never has to model a bill before they integrate.' },
  { q: 'API-only, or both surfaces?', a: 'both, always in sync', d: 'an automated order still lands on the portal and still triggers the email. the alternative splits a customer\u2019s own team in two - the engineer sees the truth, their colleagues see a stale screen.' },
  { q: 'Docs - public or behind login?', a: 'public', d: 'like the platforms developers already trust: reference and examples open to read, so integration code gets written in parallel with procurement. keys still require full onboarding and KYC.' },
  { q: 'UAT data - shared or per-customer?', a: 'shared \u00b7 phase 1', d: 'shared demo circuits with a nightly reset answer every integration question and ship far faster. per-customer snapshots are richer, and were not required to launch.' },
];

/* how it got built, and why that mattered as much as what got built */
const DELIVERY = [
  { t: 'Figma', p: 'the structure and the developer experience - navigation, page anatomy, the states an endpoint can be in' },
  { t: 'Claude Code', p: 'the entire frontend, written against that structure by me rather than queued for an engineering slot' },
  { t: 'Claude', p: 'the getting-started steps, module docs and reference copy - drafted fast, then edited for accuracy' },
  { t: 'Git', p: 'the repo handed to a developer, and the engineering team took it from there for integration' },
];

const DEV_ROUTE = ['The pull', 'The product', 'The portal', 'How it shipped', 'Result'];

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

/* ---- the five chapters ------------------------------------------------ */

const PULL = [
  <h3 className="gax-big" key="plumbing">
    We built an API to run<br />our own platform.<br />
    <em className="cp-signal">Customers asked to use it.</em>
  </h3>,
  <div className="gax-wide" key="asks">
    <span className="gax-eyebrow">What they actually asked for</span>
    <div className="gax-grid3">
      {ASKS.map((a) => (
        <div className="gax-card" key={a.n}>
          <span className="gax-n">{a.n}</span>
          <b>{a.t}</b>
          <p>{a.p}</p>
        </div>
      ))}
    </div>
    <p className="gax-note">every one of them already ran an in-house NMS. they were not asking for an API - they were asking to stop leaving the screen they already watch.</p>
  </div>,
  <h3 className="gax-big" key="product">
    So we stopped treating it as plumbing<br />and <em className="cp-up">made it a product</em> - a new way<br />to sell what we already had.
  </h3>,
];

const PRODUCT = [
  <div className="gax-wide" key="decisions">
    <span className="gax-eyebrow">The four calls that defined it</span>
    <div className="ivx-principles dv4">
      {DECISIONS.map((d) => (
        <div className="ivp" key={d.t}><b>{d.t}</b><p>{d.p}</p></div>
      ))}
    </div>
  </div>,
  <h3 className="gax-big" key="free">
    Free to call.<br /><em className="cp-up">The limit sits at the gateway,</em><br />not on the invoice.
  </h3>,
  <div className="gax-wide" key="sync">
    <span className="gax-eyebrow">The decision I would defend hardest</span>
    <div className="dv-sync">
      <div className="dv-sync-c"><span>An order placed by API</span></div>
      <i aria-hidden="true">→</i>
      <div className="dv-sync-c on"><span>appears on the portal</span></div>
      <i aria-hidden="true">+</i>
      <div className="dv-sync-c on"><span>and in their inbox</span></div>
    </div>
    <p className="gax-note">the engineer who automates it is rarely the only person who needs to see it - so adoption spreads past the one person who wrote the integration.</p>
  </div>,
  <div className="gax-wide" key="ledger">
    <span className="gax-eyebrow">A product definition is arguments, settled one by one</span>
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
      body: 'Get access, authenticate, call the APIs. The search counts what it covers, because a customer sizing up an integration needs to know how much is there before they commit to it.',
    }}
  />,
  <Shot
    key="m-access"
    src="/dp/dp-access.jpg"
    alt="The Getting Access page: five numbered steps ending in a note that the first API call takes under thirty minutes"
    eyebrow="Zero to first call"
    icon={<DvIco name="key" />}
    note={{
      title: 'Under 30 minutes, written as five steps',
      body: 'Register, KYC, activation, email, then UAT. The faster someone reaches a working call, the less likely the integration stalls in procurement - so the path had to be a page, not a conversation.',
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
      body: 'Fill the parameters, send, read the real response - here a 400 with the error code and the field that caused it. The UAT twin was the riskiest thing I asked engineering for, and this is what it bought.',
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
      title: 'A live integration finds out before it breaks',
      body: 'Suspensions and deprecations each carry the affected module, the action required and a deadline. Once a customer automates against you, a silent change is an outage in their tooling, not yours.',
    }}
  />,
];

const SHIPPED = [
  <div className="gax-wide" key="tools">
    <span className="gax-eyebrow">Four tools, one pair of hands</span>
    <div className="ivx-principles dv4">
      {DELIVERY.map((d) => (
        <div className="ivp" key={d.t}><b>{d.t}</b><p>{d.p}</p></div>
      ))}
    </div>
  </div>,
  <h3 className="gax-big" key="time">
    The frontend never waited<br />for an engineering slot.<br />
    <em className="cp-up">Their time went to integration,</em><br />which is where it was needed.
  </h3>,
];

const RESULT = [
  <h3 className="gax-big" key="close">
    From a customer request<br />to a sellable product.<br /><em className="cp-up">One pair of hands.</em>
  </h3>,
  <div className="gax-wide" key="result">
    <span className="gax-eyebrow">Where it stands</span>
    <div className="inv-result">Revenue in testing with first users - opening a segment that runs its own NMS tooling, and making every integration sticky the moment it&apos;s live.</div>
  </div>,
];

const CHAPTERS = [PULL, PRODUCT, PORTAL, SHIPPED, RESULT];

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
        <h2>The API was plumbing. <span className="cp-signal">We made it a product.</span></h2>
        <p>Polarin built an API because the platform needed one. Then customers running their own network management systems asked to place orders and pull metrics from inside their tooling - so we productised it. I defined what that product had to be, designed the developer experience, and built the frontend myself.</p>
        <div className="inv-meta">
          <div><span>My role</span><b>Product definition → DX design → frontend</b></div>
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
