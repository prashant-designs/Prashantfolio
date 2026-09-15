import { useRef, useState } from 'react';
import CaseRoute from '../CaseRoute';
import { Shot, Clip } from '../CaseMedia';

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

const PIPELINE = ['requirements', 'PRD', 'pricing + volumetrics', 'DX design', 'frontend build', 'deploy'];

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

const LEDGER = [
  { q: 'Where do requirements come from?', a: 'journeys, not wishlists', d: 'two journeys wrote the PRD - a network engineer wiring Grafana, an IT team automating operations. every requirement had to serve one of them, benchmarked against the best developer platforms.' },
  { q: 'UAT data - shared demo or per-customer snapshots?', a: 'shared · phase 1', d: 'shared demo circuits with a nightly reset ship faster and answer every integration question. per-customer production snapshots flagged for phase 2 - richer, not required for launch.' },
  { q: 'Docs - public or behind login?', a: 'public · recommended', d: 'like the platforms developers already trust: docs, reference & Postman collection open to read, so integration code gets written in parallel with procurement. keys still require full Lightstorm onboarding & KYC.' },
  { q: 'What gets metered?', a: 'monitoring only', d: 'charging an ordering API adds friction to revenue - free. high-volume monitoring is a premium usage pattern - metered above the daily pool. unit rate settled with commercial; the model settled here.' },
  { q: 'How big is the pool?', a: 'sized with engineering', d: 'volumetrics worked backwards from gateway capacity and real polling patterns (Grafana scrape intervals × circuits). pool = per-circuit limit × active circuits, recalculated live as the network grows. hard 429 at the cap, midnight reset - predictable for both sides.' },
  { q: 'Key rotation - how long do old keys live?', a: 'overlap window', d: 'old key stays valid through a fixed overlap after rotation, so a live Grafana board never goes dark mid-swap. revoke is instant when a key is compromised.' },
];

const DEV_ROUTE = ['The pipeline', 'What I found', 'The calls I made', 'The heart of it', 'Pricing & volumetrics', 'How it got finalised', 'Then I built it', 'Final result'];

export default function DeveloperPortalCaseStudy({ onPrev, onNext, idx, total }) {
  const secs = useRef([]);
  const at = (i) => (el) => { secs.current[i] = el; };
  const [env, setEnv] = useState('uat');
  const [res, setRes] = useState(null);
  const [circuits, setCircuits] = useState(10);
  const [tier, setTier] = useState(1);

  const send = () => {
    setRes(env === 'uat'
      ? { ok: true, main: 'request validated & simulated', sub: 'no provisioning triggered · circuit untouched · cost ₹0 · UAT resets tonight' }
      : { ok: true, main: 'live change queued', sub: 'real & billable · fires the same notifications as the portal · logged to the activity trail with this key\'s label' });
  };

  const poolLabel = tier === 1 ? 'XX,XXX' : 'X,XX,XXX';
  const barWidth = Math.min(100, (circuits / 50) * 100 * (tier === 1 ? 1 : 1.6));

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
          <div><span>My role</span><b>Requirements → design → build → deploy</b></div>
          <div><span>Output</span><b>236 endpoints, live portal</b></div>
          <div><span>Status</span><b>In testing · revenue expected</b></div>
        </div>
        <span className="cp-scroll" aria-hidden="true"><i></i>scroll</span>
      </div>

      <div className="inv-section" ref={at(0)}>
        <div className="dv-pipe">
          {PIPELINE.map((p, i) => (
            <span key={p} className={`dvp ${i === PIPELINE.length - 1 ? 'last' : ''}`}>
              <b>{p}</b>{i === PIPELINE.length - 1 ? <i>201</i> : <i>200</i>}
            </span>
          ))}
        </div>
      </div>

      <div className="inv-section" ref={at(1)}>
        <div className="inv-step-tag"><i></i>What I found</div>
        <h3 className="dv-h">Requirement collection</h3>
        <p className="dv-p">I shadowed support tickets, sat with CX, sales and engineering, and anchored everything on the two customers who matter: network-ops teams pulling metrics into Grafana or Datadog, and enterprise IT automating orders and changes. The current state, as a developer experiences it:</p>
        <div className="dv-fails">
          {FAILS.map((f) => (
            <div className="dvf" key={f.code}>
              <code>{f.code}</code>
              <span className="dvf-code">{f.status}</span>
              <p>{f.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="inv-section" ref={at(2)}>
        <div className="inv-step-tag"><i></i>The calls I made</div>
        <h3 className="dv-h">The PRD</h3>
        <div className="ivx-principles dv4">
          {PRINCIPLES.map((pr) => (
            <div className="ivp" key={pr.t}><b>{pr.t}</b><p>{pr.p}</p></div>
          ))}
        </div>
      </div>

      <div className="inv-section" ref={at(3)}>
        <div className="inv-step-tag"><i></i>The heart of it</div>
        <h3 className="dv-h">Try the two environments</h3>
        <div className="dv-console" data-env={env}>
          <div className="dvc-top">
            <div className="dvc-toggle">
              <button type="button" className={`dvc-toggle-btn ${env === 'uat' ? 'on' : ''}`} onClick={() => { setEnv('uat'); setRes(null); }}>UAT · sandbox</button>
              <button type="button" className={`dvc-toggle-btn ${env === 'prod' ? 'on' : ''}`} onClick={() => { setEnv('prod'); setRes(null); }}>Production</button>
            </div>
            <span className="dvc-badge">{env === 'uat' ? 'nothing real happens here' : 'live · real & billable'}</span>
          </div>
          <div className="dvc-req">
            <span className="m">POST</span> /v1/circuits/DEL-SIN-10G/bandwidth<br />
            <span className="d">{'{ "bandwidth": '}<span className="v">&quot;20G&quot;</span>{' }'}</span>
          </div>
          <button type="button" className="btn-big dvc-send" onClick={send}>Send request →</button>
          {res ? (
            <div className="dvc-res pop">
              <span className="ok">200 OK</span> · {res.main}<br />
              <span className="d">- {res.sub}</span>
            </div>
          ) : null}
        </div>
        <p className="dv-p dim">the mock layer behind UAT was the riskiest engineering ask in the PRD - and the reason a developer can go from activation email to first successful API call in <b style={{ color: 'var(--text)' }}>under 30 minutes.</b></p>
      </div>

      <div className="inv-section" ref={at(4)}>
        <div className="inv-step-tag"><i></i>Pricing & volumetrics</div>
        <h3 className="dv-h">The framework</h3>
        <p className="dv-p">One principle: <b style={{ color: 'var(--text)' }}>never charge the call that earns us money.</b> Ordering, changes, billing, admin - all free; Lightstorm earns from the services, not the calls. Only monitoring is metered, and only above a daily pool that scales with the customer&apos;s network:</p>
        <div className="dv-vol">
          <div className="dvv-row">
            <label htmlFor="dvCirc">circuits on VISTA</label>
            <input id="dvCirc" type="range" min="1" max="50" value={circuits} onChange={(e) => setCircuits(+e.target.value)} />
            <output>{circuits}</output>
          </div>
          <div className="dvv-row">
            <span>tier</span>
            <div className="dvc-toggle">
              <button type="button" className={`dvc-toggle-btn ${tier === 1 ? 'on' : ''}`} onClick={() => setTier(1)}>Free · base pool</button>
              <button type="button" className={`dvc-toggle-btn ${tier === 2 ? 'on' : ''}`} onClick={() => setTier(2)}>Premium · larger pool</button>
            </div>
          </div>
          <div className="dvv-bar"><i style={{ width: `${barWidth}%` }}></i></div>
          <div className="dvv-out">daily pool <b>{poolLabel} × {circuits}</b> calls / day · org-level, shared across every key & integration</div>
          <p className="dvv-note">beyond the pool: a flat ₹X.XX per additional call - tracked daily, invoiced monthly, one line item. days within the pool cost ₹0 extra. pool resets 00:00 UTC. no carry-over, no bundles, no surprises. <em>(rates masked - framework only)</em></p>
        </div>
      </div>

      <div className="inv-section" ref={at(5)}>
        <div className="inv-step-tag"><i></i>How it got finalised</div>
        <h3 className="dv-h">The decision ledger</h3>
        <p className="dv-p">A PRD is a stack of arguments settled one by one. The ones that shaped this portal - hover each for the call and the why:</p>
        <div className="dv-ledger">
          {LEDGER.map((l) => (
            <div className="li" key={l.q} tabIndex={0}>
              <div className="li-row dvl-row"><span className="li-name">{l.q}</span><b>{l.a}</b></div>
              <div className="li-detail">{l.d}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="inv-section" ref={at(6)}>
        <div className="inv-step-tag"><i></i>Then I built it</div>
        <h3 className="dv-h">DX design → frontend → deploy</h3>
        <p className="dv-p">Designed the developer experience end to end - a 5-step getting-started, executable Swagger against UAT, one-click Postman, module docs with real use cases - then built the frontend myself and shipped it.</p>
        <div className="dv-media">
          <Shot
            variant="flow"
            src="/dp/dp-welcome.jpg"
            alt="The Polarin developer portal landing page, with a search bar reading 236 endpoints and a three-step how-it-works"
            icon={<DvIco name="book" />}
            note={{
              title: 'One front door, 236 endpoints behind it',
              body: 'Get access, authenticate, call the APIs - the three steps of the PRD, made the first thing on the page. The search counts what it covers, because the old Swagger page never told you how much there was.',
            }}
          />
          <Shot
            variant="flow"
            src="/dp/dp-access.jpg"
            alt="The Getting Access page: five numbered steps ending in a note that the first API call takes under thirty minutes"
            icon={<DvIco name="key" />}
            note={{
              title: 'The 30-minute promise, written as five steps',
              body: 'Register, KYC, activation, email, then UAT. The claim in the PRD was a developer going from activation to first successful call in under half an hour; this is that claim turned into a page someone can follow.',
            }}
          />
          <Shot
            variant="flow"
            src="/dp/dp-auth.jpg"
            alt="The authentication guide explaining access tokens and refresh tokens side by side, with a step-by-step walkthrough"
            icon={<DvIco name="lock" />}
            note={{
              title: 'Auth explained before it is demanded',
              body: 'Short-lived access token, long-lived refresh token, and the full lifecycle including the 401 retry - the question support answered most often, answered once on a page instead.',
            }}
          />
          <Clip
            variant="flow"
            src="/dp/dp-try.mp4"
            icon={<DvIco name="play" />}
            note={{
              title: 'Every endpoint is executable, against the sandbox',
              body: 'Fill the parameters, send, and read the real response - here a 400 with the error code and the field that caused it. The mock layer behind UAT was the riskiest ask in the PRD, and this is what it bought.',
            }}
          />
          <div className="dv-env">
            <Shot
              variant="flow"
              src="/dp/dp-uat.jpg"
              alt="An endpoint page in the UAT environment, with a green UAT badge and a uat-api base URL"
              note={{ title: 'UAT', body: 'nothing real happens' }}
            />
            <Shot
              variant="flow"
              src="/dp/dp-prod.jpg"
              alt="The same endpoint page switched to production, with a red badge and the production base URL"
              note={{ title: 'Production', body: 'live and billable' }}
            />
          </div>
          <p className="dv-p dim dv-env-note">One switch rewrites every base URL, every curl example and the badge in the corner - so a developer can never copy a sandbox call and fire it at production by accident.</p>
          <Shot
            variant="flow"
            src="/dp/dp-alerts.jpg"
            alt="The API alerts page showing a critical suspended-endpoint notice and a deprecation warning, each with a required action"
            icon={<DvIco name="alert" />}
            note={{
              title: 'Breaking changes arrive before they break you',
              body: 'Suspensions and deprecations get their own surface, each with the affected module, the action required and a deadline. This is the 180-day promise from the PRD, given somewhere to live.',
            }}
          />
        </div>
        <div className="inv-meta">
          <div><span>Time to first call</span><b>≤ 30 min</b></div>
          <div><span>Swagger</span><b>runs live against UAT</b></div>
          <div><span>Postman</span><b>one-click collection</b></div>
        </div>
      </div>

      <div className="inv-section" ref={at(7)}>
        <div className="inv-step-tag"><i></i>Final result</div>
        <h3 className="plain">What changed</h3>
        <div className="inv-result">Revenue in testing with first users - opening segments running in-house NMS tools, and making every integration sticky the moment it&apos;s live.</div>
      </div>

      <div className="ovl-nav">
        <button type="button" onClick={onPrev}>← Prev</button>
        <span className="ovl-count"><b>{idx + 1}</b> / {total} surfaces</span>
        <button type="button" onClick={onNext}>Next →</button>
      </div>
    </div>
  );
}
