import { Fragment, useEffect, useRef, useState } from 'react';

/* ---- line-icon set for this case study ----
   same language as GenAICaseStudy's ICONS / CurrentProject's .tl-cs-icon svgs:
   24x24 viewBox, no fill, stroke: currentColor at 1.6, round caps and joins, so
   every glyph inherits the surrounding text colour and flips with the theme.
   no filled shapes, no emoji, no external icon set. */
const ICONS = {
  /* people, money, speed, shipping - the four things the shift changed */
  users: <><circle cx="9.2" cy="8" r="3" /><path d="M3.5 19.5c0-3.1 2.6-5.3 5.7-5.3s5.7 2.2 5.7 5.3" /><path d="M15.6 6.2a2.9 2.9 0 0 1 0 5.7" /><path d="M17.2 14.5c2 .7 3.3 2.5 3.3 5" /></>,
  receipt: <><path d="M6 3.5h12v17l-2-1.4-2 1.4-2-1.4-2 1.4-2-1.4-2 1.4z" /><path d="M9 8.5h6M9 12h6M9 15.5h3.5" /></>,
  bolt: <path d="M13.6 3L6.6 13.3h4.2L10 21l7-10.5h-4.2z" />,
  launch: <><path d="M12 3.2c2.4 2.1 3.7 4.9 3.7 8.2 0 2-.5 3.9-1.4 5.6H9.7c-.9-1.7-1.4-3.6-1.4-5.6 0-3.3 1.3-6.1 3.7-8.2z" /><circle cx="12" cy="9.8" r="1.6" /><path d="M9.7 17.6l-1.9 3.2M14.3 17.6l1.9 3.2" /></>,

  /* the four costs of the old system */
  code: <path d="M9.2 7.4L4.5 12l4.7 4.6M14.8 7.4L19.5 12l-4.7 4.6" />,
  train: <><rect x="5" y="4.5" width="14" height="10.5" rx="2.5" /><path d="M5 10.2h14" /><circle cx="9" cy="17.8" r="1.4" /><circle cx="15" cy="17.8" r="1.4" /><path d="M3 20.8h18" /></>,
  ceiling: <><path d="M3.5 5h17" /><path d="M12 20.5V9.4" /><path d="M8.3 13.1L12 9.4l3.7 3.7" /></>,
  unsaid: <><path d="M4.5 5.5h15v10h-8.2l-4.3 3.3v-3.3H4.5z" /><path d="M4.8 19.8L19.2 4.8" /></>,

  /* the bet: a bolted-on assistant, or the bottleneck itself */
  chat: <path d="M4 5.5h16v10H9.5l-5.5 4z" />,
  bottleneck: <path d="M3.5 4.5h17l-6.4 7.4v5.4L9.9 20v-8.1z" />,

  /* the six jobs AI took over */
  migrate: <><rect x="3" y="6.2" width="6.4" height="11.6" rx="1.6" /><rect x="14.6" y="6.2" width="6.4" height="11.6" rx="1.6" /><path d="M10.6 12h3.2" /><path d="M12.3 10.3L14 12l-1.7 1.7" /></>,
  tree: <><rect x="9" y="3.5" width="6" height="4.4" rx="1.3" /><path d="M12 7.9v3.1M5.6 11h12.8M5.6 11v4.6M18.4 11v4.6" /><rect x="3.1" y="15.6" width="5" height="4.4" rx="1.3" /><rect x="15.9" y="15.6" width="5" height="4.4" rx="1.3" /></>,
  pen: <><path d="M4 20.3h16" /><path d="M17.6 4.4l2 2-9.7 9.7-2.7.7.7-2.7z" /></>,
  notes: <><path d="M6.5 3.5h8L18 7v13.5H6.5z" /><path d="M14.5 3.5V7H18" /><path d="M9.2 11h5.6M9.2 14.3h5.6M9.2 17.6h3.2" /></>,
  alert: <><path d="M12 4l8.6 15H3.4z" /><path d="M12 10v4.3" /><path d="M12 17.1v.1" /></>,
  gap: <><path d="M3.5 12h4.3M16.2 12h4.3" /><path d="M7.8 8.6v6.8M16.2 8.6v6.8" /><path d="M8.6 12h6.8" strokeDasharray="1.8 2.8" /></>,

  /* the three rules retrieval has to clear */
  anchor: <><circle cx="12" cy="4.9" r="2" /><path d="M12 6.9v13.4" /><path d="M7.7 10h8.6" /><path d="M4.6 14.3a7.4 7.4 0 0 0 14.8 0" /></>,
  link: <><path d="M9.9 14.1l4.2-4.2" /><path d="M13.2 7.7l1.4-1.4a3.4 3.4 0 0 1 4.8 4.8l-1.4 1.4" /><path d="M10.8 16.3l-1.4 1.4a3.4 3.4 0 0 1-4.8-4.8l1.4-1.4" /></>,
  question: <><circle cx="12" cy="12" r="8.4" /><path d="M9.9 9.7a2.2 2.2 0 1 1 3.2 2.1c-.7.4-1.1 1-1.1 1.8" /><path d="M12 16.4v.1" /></>,

  /* the human gate every job ends at */
  check: <><circle cx="12" cy="12" r="8.4" /><path d="M8.2 12.3l2.7 2.7 4.9-5.4" /></>,

  /* a required text field, an open guide, and an empty meter */
  text: <path d="M6 5.5h12M12 5.5v13M9 18.5h6" />,
  book: <><path d="M4 5.2c2.6-1.2 5.4-1.2 8 0v13.6c-2.6-1.2-5.4-1.2-8 0z" /><path d="M20 5.2c-2.6-1.2-5.4-1.2-8 0v13.6c2.6-1.2 5.4-1.2 8 0z" /></>,
  nogauge: <><path d="M4 16.6a8 8 0 1 1 16 0" /><path d="M4 16.6h2.6M17.4 16.6H20" /><path d="M10.2 12.6h3.6" strokeDasharray="1.8 2.6" /></>,
};

function Ico({ name }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

/* a chip: icon in a recessed square. one shape, two sizes. */
function Chip({ name, lg }) {
  return <i className={lg ? 'kbx-ic lg' : 'kbx-ic'}><Ico name={name} /></i>;
}

/* copy written as [before, the load-bearing phrase, after] so the one phrase
   that IS the point is emphasised in the markup rather than left for the
   reader to find in a paragraph */
function Split({ parts }) {
  return <>{parts[0]}<b className="kbx-hl">{parts[1]}</b>{parts[2]}</>;
}

/* the four things that actually changed, as old → new pairs */
const SWAPS = [
  { i: 'users', from: 'only developers could publish', to: 'anyone on the product team' },
  { i: 'receipt', from: 'an edit meant a vendor invoice', to: 'no invoice, no queue' },
  { i: 'bolt', from: 'live on the next deploy window', to: 'live in minutes' },
  { i: 'launch', from: 'a launch waited on the docs', to: 'the docs ship with the launch' },
];

/* the old system, framed as cost and dependency - not "the pages were stale".
   each one leads with the consequence and keeps the cause as the small line
   underneath, so the grid can be read at a glance instead of in full */
const COSTS = [
  {
    i: 'code',
    code: 'engineers-as-CMS',
    status: 'cost',
    hl: 'every documentation change competed with the roadmap for engineering time',
    body: 'only a developer could publish - a real line item, not an inconvenience',
  },
  {
    i: 'train',
    code: 'content-on-the-deploy-train',
    status: 'latency',
    hl: 'a one-word correction waited on a deploy window',
    body: 'the docs shipped the way the product shipped',
  },
  {
    i: 'ceiling',
    code: 'scale = headcount',
    status: 'ceiling',
    hl: 'the only lever left was money',
    body: 'more coverage meant hiring a writer or paying a vendor per page',
  },
  {
    i: 'unsaid',
    code: 'release-notes.optional',
    status: 'drift',
    hl: 'customers heard about features from support instead of from us',
    body: 'notes got written when someone had time',
  },
];

/* the bet: the obvious move, and the one I made instead */
const BET = [
  {
    i: 'chat',
    k: 'no',
    mark: '✕',
    verdict: 'not this',
    n: 'the obvious move',
    title: 'Bolt a chatbot onto the wiki',
    body: [
      'Visible, demo-friendly, and useless. The pages underneath are still stale and still need a developer to change - so the assistant ',
      'answers confidently from content nobody could fix',
      '. It looks like progress and moves nothing.',
    ],
  },
  {
    i: 'bottleneck',
    k: 'yes',
    mark: '✓',
    verdict: 'this',
    n: 'what I did instead',
    title: 'Point AI at the bottleneck',
    body: [
      'Use AI for ',
      'the internal jobs that made a human a dependency',
      ' - migrating, structuring, drafting, editing, spotting gaps. Ship the customer-facing assistant last, once retrieval was worth trusting.',
    ],
  },
];

/* the labour, not the feature. every job ends at a human approval. */
const JOBS = [
  { i: 'migrate', job: 'migration', ai: 'reads the old wiki and rewrites each page into the new structure', was: 'a manual re-type, page by page' },
  { i: 'tree', job: 'structure & tags', ai: 'proposes where a page belongs and how it gets labelled', was: 'a taxonomy argument in a meeting' },
  { i: 'pen', job: 'first drafts', ai: 'turns a PRD or a ticket into a draft article', was: 'a blank page, or an outsourced writer' },
  { i: 'notes', job: 'release notes', ai: 'drafts the note from what actually shipped', was: 'a note that often never got written' },
  { i: 'alert', job: 'the editing pass', ai: 'flags contradictions, dead links and stale screenshots', was: 'a review nobody had time for' },
  { i: 'gap', job: 'finding its own gaps', ai: 'surfaces the questions the docs answer badly, or not at all', was: 'waiting for a support ticket to tell us' },
];

/* what retrieval has to clear before answering is a job AI is allowed to do */
const TRUST = [
  { i: 'anchor', t: 'grounded', p: ['it answers only from ', 'published, approved content', " - not from the model's general knowledge, and never from a draft"] },
  { i: 'link', t: 'cited', p: ['every answer ', 'points at the pages it came from', ', so a reader can check the source instead of trusting the tone'] },
  { i: 'question', t: 'willing to fail', p: ['no confident guessing. ', 'when it is not sure it says so', ', and files the question as a documentation gap'] },
];

/* release notes, as a pipeline that steps through itself */
const PIPE = [
  { i: 'text', t: 'required at ticket time' },
  { i: 'launch', t: 'version ships' },
  { i: 'pen', t: 'AI drafts the note' },
  { i: 'check', t: 'human approves' },
  { i: 'bolt', t: 'live everywhere', n: 'minutes', last: true },
];

/* who had to act, for four ordinary changes */
const ACTS = [
  { i: 'text', t: 'fix a typo', before: 'a developer, on the next deploy', now: 'me, in minutes' },
  { i: 'book', t: 'add a guide', before: 'a vendor queue, billed per page', now: 'drafted, approved, live the same day' },
  { i: 'notes', t: 'write release notes', before: 'whoever remembered, if anyone did', now: 'drafted from what shipped, approved by a human' },
  { i: 'launch', t: 'launch a feature', before: 'the docs were the last blocker', now: 'the docs go out with it' },
];

/* the closing result, as three consequences of one sentence */
const RESULT = [
  { i: 'users', t: 'publishing moved to the people who own the product' },
  { i: 'bolt', t: 'a fix that used to wait on a deploy window goes live in minutes' },
  { i: 'notes', t: 'a release now drafts its own notes instead of being remembered after the fact' },
];

/* reveal-on-scroll for [data-rv] children, scoped to the overlay panel - the
   same hook GenAICaseStudy uses, kept local because a component file on this
   site only exports its component (see react/only-export-components) */
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

export default function KnowledgeBaseCaseStudy({ onPrev, onNext, idx, total }) {
  const wrap = useRef(null);
  useReveal(wrap);
  /* which job card has been opened by click / keyboard - hover and focus reveal
     the same line without it, and touch devices get it unconditionally */
  const [openJob, setOpenJob] = useState(null);
  /* which side of the independence matrix is emphasised. "now" by default, so
     the page never depends on the reader touching it to make its point */
  const [side, setSide] = useState('now');

  return (
    <div className="inv-wrap" ref={wrap}>
      <div className="inv-hero">
        <p className="eyebrow">Polarin · Knowledge Base</p>
        <h2>We didn&apos;t add AI to the docs. AI is why the docs no longer need engineers.</h2>
        <p>Polarin&apos;s knowledge base lived on an external wiki, and <b className="kbx-hl">only a developer could publish to it</b> - so every typo, every guide, every release note queued behind someone else&apos;s sprint. I&apos;m rebuilding it in-house. The interesting part isn&apos;t the assistant on the front; it&apos;s that AI took over the work that made engineers the bottleneck.</p>
        <div className="inv-meta">
          <div><span>My role</span><b>PM + designer, end to end</b></div>
          <div><span>Output</span><b>In-house, AI-assisted knowledge base</b></div>
          <div><span>Status</span><b>Being built - assistant ships last</b></div>
        </div>
      </div>

      {/* ---------- the shift, as four before → after tiles ---------- */}
      <div className="inv-section">
        <div className="inv-step-tag"><i></i>The shift</div>
        <h3 className="plain">Same docs. Different dependency.</h3>
        <div className="kbx-swaps kbx-rv" data-rv>
          {SWAPS.map((s) => (
            <div className="kbx-swap" key={s.to}>
              <Chip name={s.i} />
              <s>{s.from}</s>
              <b>{s.to}</b>
            </div>
          ))}
        </div>
        <p className="dv-p dim">none of that came from a better wiki. it came from moving the work that needed a developer onto something that doesn&apos;t.</p>
      </div>

      {/* ---------- the cost, as four labelled dependencies ---------- */}
      <div className="inv-section">
        <div className="inv-step-tag"><i></i>The real cost</div>
        <h3 className="dv-h">The wiki wasn&apos;t slow. It was expensive.</h3>
        <p className="dv-p">Out-of-date pages are the symptom everyone talks about. The actual problem was structural - <b className="kbx-hl">the documentation had a standing dependency on the one team you least want to interrupt</b>:</p>
        <div className="kbx-costs kbx-rv" data-rv>
          {COSTS.map((c) => (
            <div className="kbx-cost" key={c.code}>
              <Chip name={c.i} />
              <div className="kbx-cost-m">
                <code>{c.code}</code>
                <span className="kbx-tag">{c.status}</span>
              </div>
              <b>{c.hl}</b>
              <p>{c.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- the bet: one option struck out, one taken ---------- */}
      <div className="inv-section">
        <div className="inv-step-tag"><i></i>The bet</div>
        <h3 className="plain">AI as a feature, or AI as <span>labour</span></h3>
        <div className="kbx-bet kbx-rv" data-rv>
          {BET.map((b) => (
            <div className={`kbx-b ${b.k}`} key={b.n}>
              <div className="kbx-b-h">
                <Chip name={b.i} lg />
                <span className="kbx-b-n">{b.n}</span>
              </div>
              <h4>{b.title}</h4>
              <p><Split parts={b.body} /></p>
              <span className="kbx-b-v"><em aria-hidden="true">{b.mark}</em>{b.verdict}</span>
            </div>
          ))}
        </div>
        <p className="dv-p dim">a chatbot is the part a customer sees. it was never the part that was broken.</p>
      </div>

      {/* ---------- the six jobs, each hiding what it replaced ---------- */}
      <div className="inv-section">
        <div className="inv-step-tag"><i></i>The work AI does</div>
        <h3 className="dv-h">What AI actually took over</h3>
        <p className="dv-p">Not writing the documentation - <b className="kbx-hl">doing the labour around it that used to need a person with repo access</b>:</p>
        <p className="kbx-hint tap">hover, tap or tab a job to see what it replaced</p>
        <div className="kbx-jobs kbx-rv" data-rv>
          {JOBS.map((j, i) => (
            <button
              type="button"
              key={j.job}
              className={openJob === i ? 'kbx-job on' : 'kbx-job'}
              aria-expanded={openJob === i}
              onClick={() => setOpenJob(openJob === i ? null : i)}
            >
              <Chip name={j.i} lg />
              <b>{j.job}</b>
              {/* a span, not a p: a <button>'s content model is phrasing only */}
              <span className="kbx-ai">{j.ai}</span>
              <span className="kbx-was"><em>what it replaced</em><s>{j.was}</s></span>
            </button>
          ))}
        </div>
        <div className="kbx-gate kbx-rv" data-rv>
          <Chip name="check" />
          <p><b className="kbx-hl">every job above drafts - none of them publishes.</b> a human still approves.</p>
        </div>
        <p className="dv-p dim">so scale stopped meaning headcount - it means review time. the same pattern runs on the build side: designs pull straight into the model over MCP, so the frontend gets built without a second pair of hands.</p>
      </div>

      {/* ---------- three gates before answering counts as a job ---------- */}
      <div className="inv-section">
        <div className="inv-step-tag"><i></i>Earning trust</div>
        <h3 className="dv-h">The assistant shipped last, on purpose</h3>
        <p className="dv-p">An assistant that sounds certain and is wrong costs more trust than no assistant at all.</p>
        <p className="kbx-hint">three rules, before answering counts as a job AI is allowed to do</p>
        <div className="ivx-principles kbx-gates kbx-rv" data-rv>
          {TRUST.map((t) => (
            <div className="ivp" key={t.t}>
              <Chip name={t.i} />
              <b>{t.t}</b>
              <p><Split parts={t.p} /></p>
            </div>
          ))}
        </div>
        <p className="dv-p dim">the third rule is the useful one. a refusal is a signal - it tells us which page to write next, which means the docs find their own gaps instead of waiting for a ticket to find them.</p>
      </div>

      {/* ---------- release notes, as a pipeline that steps itself ---------- */}
      <div className="inv-section">
        <div className="inv-step-tag"><i></i>The clearest example</div>
        <h3 className="dv-h">Release notes, without the reminder</h3>
        <p className="dv-p">A &quot;what changes for the customer&quot; field is <b className="kbx-hl">required at ticket time</b> - so the raw material exists before anyone thinks about documentation.</p>
        <div className="dv-pipe kbx-pipe kbx-rv" data-rv>
          {PIPE.map((p, i) => (
            <Fragment key={p.t}>
              {i > 0 ? <em aria-hidden="true">→</em> : null}
              <span className={p.last ? 'dvp last' : 'dvp'} style={{ '--d': `${i * 150}ms` }}>
                <Ico name={p.i} />
                <b>{p.t}</b>
                {p.n ? <i>{p.n}</i> : null}
              </span>
            </Fragment>
          ))}
        </div>
        <div className="inv-highlight kb-pull">A release used to make the documentation slightly more wrong. Now a release tells the documentation which pages to re-check.</div>
        <p className="dv-p dim">release notes went from something that happened when someone had time to something that happens every time - because the effort moved from writing to approving.</p>
      </div>

      {/* ---------- independence: one matrix, two emphases ---------- */}
      <div className="inv-section">
        <div className="inv-step-tag"><i></i>Independence</div>
        <h3 className="plain">Who has to act now</h3>
        <div className={`kbx-ind kbx-rv s-${side}`} data-rv>
          <div className="cs-tabs kbx-tog" role="group" aria-label="which side of the comparison to emphasise">
            <button type="button" className={side === 'before' ? 'on' : ''} aria-pressed={side === 'before'} onClick={() => setSide('before')}>before · external wiki</button>
            <button type="button" className={side === 'now' ? 'on' : ''} aria-pressed={side === 'now'} onClick={() => setSide('now')}>now · in-house platform</button>
          </div>
          <div className="kbx-acts">
            {ACTS.map((a) => (
              <div className="kbx-act" key={a.t}>
                <span className="kbx-act-t"><Chip name={a.i} />{a.t}</span>
                <span className="kbx-cell b"><em>then</em>{a.before}</span>
                <span className="kbx-cell n"><em>now</em>{a.now}</span>
              </div>
            ))}
          </div>
          <div className="kbx-ind-f">
            <span></span>
            <p className="b">every change needed someone outside the product team</p>
            <p className="n">the team that owns the product owns its documentation</p>
          </div>
        </div>
        <p className="dv-p dim">engineers stopped being the CMS. that is the whole result - everything else on this page is a consequence of it.</p>
      </div>

      {/* ---------- what changed, and what is deliberately not claimed ---------- */}
      <div className="inv-section">
        <div className="inv-step-tag"><i></i>Final result</div>
        <h3 className="plain">What changed</h3>
        <div className="inv-result kbx-res">
          <p className="kbx-res-l">The documentation stopped being an engineering dependency.</p>
          <div className="kbx-res-rows">
            {RESULT.map((r) => (
              <span key={r.i}><Chip name={r.i} />{r.t}</span>
            ))}
          </div>
        </div>
        <div className="kbx-open kbx-rv" data-rv>
          <Chip name="nogauge" lg />
          <div>
            <span>where it stands</span>
            <p>still being built, and the customer-facing assistant is deliberately the last thing to ship - it only earns its place once the content underneath is worth quoting. <b className="kbx-hl">no scoreboard here yet</b>: what I can say is which dependency is gone, not by how much.</p>
          </div>
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
