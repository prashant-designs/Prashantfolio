import { useEffect, useRef } from 'react';

/* ---- tiny line-icon set (no emoji, matches the site's stroke weight) ---- */
const ICONS = {
  person: <><circle cx="12" cy="8" r="3.4" /><path d="M5.5 20c0-3.5 2.9-6 6.5-6s6.5 2.5 6.5 6" /></>,
  chat: <path d="M4 5.5h16v10H9.5l-5.5 4z" />,
  calc: <><rect x="5" y="3.5" width="14" height="17" rx="2.5" /><path d="M8.5 8h7M8.5 12h2M13 12h2.5M8.5 16h2M13 16h2.5" /></>,
  clock: <><circle cx="12" cy="12" r="8" /><path d="M12 7.5V12l3 2" /></>,
  spark: <path d="M12 3.2l1.9 5.4 5.4 1.9-5.4 1.9L12 17.8l-1.9-5.4L4.7 10.5l5.4-1.9z" />,
  list: <><rect x="4" y="4.5" width="16" height="15" rx="2.5" /><path d="M8 9.5h8M8 13h8M8 16.5h4.5" /></>,
  check: <path d="M4.5 12.5l4.5 4.5L19.5 6.5" />,
  gauge: <><path d="M4 16.5a8 8 0 1 1 16 0" /><path d="M12 16.5l4.2-4.7" /><path d="M4 16.5h3M17 16.5h3" /></>,
  ticket: <><path d="M4.5 6.5h15v4a2 2 0 0 0 0 4v3h-15v-3a2 2 0 0 0 0-4z" /><path d="M9.5 10h6M9.5 14h4" /></>,
};

function Ico({ name }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

/* today, a person works the answer out by hand */
const MANUAL = [
  { i: 'person', t: 'the customer says what they need', c: ['from here', 'to there', 'how fast', 'how reliable', 'how much capacity'] },
  { i: 'chat', t: 'a sales person takes it away' },
  { i: 'calc', t: 'route, service level and price - worked out by hand' },
  { i: 'clock', t: 'the answer comes back later' },
];

/* the two use cases that sat behind the flagship */
const USE_CASES = [
  {
    i: 'gauge',
    t: 'the dashboard, in plain English',
    from: 'a screen full of network numbers',
    to: 'a line underneath saying what that number means for the business, and why it should matter to you today',
  },
  {
    i: 'ticket',
    t: 'the first reply, already written',
    from: 'a customer attaches a screenshot to a support ticket',
    to: 'the system checks it against the live network and drafts the reply before a human has opened the ticket',
  },
];

/* the two-lane device: my decisions vs what the delivery team built */
const LANES = [
  { me: 'which problem was worth pointing AI at', them: 'the model that produces the answers' },
  { me: 'the three use cases, and where each one stops', them: 'the plumbing that feeds it the right information' },
  { me: 'what counts as a good answer', them: 'the wiring into live network and commercial data' },
  { me: 'the ways we would try to break it, written down first', them: 'the environment it runs in' },
  { me: 'what stays off-limits while it is only a trial', them: 'the record it keeps of every single run' },
  { me: 'how we decide go, change, or stop', them: 'the build we test against' },
];

/* the acceptance criteria - the term on the left, what it actually means on the right */
const TRANSLATED = [
  { j: 'retrieval relevance', q: 'is this actually a good answer?', a: 'people who know the subject score it on a scale - because a good answer is a judgement call, not a tick box' },
  { j: 'hallucination test', q: 'does it admit when it does not know?', a: 'we asked it things it could not possibly know, on purpose, to see if it made something up' },
  { j: 'workflow completion', q: 'does it finish the job?', a: 'all the way to the end - not almost-done and handed back to a person halfway' },
  { j: 'prompt injection', q: 'what happens when someone tries to trick it?', a: 'we tried first - asking it things outside its job, telling it to ignore its own instructions' },
  { j: 'POC-grade latency', q: 'is it quick enough to work with?', a: 'quick enough for one person testing it - deliberately not a promise about launch day' },
  { j: 'traceability', q: 'can we see exactly what it did?', a: 'what it was asked, what it looked up, what it did, what it said - all recorded, and spot-checked by hand' },
];

const INSIDE = ['a small group of internal testers', 'test data only', 'one clearly bounded job per use case'];
const OUTSIDE = ['real customers', 'anything sensitive', 'launch-grade access control', 'a promise about speed at scale'];

const VERDICTS = [
  { k: 'a', t: 'it works', p: 'take it forward as it stands' },
  { k: 'b', t: 'it works, with changes', p: 'the idea holds - the build needs work' },
  { k: 'c', t: 'it does not work', p: 'say so early, and stop spending' },
];

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

export default function GenAICaseStudy({ onPrev, onNext, idx, total }) {
  const wrap = useRef(null);
  useReveal(wrap);

  return (
    <div className="inv-wrap" ref={wrap}>
      <div className="inv-hero">
        <p className="eyebrow">Polarin · GenAI Initiative</p>
        <h2>I didn&apos;t build the model. I decided what it had to be right about.</h2>
        <p>In 2026 I scoped Polarin&apos;s first GenAI initiative - three customer-facing use cases, built with a specialist AI delivery team.</p>
        <div className="inv-meta gac-meta">
          <div><span>My input</span><b>the use cases · what &quot;good&quot; means · the go / no-go</b></div>
          <div><span>Built by</span><b>a specialist AI delivery team</b></div>
          <div><span>Status</span><b>a live trial - verdict still open</b></div>
        </div>
      </div>

      {/* ---------- the flagship, as a before / after ---------- */}
      <div className="inv-section">
        <div className="inv-step-tag"><i></i>The flagship</div>
        <h3 className="plain">Buy Journey AI</h3>
        <p className="gac-lead">buying a network link starts with a conversation</p>

        <div className="gac-ba gac-rv" data-rv>
          <div className="gac-pane now">
            <div className="gac-pane-h"><b>today</b> · a person works it out</div>
            {MANUAL.map((s) => (
              <div className="gac-step" key={s.t}>
                <i><Ico name={s.i} /></i>
                <div>
                  <b>{s.t}</b>
                  {s.c ? (
                    <div className="gac-chips">{s.c.map((c) => <span key={c}>{c}</span>)}</div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          <div className="gac-pane ai">
            <div className="gac-pane-h"><b>the use case I scoped</b> · the platform answers</div>
            <div className="gac-step">
              <i><Ico name="person" /></i>
              <div><b>the customer says the same thing</b></div>
            </div>
            <div className="gac-step">
              <i><Ico name="spark" /></i>
              <div><b>no waiting for a person to work it out</b></div>
            </div>
            <div className="gac-step">
              <i><Ico name="list" /></i>
              <div>
                <b>it hands back the routes worth buying</b>
                <div className="gac-rec">
                  <span className="gac-rec-tag">illustration</span>
                  <div className="gac-opt top"><b>best fit</b><em><i style={{ width: '92%' }}></i></em></div>
                  <div className="gac-opt"><b>cheaper, slower</b><em><i style={{ width: '68%' }}></i></em></div>
                  <div className="gac-opt"><b>backup route</b><em><i style={{ width: '44%' }}></i></em></div>
                </div>
              </div>
            </div>
            <div className="gac-step">
              <i><Ico name="check" /></i>
              <div><b>service level, price and the alternatives - in the same breath</b></div>
            </div>
          </div>
        </div>

        <div className="gac-fuel gac-rv" data-rv>
          <span>what was actually booked before</span>
          <em>+</em>
          <span>real commercial history</span>
        </div>
        <p className="dv-p dim">so it leans towards what customers actually buy - not everything that is technically possible.</p>
      </div>

      {/* ---------- the other two ---------- */}
      <div className="inv-section">
        <div className="inv-step-tag"><i></i>Two more, same bar</div>
        <h3 className="plain">Not the only one</h3>
        <div className="gac-uc gac-rv" data-rv>
          {USE_CASES.map((u) => (
            <div className="gac-card" key={u.t}>
              <i><Ico name={u.i} /></i>
              <b>{u.t}</b>
              <div className="gac-swap">
                <p><span>today</span>{u.from}</p>
                <p className="to"><span>instead</span>{u.to}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- the device: two lanes of work ---------- */}
      <div className="inv-section">
        <div className="inv-step-tag"><i></i>Who did what</div>
        <h3 className="plain">Two different jobs, running side by side</h3>
        <div className="gac-lanes gac-rv" data-rv>
          <div className="gac-lane-h">
            <span className="mine">what I decided</span>
            <em>vs</em>
            <span className="theirs">what the delivery team built</span>
          </div>
          {LANES.map((l) => (
            <div className="gac-row" key={l.me}>
              <div className="gac-cell mine">{l.me}</div>
              <div className="gac-spine" aria-hidden="true"></div>
              <div className="gac-cell theirs">{l.them}</div>
            </div>
          ))}
        </div>
        <p className="dv-p dim">a product manager&apos;s contribution to an AI feature isn&apos;t the model. it&apos;s what it&apos;s for, what good looks like, and whether it has earned anyone&apos;s trust yet.</p>
      </div>

      {/* ---------- acceptance criteria, de-jargoned ---------- */}
      <div className="inv-section">
        <div className="inv-step-tag"><i></i>Defining done</div>
        <h3 className="plain">What does &quot;working&quot; mean, when it never answers the same way twice?</h3>
        <p className="gac-lead">the words this usually gets written in - and what I was actually asking</p>
        <div className="gac-tr gac-rv" data-rv>
          {TRANSLATED.map((t, i) => (
            <div className="gac-trr" key={t.j}>
              <span className="gac-jarg" style={{ animationDelay: `${120 + i * 90}ms` }}>{t.j}</span>
              <em className="gac-arrow" aria-hidden="true">→</em>
              <div>
                <b className="gac-q">{t.q}</b>
                <p className="gac-a">{t.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- the fence: what was deliberately left out ---------- */}
      <div className="inv-section">
        <div className="inv-step-tag"><i></i>Drawing the line</div>
        <h3 className="plain">Small on purpose</h3>
        <div className="gac-fence gac-rv" data-rv>
          <div className="gac-in">
            <span className="gac-in-tag">inside the trial</span>
            <div className="gac-fl">
              {INSIDE.map((x) => <span key={x}><i>✓</i>{x}</span>)}
            </div>
          </div>
          <div className="gac-out">
            <span className="gac-out-tag">deliberately outside it</span>
            <div className="gac-fl">
              {OUTSIDE.map((x) => <span key={x}><i>✕</i>{x}</span>)}
            </div>
          </div>
        </div>
        <p className="dv-p dim">a trial&apos;s safety rails are not a finished product&apos;s safety rails. saying that out loud early is how trust stays honest later.</p>
      </div>

      {/* ---------- the ending: a three-way call, still open ---------- */}
      <div className="inv-section">
        <div className="inv-step-tag"><i></i>How it ends</div>
        <h3 className="plain">Not a yes or a no</h3>
        <div className="gac-verdict gac-rv" data-rv>
          {VERDICTS.map((v) => (
            <div className={`gac-v ${v.k}`} key={v.t}>
              <i></i>
              <b>{v.t}</b>
              <p>{v.p}</p>
            </div>
          ))}
        </div>
        <div className="gac-open gac-rv" data-rv>
          <span>where it stands</span>
          still being tested - no verdict yet. the point was never the demo. it&apos;s that the call gets made on the evidence above.
        </div>
      </div>

      <div className="ovl-nav">
        <button type="button" onClick={onPrev}>← Prev</button>
        <span className="ovl-count"><b>{idx + 1}</b> / {total} surfaces</span>
        <button type="button" onClick={onNext}>Next →</button>
      </div>
    </div>
  );
}
