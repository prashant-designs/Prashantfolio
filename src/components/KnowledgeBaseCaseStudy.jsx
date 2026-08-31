import { Fragment, useEffect, useRef } from 'react';

/* ---- line-icon set for this case study ----
   same language as GenAICaseStudy's ICONS / CurrentProject's .tl-cs-icon svgs:
   24x24 viewBox, no fill, stroke: currentColor at 1.6, round caps and joins, so
   every glyph inherits the surrounding text colour and flips with the theme.
   no filled shapes, no emoji, no external icon set.

   the set shrank with this pass: the three "drift" glyphs (clock, split) went
   with the paragraph cards they used to head - the WikiJS pain is four .chip
   fragments now, and a chip row that is already four short strings does not get
   clearer by hanging an icon off each one. */
const ICONS = {
  /* the systems each pipeline stop stands for */
  users: <><circle cx="9.2" cy="8" r="3" /><path d="M3.5 19.5c0-3.1 2.6-5.3 5.7-5.3s5.7 2.2 5.7 5.3" /><path d="M15.6 6.2a2.9 2.9 0 0 1 0 5.7" /><path d="M17.2 14.5c2 .7 3.3 2.5 3.3 5" /></>,
  cms: <><ellipse cx="12" cy="6.3" rx="7.4" ry="2.8" /><path d="M4.6 6.3v11.4c0 1.6 3.3 2.8 7.4 2.8s7.4-1.2 7.4-2.8V6.3" /><path d="M4.6 12c0 1.6 3.3 2.8 7.4 2.8s7.4-1.2 7.4-2.8" /></>,
  book: <><path d="M4 5.2c2.6-1.2 5.4-1.2 8 0v13.6c-2.6-1.2-5.4-1.2-8 0z" /><path d="M20 5.2c-2.6-1.2-5.4-1.2-8 0v13.6c2.6-1.2 5.4-1.2 8 0z" /></>,
  reader: <><circle cx="12" cy="8" r="3.2" /><path d="M5.5 20c0-3.3 2.9-5.6 6.5-5.6s6.5 2.3 6.5 5.6" /></>,
  ticket: <><rect x="4.2" y="4.2" width="15.6" height="15.6" rx="3" /><path d="M8.4 12.2l2.4 2.4 4.8-5.3" /></>,
  funnel: <path d="M3.8 5h16.4l-6.3 7.3v6.4l-3.8-2.1v-4.3z" />,
  pen: <><path d="M4 20.3h16" /><path d="M17.6 4.4l2 2-9.7 9.7-2.7.7.7-2.7z" /></>,
  check: <><circle cx="12" cy="12" r="8.4" /><path d="M8.2 12.3l2.7 2.7 4.9-5.4" /></>,

  /* the three rules that keep the proposed pipeline honest */
  notes: <><path d="M6.5 3.5h8L18 7v13.5H6.5z" /><path d="M14.5 3.5V7H18" /><path d="M9.2 11h5.6M9.2 14.3h5.6M9.2 17.6h3.2" /></>,

  /* the panel that refuses to put a number on any of it */
  nogauge: <><path d="M4 16.6a8 8 0 1 1 16 0" /><path d="M4 16.6h2.6M17.4 16.6H20" /><path d="M10.2 12.6h3.6" strokeDasharray="1.8 2.6" /></>,
};

function Ico({ name }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

/* a chip: icon in a recessed square. one shape, two sizes.
   still no `cat` here, and the denser layout this pass produced makes the case
   stronger rather than weaker. the categorical --chip-* ramp is for a set of
   three or more parallel categories a reader has to tell apart (see CARD SYSTEM
   in index.css); the only icon group left on the page is the three pipeline
   rules, which are three facets of one guardrail rather than three categories,
   and the last chip is a lone accent on a strip (.kbx-open). six hues over four
   glyphs would be decoration. the teaser card in CurrentProject keeps its
   data-cat="4" - that one IS one of six parallel cards. */
function Chip({ name, lg }) {
  return <i className={lg ? 'kbx-ic lg' : 'kbx-ic'}><Ico name={name} /></i>;
}

/* the problem, as fragments rather than failure modes. four short strings on
   the shared .chip pill (AdminPortalCaseStudy's .adm-chiprow uses the same
   pair) - a reader gets the shape of a documentation queue off four tags
   faster than off three paragraphs describing it. */
const PAIN = [
  'no CMS for content owners',
  'every edit through engineering',
  'articles went stale',
  'same process, two answers',
];

/* phase 1, as it runs today */
const NOW = [
  { i: 'users', t: 'product & engineering' },
  { i: 'cms', t: 'Strapi' },
  { i: 'book', t: 'KB portal' },
  { i: 'reader', t: 'customers', n: 'live', last: true },
];

/* and the workflow the next phase proposes around Jira */
const NEXT = [
  { i: 'ticket', t: 'Jira' },
  { i: 'funnel', t: 'validation' },
  { i: 'pen', t: 'AI draft' },
  { i: 'check', t: 'approval' },
  { i: 'cms', t: 'Strapi' },
  { i: 'book', t: 'knowledge base', n: 'phase 2', last: true },
];

/* the three rules that make the pipeline above honest rather than fast - a spec
   sheet now, not three essays: label, then the shortest qualifier that still
   says something. `ok` puts the page's one lime on the approval rule. */
const RULES = [
  { i: 'notes', t: 'mandatory fields', p: 'epic, PRD, customer impact' },
  { i: 'funnel', t: 'validate before generating', p: 'a missing field stops the run' },
  { i: 'check', t: 'human approval, always', p: 'no autopilot while this is new', ok: true },
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

/* one stop of a toolchain strip. both pipelines on this page are the shared
   .dv-pipe / .kbx-pipe component the rest of the site uses for a sequence -
   same dashed strip, same mono stops, same stepped reveal - so the "today" and
   "where it is headed" flows are visibly the same kind of object. with the
   prose under them gone, these two strips are now what carries beats 3 and 4. */
function Pipe({ stops }) {
  return (
    <div className="dv-pipe kbx-pipe kbx-rv" data-rv>
      {stops.map((s, i) => (
        <Fragment key={s.t + i}>
          {i > 0 ? <em aria-hidden="true">→</em> : null}
          <span className={s.last ? 'dvp last' : 'dvp'} style={{ '--d': `${i * 150}ms` }}>
            <Ico name={s.i} />
            <b>{s.t}</b>
            {s.n ? <i>{s.n}</i> : null}
          </span>
        </Fragment>
      ))}
    </div>
  );
}

export default function KnowledgeBaseCaseStudy({ onPrev, onNext, idx, total }) {
  const wrap = useRef(null);
  useReveal(wrap);

  return (
    <div className="inv-wrap" ref={wrap}>
      <div className="inv-hero">
        <p className="eyebrow">Polarin · Knowledge Base</p>
        <h2>The knowledge base needed an engineer to change a sentence.</h2>
        <p>It lived in WikiJS. I rebuilt it on tools we already had.</p>
        <div className="inv-meta">
          <div><span>My role</span><b>Structure, design, build</b></div>
          <div><span>Output</span><b>In-house KB portal, content in Strapi</b></div>
          <div><span>Status</span><b>Phase 1 live · automation designed</b></div>
        </div>
      </div>

      {/* ---------- 1. the problem, as four tags ---------- */}
      <div className="inv-section">
        <div className="inv-step-tag"><i></i>The problem</div>
        <h3 className="plain">WikiJS, and one team who could operate it</h3>
        <div className="adm-chiprow kbx-pain kbx-rv" data-rv>
          {PAIN.map((p) => (
            <span className="chip" key={p}>{p}</span>
          ))}
        </div>
      </div>

      {/* ---------- 2. my approach, as three labels ---------- */}
      <div className="inv-section">
        <div className="inv-step-tag"><i></i>My approach</div>
        <h3 className="plain">Built out of what we already had</h3>
        <div className="inv-meta">
          <div><span>Designed in</span><b>Figma - structure & UI, mine</b></div>
          <div><span>Built with</span><b>Claude Code, Figma over MCP</b></div>
          <div><span>Content in</span><b>Strapi - already ours</b></div>
        </div>
        <p className="dv-p dim">a wording fix is a content edit now, not a release.</p>
      </div>

      {/* ---------- 3. how much we solved, as the flow it runs ---------- */}
      <div className="inv-section">
        <div className="inv-step-tag"><i></i>How much we solved</div>
        <h3 className="plain">Phase 1, live</h3>
        <Pipe stops={NOW} />
        <div className="kbx-open kbx-rv" data-rv>
          <Chip name="nogauge" lg />
          <div>
            <span>how much, honestly</span>
            <p>Publishing left engineering. Staying current did not. <b className="kbx-hl">No numbers yet.</b></p>
          </div>
        </div>
      </div>

      {/* ---------- 4. what's next: same strip, longer flow ---------- */}
      <div className="inv-section">
        <div className="inv-step-tag"><i></i>What&apos;s next</div>
        <h3 className="plain">Make Jira the source of truth</h3>
        <p className="kbx-hint">proposed · not built yet</p>
        <Pipe stops={NEXT} />
        <div className="kbx-ba kbx-rv" data-rv>
          <p><span>jira says</span>Added centralized alert visibility across all customer services.</p>
          <p className="to"><span>customer reads</span>Alerts for every service now sit on one screen - and here is where to find it.</p>
        </div>
        <div className="ivx-principles kbx-gates kbx-rv" data-rv>
          {RULES.map((r) => (
            <div className={r.ok ? 'ivp ok' : 'ivp'} key={r.t}>
              <Chip name={r.i} />
              <b>{r.t}</b>
              <p>{r.p}</p>
            </div>
          ))}
        </div>
        <div className="inv-highlight kb-pull">No AI can write an honest article out of an empty field.</div>
      </div>

      <div className="ovl-nav">
        <button type="button" onClick={onPrev}>← Prev</button>
        <span className="ovl-count"><b>{idx + 1}</b> / {total} surfaces</span>
        <button type="button" onClick={onNext}>Next →</button>
      </div>
    </div>
  );
}
