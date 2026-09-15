import { Fragment, useEffect, useRef, useState } from 'react';

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




/* and the workflow the next phase proposes around Jira */
const NEXT = [
  { i: 'ticket', t: 'Jira' },
  { i: 'funnel', t: 'validation' },
  { i: 'pen', t: 'AI draft' },
  { i: 'check', t: 'approval' },
  { i: 'cms', t: 'Strapi' },
  { i: 'book', t: 'knowledge base', n: 'phase 2', last: true },
];


/* reveal-on-scroll for [data-rv] children, scoped to the overlay panel - the
   same hook GenAICaseStudy uses, kept local because a component file on this
   site only exports its component (see react/only-export-components) */
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
    panel.addEventListener('scroll', onScroll);
    update();
    return () => panel.removeEventListener('scroll', onScroll);
  }, [ref, beats]);
  return beat;
}

/* the nine days, as they actually ran - mapped from ticket timestamps in
   discovery. the point is that not one of these steps is hard; the delay is
   entirely the dependency. */
const KB_NINE = [
  { d: 'Day 0', t: 'Spotted', n: 'support finds a wrong port speed in a guide' },
  { d: 'Day 1', t: 'Ticketed', n: 'raised to the dev backlog - no content owner exists' },
  { d: 'Day 4', t: 'Queued', n: 'waits for the next sprint, against roadmap work' },
  { d: 'Day 7', t: 'Edited', n: "a developer edits wording they don't own the meaning of" },
  { d: 'Day 9', t: 'Live', n: 'deployed. nobody checks whether it answered the question' },
];

/* six structural limits, not six bugs - each one is a thing the platform
   could not do, rather than a thing it did badly. */
const KB_LIMITS = [
  { n: '01', t: 'Developer-gated', p: 'Publishing needed repo access, so the people who knew the answer could not write it.' },
  { n: '02', t: 'Flat content', p: 'Everything was a page. No how-to, no reference, no release note - so nothing could be filtered or reused.' },
  { n: '03', t: 'Fixed interface', p: 'One template, one theme. No API layout, no product landing pages.' },
  { n: '04', t: 'Search returns pages', p: 'People arrived with a question and left with a reading list.' },
  { n: '05', t: 'No governance', p: 'No owner, no review, no freshness date. Stale instructions read as authoritative as verified ones.' },
  { n: '06', t: 'Blind operation', p: 'No view of what was read, searched, or not found. Content decisions were opinion.' },
];

/* what discovery actually consisted of - the numbers matter because they are
   what turns "we should fix the docs" into a costed argument. */
const KB_DISCOVERY = [
  { b: '18', k: 'Stakeholder interviews', s: 'support, NOC, solution architects, sales engineers' },
  { b: '1.2k', k: 'Support tickets clustered', s: 'tagged by intent, to find what docs should have answered' },
  { b: '90d', k: 'Search logs read', s: 'zero-result queries became the content backlog' },
  { b: '340', k: 'Pages audited', s: 'scored for accuracy, staleness, duplication, ownership' },
];

/* the four commitments made before any tool was chosen. */
const KB_PRINCIPLES = [
  { t: 'Answers, not pages', p: 'Success is a resolved question, not a pageview.' },
  { t: 'Structure once, publish anywhere', p: 'Content is data. A layout is a consumer of it, never its container.' },
  { t: 'Authors are the primary users', p: "If an expert can't publish in 15 minutes, the system failed." },
  { t: 'Residency is non-negotiable', p: 'Telecom customers ask where their data sits. That answer comes first.' },
];

/* the decision, argued rather than asserted - residency eliminated most of
   the field before cost or features were even discussed. */
const KB_OPTIONS = [
  { n: 'Wiki.js (current)', a: 'yes', b: 'flat pages', c: 'basic', v: 'ceiling already hit' },
  { n: 'Confluence', a: 'cloud-first', b: 'weak', c: 'yes', v: 'a wiki, not a product surface' },
  { n: 'Contentful', a: 'no', b: 'strong', c: 'yes', v: 'residency + cost blocked it' },
  { n: 'Sanity', a: 'no', b: 'strong', c: 'yes', v: 'close second, hosting model failed' },
  { n: 'Docusaurus', a: 'yes', b: 'files, not data', c: 'git PRs', v: 're-creates the dev dependency' },
];

/* how it was sequenced. the week ranges are from my own project notes; the
   ordering is the argument - structure first, authors second, and the
   portable-docs work only once there was content worth handing to anything.
   the fourth marker is the one that has not happened yet. */
const KB_PHASES = [
  { p: 'Phase 1', w: 'weeks 1-5', t: 'Model and prove', n: 'content model cut from fourteen types to nine, IA validated by tree testing, highest-traffic pages migrated and hand-checked' },
  { p: 'Phase 2', w: 'weeks 6-11', t: 'Hand it over', n: 'editor experience built in Strapi with owner and verify-by as required fields, experts trained, old wiki set read-only with 1:1 redirects' },
  { p: 'Phase 3', w: 'weeks 12-16', t: 'Make it portable', n: 'portal built with Claude Code, a markdown twin generated for every page, and the Copy page control shipped' },
  { p: 'Next', w: 'designed', t: 'Notes from Jira', n: 'release notes generated from the tickets in a shipped version, approved by a human before they publish', soon: true },
];

/* publish is one button; these are the things it sets off. */
/* what each tool was actually responsible for. the split is the point:
   Strapi holds the parts, Claude Code built the thing that renders them,
   and the markdown twin is what makes the result machine-readable. */
const KB_STACK = [
  { k: 'Strapi', t: 'The components', p: 'content types and the fields inside them - a page is assembled out of parts rather than typed into one box' },
  { k: 'Claude Code', t: 'The platform', p: 'the portal itself - routing, search, every page template and the whole frontend, written against the Figma structure' },
  { k: 'Markdown twin', t: 'The AI surface', p: 'each page saved again as a plain file beside itself, so an assistant reads exactly what the reader sees' },
];

/* the library an author picks from. this is the reason someone who has
   never opened Figma can still produce a page that matches the rest. */
const KB_COMPONENTS = [
  'Step + screenshot', 'Tip callout', 'On this page', 'Related articles',
  'Release version', 'Product card', 'Prev / next', 'Type chip',
];

/* the rules that keep a generated release note honest. the fourth is the
   one that makes the other three safe to have. */
const KB_JIRA = [
  { n: '01', t: 'Only what shipped', p: 'tickets inside a released version. internal chores, reverts and spikes never reach the draft.' },
  { n: '02', t: 'Rewritten, not copied', p: "the engineer's sentence becomes the customer's. the model drafts language; it does not decide what is worth saying." },
  { n: '03', t: 'Sorted into the three groups', p: 'feature, improvement, fix - the shape the release-notes type already has, so a draft lands in a real structure.' },
  { n: '04', t: 'A person approves it', p: 'the owner edits or rejects before anything publishes. nothing goes live unread.', ok: true },
];


/* what shipped instead of an assistant. no model is hosted, nothing is
   indexed, and there is no chatbot to keep correct - every page simply also
   exists as a plain markdown file at its own URL, and a control on the page
   hands that URL to whichever assistant the reader already uses. */
const KB_MD = [
  { i: 'pen', t: 'Written in Strapi' },
  { i: 'cms', t: 'Markdown stored beside it' },
  { i: 'notes', t: '/md/page.html' },
  { i: 'reader', t: 'any assistant', n: 'live', last: true },
];

/* why that beats the chatbot everyone asked for - three consequences, not
   three features. */
const KB_WHY = [
  { t: 'Nothing to keep in sync', p: 'The markdown IS the page. It cannot drift from what the reader is looking at.' },
  { t: 'Nothing to host', p: 'No model, no index, no monthly bill that grows with questions asked.' },
  { t: 'They use what they trust', p: 'The reader brings their own assistant. We just make the page legible to it.', ok: true },
];


/* the section bar the Customer Portal has, over this case study's single
   pinned scene: its beats are grouped into chapters so the bar reads as
   seven stops rather than fifteen ticks of noise. it is display-only, so it
   reads the scene out of the DOM and does its own scroll maths rather than
   forcing the scene to lift its beat state.
   the width clamp is the same one the Customer Portal needed: .ovl-close
   sits OUTSIDE the panel, so stopping short of it alone lets the bar and
   its label run past the panel's rounded corner. */
/* the scene's beat count. the route bar derives its chapter from this too,
   so adding a beat can never leave the bar reading the wrong chapter. */
const KB_BEATS = 24;

const KB_CHAPTERS = [
  { label: 'Problem', at: 0 },
  { label: 'Discovery', at: 4 },
  { label: 'Decision', at: 6 },
  { label: 'Build', at: 8 },
  { label: 'Portable', at: 15 },
  { label: 'Rollout', at: 20 },
  { label: 'Automation', at: 21 },
  { label: 'Close', at: 23 },
];

function KbRoute({ total }) {
  const [pos, setPos] = useState(null);
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const panel = document.querySelector('.ovl-panel');
    if (!panel) return undefined;
    let raf = null;

    const place = () => {
      const r = panel.getBoundingClientRect();
      const closeBtn = document.querySelector('.ovl-close');
      const closeLeft = closeBtn ? closeBtn.getBoundingClientRect().left : r.right - 28;
      const rightLimit = Math.min(closeLeft - 14, r.right - 28);
      setPos({ top: r.top, left: r.left + 28, width: Math.max(120, rightLimit - (r.left + 28)) });
    };
    const update = () => {
      const el = document.querySelector('.kbs-oscn');
      const stage = el && el.firstElementChild;
      if (!stage) return;
      const r = panel.getBoundingClientRect();
      const top = el.getBoundingClientRect().top - r.top + panel.scrollTop;
      const span = el.offsetHeight - stage.offsetHeight;
      if (span <= 0) return;
      const pr = Math.min(1, Math.max(0, (panel.scrollTop - top) / span));
      setBeat(Math.min(total - 1, Math.floor(pr * total)));
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { raf = null; place(); update(); });
    };
    panel.addEventListener('scroll', onScroll, { passive: true });
    const ro = new ResizeObserver(() => { place(); update(); });
    ro.observe(panel);
    place();
    update();
    return () => {
      ro.disconnect();
      panel.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [total]);

  // instant, never smooth - the scene spans fifteen viewport heights, so an
  // eased jump would drag the reader through every beat in between.
  const jumpTo = (b) => {
    const panel = document.querySelector('.ovl-panel');
    const el = document.querySelector('.kbs-oscn');
    const stage = el && el.firstElementChild;
    if (!panel || !stage) return;
    const top = el.getBoundingClientRect().top - panel.getBoundingClientRect().top + panel.scrollTop;
    const span = el.offsetHeight - stage.offsetHeight;
    panel.scrollTop = top + ((b + 0.5) / total) * span;
  };

  if (!pos) return null;
  const active = KB_CHAPTERS.reduce((acc, c, i) => (beat >= c.at ? i : acc), 0);
  const progress = total > 1 ? (beat / (total - 1)) * 100 : 0;

  return (
    <div className="cp-route-wrap" style={{ top: pos.top, left: pos.left, width: pos.width }}>
      <div className="route-line" aria-label="Jump to section">
        <div className="route-fill" style={{ width: `${progress}%` }}></div>
        <div className="route-packet" style={{ left: `${progress}%` }}>
          <span className="route-now" style={{ transform: `translateX(-${progress}%)` }}>
            <i>{String(active + 1).padStart(2, '0')}</i>{KB_CHAPTERS[active].label}
          </span>
        </div>
        {KB_CHAPTERS.map((c, i) => (
          <button
            key={c.label}
            type="button"
            className={`route-tick ${i === active ? 'on' : ''}`}
            data-cp-ch={c.label}
            aria-label={`Jump to ${c.label}`}
            style={{ left: `${(c.at / (total - 1)) * 100}%` }}
            onClick={() => jumpTo(c.at)}
          />
        ))}
      </div>
    </div>
  );
}

/* the whole case study as one pinned run of beats, written for a reader who
   has never operated a CMS: no tool names in the narrative, no retrieval
   vocabulary, one idea per screen. the built/designed split the old version
   was careful about is kept - beats 4 onward are explicitly the proposal. */
/* a product shot, framed. from the build chapter on, the argument is the
   thing itself - so the screen gets the room and the words shrink to a
   caption under it. the frame is sized to the image rather than the column
   so a wide screenshot never letterboxes inside a border. */
function Shot({ src, alt, eyebrow, note }) {
  return (
    <div className="kbs-wide kbm">
      {eyebrow ? <span className="kbs-eyebrow">{eyebrow}</span> : null}
      <figure className="kbm-frame">
        <img src={src} alt={alt} loading="lazy" />
        {note ? <Note {...note} /> : null}
      </figure>
    </div>
  );
}

/* the explanation that rides under a screenshot. the Invoice case study
   does this with a callout baked into its own artwork; these screens are
   frames of a recording, so the annotation is built as markup instead -
   which is sharper, reflows on a phone, and can be edited without going
   back to Figma. dark rather than the Invoice's pale card, because that
   card sits on a white invoice and this one sits on the case study. */
function Note({ icon, title, body }) {
  return (
    <figcaption className="kbm-note">
      <span className="kbm-note-i" aria-hidden="true"><Ico name={icon} /></span>
      <span className="kbm-note-t">
        <b>{title}</b>
        <span>{body}</span>
      </span>
    </figcaption>
  );
}

/* the one beat that has to move: a still cannot show a question being
   answered out of a page the model had never seen until it was handed the
   link. muted + loop + playsInline so it behaves like a gif and autoplays
   on iOS; it only mounts when its beat is reached, so the file is not
   fetched until the reader gets there. */
function Clip({ src, eyebrow, note }) {
  return (
    <div className="kbs-wide kbm">
      {eyebrow ? <span className="kbs-eyebrow">{eyebrow}</span> : null}
      <figure className="kbm-frame">
        <video src={src} autoPlay muted loop playsInline preload="metadata" />
        {note ? <Note {...note} /> : null}
      </figure>
    </div>
  );
}

function KbStoryScene() {
  const ref = useRef(null);
  const beat = useScrollBeat(ref, KB_BEATS);
  const reduced = prefersReducedMotion();

  const beats = [
    <h3 className="kbs-big" key="nine">
      A one-word fix<br />took <em className="cp-rose">nine days</em>.
    </h3>,
    <div className="kbs-wide" key="timeline">
      <span className="kbs-eyebrow">Not because it was hard</span>
      <div className="kbs-rail">
        {KB_NINE.map((x) => (
          <div className="kbs-rail-s" key={x.d}>
            <span className="kbs-rail-d">{x.d}</span>
            <b>{x.t}</b>
            <p>{x.n}</p>
          </div>
        ))}
      </div>
      <p className="kbs-note">content was code, and code needs a developer, a review, a merge and a deploy window.</p>
    </div>,
    <div className="kbs-wide" key="limits">
      <span className="kbs-eyebrow">Six structural limits, not six bugs</span>
      <div className="kbs-lim">
        {KB_LIMITS.map((l) => (
          <div className="kbs-card" key={l.n}>
            <span className="kbs-k">{l.n}</span>
            <b>{l.t}</b>
            <p>{l.p}</p>
          </div>
        ))}
      </div>
    </div>,
    <h3 className="kbs-big" key="dep">
      The wiki wasn&apos;t slow.<br />The <em className="cp-amber">dependency</em> was.
    </h3>,
    <div className="kbs-wide" key="disc">
      <span className="kbs-eyebrow">So I went looking for the question behind the ticket</span>
      <div className="kbs-stats">
        {KB_DISCOVERY.map((d) => (
          <div className="kbs-stat" key={d.k}>
            <b>{d.b}</b>
            <span>{d.k}</span>
            <small>{d.s}</small>
          </div>
        ))}
      </div>
    </div>,
    <div className="kbs-wide" key="prin">
      <span className="kbs-eyebrow">What I committed to before choosing a tool</span>
      <div className="kbs-lim kbs-lim-4">
        {KB_PRINCIPLES.map((x) => (
          <div className="kbs-card" key={x.t}>
            <b>{x.t}</b>
            <p>{x.p}</p>
          </div>
        ))}
      </div>
    </div>,
    <div className="kbs-wide" key="options">
      <span className="kbs-eyebrow">Residency ruled out most of the field before cost did</span>
      <div className="aud kbs-tbl">
        <div className="aud-r aud-h"><span>option</span><span>self-host</span><span>content model</span><span>verdict</span></div>
        {KB_OPTIONS.map((o) => (
          <div className="aud-r" key={o.n}><span>{o.n}</span><span>{o.a}</span><span>{o.b}</span><span>{o.v}</span></div>
        ))}
        <div className="aud-r aud-p"><span>Strapi →</span><span>our AWS, our VPC</span><span>fully custom</span><span>chosen</span></div>
      </div>
    </div>,
    <h3 className="kbs-big" key="model">
      The content model<br />was the <em className="cp-up">real design work</em>.
    </h3>,
    <Shot
      key="s-home"
      src="/kb/kb-home.jpg"
      alt="Polarin Docs home page, with a search bar and six Choose Your Path cards"
      eyebrow="What shipped"
      note={{
        icon: 'book',
        title: 'Six paths, not a table of contents',
        body: 'Discovery said people arrive with a job to do, not a product tree to browse. The landing page routes by intent - new to Polarin, configure a service, monitor it, find a location, handle billing, or get help.',
      }}
    />,
    <Shot
      key="s-article"
      src="/kb/kb-article.jpg"
      alt="An article page titled What Is a Port, with read time, category chip, an on-this-page rail and a tip callout"
      eyebrow="One page, four affordances"
      note={{
        icon: 'notes',
        title: 'The content model, showing through',
        body: 'Read time, a type chip, an on-this-page rail and a tip callout - none of which the old flat wiki could express. Because a page knows what type it is, it can be filtered, cross-linked and reused rather than just read.',
      }}
    />,
    <Shot
      key="s-ticket"
      src="/kb/kb-ticket.jpg"
      alt="A how-to article with numbered steps and an embedded screenshot of the ticket creation form"
      eyebrow="How-tos carry the product with them"
      note={{
        icon: 'ticket',
        title: 'Numbered steps, each with its own screen',
        body: 'The old wiki could hold prose and nothing else. This one holds the interface the instruction is about, so a reader can check what they are seeing against what they should be seeing.',
      }}
    />,
    <Shot
      key="s-release"
      src="/kb/kb-release.jpg"
      alt="The release notes page with year and month filters and version cards grouped into new features, improvements and bug fixes"
      eyebrow="Release notes became a type, not a page"
      note={{
        icon: 'check',
        title: 'Filterable by year, month and class of change',
        body: 'Every version splits into new features, improvements and bug fixes, each with a count. This is the structure the Jira phase writes into - the shape had to exist before anything could fill it.',
      }}
    />,
    <h3 className="kbs-big" key="fifteen">
      Nine days became<br /><em className="cp-up">fifteen minutes</em>.
    </h3>,
    <div className="kbs-wide" key="stack">
      <span className="kbs-eyebrow">Three tools, three jobs</span>
      <div className="kbs-lim kbs-lim-3">
        {KB_STACK.map((x) => (
          <div className="kbs-card" key={x.k}>
            <span className="kbs-k">{x.k}</span>
            <b>{x.t}</b>
            <p>{x.p}</p>
          </div>
        ))}
      </div>
      <p className="kbs-note">no developer sits between an expert and a published page - the last one needed was the one who built the thing they publish into.</p>
    </div>,
    <div className="kbs-wide" key="components">
      <span className="kbs-eyebrow">A page is assembled, not written</span>
      <div className="kbs-chips">
        {KB_COMPONENTS.map((c) => <span key={c}>{c}</span>)}
      </div>
      <p className="kbs-note">each one is a Strapi component with its own fields and its own rules. the expert picks blocks and fills them in, which is why a page written by someone who has never opened Figma still looks like the rest of the docs.</p>
    </div>,
    <h3 className="kbs-big" key="chatbot">
      Everyone said: <em className="cp-rose">add a chatbot</em>.<br />We didn&apos;t build one.
    </h3>,
    <Shot
      key="s-menu"
      src="/kb/kb-menu.jpg"
      alt="The Copy page dropdown open, offering copy as markdown, view as markdown, download as PDF, and open in ChatGPT, Claude, Gemini or Perplexity"
      eyebrow="Instead of a chatbot, one control"
      note={{
        icon: 'reader',
        title: 'Every route out of the page, in one menu',
        body: 'Copy as markdown, view it as plain text, take a PDF, or open the page straight in ChatGPT, Claude, Gemini or Perplexity. We host no model and index nothing - the page makes itself legible to whatever the reader already trusts.',
      }}
    />,
    <div className="kbs-md" key="how">
      <span className="kbs-eyebrow">Every page is also a plain markdown file</span>
      <Pipe stops={KB_MD} plain />
      <div className="kbs-prompt">
        <span className="kbs-prompt-h">what &quot;Copy page&quot; hands you</span>
        <p>
          Could you pull up this Polarin Docs page and get familiar with it? I&apos;ll have questions once you&apos;ve had a look:{' '}
          <em>https://polarin-docs.vercel.app/md/release-notes.html</em>
        </p>
      </div>
      <p className="kbs-note">paste it into Claude, ChatGPT, anything - the reader brings their own assistant, we just make the page legible to it.</p>
    </div>,
    <Clip
      key="s-llm"
      src="/kb/kb-llm.mp4"
      eyebrow="A page the model had never seen, answered in one turn"
      note={{
        icon: 'cms',
        title: 'Open in Claude → fetch → read → answer',
        body: 'It pulls the markdown twin stored beside the page in Strapi, reads it, and answers a question out of it in a single turn. No training, no embedding, no sync job - the link is the context.',
      }}
    />,
    <div className="kbs-wide" key="why">
      <span className="kbs-eyebrow">Why that beats the chatbot</span>
      <div className="kbs-lim kbs-lim-3">
        {KB_WHY.map((r) => (
          <div className={`kbs-card${r.ok ? ' ok' : ''}`} key={r.t}>
            <b>{r.t}</b>
            <p>{r.p}</p>
          </div>
        ))}
      </div>
    </div>,
    <div className="kbs-wide" key="phases">
      <span className="kbs-eyebrow">Sequencing was the decision</span>
      <div className="kbs-tl">
        {KB_PHASES.map((ph) => (
          <div className={`kbs-tl-s${ph.soon ? ' soon' : ''}`} key={ph.p}>
            <span className="kbs-tl-dot" aria-hidden="true" />
            <span className="kbs-tl-p">{ph.p} · {ph.w}</span>
            <b>{ph.t}</b>
            <p>{ph.n}</p>
          </div>
        ))}
      </div>
      <p className="kbs-note">structure first, authors second. making the docs portable only mattered once there was content worth handing to anything.</p>
    </div>,
    <div className="kbs-notes" key="notes">
      <span className="kbs-eyebrow">Designed next · release notes from Jira</span>
      <Pipe stops={NEXT} plain />
      <div className="kbx-ba">
        <p><span>an engineer types</span>Added centralized alert visibility across all customer services.</p>
        <p className="to"><span>a customer reads</span>Alerts for every service now sit on one screen - and here is where to find it.</p>
      </div>
      <p className="kbs-note">they already write down what they built. we ask one more question while they still remember.</p>
    </div>,
    <div className="kbs-wide" key="jira">
      <span className="kbs-eyebrow">Four rules that keep a generated note honest</span>
      <div className="kbs-lim kbs-lim-4">
        {KB_JIRA.map((x) => (
          <div className={`kbs-card${x.ok ? ' ok' : ''}`} key={x.n}>
            <span className="kbs-k">{x.n}</span>
            <b>{x.t}</b>
            <p>{x.p}</p>
          </div>
        ))}
      </div>
      <p className="kbs-note">the release-notes type had to exist before any of this could land anywhere - which is why it was built in phase 1 and automated later, not the other way round.</p>
    </div>,
    <div className="inv-highlight kb-pull" key="pull">No AI can write an honest article out of an empty field.</div>,
  ];

  if (reduced) return <div className="kbs-static">{beats}</div>;

  return (
    <div className="oscn kbs-oscn" ref={ref} style={{ '--beats': beats.length }}>
      <div className="oscn-stage kbs-stage" key={beat}>{beats[beat]}</div>
    </div>
  );
}

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
/* `plain` drops the reveal hooks. useReveal collects its [data-rv] targets
   once, when the case study mounts - a beat inside the pinned scene mounts
   long after that, so its Pipe was never observed and simply sat at opacity
   0 forever. inside the scene the beat swap is already the entrance. */
function Pipe({ stops, plain }) {
  return (
    <div className={plain ? 'dv-pipe kbx-pipe kbx-plain' : 'dv-pipe kbx-pipe kbx-rv'} data-rv={plain ? undefined : true}>
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
      <KbRoute total={KB_BEATS} />
      {/* the Customer Portal's fold recipe: logo, headline, lede, then the
          three facts as a ruled spec strip rather than three phrases
          floating in the middle of the screen. the strip gives each cell
          one column, so the values here are sized to fit one - the longer
          detail lives in the lede, which has the width for it. */}
      <div className="inv-hero cs-hero">
        <div className="cp-logo-wrap">
          <img className="cp-logo" src="/polarin-logo.png" alt="Polarin, by Lightstorm" />
        </div>
        <h2>The knowledge base needed <span className="cp-rose">an engineer to change a sentence.</span></h2>
        <p>It lived in WikiJS, where every correction queued behind a developer, a review and a deploy. I rebuilt it on Strapi, wrote the portal in Claude Code, and made every page as readable to an assistant as it is to a person.</p>
        <div className="inv-meta">
          <div><span>My role</span><b>Structure, design, and the build</b></div>
          <div><span>Built with</span><b>Claude Code · Strapi</b></div>
          <div><span>Status</span><b>Phase 1 live · automation designed</b></div>
        </div>
        <span className="cp-scroll" aria-hidden="true"><i></i>scroll</span>
      </div>

      <KbStoryScene />

      <div className="ovl-nav">
        <button type="button" onClick={onPrev}>← Prev</button>
        <span className="ovl-count"><b>{idx + 1}</b> / {total} surfaces</span>
        <button type="button" onClick={onNext}>Next →</button>
      </div>
    </div>
  );
}
