import { useEffect, useRef, useState } from 'react';
import ScrollHint from '../components/ScrollHint';

const CROSSING = [
  {
    yr: '2022',
    role: 'Executive UI/UX Designer',
    qPre: 'Does it ',
    qEm: 'look',
    qPost: ' right?',
    body: 'First designer in the building. Every customer-portal module taken 0 → 1 — structure, core flows, screens — from a truly blank canvas.',
    word: 'PIXELS',
  },
  {
    yr: '2025',
    role: 'Senior Executive UI/UX Designer',
    qPre: 'Does it ',
    qEm: 'scale',
    qPost: ' right?',
    body: 'Built the Polarin design system — tokens, components, patterns — that every product surface still runs on. Screens became a language.',
    word: 'SYSTEMS',
  },
  {
    yr: '2026',
    role: 'Associate Product Manager',
    qPre: 'Is it the ',
    qEm: 'right thing',
    qPost: ' at all?',
    body: 'Full product ownership: the developer & customer portal roadmap end to end — priorities shaped by support data, usage analytics, and customer interviews.',
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
      <p className="bp-cap">fig. 1 — three enterprise products, redrawn — <b>+28% task completion · −35% drop-off</b></p>
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
          <div className="art-bar"><i style={{ background: 'var(--link)' }}></i>portal-module-v1.fig · first designer</div>
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
        <path className="thread" data-th style={{ stroke: 'var(--link)' }} d="M150 70  C 330 70,  330 226, 500 232" />
        <path className="thread" data-th style={{ stroke: 'var(--rose)' }} d="M150 155 C 320 155, 330 230, 500 236" />
        <path className="thread" data-th style={{ stroke: 'var(--signal)' }} d="M150 240 C 320 240, 330 240, 500 240" />
        <path className="thread" data-th style={{ stroke: 'var(--up)' }} d="M150 325 C 320 325, 330 250, 500 244" />
        <path className="thread" data-th style={{ stroke: '#B79CFF' }} d="M150 410 C 330 410, 330 254, 500 248" />
        <text className="in-label" x="140" y="74" textAnchor="end">Design craft</text>
        <text className="in-label" x="140" y="159" textAnchor="end">Design systems</text>
        <text className="in-label" x="140" y="244" textAnchor="end">Customer discovery</text>
        <text className="in-label" x="140" y="329" textAnchor="end">Data & analytics</text>
        <text className="in-label" x="140" y="414" textAnchor="end">AI × frontend</text>
        <g id="multCore" opacity="0">
          <circle cx="545" cy="240" r="52" fill="rgba(255,196,107,.08)" stroke="var(--signal)" strokeWidth="1.4" />
          <circle cx="545" cy="240" r="66" fill="none" stroke="rgba(255,196,107,.25)" strokeDasharray="3 7" />
          <text className="core-t1" x="545" y="236" textAnchor="middle">One PM</text>
          <text className="core-t2" x="545" y="254" textAnchor="middle">END TO END</text>
        </g>
        <path className="thread" data-out style={{ stroke: 'rgba(92,224,168,.7)' }} d="M612 232 C 740 210, 760 110, 880 96" />
        <path className="thread" data-out style={{ stroke: 'rgba(92,224,168,.7)' }} d="M612 240 C 760 240, 760 240, 880 240" />
        <path className="thread" data-out style={{ stroke: 'rgba(92,224,168,.7)' }} d="M612 248 C 740 270, 760 370, 880 384" />
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

export default function MyJourney() {
  const heroRef = useRef(null);
  const heroCardRef = useRef(null);

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

    // chapter jump-ticks on the shared top-nav progress line
    const routeLine = document.getElementById('routeLine');
    const chSections = [...document.querySelectorAll('[data-ch]')];
    const createdTicks = [];

    if (routeLine) {
      chSections.forEach((section) => {
        const tickEl = document.createElement('button');
        tickEl.className = 'route-tick';
        tickEl.dataset.ch = section.dataset.ch;
        tickEl.setAttribute('aria-label', `Jump to ${section.dataset.ch}`);
        tickEl.addEventListener('click', () => section.scrollIntoView({ behavior: 'smooth' }));
        routeLine.appendChild(tickEl);
        createdTicks.push(tickEl);
      });
    }
    const placeTicks = () => {
      if (!routeLine || chSections.length === 0) return;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      createdTicks.forEach((tickEl, i) => {
        const section = chSections[i];
        if (!section) return;
        const top = section.getBoundingClientRect().top + window.scrollY;
        tickEl.style.left = `${clamp((top / docHeight) * 100, 0, 100)}%`;
      });
    };
    placeTicks();
    window.addEventListener('resize', placeTicks);

    // subtle hero tilt + floating-glyph parallax on mouse move (desktop only)
    const hero = heroRef.current;
    const heroCard = heroCardRef.current;
    const glyphEls = hero ? [...hero.querySelectorAll('.glyph')] : [];
    let onHeroMove;
    let onHeroLeave;
    if (window.matchMedia('(pointer:fine)').matches && hero && heroCard) {
      let frame = null;
      onHeroMove = (event) => {
        if (frame) return;
        frame = window.requestAnimationFrame(() => {
          const rect = hero.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          heroCard.style.transform = `rotateY(${x * 5}deg) rotateX(${y * -4}deg)`;
          glyphEls.forEach((g) => {
            const depth = Number(g.dataset.depth || 20);
            g.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
          });
          frame = null;
        });
      };
      onHeroLeave = () => {
        heroCard.style.transform = '';
        glyphEls.forEach((g) => { g.style.transform = ''; });
      };
      hero.addEventListener('mousemove', onHeroMove);
      hero.addEventListener('mouseleave', onHeroLeave);
    }

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
      window.removeEventListener('resize', placeTicks);
      rvObs.disconnect();
      if (hero && onHeroMove) hero.removeEventListener('mousemove', onHeroMove);
      if (hero && onHeroLeave) hero.removeEventListener('mouseleave', onHeroLeave);
      createdTicks.forEach((tickEl) => tickEl.remove());
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <main id="top">
      {/* PROLOGUE */}
      <section className="hero" id="hero" ref={heroRef} data-ch="Prologue">
        <span className="glyph" data-depth="18" style={{ top: '20%', left: '5%' }}>⚡ portal-prd-v3.md</span>
        <span className="glyph" data-depth="30" style={{ top: '68%', left: '9%' }}>✦ claude --pair</span>
        <span className="glyph" data-depth="24" style={{ top: '28%', right: '6%' }}>▷ vercel --prod</span>
        <svg className="hero-map" viewBox="0 0 220 320" aria-hidden="true">
          <path className="hm-path" d="M40 280 C 20 200, 140 220, 120 140 C 100 60, 200 80, 180 30" />
          <circle className="hm-dot" cx="40" cy="280" r="6" />
          <circle className="hm-dot d2" cx="120" cy="140" r="6" />
          <circle className="hm-dot d3" cx="180" cy="30" r="6" />
        </svg>
        <div className="wrap hero-inner">
          <div id="heroCard" ref={heroCardRef}>
            <p className="hero-kicker">My Journey · <b>three chapters</b></p>
            <h1>
              <span className="l1">Every product</span><br />
              <span className="l2">is a story.</span><br />
              <span className="l3">I ship the plot.</span><span className="car" aria-hidden="true"></span>
            </h1>
            <p className="hero-sub">First designer at <b>Lightstorm</b>. Now I ship the whole loop myself.</p>
          </div>
        </div>
        <ScrollHint label="Scroll to begin" />
      </section>

      {/* CH1 — THE PIXEL YEARS */}
      <section id="ch1" data-ch="Ch.1 — The Pixel Years">
        <div className="wrap ch-head">
          <p className="ch-num rv"><b>Chapter 01</b> · 2017 — 2022 · Bangalore</p>
          <h2 className="ch-title rv d1">The Pixel <span>Years.</span></h2>
          <div className="ch1-creds rv d2">
            <span className="chip">B.Des · FDDI Noida · 2017—2021</span>
            <span className="chip">UI/UX Designer · Peepal Design · 2021—2022</span>
            <span className="chip">UX-PM Certification · Level 1 & 2</span>
          </div>
        </div>
        <div className="scene" id="scene-ch1" style={{ height: '220vh' }}>
          <div className="pin">
            <div className="wrap ch1-grid">
              <p className="wr" id="wr1">A design degree, then the trenches at a Bangalore studio — redesigning three enterprise B2B products. Task completion rose 28%. Drop-off fell 35%. And one lesson stuck for good: <i className="hot">the interface is never the product.</i> <i className="lnk">The decision behind it is.</i></p>
              <PixelBlueprint />
            </div>
          </div>
        </div>
      </section>

      {/* CH2 — THE CROSSING */}
      <section id="ch2" data-ch="Ch.2 — The Crossing">
        <div className="wrap ch-head">
          <p className="ch-num rv"><b>Chapter 02</b> · Nov 2022 — Now · Lightstorm · Promoted 2×</p>
          <h2 className="ch-title rv d1">The <span>Crossing.</span></h2>
          <p style={{ color: 'var(--mute)', maxWidth: '58ch', marginTop: '14px' }} className="rv d2">I joined Lightstorm as its first designer. Three promotions later the title says product — but it was always the same question, asked three sizes bigger.</p>
        </div>
        <div className="wrap" style={{ paddingBottom: '100px' }}>
          <TheCrossing />
        </div>
      </section>

      {/* CH3 — THE MULTIPLIER */}
      <section id="ch3" data-ch="Ch.3 — The Multiplier">
        <div className="wrap ch-head" style={{ textAlign: 'center' }}>
          <p className="ch-num rv" style={{ justifyContent: 'center' }}><b>Chapter 03</b> · Why it matters to an org</p>
          <h2 className="ch-title rv d1">The <span>Multiplier.</span></h2>
          <p style={{ color: 'var(--mute)', maxWidth: '60ch', margin: '14px auto 0' }} className="rv d2">Five disciplines usually live in five people, five backlogs, five handoffs. Here&apos;s what happened at Lightstorm when they routed through one.</p>
        </div>
        <div className="scene" id="scene-ch3" style={{ height: '300vh' }}>
          <div className="pin">
            <TheMultiplier />
          </div>
        </div>
      </section>

      {/* EPILOGUE */}
      <section className="epi" id="epi" data-ch="Epilogue">
        <div className="wrap">
          <p className="eyebrow rv">Epilogue · Your move</p>
          <h2 className="rv d1">The next chapter is <span className="hot">unwritten.</span></h2>
          <p className="rv d2">Enterprise B2B, 5+ years, and one conviction: product, design, and AI-speed delivery should be
          one job, not three. If you&apos;re building something that agrees — let&apos;s talk.</p>
          <div className="epi-row rv d3">
            <a className="btn-big" href="mailto:hello@prashant.design">hello@prashant.design <span aria-hidden="true">→</span></a>
            <a className="btn-ghost" href="#" onClick={(e) => e.preventDefault()}>LinkedIn</a>
            <a className="btn-ghost" href="#" onClick={(e) => e.preventDefault()}>prashantfolio.in</a>
          </div>
        </div>
      </section>
    </main>
  );
}
