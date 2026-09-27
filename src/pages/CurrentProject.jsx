import { useEffect, useRef, useState } from 'react';
import InvoiceCaseStudy from '../components/InvoiceCaseStudy';
import CustomerPortalCaseStudy from '../components/CustomerPortalCaseStudy';
import DeveloperPortalCaseStudy from '../components/DeveloperPortalCaseStudy';
import KnowledgeBaseCaseStudy from '../components/KnowledgeBaseCaseStudy';
import GenAICaseStudy from '../components/GenAICaseStudy';
import ScrollHint from '../components/ScrollHint';
import useHeroPointer from '../useHeroPointer';

const STATS = [
  { to: 3, prefix: '', suffix: '×', label: 'self-serve adoption' },
  { to: 40, prefix: '−', suffix: '%', label: 'dev handoffs' },
  { to: 50, prefix: '~', suffix: '%', label: 'vendor dependency' },
  { to: 5, prefix: '', suffix: '+', label: 'surfaces · one owner' },
];

// Admin Portal is temporarily hidden: its card, its index row and its
// overlay branch are all out, so it cannot be reached by click OR by the
// overlay's prev/next either. restoring it means putting it back in these
// four places and moving the group boundary below back to 3.
const SURFACES = ['Customer Portal', 'Invoice Design', 'Developer Portal', 'Knowledge Base', 'Polarin AI Assistance'];

/* the closing index - every case study on the page as one plain arrow-link
   list, which is the onething.design device the brief points at (italic-ish
   label, plain arrow, generous rows) rather than a seventh card family.
   it is a table of contents, NOT a second feature: the cards inside the
   timeline are where each study is argued, this is just the flat list for a
   reader who wants to pick one. `cat` is the card's own rung of the
   categorical --chip-* ramp, so a row and its card upstream carry the same
   hue and the same number - see the note above the timeline's card grids. */
const INDEX = [
  { cat: 1, name: 'Customer Portal', label: 'Customer Portal', note: 'the self-serve front door' },
  { cat: 3, name: 'Invoice Design', label: 'Invoice Design', note: 'transparency for high-ticket billing' },
  { cat: 4, name: 'Knowledge Base', label: 'Knowledge Base', note: 'documentation out of the engineering queue' },
  { cat: 5, name: 'Developer Portal', label: 'Developer Portal', note: 'the API, turned into a product' },
  { cat: 6, name: 'Polarin AI Assistance', label: 'Polarin AI Assistance', note: 'an assistant that answers with evidence' },
];

// the exact vocabulary the immersion covered - nothing added
const FOG_WORDS = ['L1', 'L2', 'L3', 'ports', 'VRs', 'VCs'];

/* the one viewport test the sticky stack is allowed to run on. below 860px the
   rail collapses into the kicker (see TIMELINE SCAFFOLD in index.css) and a
   phone has no room to spend a whole screen on one covered panel, so the
   stack is simply not switched on there and the six steps stay the plain
   document-flow timeline they already are. */
const STACK_MQ = '(min-width: 860px)';

/**
 * One stop on the timeline.
 *
 * The reveal is the site's own `.rv` mechanism (see the observer in
 * src/App.jsx) rather than a third pattern: App scans every `.rv` in the page
 * subtree, adds `.in` at 12% visibility and unobserves. Putting `.rv` on the
 * step element itself buys the reference's `.step` / `.step.in` fade AND its
 * `.step.in .marker` dot-fill in one class, since the dot is a child of the
 * step and can simply be styled off `.tlx-step.in`.
 *
 * The step DOES stick - see useStackFade below and THE STACK in index.css -
 * but nothing here scrubs: no beat is computed from a scroll offset and the
 * page is never held still, which is the whole mechanism this section used to
 * run on and does not any more.
 *
 * `n` is both the step number printed in the rail marker and the number in the
 * kicker - one number, two places, so the onething-style numbered rail and the
 * kicker can never disagree.
 */
function Step({ n, when, kicker, title, id, stepRef, className = '', children }) {
  return (
    <section className={`tlx-step rv ${className}`.trim()} id={id} ref={stepRef}>
      {/* the rail marker: a number on a thin line, with the date under it.
          desktop only - below 860px the number and the date move inline into
          the kicker and only the dot stays on the spine. */}
      <div className="tlx-mark" aria-hidden="true">
        <span className="tlx-n">{n}</span>
        <span className="tlx-when">{when}</span>
      </div>
      <span className="tlx-dot" aria-hidden="true"></span>
      <p className="tlx-kicker">
        <b>{n}</b>{kicker}
        <span className="tlx-when-inline"> · {when}</span>
      </p>
      {title ? <h3 className="tlx-h">{title}</h3> : null}
      {children}
    </section>
  );
}

/**
 * The sticky stack's one piece of JS: it decides whether the stack is on at
 * all, and marks the step that is currently being covered.
 *
 * The stacking itself is native - every .tlx-step is `position: sticky` at the
 * nav's height, and because they are siblings in DOM order the later one
 * paints over the earlier one when they meet at the same sticky offset. There
 * is no scroll hijacking here and no "beat": the browser's own scroll moves
 * everything, this hook only toggles two classes.
 *
 *   .tlx-stack (on .tlx)         the master switch. added only when the
 *                                viewport is wide enough AND every step is
 *                                shorter than the space under the nav - a step
 *                                taller than that would stick with its own
 *                                foot below the fold and never be readable, so
 *                                the whole effect turns itself off instead of
 *                                hiding content. re-tested on resize.
 *   --cover (on a step, inline)  the settle: a continuous 0..1 read of how
 *                                much of this step the next one has actually
 *                                painted over, not a threshold flipped at some
 *                                fixed fraction - so the scale-down and dim
 *                                the CSS drives off it starts at the same
 *                                instant the first pixel of overlap does,
 *                                rather than snapping in partway through.
 *
 * The read is the geometry the effect actually depends on and nothing else:
 * an IntersectionObserver cannot answer this one, because being covered is
 * occlusion, not intersection - a stuck step keeps a constant intersection
 * ratio with the viewport the entire time the next step is sliding over it.
 * So this follows the other convention in this codebase for scroll-linked
 * effects (useGlobalTheme in src/App.jsx): one rAF-throttled measure per
 * scroll frame, an imperative style write, never React state, so scrolling
 * never re-renders the tree. --cover is written directly rather than
 * transitioned in CSS, because it already tracks the scroll position 1:1 -
 * a transition chasing a value that moves every frame would only add lag.
 *
 * Positions come from `offsetTop` rather than getBoundingClientRect on the
 * steps themselves, since a covered step is scaled and its client rect is not
 * where its layout box is. offsetTop is layout, so it is transform-proof; one
 * rect read on the container turns it into viewport space.
 *
 * prefers-reduced-motion keeps the stack and drops the settle: the master
 * switch still goes on, so a step still pins and still gets covered - that is
 * the page's structure, and it is the browser's own scroll doing it - but
 * --cover is always written as 0, so nothing scales or fades. (the matching
 * guard in the CSS covers the case where the setting changes while a class is
 * already on the element.)
 */
function useStackFade(rootRef) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const noMotion = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    const steps = [...root.querySelectorAll('.tlx-step')];
    if (steps.length < 2) return undefined;

    const mq = window.matchMedia(STACK_MQ);
    const stackTop = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--stack-top')) || 100;
    let raf = null;

    const clear = () => {
      root.classList.remove('tlx-stack');
      steps.forEach((s) => {
        s.style.removeProperty('--cover');
        s.style.removeProperty('--covering');
      });
    };

    // every read happens before every write, on purpose: a classList write
    // invalidates layout, so interleaving them would force a fresh layout on
    // each of the six steps rather than one for the whole frame.
    const apply = () => {
      raf = null;
      const base = root.getBoundingClientRect().top;
      const tops = steps.map((s) => s.offsetTop);
      const heights = steps.map((s) => s.offsetHeight);
      const room = window.innerHeight - stackTop;
      const on = mq.matches && heights.every((h) => h <= room);

      root.classList.toggle('tlx-stack', on);
      // raw is the real overlap fraction regardless of reduced-motion - `left`
      // is the px gap still open between the sticky line and the next step's
      // natural top, so (heights[i]-left)/heights[i] is how much of step i the
      // next step has actually painted over at this exact scroll position. a
      // threshold (an earlier version fired at a fixed 65%) meant the first
      // 65% of covering painted step i+1 directly over step i's full-contrast
      // text with no cushion at all, then snapped to scaled+dimmed - that
      // abrupt seam is what read as cluttered. tracking the true fraction
      // means the settle starts at the same instant the first pixel of
      // overlap does.
      //
      // --cover (on step i) drives the settle - scale, dim, marker fade - and
      // is suppressed under reduced motion, same as before.
      // --covering (on step i+1) is NOT the same raw number any more: it is
      // raw run through a x4 curtain curve, because "how much of step i has
      // step i+1 geometrically overlapped" and "how opaque does step i+1's
      // backing fill need to be so step i's text stops being readable" are
      // different questions with different answers. at raw's own pace, the
      // fill was still ~30-50% see-through while step i+1's own (always
      // full-contrast) text was already drawing over step i's - two legible
      // texts overlapping mid-scroll, which is the actual complaint a linear
      // fill produced. the curtain reaches fully opaque by raw=0.25 and holds
      // there, so step i is genuinely hidden well before step i+1's text
      // reaches it, while still opening from 0 at raw=0 - step 0 still gets
      // no backing fill and still reads as the page, not a panel, because
      // Math.min(1, 0 * 4) is still 0. never suppressed under reduced
      // motion, for the reason below - hiding text is not an animation.
      steps.forEach((s, i) => {
        const last = i === steps.length - 1;
        const left = last ? Infinity : base + tops[i + 1] - stackTop;
        const raw = on ? Math.min(1, Math.max(0, 1 - left / heights[i])) : 0;
        s.style.setProperty('--cover', noMotion ? 0 : raw);
        const next = steps[i + 1];
        if (next) next.style.setProperty('--covering', Math.min(1, raw * 4));
      });
    };

    const request = () => {
      if (raf === null) raf = window.requestAnimationFrame(apply);
    };

    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    mq.addEventListener('change', request);
    apply();

    return () => {
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
      mq.removeEventListener('change', request);
      if (raf !== null) window.cancelAnimationFrame(raf);
      clear();
    };
  }, [rootRef]);
}

function CountStat({ to, prefix, suffix, label }) {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !done.current) {
            done.current = true;
            const start = performance.now ? performance.now() : 0;
            const duration = 1100;
            const step = (now) => {
              const t = Math.min(1, (now - start) / duration);
              setN(Math.round(to * (1 - Math.pow(1 - t, 3))));
              if (t < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [to]);

  return (
    <div className="cstat" ref={ref}>
      <div className="n">{prefix}<b>{n}</b><span className="sfx">{suffix}</span></div>
      <div className="l">{label}</div>
    </div>
  );
}

export default function CurrentProject() {
  const [studyOpen, setStudyOpen] = useState(false);
  const [studyIdx, setStudyIdx] = useState(0);
  const ovlPanelRef = useRef(null);
  const spotRef = useRef(null);
  const indexRef = useRef(null);
  const tlxRef = useRef(null);
  const heroRef = useRef(null);

  useStackFade(tlxRef);
  // the fold's shared cursor interaction - same hook, same numbers, on all four
  // inner pages (src/useHeroPointer.js). the hook only needs the fold now: it
  // writes the lean onto it as --hero-tilt-x/y and every .hero-tilt inside
  // spends them, so what leans here is decided in the markup below - and this is
  // the one fold with two of them (the copy, and the motif in the margin).
  useHeroPointer(heroRef);

  // the two in-page jumps the hero offers. plain scrollIntoView rather than an
  // href anchor: the site is on hash routing (#/current), so a `#latest` href
  // would be read as a route, not as a fragment.
  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  const openStudy = (name) => {
    const idx = SURFACES.indexOf(name);
    setStudyIdx(idx < 0 ? 0 : idx);
    setStudyOpen(true);
  };
  const closeStudy = () => setStudyOpen(false);
  // prev/next stay within their own group - the 3 "zero to one" case studies
  // (Customer/Admin/Invoice) cycle among themselves, not into the 3 later ones
  // (Developer Portal/Knowledge Base/GenAI), and vice versa.
  const ZERO_TO_ONE = 2;
  const groupStart = (i) => (i < ZERO_TO_ONE ? 0 : ZERO_TO_ONE);
  const groupLen = (i) => (i < ZERO_TO_ONE ? ZERO_TO_ONE : SURFACES.length - ZERO_TO_ONE);
  const prevStudy = () => setStudyIdx((i) => groupStart(i) + ((i - groupStart(i) + groupLen(i) - 1) % groupLen(i)));
  const nextStudy = () => setStudyIdx((i) => groupStart(i) + ((i - groupStart(i) + 1) % groupLen(i)));

  // a keyboard-openable card: Enter and Space both act like a click, which is
  // what a role="button" element owes a keyboard user.
  const cardKeys = (name) => (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openStudy(name);
    }
  };

  useEffect(() => {
    document.body.classList.toggle('ovl-lock', studyOpen);
    return () => document.body.classList.remove('ovl-lock');
  }, [studyOpen]);

  // jump back to the top of the case study whenever it opens or the surface changes
  useEffect(() => {
    ovlPanelRef.current?.scrollTo(0, 0);
  }, [studyOpen, studyIdx]);

  useEffect(() => {
    if (!studyOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') closeStudy();
      if (e.key === 'ArrowLeft') prevStudy();
      if (e.key === 'ArrowRight') nextStudy();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [studyOpen]);

  return (
    <div>
      {/* 01 · full-fold open, on the shared PAGE HERO RECIPE in src/index.css -
          same six slots, same order, same weight as the other three inner
          pages. this page's own content inside them: the hollow "Building" with
          its per-letter hover, the unfinished-sentence ellipsis, the jump into
          the timeline, and - new, and the last of the six slots this fold was
          still leaving empty - the stacked-panes motif in the right margin.
          zone-cool, like the closing metrics fold's zone-cool-r: zone-sink
          alone resolves to a near-flat #0b0c0f over the whole fold, and this is
          the page whose opening type carries the most of it (the outlined
          "Building" at 108px). the wash is whisper strength - a change in the
          air of the fold, not a visible circle on it. */}
      <section className="hero-fold zone zone-sink zone-cool" ref={heroRef} data-ch="Intro">
        {/* the recipe's motif slot, ambient: the fold's right margin, outside
            the reading column, hairline weight, pointer-events none, gone under
            1100px - and the smallest of the four drawings, because this is the
            sparsest of the four folds. one product drawn three times: today's
            screen in front, the step before it behind, and the first empty one
            dashed at the back. .cp-motif holds the placement and .cp-stack the
            tilt, so the wrapper's translateY(-50%) and the drawing's rotation
            are not fighting for one `transform` - see THE POINTER LAYER in
            index.css. data-depth is what separates the three panes under the
            cursor.
            this is the one fold of the four with TWO tilt cards, and it is
            allowed one because the motif sits in the margin: it is a sibling of
            the copy's card below, not a descendant, so the two lean side by side
            off the same --hero-tilt-x/y instead of compounding. About's and
            Other Projects' motifs are inside their reading column, which is why
            theirs simply ride along inside the text card. */}
        <div className="cp-motif hero-tilt-scene" aria-hidden="true">
          <svg className="cp-stack hero-tilt" viewBox="0 0 122 100">
            <g className="cs-first" data-depth="3">
              <rect x="6" y="44" width="88" height="44" rx="7" />
            </g>
            <g data-depth="6">
              <rect x="17" y="28" width="88" height="44" rx="7" />
            </g>
            <g className="cs-now" data-depth="9">
              <rect x="28" y="12" width="88" height="44" rx="7" />
              <path className="cs-bar" d="M38 24h30" />
            </g>
          </svg>
        </div>
        {/* the tilt scene and the tilt card are the shared pair from
            THE POINTER LAYER in index.css, and the card is this fold's TEXT -
            eyebrow, headline, lede and action row. before this the fold's only
            tilt card was the motif above, i.e. the cursor moved a 120px drawing
            in the margin and left every word of the copy still; the motif keeps
            its own lean and the words have one now too. */}
        <div className="wrap hero-tilt-scene">
          <div className="hero-tilt">
            <p className="hero-eyebrow rv">Current Project · <b>2022 - now</b></p>
            {/* the recipe's headline: one hollow line, the rest solid, and the
                accent on the terminal glyph. this page's sentence is the one that
                is deliberately unfinished, so its terminal glyph is the animated
                ellipsis rather than a full stop - .tdots carries --signal, the
                gradient's solid stand-in, for the same reason .hero-dot carries
                --grad on the other three. the per-letter <b>s inside .bt are this
                page's own hover lift; the stroke they draw is inherited from
                .hero-hollow, not restated. */}
            <h2 className="hero-title rv d1">
              <span className="hero-hollow bt">{'Building'.split('').map((ch, i) => <b key={i}>{ch}</b>)}</span><br />
              Polarin
              <span className="tdots" aria-hidden="true"><i></i><i></i><i></i></span>
            </h2>
            <p className="hero-lede rv d2">Four years on one product, still going - from the first empty screen to the roadmap it runs on today.</p>

            {/* the same in-page jump the hero has always offered - the GenAI
                initiative is only ever featured once on this page (the spotlight
                step further down), so this scrolls there rather than opening a
                second entry point. what changed is only the control: it was a
                bespoke 560px "pointer card" with a pulsing kicker, i.e. a fourth
                kind of widget in the slot the other three pages fill with a ghost
                button. the label carries the same two pieces of information the
                card's two lines did. */}
            <div className="soon-ctas rv d3">
              <button type="button" className="btn-ghost" onClick={() => scrollTo(spotRef)}>
                Latest · Polarin AI Assistance <span aria-hidden="true">↓</span>
              </button>
            </div>
          </div>
        </div>
        <ScrollHint label="scroll the timeline" />
      </section>

      {/* 02 · the whole arc, as a sticky-stacked scroll timeline.
          this section used to be a pinned scroll-scrubbed scene - a tall track
          whose sticky stage held a clickable rail and swapped one detail panel
          per beat. that mechanism is still gone and is not coming back: there
          is no track, no stage, no beat, and nothing computes a scroll
          position into a step index.
          what the six steps do now is native `position: sticky` stacking -
          each .tlx-step pins under the nav and the next one, being later in
          the DOM, scrolls up and covers it, with the outgoing one settling
          back a touch (see useStackFade above and .tlx-stack in index.css).
          the browser's own scroll drives all of it at its own speed, and each
          step still fades in on first entrance via the site's shared .rv
          observer.
          .flip stays, and stays on the whole section rather than per step: the
          timeline is one light chapter in the page's dark/light rhythm, which
          is what it already was when the pinned stage carried the marker. six
          steps each flipping for themselves would be six paper changes in one
          scroll - and now that the steps paint an opaque panel while stacked,
          it would also be six of them disagreeing with each other on screen at
          the same time. */}
      <section className="timeline-sec zone zone-lift flip" data-ch="Timeline">
        <div className="wrap">
          <div className="tlx" ref={tlxRef}>

            <Step n="01" when="2022" kicker="The starting point" title={<>What is <span className="pw">Polarin</span></>}>
              {/* one sentence, no figure. the metadata sidebar that used to sit
                  beside this copy, and the "in plain terms" analogy under it,
                  are both gone on purpose - every value in that sidebar was a
                  claim this page already makes somewhere else (first designer
                  → step 02, AI product manager → step 04, live since 2023 →
                  step 03, still building → the closing fold), so cutting it
                  costs the page no information and buys it a quiet opening.
                  the globe that used to sit under this paragraph is gone too -
                  it was the tallest thing in the step by a wide margin, which
                  is what set the ceiling on --stack-top's room check for every
                  other step on the page. */}
              <p><a className="inline-link" href="https://www.lightstorm.net/" target="_blank" rel="noopener noreferrer">Lightstorm</a>&apos;s Network-as-a-Service platform - private, low-latency links between data centers, clouds and SaaS apps, provisioned in minutes through an API instead of a paperwork trail.</p>
            </Step>

            {/* "learning the domain" - the vocabulary as noise on day one,
                resolving as it gets learned. the fog chips stay because they
                ARE the argument; what came off is the three-stream / arc-join /
                knowledge-doc diagram that used to sit under them, which spent a
                whole screen and about 90 words saying what the two sentences
                here say: where the four months went, and that the first thing
                made was the doc rather than a screen. nothing was dropped from
                that - the three inputs are the three clauses of the second
                sentence. */}
            <Step n="02" when="first months" kicker="Learning the domain" title="Joined as its first designer">
              <p>Polarin was a name on a whiteboard and I was its first designer - no telecom background, no template to copy.</p>

              <div className="tl-fog">
                <span className="tl-fog-l">day one, this was noise</span>
                {FOG_WORDS.map((w, i) => (
                  <span className="tl-fog-w" key={w} style={{ animationDelay: `${260 + i * 120}ms` }}>{w}</span>
                ))}
              </div>
              <p className="tl-fog-cap">four months later it was the vocabulary I designed in <b>·</b> figma stayed shut until then</p>

              <p>Four months with the architects, structured interviews across sales, ops and engineering, every public telecom and NaaS doc I could find. No one had written the domain down yet, so the first thing I made wasn&apos;t a screen - it was that doc.</p>
            </Step>

            {/* data-cat on each badge is the case study's rung of the
                categorical --chip-* ramp (see TOKENS / CARD SYSTEM in
                index.css). the six run 1..6 across BOTH grids on this page -
                this one and step 04's three-card row below, which is where the
                GenAI card (6) now lives - they are one set of six parallel
                categories that happens to be split over two steps, so the
                numbering must not restart here. */}
            <Step n="03" when="2022 - 2024" kicker="Building it, zero to one" title="Built from nothing">
              <p>Five surfaces, one designer - a design system first, so screens could ship fast. Self-serve launched in 2023: 90 days of manual provisioning became 10 minutes.</p>

              <div className="tl-cs-grid">
                <article className="tl-cs-card" role="button" tabIndex={0} onClick={() => openStudy('Customer Portal')} onKeyDown={cardKeys('Customer Portal')}>
                  <span className="tl-cs-icon" data-cat="1" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                      <circle cx="5" cy="12" r="2.3" />
                      <circle cx="19" cy="12" r="2.3" />
                      <path d="M7.3 12h9.4" strokeDasharray="2.2 3">
                        <animate attributeName="stroke-dashoffset" from="10.4" to="0" dur="1.1s" repeatCount="indefinite" />
                      </path>
                    </svg>
                  </span>
                  <h4>Customer Portal</h4>
                  <div className="tl-cs-row"><span>about</span><p>the self-serve front door - order, manage, monitor connectivity</p></div>
                  <div className="tl-cs-row"><span>role</span><p>designed it 0 → 1 · now own its roadmap & ship its frontend</p></div>
                  <div className="tl-cs-foot"><span className="tl-cs-impact">3× <small>self-serve adoption</small></span><span className="tl-cs-link">Deep dive →</span></div>
                </article>

                <article className="tl-cs-card" role="button" tabIndex={0} onClick={() => openStudy('Invoice Design')} onKeyDown={cardKeys('Invoice Design')}>
                  <span className="tl-cs-icon" data-cat="3" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 3h9l3 3v15H6z" />
                      <path d="M9 9h6M9 12.5h6M9 16h3.5" opacity="0.55" />
                      <path d="M14.3 15.2l1.8 1.8 3.3-3.7" strokeDasharray="8.4" strokeDashoffset="8.4">
                        <animate attributeName="stroke-dashoffset" values="8.4;0;0;8.4" keyTimes="0;.4;.8;1" dur="2.6s" repeatCount="indefinite" />
                      </path>
                    </svg>
                  </span>
                  <h4>Invoice Design</h4>
                  <div className="tl-cs-row"><span>about</span><p>transparency for high-ticket billing - clarity for every second billed</p></div>
                  <div className="tl-cs-row"><span>role</span><p>designed a template that adapts complicated billing to complicated products</p></div>
                  <div className="tl-cs-foot"><span className="tl-cs-impact">trust <small>transparent · scalable</small></span><span className="tl-cs-link">Deep dive →</span></div>
                </article>
              </div>

            </Step>

            {/* step 05 - the GenAI spotlight - folded back in as this grid's
                third card. it was promoted out to its own step for a pass, but
                once it lost the ring/badge that had made it "featured" (see
                git history), it was just a fourth .tl-cs-card-shaped thing
                sitting alone in its own step - so it comes back to the row it
                started in, same as Knowledge Base and Developer Portal. the
                hero's "latest" pointer now scrolls to this step rather than a
                step of its own. */}
            <Step n="04" when="2025 - now" kicker="Moving into product" title="Now: AI product manager" id="latest" stepRef={spotRef}>
              <p>Same platform, different lens - PRDs, roadmaps, prioritisation, UAT, frontend deployment. AI runs the loop with me: real prototypes, not mockups.</p>

              <div className="tl-cs-grid">
                <article className="tl-cs-card" role="button" tabIndex={0} onClick={() => openStudy('Knowledge Base')} onKeyDown={cardKeys('Knowledge Base')}>
                  <span className="tl-cs-icon" data-cat="4" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 5.5h11M4 9.5h8M4 13.5h9" opacity="0.55" />
                      <g>
                        <animateTransform attributeName="transform" type="translate" values="-2 -1; 2 1; -2 -1" dur="3.2s" repeatCount="indefinite" />
                        <circle cx="14.6" cy="14.6" r="4.1" />
                        <line x1="17.6" y1="17.6" x2="21" y2="21" />
                      </g>
                    </svg>
                  </span>
                  <h4>Knowledge Base</h4>
                  <div className="tl-cs-row"><span>about</span><p>an in-house docs portal on Strapi - content owners publish it, not engineers, and every page also exists as markdown any LLM can read</p></div>
                  <div className="tl-cs-row"><span>role</span><p>designed it in Figma, built it with Claude Code · now designing the Jira → AI → approval pipeline</p></div>
                  <div className="tl-cs-foot"><span className="tl-cs-impact">phase 1 <small>live · automation next</small></span><span className="tl-cs-link">Deep dive →</span></div>
                </article>

                <article className="tl-cs-card" role="button" tabIndex={0} onClick={() => openStudy('Developer Portal')} onKeyDown={cardKeys('Developer Portal')}>
                  <span className="tl-cs-icon" data-cat="5" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8.5 6L3 12l5.5 6" />
                      <path d="M15.5 6L21 12l-5.5 6" />
                      <line x1="12" y1="7.5" x2="12" y2="16.5" strokeWidth="2">
                        <animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0;.45;.5;.95;1" dur="1.1s" repeatCount="indefinite" />
                      </line>
                    </svg>
                  </span>
                  <h4>Developer Portal</h4>
                  <div className="tl-cs-row"><span>about</span><p>customers with their own NMS asked to drive Polarin from inside it - so we productised the API we had already built for ourselves</p></div>
                  <div className="tl-cs-row"><span>role</span><p>DX design, docs & frontend · PRD + pricing framework · volumetrics with engineering</p></div>
                  <div className="tl-cs-foot"><span className="tl-cs-impact">upsell <small>live with customers</small></span><span className="tl-cs-link">Deep dive →</span></div>
                </article>

                <article className="tl-cs-card" role="button" tabIndex={0} onClick={() => openStudy('Polarin AI Assistance')} onKeyDown={cardKeys('Polarin AI Assistance')}>
                  <span className="tl-cs-icon" data-cat="6" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
                      <circle cx="12" cy="12" r="4.2">
                        <animate attributeName="opacity" values="1;0.4;1" dur="2.2s" repeatCount="indefinite" />
                      </circle>
                    </svg>
                  </span>
                  <h4>Polarin AI Assistance</h4>
                  <div className="tl-cs-row"><span>about</span><p>an assistant that turns &quot;how is my network doing?&quot; into a conclusion, the evidence behind it, and a next step the customer confirms</p></div>
                  <div className="tl-cs-row"><span>role</span><p>product definition · AI behaviour &amp; guardrails · response design · frontend spec · built by a specialist AI delivery team</p></div>
                  <div className="tl-cs-foot"><span className="tl-cs-impact">POC done <small>full build underway</small></span><span className="tl-cs-link">Deep dive →</span></div>
                </article>
              </div>
            </Step>

          </div>
        </div>
      </section>

      {/* 03 · every case study, as one plain list. the arrow-link device from
          onething.design: a big display label, a quiet note, a plain arrow, and
          a lot of air per row. it is the flat index of the same six studies the
          timeline argues one at a time - each row opens the same overlay
          through the same openStudy() call the cards use. */}
      <section className="zone zone-sink zone-cool-r" data-ch="Case Studies" ref={indexRef}>
        <div className="wrap tlx-index-sec">
          <p className="eyebrow rv">Every case study</p>
          <h2 className="ch-title t-section rv d1">All six <span>case studies.</span></h2>
          <ul className="tlx-index rv d2">
            {INDEX.map((c) => (
              <li key={c.name}>
                <button type="button" className="tlx-idx" onClick={() => openStudy(c.name)}>
                  <span className="tlx-idx-n" data-cat={String(c.cat)}>{`0${c.cat}`}</span>
                  <span className="tlx-idx-t">{c.label}</span>
                  <span className="tlx-idx-m">{c.note}</span>
                  <span className="tlx-idx-go" aria-hidden="true">→</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 04 · overall metrics */}
      <section className="zone zone-lift" data-ch="Metrics">
        <div className="wrap metrics-sec">
          <p className="eyebrow rv" style={{ justifyContent: 'center' }}>Four years in</p>
          <h2 className="ch-title t-section rv d1">What <span>moved.</span></h2>
          <div className="cs-stats rv d2" style={{ justifyContent: 'center' }}>
            {STATS.map((s) => (
              <CountStat key={s.label} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* 05 · still building */}
      <section className="still-sec zone zone-lift-hi" data-ch="Still Building">
        <div className="wrap" style={{ textAlign: 'center' }}>
          <h2 className="still-t rv">still building<i className="tcur"></i></h2>
          <div className="soon-bar rv d1" style={{ maxWidth: '280px', margin: '22px auto 0' }}><i></i></div>
          <div className="soon-ctas rv d2" style={{ justifyContent: 'center' }}>
            <a className="btn-big" href="#/journey">The whole story - My Journey <span aria-hidden="true">→</span></a>
            <a className="btn-ghost" href="#/">Home</a>
          </div>
        </div>
      </section>

      {/* case study overlay */}
      <div className={`ovl ${studyOpen ? 'open' : ''}`} role="dialog" aria-modal="true" aria-labelledby="ovlTitle">
        <div className="ovl-scrim" onClick={closeStudy}></div>
        <button className="ovl-close" onClick={closeStudy} aria-label="Close">×</button>
        <div className="ovl-panel" ref={ovlPanelRef}>
          {SURFACES[studyIdx] === 'Customer Portal' ? (
            <CustomerPortalCaseStudy onPrev={prevStudy} onNext={nextStudy} idx={studyIdx - groupStart(studyIdx)} total={groupLen(studyIdx)} />
          ) : SURFACES[studyIdx] === 'Invoice Design' ? (
            <InvoiceCaseStudy onPrev={prevStudy} onNext={nextStudy} idx={studyIdx - groupStart(studyIdx)} total={groupLen(studyIdx)} />
          ) : SURFACES[studyIdx] === 'Developer Portal' ? (
            <DeveloperPortalCaseStudy onPrev={prevStudy} onNext={nextStudy} idx={studyIdx - groupStart(studyIdx)} total={groupLen(studyIdx)} />
          ) : SURFACES[studyIdx] === 'Knowledge Base' ? (
            <KnowledgeBaseCaseStudy onPrev={prevStudy} onNext={nextStudy} idx={studyIdx - groupStart(studyIdx)} total={groupLen(studyIdx)} />
          ) : (
            <GenAICaseStudy onPrev={prevStudy} onNext={nextStudy} idx={studyIdx - groupStart(studyIdx)} total={groupLen(studyIdx)} />
          )}
        </div>
      </div>
    </div>
  );
}
