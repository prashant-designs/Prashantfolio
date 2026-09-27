import { useEffect, useRef, useState } from 'react';
import ScrollHint from '../components/ScrollHint';
import useHeroPointer from '../useHeroPointer';

const MIX = {
  design: {
    name: 'design',
    pct: '40%',
    title: 'Part designer',
    list: ['UI & UX craft', 'design systems', 'interaction & motion', '0 → 1 from a blank file'],
  },
  product: {
    name: 'product',
    pct: '35%',
    title: 'Part PM',
    list: ['roadmaps & PRDs', 'pricing & volumetrics', 'discovery & interviews', 'ruthless prioritisation'],
  },
  build: {
    name: 'builder',
    pct: '25%',
    title: 'Part builder',
    list: ['AI-native builds - spec to shipped frontend', 'frontend that ships to prod', '3D, motion & prototypes', 'hands-on craft - leather & tools'],
  },
};


// bar colours come through --bar-1..6 rather than named tokens or raw hex so
// the chart re-points with the palette when this section flips to light - a
// value that reads on a dark card washes out to nothing on paper. the six are
// their own pastel hues, not a lightness ramp: red still belongs to the one
// decisive action and blue is retired as a UI accent, but a chart's series
// still need to be tellable apart at a glance, which is a data-legibility
// question separate from the chrome accent rule. the palette is defined once
// in src/index.css (see the chart-palette note in TOKENS) - the order here is
// just what maps a skill to a hue, with no ranking implied by which is which.
const SKILLS = [
  { label: 'Figma', v: 95, c: 'var(--bar-1)' },
  { label: 'AI-assisted building', v: 92, c: 'var(--bar-2)' },
  { label: 'design systems', v: 90, c: 'var(--bar-3)' },
  { label: 'product & PRDs', v: 86, c: 'var(--bar-4)' },
  { label: 'crafting accessories', v: 80, c: 'var(--bar-5)' },
  { label: '3D & animation', v: 74, c: 'var(--bar-6)' },
];

/* the opening fold's three ambient chips - see THE AMBIENT CHIP in
   PAGE HERO RECIPE (src/index.css). `key` points at MIX above rather than
   carrying its own copy of the words, so the chips say exactly what the mix ring
   says. `depth` is the drift amount useHeroPointer reads
   (src/useHeroPointer.js): three different values inside the 3-30 range the four
   folds share, so the three chips separate from each other under the cursor
   instead of moving as one plane. top/right park them in the fold's ambient
   zone - the right margin, clear of the reading column. */
const HERO_CHIPS = [
  { key: 'design', depth: 16, top: '21%', right: '8%' },
  { key: 'product', depth: 28, top: '31%', right: '23%' },
  { key: 'build', depth: 22, top: '73%', right: '12%' },
];

const FACTS = [
  { ic: '🎬', t: 'free time = films - the longer, the better' },
  { ic: '🚗', t: 'love to drive · playlists are non-negotiable' },
  { ic: '🤖', t: 'love to build - AI tools are my workshop' },
  { ic: '🧠', t: '3D models & animation, purely for the joy of it' },
  { ic: '🧵', t: 'I craft accessories by hand - wallets, bags, straps' },
  { ic: '⚡', t: 'prototype → product - if I can spec it, I can ship it' },
];

const MIX_ORDER = ['design', 'product', 'build'];

export default function About() {
  const [mix, setMix] = useState('design');
  const mixSceneRef = useRef(null);
  // a hover-only ring means a reader who never stops to hover only ever sees
  // "design" - two of the three slices are invisible to anyone who just
  // scrolls past. this pins the fold and ties `mix` to scroll position
  // instead, the same mechanism the "My Process" orbit further down this
  // page already uses (see the loopSceneRef effect below) - a .scene of
  // explicit height with a `.pin` child, `rect.top` against the scene's own
  // scrollable overshoot giving a 0..1 progress, floored into a slice index.
  // scrolling through the fold is what shows all three now; hovering still
  // works too (it just gets overwritten by the next scroll tick, same as
  // hovering a step in the orbit while it is mid-scroll would be).
  useEffect(() => {
    const scene = mixSceneRef.current;
    if (!scene) return undefined;
    const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
    let raf = null;
    const update = () => {
      const rect = scene.getBoundingClientRect();
      const total = scene.offsetHeight - window.innerHeight;
      const progress = total > 0 ? clamp(-rect.top / total, 0, 1) : 0;
      const active = clamp(Math.floor(progress * (MIX_ORDER.length + 0.01)), 0, MIX_ORDER.length - 1);
      setMix(MIX_ORDER[active]);
    };
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => { raf = null; update(); });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);
  const chartRef = useRef(null);
  const [chartIn, setChartIn] = useState(false);
  const [vals, setVals] = useState(SKILLS.map(() => 0));
  const loopSceneRef = useRef(null);
  const heroRef = useRef(null);

  // the fold's shared cursor interaction - same hook, same numbers, on all four
  // inner pages (src/useHeroPointer.js). the hook only needs the fold now: it
  // writes the lean onto it as --hero-tilt-x/y and every .hero-tilt inside
  // spends them, so what leans here is decided in the markup below.
  useHeroPointer(heroRef);

  useEffect(() => {
    const scene = loopSceneRef.current;
    if (!scene) return undefined;
    const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
    const orbitNodes = [...scene.querySelectorAll('[data-ln]')];
    const lsteps = [...scene.querySelectorAll('[data-ls]')];
    const ringSlot = (angle) => `translate(-50%,-50%) rotateZ(${angle}deg) translateY(calc(min(360px,72vw)/-2)) rotateZ(${-angle}deg) rotateX(-62deg)`;
    let raf = null;
    const update = () => {
      const rect = scene.getBoundingClientRect();
      const total = scene.offsetHeight - window.innerHeight;
      const progress = total > 0 ? clamp(-rect.top / total, 0, 1) : 0;
      const active = clamp(Math.floor(progress * 5.01), 0, 4);
      lsteps.forEach((step, i) => step.classList.toggle('on', i === active));
      orbitNodes.forEach((node, i) => {
        const baseAngle = parseFloat(node.style.getPropertyValue('--a'));
        node.classList.toggle('on', i === active);
        node.classList.toggle('peek', active === 4 && i === 0);
        node.style.transform = ringSlot(baseAngle - active * 72);
      });
    };
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => { raf = null; update(); });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const el = chartRef.current;
    if (!el) return undefined;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setChartIn(true);
            const t0 = performance.now();
            const dur = 1200;
            const step = (now) => {
              const p = Math.min(1, (now - t0) / dur);
              const ease = 1 - (1 - p) ** 3;
              setVals(SKILLS.map((s) => Math.round(s.v * ease)));
              if (p < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const d = MIX[mix];

  return (
    <>
      {/* the opening fold, on the shared PAGE HERO RECIPE in src/index.css -
          same six slots, same order, same weight as the other three inner
          pages. this page's own content inside them: the portrait (the recipe's
          motif slot, taken inline beside the lede) and the résumé link. */}
      <section className="hero-fold zone zone-sink" ref={heroRef} data-ch="Intro">
        {/* THE AMBIENT CHIP slot from the shared PAGE HERO RECIPE (see
            index.css) - three of them, in the fold's right margin, outside the
            reading column. they are here for the interaction rather than for
            the decoration: the drift half of useHeroPointer moves every
            [data-depth] element in the fold by its own amount, and until now
            this fold had exactly one moving plane (the portrait's tilt), which
            is why the same hook read as a quieter interaction here than on My
            Journey. three chips at three depths is three more planes.
            the text is not invented for the slot - it is the same three-way
            split the mix ring further down this page prints, read straight out
            of MIX so the two can never disagree. coordinates and depths are
            inline for the reason the recipe gives: the hook writes the whole
            `transform` on these elements, so a base transform in CSS would be
            overwritten.
            the coordinates go in as --hero-amb-top / --hero-amb-right rather
            than as top / right: the values are the same percentages they always
            were, but the CSS rounds each of them to the nearest line of the
            site's drawn grid before spending it, so a chip's corner lands on an
            intersection. see THE AMBIENT SNAP in index.css. */}
        {HERO_CHIPS.map((c) => (
          <span
            key={c.key}
            className="glyph"
            data-depth={c.depth}
            style={{ '--hero-amb-top': c.top, '--hero-amb-right': c.right }}
          >
            {MIX[c.key].name} · {MIX[c.key].pct}
          </span>
        ))}
        {/* the tilt scene and the tilt card are the shared pair from
            THE POINTER LAYER in index.css, and the card is this fold's TEXT -
            eyebrow, headline, and the intro row holding the lede and the action.
            it used to be the portrait instead, i.e. the one thing on the fold
            that answered the cursor was a 96px photograph in the corner while
            every word sat still. My Journey had it right from the start (its
            #heroCard is exactly this block) and this is the same arrangement.
            the portrait rides inside the card rather than leaning on its own:
            it sits in the reading column, so it is inside the text block by
            position, and a .hero-tilt nested in a .hero-tilt would rotate
            twice. */}
        <div className="wrap hero-tilt-scene">
          <div className="hero-tilt">
            <p className="hero-eyebrow rv">About · <b>Prashant Kumar</b></p>
            <h1 className="hero-title rv d1">about<span className="hero-dot">.</span></h1>
            <div className="ab-intro">
              {/* two things still want to transform the portrait - the shared
                  reveal and its own hover lift - and one element can only carry
                  one, so each keeps its own box: the span reveals, the
                  photograph lifts on hover. (a third box used to sit between
                  them for the pointer tilt; the tilt is on the text card above
                  now.) the split is also what keeps the reveal on the SHARED
                  timing: .ab-photo's own transition list is later in index.css
                  than .rv's, so with the reveal on the <img> it silently ran the
                  portrait in at 0.5s with no opacity fade at all while the other
                  five slots ran at .rv's 0.75s/1s. */}
              <span className="ab-photo-w rv d2">
                <img
                  className="ab-photo"
                  src="/image.png"
                  alt="Prashant Kumar"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </span>
              <div>
                <p className="hero-lede rv d2">I&apos;m Prashant - product manager at Lightstorm, building <b>Polarin</b>, India&apos;s first self-serve NaaS platform. Designer by training, builder by habit: I ship the things I spec.</p>
                <p className="hero-lede rv d3">Four years ago I was the first designer on a whiteboard idea. Now I run its roadmap - and still push its frontend to production myself.</p>
                <div className="soon-ctas rv d3">
                  <a className="btn-ghost" href="/Prashant_Resume.pdf" target="_blank" rel="noopener noreferrer">Download résumé <span aria-hidden="true">↓</span></a>
                  <a className="btn-ghost" href="https://github.com/pk8423206" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ScrollHint label="scroll to the mix" />
      </section>

      <section className="ab-split zone zone-lift flip" data-ch="The Mix">
        <div className="wrap">
          <p className="eyebrow rv">- what I&apos;m made of</p>
          <h2 className="ab-h rv d1">Part designer. Part PM.<br /><em>All builder.</em></h2>
        </div>
        {/* pinned, the same mechanism as the "My Process" orbit below: a .scene
            of explicit height holds .pin in place while its own scroll
            distance runs, so the fold is held on screen for exactly as long
            as it takes to pass all three slices - see the mixSceneRef effect
            above for why. no .rv here, for the same reason .lstep has none:
            what's pinned doesn't need a first-scroll reveal, it needs to
            already be the thing on screen the moment the reader arrives. */}
        <div className="scene mix-scene" ref={mixSceneRef} style={{ height: '210vh' }}>
          <div className="pin">
            <div className="wrap ab-mix">
              <div className="ab-mix-word" aria-hidden="true"><span>{d.name}</span></div>
              <svg className="ab-donut" viewBox="0 0 200 200" aria-hidden="true">
                <circle className="ab-ring" cx="100" cy="100" r="70" />
                <circle
                  className={`ab-seg ${mix === 'design' ? 'on' : ''}`}
                  data-mix="design"
                  onMouseEnter={() => setMix('design')}
                  onClick={() => setMix('design')}
                  cx="100" cy="100" r="70"
                  pathLength="100"
                  strokeDasharray="37 63"
                  strokeDashoffset="0"
                />
                <circle
                  className={`ab-seg ${mix === 'product' ? 'on' : ''}`}
                  data-mix="product"
                  onMouseEnter={() => setMix('product')}
                  onClick={() => setMix('product')}
                  cx="100" cy="100" r="70"
                  pathLength="100"
                  strokeDasharray="32 68"
                  strokeDashoffset="-39"
                />
                <circle
                  className={`ab-seg ${mix === 'build' ? 'on' : ''}`}
                  data-mix="build"
                  onMouseEnter={() => setMix('build')}
                  onClick={() => setMix('build')}
                  cx="100" cy="100" r="70"
                  pathLength="100"
                  strokeDasharray="22 78"
                  strokeDashoffset="-73"
                />
                <text className="ab-donut-t" x="100" y="97" textAnchor="middle">{d.name}</text>
                <text className="ab-donut-p" x="100" y="117" textAnchor="middle">{d.pct}</text>
              </svg>
              <div className="ab-mix-panel">
                <b>{d.title}</b>
                <ul>
                  {d.list.map((x) => <li key={x}>{x}</li>)}
                </ul>
                <p className="ab-mix-hint">scroll to see all three - or hover to jump →</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ab-split zone zone-sink zone-cool" data-ch="My Process">
        <div className="wrap">
          <p className="eyebrow rv">- how I work</p>
          <h2 className="ab-h rv d1">My process, <em>end to end.</em></h2>
          <p className="ab-lede2 rv d2">One person, end to end - AI collapsing the distance between a question and a shipped answer. Scroll to run one full cycle; the orbit turns with you.</p>
        </div>
        <div className="scene loop-scene" ref={loopSceneRef} style={{ height: '320vh' }}>
          <div className="pin">
            <div className="wrap loop-grid">
              <div className="orbit-stage" aria-hidden="true">
                <div className="orbit" id="procOrbit">
                  <div className="ring"></div><div className="ring r2"></div>
                  <div className="node" style={{ '--a': '0deg' }} data-ln="0"><b>Discover</b></div>
                  <div className="node" style={{ '--a': '72deg' }} data-ln="1"><b>Define</b></div>
                  <div className="node" style={{ '--a': '144deg' }} data-ln="2"><b>Prototype</b></div>
                  <div className="node" style={{ '--a': '216deg' }} data-ln="3"><b>Validate</b></div>
                  <div className="node" style={{ '--a': '288deg' }} data-ln="4"><b>Deploy</b></div>
                </div>
                <div className="orbit-core"><div className="c1">AI</div><div className="c2">in the loop</div></div>
              </div>
              <div className="loop-steps">
                <div className="lstep" data-ls="0"><div className="n">01</div><div>
                  <h3>Discover <span>hours, not weeks</span></h3>
                  <p>Support data, usage analytics, and customer interviews - synthesized by AI into friction themes and jobs-to-be-done I can interrogate, rank, and challenge.</p></div></div>
                <div className="lstep" data-ls="1"><div className="n">02</div><div>
                  <h3>Define <span>PRDs that argue back</span></h3>
                  <p><b>PRDs, user stories, and OKRs</b> drafted with AI as a sparring partner - it red-teams assumptions and pressure-tests success metrics before engineering reads a word.</p></div></div>
                <div className="lstep" data-ls="2"><div className="n">03</div><div>
                  <h3>Prototype <span>high-fidelity, working</span></h3>
                  <p>Not wireframes - <b>rapid POCs on the Polarin design system</b>, built in Figma and AI-paired. Design instincts from the pixel years, speed from the AI loop.</p></div></div>
                <div className="lstep" data-ls="3"><div className="n">04</div><div>
                  <h3>Validate <span>test the real thing</span></h3>
                  <p>Customers click actual software in week one. Signals sharpen, feedback gets honest, and <b>bad ideas die cheap</b> - before they cost a sprint.</p></div></div>
                <div className="lstep" data-ls="4"><div className="n">05</div><div>
                  <h3>Deploy <span>evidence, not opinions</span></h3>
                  <p>Frontend changes ship <b>directly from spec to production - AI-paired build, deployed on Vercel</b>. Handoffs become head starts.</p>
                  <div className="loop-reset"><span className="loop-reset-ic" aria-hidden="true">↻</span> then the loop turns again - back to <b>01 Discover</b></div>
                </div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ab-skills zone zone-lift flip" data-ch="Skills">
        <div className="wrap">
          <p className="eyebrow rv">- my skills, honestly</p>
          <h2 className="ab-h rv d1">The chart HR never asks for.</h2>
          <div className={`ab-chart rv d2 ${chartIn ? 'in' : ''}`} ref={chartRef}>
            <div className="ab-axis"><span>jedi</span><span>ninja</span><span>geek</span><span>newbie</span></div>
            <div className="ab-bars">
              {SKILLS.map((s, i) => (
                <div className="ab-bar" key={s.label} style={{ '--h': `${s.v}%`, '--c': s.c }}>
                  <span className="bx"><i></i><b>{vals[i]}%</b></span>
                  <span className="lb">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="ab-facts zone zone-sink" data-ch="Facts">
        <div className="wrap">
          <p className="eyebrow rv">- off the clock</p>
          <h2 className="ab-h rv d1">Random facts.</h2>
          <div className="ab-grid">
            {FACTS.map((f, i) => (
              <div className={`ab-fact rv d${(i % 3) + 1}`} key={f.t}>
                <span>{f.ic}</span>
                <p>{f.t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* not flipped, unlike The Mix and Skills above: three light sections on
          one page turned the device into the page's default rather than an
          accent, and this one is the closing CTA - it hands off to the dark
          footer, so it stays on the page's own stock. */}
      <section className="ab-journey zone zone-lift-hi" data-ch="My Journey">
        <div className="wrap">
          <p className="eyebrow rv">- the long version</p>
          <h2 className="ab-big rv d1">the full story lives<br />in <span>three chapters.</span></h2>
          <p className="ab-lede rv d2">Pixel years - the crossing - the multiplier. How a designer became the product manager of the thing he designed - told as a scroll.</p>
          <div className="soon-ctas rv d3">
            <a className="btn-big" href="#/journey">Open My Journey →</a>
            <a className="btn-ghost" href="#/current">See what I&apos;m building →</a>
          </div>
        </div>
      </section>
    </>
  );
}
