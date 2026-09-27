import { useEffect, useRef, useState } from 'react';
import useHeroPointer from '../useHeroPointer';
import ScrollHint from '../components/ScrollHint';

const PROJECTS = [
  'Jeevika App - empowering street vendors',
  'Enote - seamless e-paper note-taking',
  'Portico - HR & payroll suite',
  'Giesecke + Devrient - cash counting UI',
];

/* the fold's three ambient chips - see THE AMBIENT CHIP in PAGE HERO RECIPE
   (src/index.css). every one of the three says something this page already says
   out loud: the count is PROJECTS.length itself (the four case studies the
   terminal is typing through), "one at a time" is the lede's own phrase, and
   Behance is where the CTA under them points. `depth` is the drift amount
   useHeroPointer reads (src/useHeroPointer.js) - three different values in the
   shared 3-30 range so the chips separate from each other rather than sliding as
   one plane, which is the whole difference between this fold's interaction and
   My Journey's. top/right keep them in the right margin, outside the reading
   column, and they are inline because the hook owns these elements' transform. */
const HERO_CHIPS = [
  { label: `${PROJECTS.length} case studies`, depth: 14, top: '20%', right: '7%' },
  { label: 'one at a time', depth: 26, top: '30%', right: '21%' },
  { label: 'on Behance', depth: 20, top: '74%', right: '11%' },
];

/* ---- Move With Design --------------------------------------------------
   The one project on this page with more than a Behance link behind it: a
   brand identity from 2024 that became a working learning platform in 2026,
   designed and built solo. Three surfaces, one tab each - a real screen,
   a headline, three pills. The admin console is the only surface without a
   public page, so until a screen of it is added it is shown as the modules
   it runs rather than a mock of a screen that does not exist. */
const MWD_SURFACES = [
  {
    k: 'site',
    tab: 'Website',
    img: '/mwd/mwd-home.jpg',
    alt: 'The Move With Design landing page: Move with finance, with a Find your move button',
    h: 'One headline, many subjects',
    pills: ['Scroll-motion landing', '49 long-form posts', 'Daily AI & design news'],
  },
  {
    k: 'learn',
    tab: 'Learner portal',
    img: '/mwd/mwd-skills.jpg',
    alt: 'The Skills page: Pick what moves you, with Design, Finance, History and Your Body skill cards',
    h: 'Pick a skill, climb five levels',
    pills: ['Lessons, tests & unlocks', 'Certificates per skill', 'XP and achievements'],
  },
  {
    k: 'admin',
    tab: 'Admin console',
    h: 'The whole business, one console',
    pills: ['Real visitor analytics', 'Content curation', 'Learner management'],
    modules: ['Analytics', 'Business dashboard', 'News curation', 'Content', 'Learners', 'Email & subscribers', 'Affiliate manager', 'Error log', 'Navigation', 'Settings'],
  },
];

const MWD_BRAND = [
  { src: '/mwd/mwd-brand-logo.jpg', alt: 'The Move With Design mark on pink' },
  { src: '/mwd/mwd-brand-colours.jpg', alt: 'The mark in its four colour pairings' },
  { src: '/mwd/mwd-brand-tote.jpg', alt: 'The mark on a tote bag' },
  { src: '/mwd/mwd-brand-pattern.jpg', alt: 'The repeat pattern built from the mark' },
];

function MoveWithDesign() {
  const [tab, setTab] = useState('site');
  const cur = MWD_SURFACES.find((x) => x.k === tab);
  return (
    <section className="op-mwd zone zone-lift" data-ch="Move With Design">
      <div className="wrap">
        <p className="eyebrow rv">Side project · founder</p>
        <div className="op-mwd-head rv d1">
          <img className="op-mwd-mark" src="/mwd/mwd-mark.svg" alt="" />
          <h2>Move With Design</h2>
        </div>
        <p className="op-mwd-lede rv d2">A brand I drew in 2024, rebuilt in 2026 as a learning platform - designed, built and shipped solo.</p>
        <div className="op-mwd-meta rv d2">
          <div><span>Role</span><b>Design, build, run</b></div>
          <div><span>Stack</span><b>Next.js · Supabase · Vercel</b></div>
          <div><span>Timeline</span><b>Brand 2024 → platform 2026</b></div>
        </div>

        <div className="op-mwd-tabs rv d3" role="tablist" aria-label="Move With Design surfaces">
          {MWD_SURFACES.map((x) => (
            <button key={x.k} type="button" role="tab" id={`mwd-tab-${x.k}`} aria-selected={tab === x.k} aria-controls="mwd-panel" onClick={() => setTab(x.k)}>
              {x.tab}
            </button>
          ))}
        </div>
        <div className="op-mwd-panel" id="mwd-panel" role="tabpanel" aria-labelledby={`mwd-tab-${tab}`}>
          <h3>{cur.h}</h3>
          <div className="op-mwd-pills">{cur.pills.map((p) => <span className="chip" key={p}>{p}</span>)}</div>
          {cur.img ? (
            <figure className="op-mwd-frame"><img src={cur.img} alt={cur.alt} /></figure>
          ) : (
            <div className="op-mwd-mods" aria-label="Admin console modules">
              {cur.modules.map((m) => <span key={m}>{m}</span>)}
            </div>
          )}
        </div>

        <p className="eyebrow op-mwd-sub rv">Where it started · the 2024 identity</p>
        <div className="op-mwd-brand rv d1">
          {MWD_BRAND.map((b) => <img key={b.src} src={b.src} alt={b.alt} loading="lazy" />)}
        </div>

        <div className="soon-ctas op-mwd-ctas rv d2">
          <a className="btn-ghost" href="https://www.movewithdesign.in" target="_blank" rel="noopener noreferrer">Visit movewithdesign.in <span aria-hidden="true">↗</span></a>
          <a className="btn-ghost" href="https://github.com/prashant-designs" target="_blank" rel="noopener noreferrer">See the commits on GitHub <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </section>
  );
}

function useTypewriter(words) {
  const [text, setText] = useState('');
  const [idx, setIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[idx];
    let delay = deleting ? 28 : 45;
    if (!deleting && text === current) delay = 1500;
    if (deleting && text === '') delay = 350;

    const t = setTimeout(() => {
      if (!deleting && text === current) {
        setDeleting(true);
        return;
      }
      if (deleting && text === '') {
        setDeleting(false);
        setIdx((i) => (i + 1) % words.length);
        return;
      }
      setText(deleting ? current.slice(0, text.length - 1) : current.slice(0, text.length + 1));
    }, delay);
    return () => clearTimeout(t);
  }, [text, deleting, idx, words]);

  return text;
}

/* the headline's second line. the two type treatments are the shared ones from
   PAGE HERO RECIPE, not this component's own: .hero-hollow on the word is the
   same 1.2px --mute stroke My Journey and Current Project draw on their hollow
   line, and .hero-dot on the full stop is the same gradient text-clip About
   draws on its. the bounce is what is actually this page's - the letters are
   split so each one can carry its own delay, and the full stop is the last one
   in that sequence rather than a static glyph parked beside it. */
function ComingBuilder() {
  return (
    <span className="op-coming">
      <span className="op-bounce hero-hollow">
        {'coming'.split('').map((ch, i) => (
          <span key={i} style={{ animationDelay: `${i * 0.07}s` }}>{ch}</span>
        ))}
        <span className="hero-dot" style={{ animationDelay: '0.42s' }}>.</span>
      </span>
      <svg className="op-builder" viewBox="0 0 60 60" aria-hidden="true">
        <circle cx="30" cy="13" r="7" fill="none" stroke="var(--mute)" strokeWidth="2.4" />
        <line x1="30" y1="20" x2="30" y2="40" stroke="var(--mute)" strokeWidth="2.4" strokeLinecap="round" />
        <line x1="30" y1="40" x2="21" y2="56" stroke="var(--mute)" strokeWidth="2.4" strokeLinecap="round" />
        <line x1="30" y1="40" x2="39" y2="56" stroke="var(--mute)" strokeWidth="2.4" strokeLinecap="round" />
        <line x1="30" y1="28" x2="17" y2="24" stroke="var(--mute)" strokeWidth="2.4" strokeLinecap="round" />
        <g>
          <line x1="30" y1="28" x2="46" y2="16" stroke="var(--mute)" strokeWidth="2.4" strokeLinecap="round" />
          <rect x="43" y="9" width="14" height="7" rx="2" fill="var(--mute)" transform="rotate(-38 50 12.5)" />
          <animateTransform attributeName="transform" type="rotate" values="0 30 28; -30 30 28; 8 30 28; 0 30 28" keyTimes="0; 0.35; 0.6; 1" dur="1.1s" repeatCount="indefinite" />
        </g>
      </svg>
    </span>
  );
}

export default function OtherProject() {
  const typed = useTypewriter(PROJECTS);
  const heroRef = useRef(null);

  // the fold's shared cursor interaction - same hook, same numbers, on all four
  // inner pages (src/useHeroPointer.js). the hook only needs the fold now: it
  // writes the lean onto it as --hero-tilt-x/y and every .hero-tilt inside
  // spends them, so what leans here is decided in the markup below.
  useHeroPointer(heroRef);

  /* DARK STOCK, like the other three inner pages' opening folds. this page used
     to carry .flip-lock - the marker useGlobalTheme reads to hold the one global
     .theme-light flag on for as long as the page is mounted - on the argument
     that a one-section page has nothing to alternate against, so it may as well
     be permanent paper. that argument is about this page on its own; seen next
     to its three siblings it was the single most jarring thing in the set, one
     fold opening on white while three opened on ink. it is a plain dark
     .zone-sink fold now, on the shared PAGE HERO RECIPE in src/index.css.
     nothing about the flip mechanism changed: the page simply carries neither
     .flip nor .flip-lock, so useGlobalTheme finds no light chapter and leaves
     the page dark - and the moment a .flip section is added under this fold, the
     scroll-driven turn-over works exactly as it does on the other pages. */
  return (
    <>
    <section className="hero-fold zone zone-sink zone-cool" ref={heroRef} data-ch="Intro">
      {/* the recipe's ambient chips (HERO_CHIPS above). this fold's tilt card
          was the only thing in it that answered the cursor, so the shared
          pointer hook had one plane to move here against My Journey's four -
          same hook, same numbers, visibly less alive. these are the missing
          planes, in the ambient zone the recipe reserves for them.
          the coordinates go in as --hero-amb-top / --hero-amb-right rather than
          as top / right - same percentages, snapped to the nearest line of the
          drawn grid by the CSS. see THE AMBIENT SNAP in index.css. */}
      {HERO_CHIPS.map((c) => (
        <span
          key={c.label}
          className="glyph"
          data-depth={c.depth}
          style={{ '--hero-amb-top': c.top, '--hero-amb-right': c.right }}
        >
          {c.label}
        </span>
      ))}
      <div className="wrap hero-tilt-scene">
        {/* the reveal used to be one .rv on this box, i.e. the whole fold
            arriving as a single slab - the only one of the four that did not
            stagger its own slots. it is per-slot now, in the same order and on
            the same three delay rungs the other three heroes use: eyebrow,
            headline (d1), lede (d2), motif (d2, beside the lede it belongs to),
            action row (d3).
            it is also this fold's TILT CARD (see WHAT LEANS in THE POINTER LAYER
            in index.css) - it already was the whole text block, so it took the
            class and needed no new box. the card used to be the terminal panel
            inside it, which meant the one thing on this fold that answered the
            cursor was a decoration and not a word of the copy. the panel leans
            with the card now, because it sits in the reading column and is
            therefore inside it. */}
        <div className="soon-box hero-tilt">
          <p className="hero-eyebrow rv">Other Projects · <b>before &amp; alongside Polarin</b></p>
          <h2 className="hero-title rv d1">More projects,<br /><ComingBuilder /></h2>
          <p className="hero-lede rv d2">Design work from before and alongside Polarin - full case studies are being written up, one at a time.</p>
          {/* the recipe's motif slot, inline: the fold's one decorative element,
              in the reading column, opened on --sp-fold, at card weight. the
              plain wrapper is here to carry the reveal, so the panel's own box
              stays free of `transform` - it used to be this fold's tilt card and
              is now one more thing riding inside it, and two rotations on one
              chain would compound. the wrapper carries no styling of its own, so
              the panel's --sp-fold top margin collapses through it unchanged. */}
          <div className="rv d2">
            <div className="soon-term">
              <span className="k">$</span> writing-case-study.sh<br />
              <span className="k">&gt;</span> <span className="a">{typed}</span><span className="cur"></span>
              <div className="soon-bar"><i></i></div>
            </div>
          </div>
          {/* ghost buttons, both of them. the Behance link was the accent's
              filled .btn-big pill, which is one per page and belongs on a
              closing hand-off - and this fold now carries the accent once
              already, on the headline's gradient full stop. two accents in one
              viewport is what THE ACCENT exists to prevent; first-in-row is what
              makes this the primary action. */}
          <div className="soon-ctas rv d3">
            <a className="btn-ghost" href="https://www.behance.net/NAYA_DESIGN" target="_blank" rel="noopener noreferrer">Explore these case studies on Behance <span aria-hidden="true">→</span></a>
            <a className="btn-ghost" href="#/">Back to home</a>
          </div>
        </div>
      </div>
      <ScrollHint label="scroll to Move With Design" />
    </section>
    <MoveWithDesign />
    </>
  );
}
