import { useEffect, useRef } from 'react';
import useHeroPointer from '../useHeroPointer';
import ScrollHint from '../components/ScrollHint';

/* ---- Personal Project: Move With Design --------------------------------
   One product, zero to live, solo: a 2024 brand that became a learning
   platform. The page is the build in order - brand, website, content,
   onboarding, portal, console, agents, the plumbing under all of it, and
   what it publishes. Every chapter is a visual, a headline and three pills;
   the prose budget is one line.

   Screens are cut from the live public site (analytics blocked while
   recording). The signed-in surfaces - onboarding, the learner dashboard
   and the admin console - have no public page, so they are drawn as
   labelled slots until real screens replace them. A slot says what goes
   there; it never pretends to be the screen. */

const MARK = '/mwd/mwd-mark.svg';

/* the fold's ambient chips, on the shared PAGE HERO RECIPE - each one says
   something the page says out loud further down */
const HERO_CHIPS = [
  { label: 'zero to live', depth: 14, top: '20%', right: '8%' },
  { label: '3 surfaces · 1 builder', depth: 26, top: '58%', right: '18%' },
  { label: 'agents run daily', depth: 20, top: '74%', right: '10%' },
];

const BRAND = [
  { src: '/mwd/mwd-brand-logo.jpg', alt: 'The Move With Design mark on pink' },
  { src: '/mwd/mwd-brand-colours.jpg', alt: 'The mark in its four colour pairings' },
  { src: '/mwd/mwd-brand-tote.jpg', alt: 'The mark on a tote bag' },
  { src: '/mwd/mwd-brand-pattern.jpg', alt: 'The repeat pattern built from the mark' },
];

const STATS = [
  { n: '80', l: 'lessons' },
  { n: '9', l: 'tracks' },
  { n: '5 × 5', l: 'skills × levels' },
  { n: '49', l: 'long-form posts' },
];

/* the daily curation run, in the order the engine runs it */
const PIPE = [
  { t: 'Collect', s: 'news + jobs' },
  { t: 'Verify', s: 'credible sources' },
  { t: 'Dedupe', s: 'against history' },
  { t: 'Rank', s: 'relevance' },
  { t: 'Draft', s: 'Gemini' },
  { t: 'Approve', s: 'me, in the console', me: true },
  { t: 'Live', s: 'news · jobs' },
];

const STACK = [
  { k: 'Domain', v: 'movewithdesign.in' },
  { k: 'Hosting & cron', v: 'Next.js on Vercel' },
  { k: 'Database & auth', v: 'Supabase' },
  { k: 'Email', v: 'Brevo · branded templates' },
  { k: 'Analytics', v: 'First-party, no third party' },
  { k: 'AI', v: 'Gemini - drafting & chat' },
];

const POSTS = [
  { slug: 'your-portfolio-doesnt-need-ten-case-studies-it-needs-three-good-ones', t: 'Your Portfolio Doesn’t Need Ten Case Studies, It Needs Three Good Ones', c: 'Design Careers' },
  { slug: 'what-hiring-managers-actually-look-at-first', t: 'What Hiring Managers Actually Look at First', c: 'Design Careers' },
  { slug: 'prompting-is-a-design-skill-now', t: 'Prompting Is a Design Skill Now', c: 'AI & Design' },
  { slug: 'designing-trust-into-ai-powered-interfaces', t: 'Designing Trust Into AI-Powered Interfaces', c: 'AI & Design' },
  { slug: 'the-quiet-power-of-a-good-type-scale', t: 'The Quiet Power of a Good Type Scale', c: 'Typography' },
  { slug: 'how-to-talk-about-failed-projects-in-an-interview', t: 'How to Talk About Failed Projects in an Interview', c: 'Design Careers' },
];

/* a looping clip that only fetches once it is near the viewport - four of
   these on one page would otherwise pull ~12MB before anyone scrolls */
function Loop({ src, label }) {
  const ref = useRef(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return undefined;
    if (typeof IntersectionObserver === 'undefined') { v.src = src; return undefined; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        if (!v.src) v.src = src;
        v.play().catch(() => {});
      } else if (v.src) {
        v.pause();
      }
    }, { rootMargin: '300px 0px' });
    io.observe(v);
    return () => io.disconnect();
  }, [src]);
  return <video ref={ref} className="pp-media" muted loop playsInline preload="none" aria-label={label} />;
}

function Frame({ children, tone = '' }) {
  return <figure className={`pp-frame ${tone}`.trim()}>{children}</figure>;
}

/* a labelled slot for a signed-in screen. the faint skeleton says "this is
   a product screen" at a glance; the label says which one is coming. */
function Slot({ label, kind = 'app' }) {
  return (
    <div className={`pp-slot pp-slot-${kind}`} role="img" aria-label={`Placeholder: ${label}`}>
      <div className="pp-slot-ui" aria-hidden="true">
        <i className="side" />
        <div className="main">
          <i className="bar" />
          <div className="row"><i /><i /><i /></div>
          <i className="panel" />
        </div>
      </div>
      <span className="pp-slot-l">Screenshot coming · {label}</span>
    </div>
  );
}

function Pills({ items }) {
  return <div className="pp-pills">{items.map((p) => <span className="chip" key={p}>{p}</span>)}</div>;
}

function Chapter({ n, name, title, pills, children, tone = 'zone-lift', wide }) {
  return (
    <section className={`pp-ch zone ${tone}`} data-ch={name}>
      <div className="wrap">
        <p className="eyebrow rv">{n} · {name}</p>
        <h2 className="pp-h rv d1">{title}</h2>
        {pills ? <div className="rv d2"><Pills items={pills} /></div> : null}
        <div className={`pp-body rv d2${wide ? ' pp-wide' : ''}`}>{children}</div>
      </div>
    </section>
  );
}

export default function PersonalProject() {
  const heroRef = useRef(null);
  useHeroPointer(heroRef);

  return (
    <main className="pp">
      <section className="hero-fold zone zone-sink zone-cool pp-hero" ref={heroRef} data-ch="Intro">
        {HERO_CHIPS.map((c) => (
          <span key={c.label} className="glyph" data-depth={c.depth} style={{ '--hero-amb-top': c.top, '--hero-amb-right': c.right }}>
            {c.label}
          </span>
        ))}
        <div className="wrap hero-tilt-scene">
          <div className="soon-box hero-tilt">
            <p className="hero-eyebrow rv">Personal Project · <b>zero to live, solo</b></p>
            <h2 className="hero-title pp-title rv d1">
              <img className="pp-mark" src={MARK} alt="" />
              Move With Design
            </h2>
            <p className="hero-lede rv d2">A brand I drew, turned into a learning platform I designed, built and run - now helping <b>100s of college students</b>.</p>
            <div className="pp-meta rv d3">
              <div><span>Role</span><b>Everything</b></div>
              <div><span>Built</span><b>Website · portal · console</b></div>
              <div><span>Status</span><b>Live</b></div>
            </div>
            <div className="soon-ctas rv d3">
              <a className="btn-ghost" href="https://www.movewithdesign.in" target="_blank" rel="noopener noreferrer">Visit movewithdesign.in <span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </div>
        <ScrollHint label="scroll the build" />
      </section>

      <Chapter n="01" name="The brand" title={<>It started as <em>a logo</em>.</>} pills={['Mark & wordmark', 'Colour pairs', 'Pattern system']} tone="zone-lift">
        <div className="pp-brand">
          {BRAND.map((b) => <img key={b.src} src={b.src} alt={b.alt} loading="lazy" />)}
        </div>
      </Chapter>

      <Chapter n="02" name="The website" title={<>One headline. <em>Many subjects.</em></>} pills={['Scroll-motion landing', 'Rotating subject', 'Free tier, then sign up']} tone="zone-sink">
        <Frame><Loop src="/mwd/mwd-landing.mp4" label="The landing page headline cycling through finance, history, your body, life and design" /></Frame>
      </Chapter>

      <Chapter n="03" name="The content" title={<>Designed the curriculum, <em>not just the UI</em>.</>} tone="zone-lift">
        <div className="pp-stats">
          {STATS.map((s) => <div key={s.l}><b>{s.n}</b><span>{s.l}</span></div>)}
        </div>
        <Frame><Loop src="/mwd/mwd-skills.mp4" label="Choosing the Design skill and scrolling its five levels of modules" /></Frame>
        <Pills items={['Lessons, tests & unlocks', 'A certificate per skill', 'Written for students']} />
      </Chapter>

      <Chapter n="04" name="Onboarding" title={<>A few answers → <em>your path</em>.</>} pills={['Pick your skills', 'Goal · level · hours', 'Path built for you']} tone="zone-sink">
        <Frame tone="pp-slotframe"><Slot label="Onboarding flow" kind="flow" /></Frame>
      </Chapter>

      <Chapter n="05" name="Learner portal" title={<>Progress you can <em>see</em>.</>} pills={['My dashboard', 'XP & achievements', 'Synced to the account']} tone="zone-lift">
        <Frame tone="pp-slotframe"><Slot label="Learner dashboard" /></Frame>
      </Chapter>

      <Chapter n="06" name="Admin console" title={<>The whole business, <em>one console</em>.</>} pills={['Live analytics', 'Learners & email', 'Error log']} tone="zone-sink">
        <div className="pp-two">
          <Frame tone="pp-slotframe"><Slot label="Analytics" kind="chart" /></Frame>
          <Frame tone="pp-slotframe"><Slot label="Curation queue" kind="list" /></Frame>
        </div>
      </Chapter>

      <Chapter n="07" name="Agents" title={<>Fresh every morning. <em>Approved by me.</em></>} tone="zone-lift">
        <ol className="pp-pipe" aria-label="Daily curation pipeline, 8:00 AM">
          {PIPE.map((x) => (
            <li key={x.t} className={x.me ? 'me' : ''}><b>{x.t}</b><span>{x.s}</span></li>
          ))}
        </ol>
        <p className="pp-note">Runs daily at 8:00 AM. Nothing publishes without approval.</p>
        <div className="pp-two">
          <Frame><Loop src="/mwd/mwd-news.mp4" label="The AI and design news feed the agent drafts" /></Frame>
          <Frame><img className="pp-media" src="/mwd/mwd-jobs.jpg" alt="Verified design and AI job openings, filterable by country and format" loading="lazy" /></Frame>
        </div>
      </Chapter>

      <Chapter n="08" name="The plumbing" title={<>Set up <em>every layer</em> myself.</>} tone="zone-sink">
        <div className="pp-stack">
          {STACK.map((s) => <div key={s.k}><span>{s.k}</span><b>{s.v}</b></div>)}
        </div>
      </Chapter>

      <Chapter n="09" name="The blog" title={<>Writing that <em>students</em> actually read.</>} pills={['49 posts', '6-7 min reads', 'Careers · AI · craft']} tone="zone-lift">
        <div className="pp-posts">
          {POSTS.map((p) => (
            <a key={p.slug} className="pp-post" href={`https://www.movewithdesign.in/blog/${p.slug}`} target="_blank" rel="noopener noreferrer">
              <span>{p.c}</span>
              <b>{p.t}</b>
              <i aria-hidden="true">Read ↗</i>
            </a>
          ))}
        </div>
      </Chapter>

      <section className="pp-close zone zone-sink zone-cool" data-ch="Live">
        <div className="wrap">
          <img className="pp-mark pp-mark-lg rv" src={MARK} alt="" />
          <h2 className="pp-h rv d1">Zero to live.<br /><em>100s of students.</em></h2>
          <div className="soon-ctas rv d2">
            <a className="btn-ghost" href="https://www.movewithdesign.in" target="_blank" rel="noopener noreferrer">Visit movewithdesign.in <span aria-hidden="true">↗</span></a>
            <a className="btn-ghost" href="https://github.com/prashant-designs" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </section>
    </main>
  );
}
