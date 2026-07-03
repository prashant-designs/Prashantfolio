import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Home.css';

const routeToPage = {
  '/about': 'about',
  '/current-project': 'current',
  '/other-project': 'other',
  '/my-journey': 'journey',
};

const pageTitle = {
  home: 'Prashant Kumar — Product Manager',
  about: 'About — Prashant Kumar',
  current: 'Current Project — Prashant Kumar',
  other: 'Other Projects — Prashant Kumar',
  journey: 'My Journey — Prashant Kumar',
};

const tabs = [
  { label: 'Home', path: '/', page: 'home' },
  { label: 'About', path: '/about', page: 'about', soon: true },
  { label: 'Current Project', path: '/current-project', page: 'current' },
  { label: 'Other Projects', path: '/other-project', page: 'other', soon: true },
  { label: 'My Journey', path: '/my-journey', page: 'journey' },
];

const journeyChapters = [
  { id: 'ch1', label: 'Ch.1 — The Pixel Years' },
  { id: 'ch2', label: 'Ch.2 — The Crossing' },
  { id: 'ch3', label: 'Ch.3 — The Platform' },
  { id: 'ch4', label: 'Ch.4 — The Loop' },
  { id: 'ch5', label: 'Ch.5 — The Multiplier' },
];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export default function Home() {
  const location = useLocation();
  const routePage = routeToPage[location.pathname] ?? 'home';
  const [currentPage, setCurrentPage] = useState(routePage);
  const [pendingJump, setPendingJump] = useState(null);
  const [heroMode, setHeroMode] = useState('');
  const containerRef = useRef(null);
  const routeLineRef = useRef(null);
  const routeFillRef = useRef(null);
  const routePacketRef = useRef(null);
  const htrackRef = useRef(null);
  const hsBarRef = useRef(null);
  const hsCountRef = useRef(null);
  const orbitRef = useRef(null);
  const orbitCoreRef = useRef(null);
  const multCoreRef = useRef(null);
  const multCapRef = useRef(null);
  const heroCardRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    setCurrentPage(routePage);
  }, [routePage]);

  useEffect(() => {
    document.title = pageTitle[currentPage] || pageTitle.home;
    const routeLine = routeLineRef.current;
    if (routeLine) {
      routeLine.classList.toggle('has-ticks', currentPage === 'journey');
    }
    if (currentPage !== 'journey') {
      window.scrollTo(0, 0);
    }
  }, [currentPage]);

  useEffect(() => {
    if (currentPage === 'journey' && pendingJump) {
      const destination = document.getElementById(pendingJump);
      if (destination) {
        destination.scrollIntoView({ behavior: 'smooth' });
      }
      setPendingJump(null);
    }
  }, [currentPage, pendingJump]);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return undefined;

    const noMotion = matchMedia('(prefers-reduced-motion:reduce)').matches;
    if (noMotion) {
      document.body.classList.add('static');
    } else {
      document.body.classList.remove('static');
    }

    const pages = Array.from(root.querySelectorAll('.page'));
    const tabsEls = Array.from(root.querySelectorAll('.tab'));
    const routeLine = routeLineRef.current;
    const routeFill = routeFillRef.current;
    const routePacket = routePacketRef.current;
    const hsBar = hsBarRef.current;
    const hsCount = hsCountRef.current;
    const htrack = htrackRef.current;
    const hero = heroRef.current;
    const heroCard = heroCardRef.current;
    const orbit = orbitRef.current;
    const orbitCore = orbitCoreRef.current;
    const multCore = multCoreRef.current;
    const multCap = multCapRef.current;

    const rvElements = Array.from(root.querySelectorAll('.rv'));
    const rvObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          rvObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    rvElements.forEach((el) => rvObserver.observe(el));

    const wr1 = Array.from(root.querySelectorAll('#wr1 .w'));
    const strokes = Array.from(root.querySelectorAll('.sd')).map((el) => {
      let len = 300;
      try { len = el.getTotalLength(); } catch (_) {}
      el.style.strokeDasharray = len;
      el.style.strokeDashoffset = len;
      return { el, len };
    });
    const threads = Array.from(root.querySelectorAll('[data-th]')).map((el) => {
      const len = el.getTotalLength();
      el.style.strokeDasharray = len;
      el.style.strokeDashoffset = len;
      return { el, len };
    });
    const outs = Array.from(root.querySelectorAll('[data-out]')).map((el) => {
      const len = el.getTotalLength();
      el.style.strokeDasharray = len;
      el.style.strokeDashoffset = len;
      return { el, len };
    });
    const outGs = Array.from(root.querySelectorAll('[data-og]'));

    const multCoreNode = multCore;
    const routeTicks = Array.from(root.querySelectorAll('.route-tick'));

    const scenes = {};
    Array.from(root.querySelectorAll('[data-scene]')).forEach((scene) => {
      scenes[scene.dataset.scene] = scene;
    });

    const arts = Array.from(root.querySelectorAll('.artifact'));
    const cqs = Array.from(root.querySelectorAll('.cross-q'));
    const cws = Array.from(root.querySelectorAll('[data-cw]'));
    const orbitNodes = Array.from(root.querySelectorAll('[data-ln]'));
    const lsteps = Array.from(root.querySelectorAll('[data-ls]'));

    const multOuts = outs;

    function sceneProgress(scene) {
      if (!scene) return 0;
      const rect = scene.getBoundingClientRect();
      const total = scene.offsetHeight - window.innerHeight;
      if (total <= 0) return 0;
      return clamp(-rect.top / total, 0, 1);
    }

    function updCh1(p) {
      const n = wr1.length;
      wr1.forEach((w, i) => {
        w.style.opacity = clamp(p * 1.15 * n - i, 0.13, 1);
      });
      strokes.forEach((s, i) => {
        const local = clamp(p * strokes.length * 1.35 - i * 0.8, 0, 1);
        s.el.style.strokeDashoffset = s.len * (1 - local);
      });
    }

    function updCh2(p) {
      const phase = p * 2.6;
      const idx = clamp(Math.round(clamp(phase, 0, 2)), 0, 2);
      arts.forEach((a, i) => {
        const d = clamp(phase, 0, 2) - i;
        const vis = clamp(1 - Math.abs(d), 0, 1);
        a.style.opacity = vis;
        a.style.transform = `rotateY(${d * -55}deg) translateX(${d * -60}px) translateZ(${(vis - 1) * 140}px)`;
        a.style.zIndex = Math.round(vis * 10);
      });
      cqs.forEach((q, i) => q.classList.toggle('on', i === idx));
      cws.forEach((w, i) => {
        const d = clamp(phase, 0, 2) - i;
        const vis = clamp(1 - Math.abs(d) * 1.4, 0, 1);
        w.style.opacity = vis * 0.9;
        w.style.transform = `translateY(${d * -70}px) scale(${0.92 + vis * 0.08})`;
      });
    }

    function updCh3(p) {
      if (!htrack || !hsBar || !hsCount) return;
      const max = htrack.scrollWidth - window.innerWidth;
      htrack.style.transform = `translateX(${-p * max}px)`;
      hsBar.style.width = `${p * 100}%`;
      hsCount.textContent = `${1 + Math.round(p * 3)} / 4`;
    }

    function updCh4(p) {
      if (!orbit || !orbitCore) return;
      const rz = p * 360;
      orbit.style.transform = `rotateX(62deg) rotateZ(${-rz}deg)`;
      orbitNodes.forEach((n) => {
        const a = parseFloat(n.style.getPropertyValue('--a')) || 0;
        n.style.transform = `translate(-50%,-50%) rotateZ(${a}deg) translateY(calc(min(360px,72vw)/-2)) rotateZ(${-(a - rz)}deg) rotateX(-62deg)`;
      });
      orbitCore.style.transform = `translate(-50%,-50%) rotateX(-62deg) rotateZ(${rz}deg)`;
      const active = clamp(Math.floor(p * 5.01), 0, 4);
      lsteps.forEach((s, i) => s.classList.toggle('on', i <= active));
      orbitNodes.forEach((n, i) => n.classList.toggle('on', i === active));
    }

    function updCh5(p) {
      threads.forEach((t, i) => {
        const local = clamp(p * 2.4 - i * 0.14, 0, 1);
        t.el.style.strokeDashoffset = t.len * (1 - local);
      });
      const coreV = clamp((p - 0.42) / 0.14, 0, 1);
      if (multCoreNode) multCoreNode.setAttribute('opacity', coreV);
      multOuts.forEach((o, i) => {
        const local = clamp((p - 0.55) * 3 - i * 0.18, 0, 1);
        o.el.style.strokeDashoffset = o.len * (1 - local);
      });
      outGs.forEach((g, i) => {
        g.style.opacity = clamp((p - 0.68) * 4 - i * 0.5, 0, 1);
      });
      if (multCap) {
        multCap.textContent = p < 0.45
          ? 'five skills, entering the same node…'
          : p < 0.7
            ? 'no handoffs. no translation loss. one owner.'
            : 'what POLO got back →';
      }
    }

    const heroMove = (event) => {
      if (!hero || !heroCard) return;
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      heroCard.style.transform = `rotateY(${x * 5}deg) rotateX(${y * -4}deg)`;
      Array.from(root.querySelectorAll('.glyph')).forEach((g) => {
        const d = parseFloat(g.dataset.depth) || 0;
        g.style.transform = `translate(${x * -30 * d}px, ${y * -24 * d}px)`;
      });
    };

    let heroRaf = null;
    const heroMouseMove = (e) => {
      if (heroRaf) return;
      heroRaf = requestAnimationFrame(() => {
        heroMove(e);
        heroRaf = null;
      });
    };
    const heroMouseLeave = () => {
      if (heroCard) heroCard.style.transform = '';
    };

    if (hero && matchMedia('(pointer:fine)').matches && !noMotion) {
      hero.addEventListener('mousemove', heroMouseMove);
      hero.addEventListener('mouseleave', heroMouseLeave);
    }

    const homeHero = root.querySelector('#homeHero');
    const face = root.querySelector('#face');
    if (homeHero) {
      const hzones = Array.from(homeHero.querySelectorAll('.hzone'));
      if (matchMedia('(pointer:fine)').matches) {
        hzones.forEach((zone) => {
          zone.addEventListener('mouseenter', () => {
            setHeroMode(zone.dataset.mode || '');
          });
        });
        const duo = homeHero.querySelector('.duo');
        if (duo) {
          duo.addEventListener('mouseleave', () => {
            setHeroMode('');
          });
        }
      } else if (face) {
        const modes = ['', 'design', 'pm'];
        let mi = 0;
        face.addEventListener('click', () => {
          mi = (mi + 1) % modes.length;
          setHeroMode(modes[mi]);
        });
      }
    }

    const routeButtons = Array.from(root.querySelectorAll('[data-go]'));
    routeButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const target = document.getElementById(button.dataset.go);
        if (target) target.scrollIntoView({ behavior: noMotion ? 'auto' : 'smooth' });
      });
    });

    const jumps = Array.from(root.querySelectorAll('[data-jump]'));
    jumps.forEach((anchor) => {
      anchor.addEventListener('click', () => {
        setPendingJump(anchor.dataset.jump || null);
      });
    });

    const placeTicks = () => {
      if (currentPage !== 'journey') return;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      journeyChapters.forEach((chapter, index) => {
        const section = document.getElementById(chapter.id);
        const tick = routeLine?.querySelectorAll('.route-tick')[index];
        if (section && tick) {
          const top = section.getBoundingClientRect().top + window.scrollY;
          tick.style.left = `${clamp((top / total) * 100, 0, 100)}%`;
        }
      });
    };

    window.addEventListener('resize', placeTicks);

    let lastY = -1;
    let running = true;
    const tick = () => {
      if (!running) return;
      if (window.scrollY !== lastY) {
        lastY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const gp = docHeight > 0 ? clamp(window.scrollY / docHeight, 0, 1) : 0;
        if (routeFill) routeFill.style.width = `${gp * 100}%`;
        if (routePacket) routePacket.style.left = `${gp * 100}%`;
        if (currentPage === 'journey' && !noMotion) {
          if (scenes.ch1) updCh1(sceneProgress(scenes.ch1));
          if (scenes.ch2) updCh2(sceneProgress(scenes.ch2));
          if (scenes.ch3) updCh3(sceneProgress(scenes.ch3));
          if (scenes.ch4) updCh4(sceneProgress(scenes.ch4));
          if (scenes.ch5) updCh5(sceneProgress(scenes.ch5));
          if (heroCard) {
            const hp = clamp(window.scrollY / window.innerHeight, 0, 1);
            heroCard.style.opacity = `${1 - hp * 1.05}`;
            heroCard.style.filter = `blur(${hp * 5}px)`;
            heroCard.style.translate = `0 ${hp * -60}px`;
          }
        }
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    if (noMotion) {
      wr1.forEach((w) => { w.style.opacity = '1'; });
      strokes.forEach((s) => { s.el.style.strokeDashoffset = '0'; });
      threads.forEach((t) => { t.el.style.strokeDashoffset = '0'; });
      outs.forEach((o) => { o.el.style.strokeDashoffset = '0'; });
      outGs.forEach((g) => { g.style.opacity = '1'; });
      if (multCoreNode) multCoreNode.setAttribute('opacity', '1');
      Array.from(root.querySelectorAll('.cross-q,.lstep')).forEach((el) => el.classList.add('on'));
      arts.forEach((a) => {
        a.style.position = 'relative';
        a.style.opacity = '1';
        a.style.margin = '0 0 20px';
      });
      if (htrack) {
        htrack.style.flexWrap = 'wrap';
        htrack.style.height = 'auto';
      }
    }

    return () => {
      running = false;
      rvObserver.disconnect();
      window.removeEventListener('resize', placeTicks);
      if (hero && matchMedia('(pointer:fine)').matches && !noMotion) {
        hero.removeEventListener('mousemove', heroMouseMove);
        hero.removeEventListener('mouseleave', heroMouseLeave);
      }
    };
  }, [currentPage]);

  const currentHeroClass = heroMode ? heroMode : '';

  return (
    <div ref={containerRef}>
      <header className="top">
        <div className="top-row">
          <nav className="tabs" aria-label="Main navigation">
            <Link className={`tab tab-ic ${currentPage === 'home' ? 'active' : ''}`} to="/" aria-label="Home" title="Home" data-page="home">
              <img
                alt=""
                src="profile.jpg"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23141A2B'/%3E%3Ctext x='32' y='39' font-family='monospace' font-size='17' fill='%23EAEEF9' text-anchor='middle'%3EPK%3C/text%3E%3C/svg%3E";
                }}
              />
            </Link>
            {tabs.slice(1).map((tab) => (
              <Link
                key={tab.path}
                className={`tab${currentPage === tab.page ? ' active' : ''}`}
                to={tab.path}
                data-page={tab.page}
              >
                {tab.label}
                {tab.soon ? <span className="soon">soon</span> : null}
              </Link>
            ))}
          </nav>
        </div>
        <div className="route-line" id="routeLine" ref={routeLineRef}>
          <div className="route-fill" id="routeFill" ref={routeFillRef}></div>
          <div className="route-packet" id="routePacket" ref={routePacketRef}></div>
          {journeyChapters.map((chapter) => (
            <button
              type="button"
              key={chapter.id}
              className="route-tick"
              data-ch={chapter.label}
              style={{ display: currentPage === 'journey' ? 'block' : 'none' }}
              onClick={() => {
                const section = document.getElementById(chapter.id);
                if (section) section.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          ))}
        </div>
      </header>

      <div className={`page${currentPage === 'home' ? ' active' : ''}`} data-page="home">
        <section className={`home-hero${currentHeroClass ? ` ${currentHeroClass}` : ''}`} id="homeHero" data-mode={heroMode || undefined} ref={heroRef}>
          <div className="home-kicker rv"><span className="home-status"><i></i>Prashant Kumar · Open to interesting problems · Gurugram</span></div>
          <div className="duo rv d1">
            <div className="hzone l" data-mode="design" aria-hidden="true"></div>
            <div className="hzone r" data-mode="pm" aria-hidden="true"></div>
            <div className="side side-design">
              <span className="tagl">2017 — 2025</span>
              <h2>designer</h2>
              <p>Four years of pixels — enterprise UI, the Polarin design system, every portal module taken 0 → 1.</p>
            </div>
            <div className="face" id="face">
              <div className="layer face-real">
                <img
                  src="profile.jpg"
                  alt="Prashant Kumar"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 460'%3E%3Crect width='400' height='460' fill='%23141A2B'/%3E%3Ccircle cx='200' cy='170' r='68' fill='none' stroke='%238FA0FF' stroke-width='2.5'/%3E%3Cpath d='M85 400 C 115 305, 285 305, 315 400' fill='none' stroke='%238FA0FF' stroke-width='2.5'/%3E%3Ctext x='200' y='182' font-family='monospace' font-size='32' fill='%23EAEEF9' text-anchor='middle'%3EPK%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
              <div className="layer face-art" aria-hidden="true">
                <img
                  src="profile.jpg"
                  alt=""
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 460'%3E%3Crect width='400' height='460' fill='%23141A2B'/%3E%3Ccircle cx='200' cy='170' r='68' fill='none' stroke='%23FFC46B' stroke-width='2.5'/%3E%3Cpath d='M85 400 C 115 305, 285 305, 315 400' fill='none' stroke='%23FFC46B' stroke-width='2.5'/%3E%3Ctext x='200' y='182' font-family='monospace' font-size='32' fill='%23EAEEF9' text-anchor='middle'%3EPK%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
              <span className="seam" aria-hidden="true"></span>
            </div>
            <div className="side side-pm">
              <span className="tagl">2026 — Now</span>
              <h2><span className="br">&lt;</span>product manager<span className="br">/&gt;</span></h2>
              <p>AI-native PM who ships the whole loop on Polarin NaaS — discovery, PRDs, prototypes, deploys — with Claude, Figma & Vercel.</p>
            </div>
          </div>
          <p className="face-cap rv d2">hover a side — <b>same person, both halves</b></p>
          <div className="home-foot rv d2">
            <div className="home-ctas">
              <Link className="btn-big" to="/my-journey" data-jump="ch3">Read my journey <span aria-hidden="true">→</span></Link>
              <Link className="btn-ghost" to="/current-project" data-jump="ch3">Current project</Link>
            </div>
          </div>
        </section>
      </div>

      <div className={`page${currentPage === 'about' ? ' active' : ''}`} data-page="about">
        <section className="soon-page">
          <div className="wrap soon-box">
            <p className="eyebrow rv">Page 02 · About</p>
            <h2 className="rv d1">The author's note is <span>being written.</span></h2>
            <p className="rv d2">Who I am off the roadmap — the design years, the tools I reach for, and why I think product, design, and delivery belong in one job. Landing here soon.</p>
            <div className="soon-term rv d3">
              <div><span className="k">$</span> build about --page</div>
              <div><span className="k">status:</span> <span className="a">drafting…</span> <span className="cur"></span></div>
              <div className="soon-bar"><i></i></div>
            </div>
            <div className="soon-ctas rv d3">
              <Link className="btn-big" to="/my-journey" data-jump="ch1">Read my journey instead →</Link>
              <Link className="btn-ghost" to="/">Back to home</Link>
            </div>
          </div>
        </section>
      </div>

      <div className={`page${currentPage === 'current' ? ' active' : ''}`} data-page="current">
        <div className="wrap proj-head">
          <p className="eyebrow rv">Page 03 · Current Project · POLO</p>
          <h2 className="ch-title rv d1">Building <span>Polarin.</span></h2>
          <p className="proj-brief rv d2">Polarin is POLO's <b>Network-as-a-Service platform</b> — enterprise connectivity that provisions like cloud. I own its product surfaces end to end: <b>five workstreams, one roadmap</b>, shaped by support data, usage analytics, and customer interviews — with AI in every loop from discovery to deployed frontend.</p>
          <div className="proj-meta rv d3">
            <span className="chip">role · Associate Product Manager</span>
            <span className="chip">2022 — now · promoted 2×</span>
            <span className="chip">stack · Claude · Figma · Cursor · Vercel</span>
          </div>
        </div>
        <div className="wrap proj-grid">
          <article className="proj-card rv">
            <span className="st live">Live · scaling</span>
            <div className="glyphbox">◈</div>
            <h3>Customer Portal</h3>
            <p>The self-serve front door — ordering, service management, real-time health. Rebuilt around the friction data; <b>self-serve adoption grew 3×</b>.</p>
            <div className="proj-tags"><span className="chip">self-serve</span><span className="chip">0→1</span></div>
            <div className="proj-foot">
              <Link className="cs-link" to="/my-journey" data-jump="ch3">Highlights in Ch.3 →</Link>
              <span className="cs-soon">full study soon</span>
            </div>
          </article>
          <article className="proj-card rv d1">
            <span className="st build">In build</span>
            <div className="glyphbox">⌘</div>
            <h3>Admin Portal</h3>
            <p>The internal ops console — provisioning, approvals, customer management. Killing swivel-chair workflows so <b>ops moves at portal speed</b>, not spreadsheet speed.</p>
            <div className="proj-tags"><span className="chip">internal tools</span><span className="chip">workflows</span></div>
            <div className="proj-foot">
              <span className="cs-soon">case study soon</span>
            </div>
          </article>
          <article className="proj-card rv d2">
            <span className="st build">In build</span>
            <div className="glyphbox">λ</div>
            <h3>Developer Portal</h3>
            <p>APIs, docs, keys, sandboxes — turning Polarin from a product into a <b>platform other teams build on</b>. Provision a network the way you'd call an API.</p>
            <div className="proj-tags"><span className="chip">API-first</span><span className="chip">DX</span></div>
            <div className="proj-foot">
              <span className="cs-soon">case study soon</span>
            </div>
          </article>
          <article className="proj-card rv d1">
            <span className="st live">Shipping</span>
            <div className="glyphbox">₹</div>
            <h3>Invoicing</h3>
            <p>Billing without tickets — usage clarity, invoice history, disputes handled in-portal. <b>Finance teams see what they pay for</b>, and why.</p>
            <div className="proj-tags"><span className="chip">billing UX</span><span className="chip">trust</span></div>
            <div className="proj-foot">
              <span className="cs-soon">case study soon</span>
            </div>
          </article>
          <article className="proj-card rv d2">
            <span className="st live">Live · every surface</span>
            <div className="glyphbox">◉</div>
            <h3>Polarin Design System</h3>
            <p>Tokens, components, patterns — the shared language <b>every product surface still runs on</b>, and the vocabulary my AI pipeline speaks when generating frontends.</p>
            <div className="proj-tags"><span className="chip">tokens</span><span className="chip">components</span><span className="chip">AI-ready</span></div>
            <div className="proj-foot">
              <Link className="cs-link" to="/my-journey" data-jump="ch2">Its origin in Ch.2 →</Link>
              <span className="cs-soon">full study soon</span>
            </div>
          </article>
          <article className="proj-card rv d3" style={{ borderStyle: 'dashed', background: 'transparent' }}>
            <div className="glyphbox">＋</div>
            <h3 style={{ color: 'var(--mute)' }}>Next workstream</h3>
            <p>The roadmap never sleeps. Deep-dive case studies for each surface are being written — problem, approach, AI-in-the-loop, and what moved.</p>
            <div className="proj-foot">
              <Link className="cs-link" to="/my-journey" data-jump="ch4">Meanwhile — my process →</Link>
            </div>
          </article>
        </div>
      </div>

      <div className={`page${currentPage === 'other' ? ' active' : ''}`} data-page="other">
        <section className="soon-page">
          <div className="wrap soon-box">
            <p className="eyebrow rv">Page 04 · Other Projects</p>
            <h2 className="rv d1">Side quests, <span>loading.</span></h2>
            <p className="rv d2">The Peepal Design redesigns, rapid AI prototypes, and experiments that didn't make the main plot. Being curated now.</p>
            <div className="soon-term rv d3">
              <div><span className="k">$</span> ls ~/projects --other</div>
              <div><span className="k">status:</span> <span className="a">indexing…</span> <span className="cur"></span></div>
              <div className="soon-bar"><i></i></div>
            </div>
            <div className="soon-ctas rv d3">
              <Link className="btn-big" to="/my-journey" data-jump="ch1">See Ch.1 — The Pixel Years →</Link>
              <Link className="btn-ghost" to="/">Back to home</Link>
            </div>
          </div>
        </section>
      </div>

      <div className={`page${currentPage === 'journey' ? ' active' : ''}`} data-page="journey">
        <main id="top">
          <section className="hero" id="hero" data-ch="Prologue">
            <span className="glyph" data-depth="0.8" style={{ top: '14%', right: '8%' }}>□ portal-prd-v3.md</span>
            <span className="glyph" data-depth="1.2" style={{ top: '46%', right: '14%' }}>✦ claude --pair</span>
            <span className="glyph" data-depth="0.5" style={{ top: '76%', right: '7%' }}>▷ vercel --prod</span>
            <div className="wrap hero-inner">
              <div id="heroCard" ref={heroCardRef}>
                <p className="hero-kicker">My Journey · <b>A portfolio in five chapters</b></p>
                <h1>
                  <span className="l1">Every product</span><br />
                  <span className="l2">is a story.</span><br />
                  <span className="l3">I ship the plot.</span>
                </h1>
                <p className="hero-sub">First designer at <b>POLO</b>. Three promotions into full product ownership of the Polarin NaaS platform. Now I ship the entire loop myself — with Claude, Figma, and Vercel as co-authors.</p>
                <div className="hero-index">
                  <button data-go="ch1" type="button"><b>01</b> Pixel Years</button>
                  <button data-go="ch2" type="button"><b>02</b> The Crossing</button>
                  <button data-go="ch3" type="button"><b>03</b> The Platform</button>
                  <button data-go="ch4" type="button"><b>04</b> The Loop</button>
                  <button data-go="ch5" type="button"><b>05</b> The Multiplier</button>
                </div>
              </div>
            </div>
            <div className="hero-scroll"><i></i>scroll to begin</div>
          </section>

          <section id="ch1" data-ch="Ch.1 — The Pixel Years">
            <div className="wrap ch-head">
              <p className="ch-num rv"><b>Chapter 01</b> · 2017 — 2022 · Bangalore</p>
              <h2 className="ch-title rv d1">The Pixel <span>Years.</span></h2>
              <div className="ch1-creds rv d2">
                <span className="chip">B.Des · FDDI Noida · 2017–2021</span>
                <span className="chip">UI/UX Designer · Peepal Design · 2021–2022</span>
                <span className="chip">UX-PM Certification · Level 1 & 2</span>
              </div>
            </div>
            <div className="scene" data-scene="ch1" style={{ height: '220vh' }}>
              <div className="pin">
                <div className="wrap ch1-grid">
                  <p className="wr" id="wr1">A design degree, then the trenches at a Bangalore studio — redesigning three enterprise B2B products. Task completion rose 28%. Drop-off fell 35%. And one lesson stuck for good: <i className="hot">the interface is never the product.</i> <i className="lnk">The decision behind it is.</i></p>
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
                </div>
              </div>
            </div>
          </section>

          <section id="ch2" data-ch="Ch.2 — The Crossing">
            <div className="wrap ch-head">
              <p className="ch-num rv"><b>Chapter 02</b> · Nov 2022 — Now · POLO · Promoted 2×</p>
              <h2 className="ch-title rv d1">The <span>Crossing.</span></h2>
              <p className="rv d2" style={{ color: 'var(--mute)', maxWidth: '58ch', marginTop: '14px' }}>I joined POLO as its first designer. Three promotions later the title says product — but it was always the same question, asked three sizes bigger. Watch the artifact change as the question does.</p>
            </div>
            <div className="scene" data-scene="ch2" style={{ height: '340vh' }}>
              <div className="pin">
                <div className="cross-word" aria-hidden="true">
                  <span data-cw="0">PIXELS</span>
                  <span data-cw="1">SYSTEMS</span>
                  <span data-cw="2">OUTCOMES</span>
                </div>
                <div className="wrap cross-stage">
                  <div className="cross-left">
                    <div className="cross-q" data-cq="0">
                      <div className="yr"><b>2022</b> · Executive UI/UX Designer</div>
                      <h3>"Does it <em>look</em> right?"</h3>
                      <p>First designer in the building. Every customer-portal module taken 0 → 1 — structure, core flows, screens — from a truly blank canvas.</p>
                    </div>
                    <div className="cross-q" data-cq="1">
                      <div className="yr"><b>2025</b> · Senior Executive UI/UX Designer</div>
                      <h3>"Does it <em>scale</em> right?"</h3>
                      <p>Built the Polarin design system — tokens, components, patterns — that every product surface still runs on. Screens became a language.</p>
                    </div>
                    <div className="cross-q" data-cq="2">
                      <div className="yr"><b>2026</b> · Associate Product Manager</div>
                      <h3>"Is it the <em>right thing</em> at all?"</h3>
                      <p>Full product ownership: the developer & customer portal roadmap end to end — priorities shaped by support data, usage analytics, and customer interviews.</p>
                    </div>
                  </div>
                  <div className="cross-right" aria-hidden="true">
                    <div className="artifact" data-art="0">
                      <div className="art-bar"><i style={{ background: 'var(--link)' }}></i>portal-module-v1.fig · first designer</div>
                      <div className="art-body">
                        <div className="wf-el bar"></div>
                        <div className="wf-el hero">MODULE / 0 → 1</div>
                        <div className="wf-row"><div className="wf-el card"></div><div className="wf-el card"></div></div>
                        <div className="wf-el btn"></div>
                      </div>
                    </div>
                    <div className="artifact" data-art="1">
                      <div className="art-bar"><i style={{ background: 'var(--rose)' }}></i>polarin-ds · tokens · components</div>
                      <div className="art-body">
                        <div className="prd-line prd-h"></div>
                        <span className="prd-tag">Tokens</span><span className="prd-tag">Components</span><span className="prd-tag">Patterns</span>
                        <div className="prd-line" style={{ width: '92%' }}></div>
                        <div className="prd-line" style={{ width: '84%' }}></div>
                        <div className="prd-line" style={{ width: '70%' }}></div>
                        <div className="prd-metric"><span>surfaces running on it</span><b>all of them</b></div>
                        <div className="prd-metric"><span>design → dev drift</span><b>▼ near zero</b></div>
                      </div>
                    </div>
                    <div className="artifact" data-art="2">
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
                <div className="cross-hint">keep scrolling — the question grows</div>
              </div>
            </div>
          </section>

          <section id="ch3" data-ch="Ch.3 — The Platform">
            <div className="scene hscroll" data-scene="ch3" style={{ height: '420vh' }}>
              <div className="pin">
                <div className="htrack" id="htrack" ref={htrackRef}>
                  <div className="panel">
                    <div className="panel-intro">
                      <p className="ch-num"><b>Chapter 03</b> · Polarin — a Network-as-a-Service platform, built at POLO</p>
                      <h2 className="ch-title" style={{ marginTop: '12px' }}>The <span>Platform.</span></h2>
                      <p style={{ color: 'var(--mute)', marginTop: '18px', maxWidth: '44ch' }}>Three problems that shaped Polarin — told in three acts each. Scroll down; the story moves sideways, the way real roadmaps do. →</p>
                    </div>
                  </div>
                  <div className="panel">
                    <article className="panel-card" data-act="I">
                      <span className="pc-tag">Case I · Foundation</span>
                      <h3 className="pc-title">A platform that started as a blank Figma file.</h3>
                      <p className="pc-sub">Polarin · customer portal & design system</p>
                      <div className="pc-acts">
                        <div className="pc-act"><h4>Act I · Tension</h4><p>A NaaS platform with <b>no product surface and no design language</b> — and I was the only designer. Every module, every flow, every screen: unmade.</p></div>
                        <div className="pc-act"><h4>Act II · Turn</h4><p>Took each customer-portal module <b>0 → 1</b> — structure, core flows, screens — while building the <b>Polarin design system</b> (tokens, components, patterns) underneath it all.</p></div>
                        <div className="pc-act"><h4>Act III · Resolution</h4><p>Every product surface at POLO <b>still runs on that system</b>. New modules ship faster because the language already exists.</p></div>
                      </div>
                      <div className="pc-ai"><b>AI in this chapter</b>The system became the shared vocabulary between design and dev — and later, the vocabulary Claude speaks when I generate production-adjacent frontends. A design system is a prompt library you can see.</div>
                      <div className="pc-foot">
                        <div className="pc-metric">0 → 1<small>platform & design system</small></div>
                        <div className="pc-chips"><span className="chip">0→1 delivery</span><span className="chip">design systems</span><span className="chip">IA & core flows</span></div>
                      </div>
                    </article>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="ch5" data-ch="Ch.5 — The Multiplier">
              <div className="wrap ch-head" style={{ textAlign: 'center' }}>
                <p className="ch-num rv" style={{ justifyContent: 'center' }}><b>Chapter 05</b> · Why it matters to an org</p>
                <h2 className="ch-title rv d1">The <span>Multiplier.</span></h2>
                <p className="rv d2" style={{ color: 'var(--mute)', maxWidth: '60ch', margin: '14px auto 0' }}>Five disciplines usually live in five people, five backlogs, five handoffs. Scroll — and watch what happened at POLO when they routed through one.</p>
              </div>
              <div className="scene" data-scene="ch5" style={{ height: '300vh' }}>
                <div className="pin">
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
                      <g id="multCore" opacity="0" ref={multCoreRef}>
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
                    <p className="mult-cap" id="multCap" ref={multCapRef}>five skills, entering the same node…</p>
                    <div className="skill-strip">
                      <span className="chip">product strategy</span><span className="chip">PRDs & user stories</span><span className="chip">roadmap planning</span>
                      <span className="chip">OKRs</span><span className="chip">stakeholder management</span><span className="chip">customer discovery</span>
                      <span className="chip">0→1 delivery</span><span className="chip">AI-assisted prototyping</span><span className="chip">rapid POC</span>
                      <span className="chip">design systems</span><span className="chip">cross-functional delivery</span><span className="chip">metrics-driven decisions</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="epi" id="epi" data-ch="Epilogue">
              <div className="wrap">
                <p className="eyebrow rv">Epilogue · Your move</p>
                <h2 className="rv d1">The next chapter is <span className="hot">unwritten.</span></h2>
                <p className="rv d2">Enterprise B2B, 5+ years, and one conviction: product, design, and AI-speed delivery should be one job, not three. If you're building something that agrees — let's talk.</p>
                <div className="epi-row rv d3">
                  <a className="btn-big" href="mailto:your-email@example.com">your-email@example.com <span aria-hidden="true">→</span></a>
                  <a className="btn-ghost" href="#!" onClick={(event) => event.preventDefault()}>LinkedIn</a>
                  <a className="btn-ghost" href="#!" onClick={(event) => event.preventDefault()}>prashantfolio.in</a>
                </div>
              </div>
            </section>
          </main>
        </div>

      <footer>
        <span>© 2026 Prashant Kumar · Gurugram / New Delhi, IN</span>
        <span><span className="g">●</span> made with love, fun & a dash of curiosity</span>
      </footer>
    </div>
  );
}
