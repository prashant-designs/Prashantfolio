import { useEffect, useRef, useState } from 'react';
import InvoiceCaseStudy from '../components/InvoiceCaseStudy';
import AdminPortalCaseStudy from '../components/AdminPortalCaseStudy';
import CustomerPortalCaseStudy from '../components/CustomerPortalCaseStudy';
import DeveloperPortalCaseStudy from '../components/DeveloperPortalCaseStudy';
import KnowledgeBaseCaseStudy from '../components/KnowledgeBaseCaseStudy';
import GenAICaseStudy from '../components/GenAICaseStudy';
import ScrollHint from '../components/ScrollHint';

const STATS = [
  { to: 3, prefix: '', suffix: '×', label: 'self-serve adoption' },
  { to: 40, prefix: '−', suffix: '%', label: 'dev handoffs' },
  { to: 50, prefix: '~', suffix: '%', label: 'vendor dependency' },
  { to: 5, prefix: '', suffix: '+', label: 'surfaces · one owner' },
];

const SURFACES = ['Customer Portal', 'Admin Portal', 'Invoice Design', 'Developer Portal', 'Knowledge Base', 'GenAI Initiative'];

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
  { cat: 2, name: 'Admin Portal', label: 'Admin Portal', note: 'the internal ops console' },
  { cat: 3, name: 'Invoice Design', label: 'Invoice Design', note: 'transparency for high-ticket billing' },
  { cat: 4, name: 'Knowledge Base', label: 'Knowledge Base', note: 'answers before tickets' },
  { cat: 5, name: 'Developer Portal', label: 'Developer Sandbox', note: 'a live API test environment' },
  { cat: 6, name: 'GenAI Initiative', label: 'GenAI Initiative', note: 'the pre-sales recommendation engine' },
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
      // --covering (on step i+1) is the same raw number but NEVER
      // suppressed: it is how opaque step i+1's own backing fill needs to be
      // to actually hide step i, which still has to happen with the settle's
      // animation turned off, or step i+1 would be a transparent pane with
      // step i's text bleeding through it. step 0 never receives one, so it
      // has no backing fill at all and reads as the page, not a panel - it is
      // never covering anything behind it, because there is nothing there.
      steps.forEach((s, i) => {
        const last = i === steps.length - 1;
        const left = last ? Infinity : base + tops[i + 1] - stackTop;
        const raw = on ? Math.min(1, Math.max(0, 1 - left / heights[i])) : 0;
        s.style.setProperty('--cover', noMotion ? 0 : raw);
        const next = steps[i + 1];
        if (next) next.style.setProperty('--covering', raw);
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

  useStackFade(tlxRef);

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
  const groupStart = (i) => (i < 3 ? 0 : 3);
  const groupLen = () => 3;
  const prevStudy = () => setStudyIdx((i) => groupStart(i) + ((i - groupStart(i) + groupLen() - 1) % groupLen()));
  const nextStudy = () => setStudyIdx((i) => groupStart(i) + ((i - groupStart(i) + 1) % groupLen()));

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
      {/* 01 · full-fold open. zone-cool, like the closing metrics fold's
          zone-cool-r: zone-sink alone resolves to a near-flat #0b0c0f over the
          whole fold, and this is the one page whose opening type is already
          carrying the accent (the outlined "Building", the gradient in
          "Polarin"). the wash is whisper strength - a change in the air of the
          fold, not a visible circle on it. */}
      <section className="tl-hero zone zone-sink zone-cool" data-ch="Intro">
        <div className="wrap tl-head">
          <p className="pol-kicker rv">Current Project · 2022 - now</p>
          <h2 className="pol-title rv d1">
            <span className="bt">{'Building'.split('').map((ch, i) => <b key={i}>{ch}</b>)}</span><br />
            <span className="pw">Polarin</span>
            <span className="tdots" aria-hidden="true"><i></i><i></i><i></i></span>
          </h2>
          <p className="pol-open-sub rv d2">Four years on one product, still going - from the first empty screen to the roadmap it runs on today.</p>

          {/* the reference's hero "featured · latest" card, deliberately built
              as a POINTER rather than as a card. the GenAI initiative already
              gets the featured treatment once on this page - the ringed
              spotlight step further down - and the brief is explicit that it
              must not end up featured in two places. so this is the
              onething-style arrow link instead: a label, a line and an arrow
              that scrolls to the one place the study is actually argued. it is
              a shortcut into the page, not a second entry point. */}
          <button type="button" className="tlx-latest rv d3" onClick={() => scrollTo(spotRef)}>
            <span className="tlx-latest-txt">
              <span className="tlx-latest-k"><i aria-hidden="true"></i>Latest · shipping now</span>
              <span className="tlx-latest-t">Polarin&apos;s first GenAI initiative</span>
            </span>
            <span className="tlx-latest-go" aria-hidden="true">↓</span>
          </button>
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
              <p>Lightstorm&apos;s Network-as-a-Service platform - private, low-latency links between data centers, clouds and SaaS apps, provisioned in minutes through an API instead of a paperwork trail.</p>
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
            <Step n="03" when="2022 - 2024" kicker="Building it, zero to one" title="Three products, built from nothing">
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

                <article className="tl-cs-card" role="button" tabIndex={0} onClick={() => openStudy('Admin Portal')} onKeyDown={cardKeys('Admin Portal')}>
                  <span className="tl-cs-icon" data-cat="2" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <g>
                        <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="7s" repeatCount="indefinite" />
                        <circle cx="12" cy="12" r="3.4" />
                        <path d="M12 3v2.4M12 18.6V21M21 12h-2.4M5.4 12H3M18.1 5.9l-1.7 1.7M7.6 16.5l-1.7 1.7M18.1 18.1l-1.7-1.7M7.6 7.5L5.9 5.9" />
                      </g>
                    </svg>
                  </span>
                  <h4>Admin Portal</h4>
                  <div className="tl-cs-row"><span>about</span><p>the internal ops console - user management, KYC, inventory, billing</p></div>
                  <div className="tl-cs-row"><span>role</span><p>understood internal users, defined & designed the flows - then built and deployed them</p></div>
                  <div className="tl-cs-foot"><span className="tl-cs-impact">faster <small>order → delivery cycle</small></span><span className="tl-cs-link">Deep dive →</span></div>
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
                started in, same as Knowledge Base and Developer sandbox. the
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
                  <div className="tl-cs-row"><span>about</span><p>answers before tickets - self-help designed into the product</p></div>
                  <div className="tl-cs-row"><span>role</span><p>content architecture, design & frontend - findable, skimmable, honest</p></div>
                  <div className="tl-cs-foot"><span className="tl-cs-impact">deflect <small>fewer tickets</small></span><span className="tl-cs-link">Deep dive →</span></div>
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
                  <h4>Developer sandbox</h4>
                  <div className="tl-cs-row"><span>about</span><p>a live API test environment against UAT - try before you buy</p></div>
                  <div className="tl-cs-row"><span>role</span><p>DX design, docs & frontend · PRD + pricing framework · volumetrics with engineering</p></div>
                  <div className="tl-cs-foot"><span className="tl-cs-impact">revenue <small>in testing</small></span><span className="tl-cs-link">Deep dive →</span></div>
                </article>

                <article className="tl-cs-card" role="button" tabIndex={0} onClick={() => openStudy('GenAI Initiative')} onKeyDown={cardKeys('GenAI Initiative')}>
                  <span className="tl-cs-icon" data-cat="6" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
                      <circle cx="12" cy="12" r="4.2">
                        <animate attributeName="opacity" values="1;0.4;1" dur="2.2s" repeatCount="indefinite" />
                      </circle>
                    </svg>
                  </span>
                  <h4>Recommend the route before the customer asks</h4>
                  <div className="tl-cs-row"><span>about</span><p>a pre-sales recommendation engine - hands back the routes worth buying before a person has to work them out</p></div>
                  <div className="tl-cs-row"><span>role</span><p>scoped the three use cases with a specialist AI delivery team · decided what the model had to be right about, not the build itself</p></div>
                  <div className="tl-cs-foot"><span className="tl-cs-impact">feasibility <small>verdict, evidence-backed</small></span><span className="tl-cs-link">Deep dive →</span></div>
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
            <CustomerPortalCaseStudy onPrev={prevStudy} onNext={nextStudy} idx={studyIdx - groupStart(studyIdx)} total={groupLen()} />
          ) : SURFACES[studyIdx] === 'Admin Portal' ? (
            <AdminPortalCaseStudy onPrev={prevStudy} onNext={nextStudy} idx={studyIdx - groupStart(studyIdx)} total={groupLen()} />
          ) : SURFACES[studyIdx] === 'Invoice Design' ? (
            <InvoiceCaseStudy onPrev={prevStudy} onNext={nextStudy} idx={studyIdx - groupStart(studyIdx)} total={groupLen()} />
          ) : SURFACES[studyIdx] === 'Developer Portal' ? (
            <DeveloperPortalCaseStudy onPrev={prevStudy} onNext={nextStudy} idx={studyIdx - groupStart(studyIdx)} total={groupLen()} />
          ) : SURFACES[studyIdx] === 'Knowledge Base' ? (
            <KnowledgeBaseCaseStudy onPrev={prevStudy} onNext={nextStudy} idx={studyIdx - groupStart(studyIdx)} total={groupLen()} />
          ) : (
            <GenAICaseStudy onPrev={prevStudy} onNext={nextStudy} idx={studyIdx - groupStart(studyIdx)} total={groupLen()} />
          )}
        </div>
      </div>
    </div>
  );
}
