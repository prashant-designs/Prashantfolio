import { useEffect, useRef, useState } from 'react';

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
    list: ['AI-native builds — Claude · Cursor', 'frontend that ships to prod', '3D, motion & prototypes', 'hands-on craft — leather & tools'],
  },
};

const PROCESS = [
  { n: '01', t: 'Discover', s: 'Support data, analytics & interviews — synthesized with Claude into themes I can rank' },
  { n: '02', t: 'Define', s: 'PRDs, user stories & OKRs — AI as a sparring partner that pressure-tests the plan' },
  { n: '03', t: 'Prototype', s: 'Rapid, high-fidelity POCs on the design system — Figma, Figma Make, Cursor' },
  { n: '04', t: 'Validate', s: 'Real customers click real software in week one — bad ideas die cheap' },
  { n: '05', t: 'Deploy', s: 'Shipped directly via Claude + Figma in VS Code, deployed on Vercel' },
];

const SKILLS = [
  { label: 'Figma', v: 95, c: 'var(--signal)' },
  { label: 'AI-assisted building', v: 92, c: 'var(--link)' },
  { label: 'design systems', v: 90, c: 'var(--up)' },
  { label: 'product & PRDs', v: 86, c: 'var(--rose)' },
  { label: 'crafting accessories', v: 80, c: '#b48ef0' },
  { label: '3D & animation', v: 74, c: '#6fd3e8' },
];

const FACTS = [
  { ic: '🎬', t: 'free time = films — the longer, the better' },
  { ic: '🚗', t: 'love to drive · playlists are non-negotiable' },
  { ic: '🤖', t: 'love to build — AI tools are my workshop' },
  { ic: '🧠', t: '3D models & animation, purely for the joy of it' },
  { ic: '🧵', t: 'I craft accessories by hand — wallets, bags, straps' },
  { ic: '⚡', t: 'prototype → product — if I can spec it, I can ship it' },
];

export default function About() {
  const [mix, setMix] = useState('design');
  const chartRef = useRef(null);
  const [chartIn, setChartIn] = useState(false);
  const [vals, setVals] = useState(SKILLS.map(() => 0));

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
      <section className="ab-hero">
        <div className="wrap">
          <p className="eyebrow rv">Page 02 · About · Gurugram, IN</p>
          <h1 className="ab-title rv d1">about<span>.</span></h1>
          <div className="ab-intro">
            <img
              className="ab-photo rv d2"
              src="/profile.jpg"
              alt="Prashant Kumar"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div>
              <p className="ab-lede rv d2">I&apos;m Prashant — product manager at POLO, building <b>Polarin</b>, India&apos;s first self-serve NaaS platform. Designer by training, builder by habit: I ship the things I spec.</p>
              <p className="ab-lede2 rv d3">Four years ago I was the first designer on a whiteboard idea. Now I run its roadmap — and still push its frontend to production myself.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="ab-split">
        <div className="wrap">
          <p className="eyebrow rv">— what I&apos;m made of</p>
          <h2 className="ab-h rv d1">Part designer. Part PM.<br /><em>All builder.</em></h2>
          <div className="ab-mix rv d2">
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
              <p className="ab-mix-hint">hover the ring →</p>
            </div>
          </div>
        </div>
      </section>

      <section className="ab-split">
        <div className="wrap">
          <p className="eyebrow rv">— how I work</p>
          <h2 className="ab-h rv d1">My process, <em>end to end.</em></h2>
          <p className="ab-lede2 rv d2">One person, one loop — AI collapsing the distance between a question and a shipped answer.</p>
          <div className="adm-loop rv d3" style={{ marginTop: '30px' }}>
            {PROCESS.map((s, i) => (
              <div className="adm-loop-step" key={s.n}>
                <div className="adm-loop-card">
                  <span className="adm-loop-n">{s.n}</span>
                  <b>{s.t}</b>
                  <p>{s.s}</p>
                </div>
                {i < PROCESS.length - 1 ? <span className="adm-loop-arrow">→</span> : <span className="adm-loop-arrow loopback">↩ back to 01</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ab-skills">
        <div className="wrap">
          <p className="eyebrow rv">— my skills, honestly</p>
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

      <section className="ab-facts">
        <div className="wrap">
          <p className="eyebrow rv">— off the clock</p>
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

      <section className="ab-journey">
        <div className="wrap">
          <p className="eyebrow rv">— the long version</p>
          <h2 className="ab-big rv d1">the full story lives<br />in <span>three chapters.</span></h2>
          <p className="ab-lede rv d2" style={{ maxWidth: '56ch' }}>Pixel years — the crossing — the multiplier. How a designer became the product manager of the thing he designed — told as a scroll.</p>
          <div className="soon-ctas rv d3">
            <a className="btn-big" href="#/journey">Open My Journey →</a>
            <a className="btn-ghost" href="#/current">See what I&apos;m building →</a>
          </div>
        </div>
      </section>
    </>
  );
}
