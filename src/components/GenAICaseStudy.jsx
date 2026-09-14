import CaseRoute from '../CaseRoute';
import { useEffect, useRef, useState } from 'react';

/* ---- the material ------------------------------------------------------
   Polarin Bot: a customer-facing assistant for people who manage business
   network connections. What follows is the product definition work - the
   decisions that had to be made before an AI team could build anything. */

/* what the initiative had to be worth. no outcome numbers are claimed here
   because the trial has not reported any - these are the objectives it was
   scoped against, which is a different and more honest thing. */
const BOT_OBJECTIVES = [
  { t: 'Answer without a round-trip', p: 'the customer stops waiting on support for something the data already knows' },
  { t: 'Hand support evidence, not a complaint', p: 'service, event times and readings travel with the request' },
  { t: 'One answer format the team reuses', p: 'a block library - not a new screen for every question' },
];

/* the destination, defined before any feature list */
const BOT_SHAPE = [
  { n: '01', k: 'Understand', t: 'What needs attention?', p: 'a conclusion, already interpreted' },
  { n: '02', k: 'Trust', t: 'Why should I believe it?', p: 'evidence, targets and sources' },
  { n: '03', k: 'Act', t: 'What can I do next?', p: 'a relevant action, ready to review' },
];

/* the discovery artifact: one questionnaire row per real customer question.
   teams filled these in, and the answers became requirements. */
const BOT_ASK = '"What is happening with my ticket?"';
const BOT_ROWS = [
  { k: 'What they need', v: 'Progress and reassurance.' },
  { k: 'Good answer', v: 'Stage · last action · owner · expected resolution.' },
  { k: 'Source owner', v: 'Network operations / support.' },
  { k: 'If vague', v: 'Resolve the ticket or the affected service.' },
];

/* six permitted sources - each one settles a different question, and each
   one had a named owner before engineering started. */
const BOT_SOURCES = [
  { t: 'Service inventory', p: 'which service is this?' },
  { t: 'Metrics & reports', p: 'what actually happened?' },
  { t: 'Service targets', p: 'was it inside the promise?' },
  { t: 'Tickets', p: 'is it already being handled?' },
  { t: 'Alerts & maintenance', p: 'is this a known event?' },
  { t: 'Knowledge base', p: 'can the customer safely resolve it?' },
];

/* the boundary is the product decision, not a disclaimer. an assistant that
   can touch the network is a different risk class entirely. */
const BOT_GATE = [
  { t: 'Change bandwidth', s: 'blocked' },
  { t: 'Promise a credit', s: 'blocked' },
  { t: 'Read my metrics', s: 'allowed' },
  { t: 'Ask for a person', s: 'escalate' },
];

/* the same facts, told at three depths */
const BOT_TONES = [
  { k: 'Business user', p: 'the outcome in plain words, no jargon' },
  { k: 'Network engineer', p: '28 connection drops. 99.21% availability against a 99.70% target.' },
  { k: 'During an outage', p: 'shorter - current status first, detail on request' },
];

/* what happens between the question and the answer */
const BOT_PIPE = [
  { n: '01', t: 'Question', p: 'what is really being asked' },
  { n: '02', t: 'Scope', p: 'which services, which period' },
  { n: '03', t: 'Evidence', p: 'permitted sources only' },
  { n: '04', t: 'Draft', p: 'conclusion first, then the reasoning' },
  { n: '05', t: 'Layout', p: 'pick a saved block structure' },
  { n: '06', t: 'Output', p: 'render it with a next step' },
];

/* the job of the answer decides the shape of the answer */
const BOT_TEMPLATES = [
  { q: 'Compare services', v: 'Comparison table' },
  { q: 'Change over time', v: 'Trend card' },
  { q: 'Ticket status', v: 'Ticket card' },
  { q: 'Share an analysis', v: 'Report card' },
];

/* the fixed order every response is assembled in */
const BOT_CONTRACT = ['Conclusion', 'Evidence', 'Interpretation', 'Action', 'Sources'];

/* when a next step is useful, and when it is pushy */
const BOT_NEXT = [
  { k: 'Suggest', p: 'the data points somewhere, but nothing is broken' },
  { k: 'Show an action', p: 'a detected problem has a fix or a ticket behind it' },
  { k: 'Offer an upgrade', p: 'only when the constraint is genuinely capacity', hard: true },
];

/* the states between the screens - the part a static mockup never covers */
const BOT_STATES = [
  { k: 'Gathering data', p: 'say what it is fetching' },
  { k: 'Missing data', p: 'name what is missing, not a generic error' },
  { k: 'Source unavailable', p: 'answer with what is there, and say what is not' },
  { k: 'Reopened answer', p: 'restore the saved blocks, show the read timestamp' },
];

/* how it was tested - the third row is the one that matters */
const BOT_TESTS = [
  { k: 'Everyday', p: 'performance answers, tickets, reports, follow-ups' },
  { k: 'Edge', p: 'vague requests, partial data, conflicting signals' },
  { k: 'Adversarial', p: 'hidden instructions, unsafe actions, data-access probes', hard: true },
];

const GENAI_ROUTE = ['Define', 'Discover', 'Data', 'Guardrails', 'Behaviour', 'Response', 'Next step', 'Evaluate'];

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

/* one chapter of the story: a run of pinned beats, one idea per screen.
   under reduced motion the whole run stacks and nothing is hidden. */
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

/* ---- the eight chapters ------------------------------------------------ */

const DEFINE = [
  <div className="gax-msg" key="ask">
    <span className="gax-eyebrow">A real message, on a real Tuesday</span>
    <p className="gax-quote">&quot;The Bengaluru one is slow again.&quot;</p>
  </div>,
  <h3 className="gax-big" key="gap">
    Six words from a customer.<br /><em className="cp-rose">Six systems to answer them.</em>
  </h3>,
  <h3 className="gax-big" key="dest">
    I defined the destination<br /><em className="cp-signal">before the feature list.</em>
  </h3>,
  <div className="gax-wide" key="three">
    <span className="gax-eyebrow">Ask once. Understand. Trust. Act.</span>
    <div className="gax-grid3">
      {BOT_SHAPE.map((x) => (
        <div className="gax-card" key={x.n}>
          <span className="gax-n">{x.k}</span>
          <b>{x.t}</b>
          <p>{x.p}</p>
        </div>
      ))}
    </div>
  </div>,
  <div className="gax-wide" key="obj">
    <span className="gax-eyebrow">What it had to be worth</span>
    <div className="gax-grid3">
      {BOT_OBJECTIVES.map((x) => (
        <div className="gax-card" key={x.t}>
          <b>{x.t}</b>
          <p>{x.p}</p>
        </div>
      ))}
    </div>
  </div>,
];

const DISCOVER = [
  <h3 className="gax-big" key="words">
    I asked for the words.<br /><em className="cp-up">Then looked for the need.</em>
  </h3>,
  <div className="gax-wide" key="sheet">
    <span className="gax-eyebrow">One questionnaire row per real question</span>
    <div className="gax-sheet">
      <p className="gax-sheet-q">{BOT_ASK}</p>
      {BOT_ROWS.map((r) => (
        <div className="gax-row" key={r.k}><span>{r.k}</span><b>{r.v}</b></div>
      ))}
    </div>
  </div>,
  <h3 className="gax-big" key="req">
    Customer words became<br /><em className="cp-signal">answer requirements</em> - not a<br />list of chatbot topics.
  </h3>,
  <h3 className="gax-big" key="perfect">
    Customers should not need<br /><em className="cp-up">the perfect question.</em>
  </h3>,
  <div className="gax-wide" key="ambig">
    <span className="gax-eyebrow">When &quot;Bengaluru&quot; matches two services</span>
    <div className="gax-vs">
      <div className="gax-vs-c bad"><span>The usual answer</span><p>&quot;Please clarify.&quot;</p></div>
      <div className="gax-vs-c good"><span>Ours</span><p>&quot;Two services match. DC1 or DC2?&quot;</p></div>
    </div>
    <p className="gax-note">place, symptom and the word &quot;again&quot; are all read as signals - so a clarification offers the likely choices instead of an empty prompt.</p>
  </div>,
];

const DATA = [
  <h3 className="gax-big" key="truth">
    I mapped each answer<br /><em className="cp-signal">to a source of truth.</em>
  </h3>,
  <div className="gax-wide" key="src">
    <span className="gax-eyebrow">Six permitted sources, each settling one question</span>
    <div className="gax-src">
      {BOT_SOURCES.map((x) => (
        <div className="gax-src-c" key={x.t}><b>{x.t}</b><p>{x.p}</p></div>
      ))}
    </div>
  </div>,
  <h3 className="gax-big" key="own">
    Every field had an owner<br />before engineering started.<br />
    <em className="cp-amber">The gaps showed up on a page,<br />not in a demo.</em>
  </h3>,
];

const GUARDRAILS = [
  <h3 className="gax-big" key="never">
    I defined what the bot<br /><em className="cp-rose">must never cross.</em>
  </h3>,
  <div className="gax-wide" key="gate">
    <span className="gax-eyebrow">Four requests, one policy barrier</span>
    <div className="gax-gate">
      {BOT_GATE.map((x) => (
        <span className={`gax-gate-c ${x.s}`} key={x.t}>{x.t}<i>{x.s}</i></span>
      ))}
    </div>
    <p className="gax-note">permitted data only, explicit confirmation for anything that acts, and no financial or network changes - enforced in the integration layer, not in a prompt.</p>
  </div>,
  <h3 className="gax-big" key="esc">
    Ask for a person and it<br /><em className="cp-up">escalates immediately</em> - carrying<br />the conversation and the diagnostics.
  </h3>,
];

const BEHAVIOUR = [
  <h3 className="gax-big" key="good">
    I defined what<br />&quot;<em className="cp-signal">a good answer</em>&quot; sounds like.
  </h3>,
  <div className="gax-wide" key="tone">
    <span className="gax-eyebrow">Same evidence, three depths</span>
    <div className="gax-grid3">
      {BOT_TONES.map((x) => (
        <div className="gax-card" key={x.k}><b>{x.k}</b><p>{x.p}</p></div>
      ))}
    </div>
    <p className="gax-note">calibrated with worked conversations rather than adjectives - the team could test against them.</p>
  </div>,
  <div className="gax-wide" key="pipe">
    <span className="gax-eyebrow">The journey inside every answer</span>
    <div className="gax-pipe2">
      {BOT_PIPE.map((x) => (
        <div className="gax-pipe-c" key={x.n}><i>{x.n}</i><b>{x.t}</b><p>{x.p}</p></div>
      ))}
    </div>
  </div>,
];

const RESPONSE = [
  <h3 className="gax-big" key="layout">
    I matched the layout<br /><em className="cp-signal">to the job of the answer.</em>
  </h3>,
  <div className="gax-wide" key="tpl">
    <span className="gax-eyebrow">A defined block library, not a screen per question</span>
    <div className="gax-tpl">
      {BOT_TEMPLATES.map((x) => (
        <div className="gax-tpl-r" key={x.q}><span>{x.q}</span><i aria-hidden="true">→</i><b>{x.v}</b></div>
      ))}
    </div>
  </div>,
  <div className="gax-wide" key="contract">
    <span className="gax-eyebrow">Every block has a reason to exist</span>
    <ol className="gax-pipe">
      {BOT_CONTRACT.map((x, i) => <li key={x}><i>{i + 1}</i>{x}</li>)}
    </ol>
    <p className="gax-note">one fixed order, so the customer can scan the answer or go deeper without leaving it.</p>
  </div>,
  <div className="gax-wide" key="spec">
    <span className="gax-eyebrow">The contract, rendered</span>
    <div className="gax-answer">
      <div className="gax-answer-h">
        <span>Performance answer</span><i>illustrative data</i>
      </div>
      <b>One Bengaluru port needs attention.</b>
      <div className="gax-answer-b">
        <div className="gax-stat"><strong>99.21%</strong><span>availability · target 99.70%</span></div>
        <p>28 of the month&apos;s 31 connection drops occurred here. The events travel with the support request.</p>
      </div>
      <div className="gax-answer-a">Review an issue with evidence attached <i aria-hidden="true">→</i></div>
      <p className="gax-answer-s">Sources: live metrics · port reports · alerts</p>
    </div>
  </div>,
];

const NEXTSTEP = [
  <h3 className="gax-big" key="when">
    I defined when to suggest.<br /><em className="cp-amber">And when to hold back.</em>
  </h3>,
  <div className="gax-wide" key="next">
    <span className="gax-eyebrow">The context chooses the path</span>
    <div className="gax-grid3">
      {BOT_NEXT.map((x) => (
        <div className={`gax-card${x.hard ? ' hard' : ''}`} key={x.k}><b>{x.k}</b><p>{x.p}</p></div>
      ))}
    </div>
    <p className="gax-note">and one rule that stops the obvious failure: check for an existing ticket before offering to create another.</p>
  </div>,
  <h3 className="gax-big" key="mem">
    &quot;What about Mumbai?&quot;<br /><em className="cp-up">Service, metric and period<br />carry forward.</em>
  </h3>,
  <div className="gax-wide" key="states">
    <span className="gax-eyebrow">I specified the states between the screens</span>
    <div className="gax-states">
      {BOT_STATES.map((x) => (
        <div className="gax-state-c" key={x.k}><b>{x.k}</b><p>{x.p}</p></div>
      ))}
    </div>
  </div>,
];

const EVALUATE = [
  <h3 className="gax-big" key="fb">
    Ask for feedback<br /><em className="cp-signal">where the value is felt</em> - after<br />an answer, after a finished task.
  </h3>,
  <h3 className="gax-big" key="test">
    I made &quot;good enough&quot;<br /><em className="cp-up">something we could test.</em>
  </h3>,
  <div className="gax-wide" key="tests">
    <span className="gax-eyebrow">A working set of 30-40 conversations</span>
    <div className="gax-grid3">
      {BOT_TESTS.map((x) => (
        <div className={`gax-card${x.hard ? ' hard' : ''}`} key={x.k}><b>{x.k}</b><p>{x.p}</p></div>
      ))}
    </div>
    <p className="gax-note">fixed set, nominated reviewers, traceable runs, and a second test after every change.</p>
  </div>,
  <h3 className="gax-big" key="close">
    No production launch yet, and<br />no business metrics claimed.<br />
    <em className="cp-amber">The verdict is still open - and<br />saying so is part of the work.</em>
  </h3>,
];

const CHAPTERS = [DEFINE, DISCOVER, DATA, GUARDRAILS, BEHAVIOUR, RESPONSE, NEXTSTEP, EVALUATE];

export default function GenAICaseStudy({ onPrev, onNext, idx, total }) {
  const wrap = useRef(null);
  const secs = useRef([]);
  const at = (i) => (el) => { secs.current[i] = el; };
  useReveal(wrap);

  return (
    <div className="inv-wrap" ref={wrap}>
      <CaseRoute refs={secs} labels={GENAI_ROUTE} />
      <div className="inv-hero">
        <p className="eyebrow">Polarin · GenAI Initiative</p>
        <h2>I didn&apos;t build the model. I decided what it had to be right about.</h2>
        <p>A customer-facing assistant for people who manage business network connections - scoped, defined and specified before a specialist AI team wrote any of it.</p>
        <div className="inv-meta gac-meta">
          <div><span>My input</span><b>product definition · AI behaviour · response design · frontend spec</b></div>
          <div><span>Built by</span><b>a specialist AI delivery team</b></div>
          <div><span>Status</span><b>a trial - verdict still open</b></div>
        </div>
      </div>

      {CHAPTERS.map((beats, i) => (
        <div ref={at(i)} key={GENAI_ROUTE[i]}><Chapter beats={beats} /></div>
      ))}

      <div className="ovl-nav">
        <button type="button" onClick={onPrev}>← Prev</button>
        <span className="ovl-count"><b>{idx + 1}</b> / {total} surfaces</span>
        <button type="button" onClick={onNext}>Next →</button>
      </div>
    </div>
  );
}
