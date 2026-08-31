import { useEffect, useRef, useState } from 'react';
import ScrollHint from '../components/ScrollHint';
import useHeroPointer from '../useHeroPointer';

const CROSSING = [
  {
    yr: '2022',
    role: 'Executive UI/UX Designer',
    qPre: 'Does it ',
    qEm: 'look',
    qPost: ' right?',
    body: 'First designer in the building. Every customer-portal module taken 0 → 1 - structure, core flows, screens - from a truly blank canvas.',
    word: 'PIXELS',
  },
  {
    yr: '2025',
    role: 'Senior Executive UI/UX Designer',
    qPre: 'Does it ',
    qEm: 'scale',
    qPost: ' right?',
    body: 'Built the Polarin design system - tokens, components, patterns - that every product surface still runs on. Screens became a language.',
    word: 'SYSTEMS',
  },
  {
    yr: '2026',
    role: 'Associate Product Manager',
    qPre: 'Is it the ',
    qEm: 'right thing',
    qPost: ' at all?',
    body: 'Full product ownership: the developer & customer portal roadmap end to end - priorities shaped by support data, usage analytics, and customer interviews.',
    word: 'OUTCOMES',
  },
];

function PixelBlueprint() {
  return (
    <div className="blueprint">
      <svg viewBox="0 0 460 340" aria-hidden="true">
        <rect className="draw sd" x="10" y="10" width="440" height="320" rx="16" />
        <line className="draw faint sd" x1="10" y1="58" x2="450" y2="58" />
        <circle className="draw sd" cx="36" cy="34" r="9" />
        <line className="draw faint sd" x1="60" y1="34" x2="150" y2="34" />
        <line className="draw faint sd" x1="330" y1="34" x2="430" y2="34" />
        <rect className="draw sd" x="34" y="82" width="250" height="90" rx="10" />
        <line className="draw faint sd" x1="52" y1="108" x2="240" y2="108" />
        <line className="draw faint sd" x1="52" y1="128" x2="200" y2="128" />
        <rect className="draw amber sd" x="52" y="142" width="86" height="18" rx="9" />
        <rect className="draw sd" x="304" y="82" width="122" height="90" rx="10" />
        <path className="draw amber sd" d="M316 156 L336 128 L354 142 L376 108 L398 124 L414 96" />
        <rect className="draw sd" x="34" y="196" width="120" height="104" rx="10" />
        <rect className="draw sd" x="170" y="196" width="120" height="104" rx="10" />
        <rect className="draw sd" x="306" y="196" width="120" height="104" rx="10" />
        <line className="draw faint sd" x1="50" y1="224" x2="138" y2="224" />
        <line className="draw faint sd" x1="186" y1="224" x2="274" y2="224" />
        <line className="draw faint sd" x1="322" y1="224" x2="410" y2="224" />
        <circle className="draw amber sd" cx="94" cy="266" r="16" />
        <circle className="draw amber sd" cx="230" cy="266" r="16" />
        <circle className="draw amber sd" cx="366" cy="266" r="16" />
      </svg>
      <p className="bp-cap">fig. 1 - three enterprise products, redrawn - <b>+28% task completion · −35% drop-off</b></p>
    </div>
  );
}

function TheCrossing() {
  const [active, setActive] = useState(0);
  const refs = useRef([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(Number(entry.target.dataset.idx));
        });
      },
      { rootMargin: '-35% 0px -45% 0px', threshold: 0 },
    );
    refs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="cross-stage">
      <div className="cross-word" aria-hidden="true"><span>{CROSSING[active].word}</span></div>
      <div className="cross-left">
        {CROSSING.map((c, i) => (
          <div
            className={`cross-q ${active === i ? 'on' : ''}`}
            key={c.yr}
            ref={(el) => { refs.current[i] = el; }}
            data-idx={i}
          >
            <div className="yr"><b>{c.yr}</b> · {c.role}</div>
            <h3>&quot;{c.qPre}<em>{c.qEm}</em>{c.qPost}&quot;</h3>
            <p>{c.body}</p>
          </div>
        ))}
      </div>
      <div className="cross-right" aria-hidden="true">
        <div className={`artifact ${active === 0 ? 'on' : ''}`}>
          <div className="art-bar"><i style={{ background: 'var(--mute)' }}></i>portal-module-v1.fig · first designer</div>
          <div className="art-body">
            <div className="wf-el bar"></div>
            <div className="wf-el hero">MODULE / 0 → 1</div>
            <div className="wf-row"><div className="wf-el card"></div><div className="wf-el card"></div></div>
            <div className="wf-el btn"></div>
          </div>
        </div>
        <div className={`artifact ${active === 1 ? 'on' : ''}`}>
          <div className="art-bar"><i style={{ background: 'var(--rose)' }}></i>polarin-ds · tokens · components</div>
          <div className="art-body">
            <div className="prd-line prd-h"></div>
            <span className="prd-tag">Tokens</span><span className="prd-tag">Components</span><span className="prd-tag">Patterns</span>
            <div className="prd-line" style={{ width: '92%' }}></div>
            <div className="prd-line" style={{ width: '84%' }}></div>
            <div className="prd-line" style={{ width: '70%' }}></div>
            <div className="prd-metric"><span>surfaces running on it</span><b>all of them</b></div>
            <div className="prd-metric"><span>design → dev drift</span><b>↓ near zero</b></div>
          </div>
        </div>
        <div className={`artifact ${active === 2 ? 'on' : ''}`}>
          <div className="art-bar"><i style={{ background: 'var(--up)' }}></i>roadmap-review · portals · apm</div>
          <div className="art-body">
            <div className="db-kpis">
              <div className="db-kpi"><div className="v g">3×</div><div className="l">self-serve adoption</div></div>
              <div className="db-kpi"><div className="v a">−40%</div><div className="l">dev handoffs</div></div>
              <div className="db-kpi"><div className="v">−50%</div><div className="l">vendor dependency</div></div>
            </div>
            <div className="db-chart">
              <i style={{ height: '30%' }}></i><i style={{ height: '42%' }}></i><i style={{ height: '38%' }}></i>
              <i style={{ height: '56%' }}></i><i style={{ height: '64%' }}></i><i className="hot" style={{ height: '82%' }}></i>
              <i className="hot" style={{ height: '95%' }}></i>
            </div>
            <div className="db-note">▲ shipped · adopted · <b>measured</b></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TheMultiplier() {
  return (
    <div className="wrap mult-stage">
      <svg className="mult-svg" viewBox="0 0 1060 480" aria-hidden="true">
        <path className="thread" data-th style={{ stroke: 'var(--mute)' }} d="M150 70  C 330 70,  330 226, 500 232" />
        <path className="thread" data-th style={{ stroke: 'var(--rose)' }} d="M150 155 C 320 155, 330 230, 500 236" />
        <path className="thread" data-th style={{ stroke: 'var(--text)' }} d="M150 240 C 320 240, 330 240, 500 240" />
        <path className="thread" data-th style={{ stroke: 'var(--up)' }} d="M150 325 C 320 325, 330 250, 500 244" />
        <path className="thread" data-th style={{ stroke: 'var(--bar-5)' }} d="M150 410 C 330 410, 330 254, 500 248" />
        <text className="in-label" x="140" y="74" textAnchor="end">Design craft</text>
        <text className="in-label" x="140" y="159" textAnchor="end">Design systems</text>
        <text className="in-label" x="140" y="244" textAnchor="end">Customer discovery</text>
        <text className="in-label" x="140" y="329" textAnchor="end">Data & analytics</text>
        <text className="in-label" x="140" y="414" textAnchor="end">AI × frontend</text>
        <g id="multCore" opacity="0">
          <circle cx="545" cy="240" r="52" fill="var(--line)" stroke="var(--text)" strokeWidth="1.4" />
          <circle cx="545" cy="240" r="66" fill="none" stroke="var(--line2)" strokeDasharray="3 7" />
          <text className="core-t1" x="545" y="236" textAnchor="middle">One PM</text>
          <text className="core-t2" x="545" y="254" textAnchor="middle">END TO END</text>
        </g>
        <path className="thread" data-out style={{ stroke: 'color-mix(in srgb, var(--up) 70%, transparent)' }} d="M612 232 C 740 210, 760 110, 880 96" />
        <path className="thread" data-out style={{ stroke: 'color-mix(in srgb, var(--up) 70%, transparent)' }} d="M612 240 C 760 240, 760 240, 880 240" />
        <path className="thread" data-out style={{ stroke: 'color-mix(in srgb, var(--up) 70%, transparent)' }} d="M612 248 C 740 270, 760 370, 880 384" />
        <g className="out-g" data-og>
          <text className="out-num" x="895" y="88">3×</text>
          <text className="out-label" x="895" y="112">self-service adoption</text>
        </g>
        <g className="out-g" data-og>
          <text className="out-num" x="895" y="234">−50%</text>
          <text className="out-label" x="895" y="258">outsourced vendor dependency</text>
        </g>
        <g className="out-g" data-og>
          <text className="out-num" x="895" y="378">−40%</text>
          <text className="out-label" x="895" y="402">dev handoffs per feature</text>
        </g>
      </svg>
      <p className="mult-cap" id="multCap">Five skills, entering the same node…</p>
      <div className="skill-strip">
        <span className="chip">product strategy</span><span className="chip">PRDs & user stories</span><span className="chip">roadmap planning</span>
        <span className="chip">OKRs</span><span className="chip">stakeholder management</span><span className="chip">customer discovery</span>
        <span className="chip">0→1 delivery</span><span className="chip">AI-assisted prototyping</span><span className="chip">rapid POC</span>
        <span className="chip">design systems</span><span className="chip">cross-functional delivery</span><span className="chip">metrics-driven decisions</span>
      </div>
    </div>
  );
}

// the hero's one in-page jump. same shape as Current Project's `scrollTo`, and
// the same reason it is not an href: the site is on hash routing, so `#ch1`
// would be read as a route rather than as a fragment.
function scrollToChapterOne() {
  document.getElementById('ch1')?.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth',
    block: 'start',
  });
}

export default function MyJourney() {
  const heroRef = useRef(null);

  /* the fold's shared cursor interaction - same hook, same numbers, on all four
     inner pages (src/useHeroPointer.js). this page is where it started, and it
     was the one fold whose tilt card was the reading column itself rather than
     the motif: #heroCard's three copy planes were cut for exactly this lean
     (see THE DEPTH RULES in index.css) and the three ambient chips are its
     data-depth drifters. all four folds tilt their copy now - see WHAT LEANS in
     THE POINTER LAYER - so this arrangement is the shared one rather than this
     page's own, and #heroCard needs no ref for it: the hook writes the lean onto
     the fold as --hero-tilt-x/y and .hero-tilt spends it in CSS. what the move
     to the hook changed here is one real gap - the effect used to check
     (pointer:fine) but not prefers-reduced-motion, so a reader who had asked for
     less motion got the tilt anyway. */
  useHeroPointer(heroRef);

  useEffect(() => {
    const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

    // reveal-on-scroll (.rv)
    const rvObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            rvObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    document.querySelectorAll('.rv').forEach((el) => rvObs.observe(el));

    // the hero tilt + floating-chip parallax that used to be inlined here is
    // now useHeroPointer above - four folds needed the same one, so it is
    // declared once in src/useHeroPointer.js.

    // --- scroll-scrubbed pinned scenes: Ch1 (Pixel Years) + Ch3 (The Multiplier) ---
    const wrapWords = (el) => {
      if (!el) return [];
      const walk = (node) => {
        [...node.childNodes].forEach((child) => {
          if (child.nodeType === 3) {
            const frag = document.createDocumentFragment();
            child.textContent.split(/(\s+)/).forEach((chunk) => {
              if (chunk.trim() === '') { frag.appendChild(document.createTextNode(chunk)); return; }
              const span = document.createElement('span');
              span.className = 'w';
              span.textContent = chunk;
              frag.appendChild(span);
            });
            child.replaceWith(frag);
          } else if (child.nodeType === 1) {
            if (child.tagName === 'I') {
              const span = document.createElement('span');
              span.className = `w ${child.className}`;
              span.textContent = child.textContent;
              child.replaceWith(span);
            } else {
              walk(child);
            }
          }
        });
      };
      walk(el);
      return [...el.querySelectorAll('.w')];
    };

    const wr1 = wrapWords(document.getElementById('wr1'));
    const ch1Strokes = [...document.querySelectorAll('#scene-ch1 .sd')].map((p) => {
      let len = 300;
      try { len = p.getTotalLength(); } catch { /* non-path element */ }
      p.style.strokeDasharray = len;
      return { el: p, len };
    });

    const threads = [...document.querySelectorAll('#scene-ch3 [data-th]')].map((p) => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = len;
      return { el: p, len };
    });
    const outs = [...document.querySelectorAll('#scene-ch3 [data-out]')].map((p) => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = len;
      return { el: p, len };
    });
    const outGs = [...document.querySelectorAll('#scene-ch3 .out-g')];
    const multCore = document.getElementById('multCore');
    const multCap = document.getElementById('multCap');

    const sceneProgress = (scene) => {
      const rect = scene.getBoundingClientRect();
      const total = scene.offsetHeight - window.innerHeight;
      if (total <= 0) return 1;
      return clamp(-rect.top / total, 0, 1);
    };

    const updateCh1 = (p) => {
      const n = wr1.length || 1;
      wr1.forEach((w, i) => { w.style.opacity = clamp(p * n * 1.2 - i, 0.13, 1); });
      const sN = ch1Strokes.length || 1;
      ch1Strokes.forEach((s, i) => {
        const local = clamp(p * sN * 1.4 - i * 0.7, 0, 1);
        s.el.style.strokeDashoffset = s.len * (1 - local);
      });
    };

    const updateCh3 = (p) => {
      threads.forEach((t, i) => {
        const local = clamp(p * 2.6 - i * 0.12, 0, 1);
        t.el.style.strokeDashoffset = t.len * (1 - local);
      });
      const coreV = clamp((p - 0.42) / 0.14, 0, 1);
      multCore?.setAttribute('opacity', coreV);
      outs.forEach((o, i) => {
        const local = clamp((p - 0.56) * 3.2 - i * 0.16, 0, 1);
        o.el.style.strokeDashoffset = o.len * (1 - local);
      });
      outGs.forEach((g, i) => { g.style.opacity = clamp((p - 0.68) * 4 - i * 0.45, 0, 1); });
      if (multCap) {
        multCap.textContent = p < 0.45
          ? 'Five skills, entering the same node…'
          : p < 0.72
            ? 'No handoffs. No translation loss.'
            : 'One PM. This is what Lightstorm got back.';
      }
    };

    const scenes = {
      ch1: document.getElementById('scene-ch1'),
      ch3: document.getElementById('scene-ch3'),
    };
    let raf = null;
    let lastY = -1;
    const tick = () => {
      const y = window.scrollY;
      if (y !== lastY) {
        lastY = y;
        if (scenes.ch1) updateCh1(sceneProgress(scenes.ch1));
        if (scenes.ch3) updateCh3(sceneProgress(scenes.ch3));
      }
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);

    return () => {
      rvObs.disconnect();
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <main id="top">
      {/* PROLOGUE - the opening fold, on the shared PAGE HERO RECIPE in
          src/index.css: same six slots, same order, same weight as the other
          three inner pages. this page's own content inside them: the three-line
          statement, the perspective tilt, and the ambient motif zone below. */}
      <section className="hero-fold zone zone-sink" id="hero" ref={heroRef} data-ch="Prologue">
        {/* the recipe's motif slot, ambient: the right margin, outside the
            reading column, hairline weight, pointer-events none, gone under
            1100px. the three chips used to be scattered at left: 5% / left: 9%,
            i.e. on top of the headline's own left edge - they belong in the same
            zone as the path they annotate. `data-depth` is the shared drift
            amount useHeroPointer reads (src/useHeroPointer.js); the coordinates
            are inline because the hook writes `transform` on these elements and
            a base transform there would be overwritten.
            they go in as --hero-amb-top / --hero-amb-right rather than as top /
            right: the same percentages, rounded to the nearest line of the
            site's drawn grid by the CSS before they are spent, so a chip's
            corner lands on an intersection instead of near one. see THE AMBIENT
            SNAP in index.css. */}
        <span className="glyph" data-depth="18" style={{ '--hero-amb-top': '17%', '--hero-amb-right': '7%' }}>⚡ portal-prd-v3.md</span>
        <span className="glyph" data-depth="30" style={{ '--hero-amb-top': '25%', '--hero-amb-right': '24%' }}>✦ ai --pair</span>
        <span className="glyph" data-depth="24" style={{ '--hero-amb-top': '76%', '--hero-amb-right': '11%' }}>▷ vercel --prod</span>
        <svg className="hero-map" viewBox="0 0 220 320" aria-hidden="true">
          <path className="hm-path" d="M40 280 C 20 200, 140 220, 120 140 C 100 60, 200 80, 180 30" />
          <circle className="hm-dot" cx="40" cy="280" r="6" />
          <circle className="hm-dot d2" cx="120" cy="140" r="6" />
          <circle className="hm-dot d3" cx="180" cy="30" r="6" />
        </svg>
        {/* the tilt scene and the tilt card are the shared pair from
            THE POINTER LAYER in index.css; the three copy planes inside the card
            are still this page's own (THE DEPTH RULES).
            the slots carry the same reveal stagger as the other three heroes -
            eyebrow, headline (d1), lede (d2), action row (d3). they could not
            before: the depth planes are ID-scoped, so they beat .rv's own
            transform outright and the entrance simply never moved. the planes
            compose translateY(var(--rv-y)) now, so the numbers are .rv's. */}
        <div className="wrap hero-inner hero-tilt-scene">
          <div id="heroCard" className="hero-tilt">
            <p className="hero-eyebrow rv">My Journey · <b>three chapters</b></p>
            {/* the recipe's headline: solid lines, ONE hollow line, and the
                accent on the terminal full stop. the middle line used to be a
                third treatment - mid-grey --mute - which made this the only
                headline on the site arguing three levels of emphasis at once. */}
            <h1 className="hero-title rv d1">
              Every product<br />
              is a story.<br />
              <span className="hero-hollow">I ship the plot</span><span className="hero-dot">.</span>
            </h1>
            <p className="hero-lede rv d2">First designer at <b>Lightstorm</b>. Now I ship the whole loop myself.</p>
            {/* plain scrollIntoView rather than an href anchor, for the reason
                Current Project's hero jump gives: the site is on hash routing
                (#/journey), so a `#ch1` href would be read as a route. */}
            <div className="soon-ctas rv d3">
              <button type="button" className="btn-ghost" onClick={() => scrollToChapterOne()}>
                Start at Chapter 01 <span aria-hidden="true">↓</span>
              </button>
            </div>
          </div>
        </div>
        <ScrollHint label="Scroll to begin" />
      </section>

      {/* CH1 - THE PIXEL YEARS */}
      <section id="ch1" className="sec-cushion zone zone-lift" data-ch="Ch.1 - The Pixel Years">
        <div className="wrap ch-head">
          <p className="ch-num rv"><b>Chapter 01</b> · 2017 - 2022 · Bangalore</p>
          <h2 className="ch-title rv d1">The Pixel <span>Years.</span></h2>
          <div className="ch1-creds rv d2">
            <span className="chip">B.Des · FDDI Noida · 2017-2021</span>
            <span className="chip">UI/UX Designer · Peepal Design · 2021-2022</span>
            <span className="chip">UX-PM Certification · Level 1 & 2</span>
          </div>
        </div>
        <div className="scene" id="scene-ch1" style={{ height: '220vh' }}>
          <div className="pin">
            <div className="wrap ch1-grid">
              <p className="wr" id="wr1">A design degree, then the trenches at a Bangalore studio - redesigning three enterprise B2B products. Task completion rose 28%. Drop-off fell 35%. And one lesson stuck for good: <i className="hot">the interface is never the product.</i> <i className="lnk">The decision behind it is.</i></p>
              <PixelBlueprint />
            </div>
          </div>
        </div>
      </section>

      {/* CH2 - THE CROSSING
          one of this page's two flipped chapters (see SECTION THEME FLIP in
          index.css). the two pinned, scroll-scrubbed chapters either side of
          it - Ch.1 and Ch.3 - stay on dark stock: their SVG scenes are drawn
          by scroll math, same reason About's .orbit loop was left alone. */}
      <section id="ch2" className="sec-cushion zone zone-sink zone-duo flip" data-ch="Ch.2 - The Crossing">
        <div className="wrap ch-head">
          <p className="ch-num rv"><b>Chapter 02</b> · Nov 2022 - Now · Lightstorm · Promoted 2×</p>
          <h2 className="ch-title rv d1">The <span>Crossing.</span></h2>
          <p className="ch-lede rv d2">I joined Lightstorm as its first designer. Three promotions later the title says product - but it was always the same question, asked three sizes bigger.</p>
        </div>
        <div className="wrap">
          <TheCrossing />
        </div>
      </section>

      {/* CH3 - THE MULTIPLIER */}
      <section id="ch3" className="sec-cushion zone zone-lift-hi zone-cool" data-ch="Ch.3 - The Multiplier">
        <div className="wrap ch-head ch-center">
          <p className="ch-num rv"><b>Chapter 03</b> · Why it matters to an org</p>
          <h2 className="ch-title rv d1">The <span>Multiplier.</span></h2>
          <p className="ch-lede rv d2">Five disciplines usually live in five people, five backlogs, five handoffs. Here&apos;s what happened at Lightstorm when they routed through one.</p>
        </div>
        <div className="scene" id="scene-ch3" style={{ height: '300vh' }}>
          <div className="pin">
            <TheMultiplier />
          </div>
        </div>
      </section>

      {/* EPILOGUE - the page's second flip: dark prologue, dark Ch.1, light
          Ch.2, dark Ch.3, light close. */}
      <section className="epi zone zone-sink flip" id="epi" data-ch="Epilogue">
        <div className="wrap">
          <p className="eyebrow rv">Epilogue · Your move</p>
          <h2 className="rv d1">The next chapter is <span className="hot">unwritten.</span></h2>
          <p className="rv d2">Enterprise B2B, 5+ years, and one conviction: product, design, and AI-speed delivery should be
          one job, not three. If you&apos;re building something that agrees - let&apos;s talk.</p>
          <div className="epi-row rv d3">
            <a className="btn-big" href="mailto:prashant.kumar3058@gmail.com">prashant.kumar3058@gmail.com <span aria-hidden="true">→</span></a>
            <a className="btn-ghost" href="https://www.linkedin.com/in/prashant-kumar100/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a className="btn-ghost" href="/Prashant_Resume.pdf" target="_blank" rel="noopener noreferrer">Résumé</a>
          </div>
        </div>
      </section>
    </main>
  );
}
