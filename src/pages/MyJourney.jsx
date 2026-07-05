import { useEffect } from 'react';
import ScrollHint from '../components/ScrollHint';

export default function MyJourney() {
  useEffect(() => {
    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
    const noMotion = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    const enhanced = !noMotion;

    if (!enhanced) {
      document.body.classList.add('static');
    }

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

    document.querySelectorAll('.wr').forEach((paragraph) => {
      const fragment = document.createDocumentFragment();
      [...paragraph.childNodes].forEach((node) => {
        if (node.nodeType === 3) {
          node.textContent.split(/\s+/).filter(Boolean).forEach((word) => {
            const span = document.createElement('span');
            span.className = 'w';
            span.textContent = `${word} `;
            fragment.appendChild(span);
          });
        } else if (node.nodeType === 1) {
          const className = node.tagName === 'I' ? node.className || '' : '';
          node.textContent.split(/\s+/).filter(Boolean).forEach((word) => {
            const span = document.createElement('span');
            span.className = `w ${className}`.trim();
            span.textContent = `${word} `;
            fragment.appendChild(span);
          });
        }
      });
      paragraph.innerHTML = '';
      paragraph.appendChild(fragment);
    });

    const strokes = [...document.querySelectorAll('.sd')].map((element) => {
      let length = 300;
      try {
        length = element.getTotalLength();
      } catch {
        // ignore
      }
      element.style.strokeDasharray = length;
      element.style.strokeDashoffset = length;
      return { element, length };
    });

    const threads = [...document.querySelectorAll('[data-th]')].map((element) => {
      const length = element.getTotalLength();
      element.style.strokeDasharray = length;
      element.style.strokeDashoffset = length;
      return { element, length };
    });

    const outs = [...document.querySelectorAll('[data-out]')].map((element) => {
      const length = element.getTotalLength();
      element.style.strokeDasharray = length;
      element.style.strokeDashoffset = length;
      return { element, length };
    });

    const outGs = [...document.querySelectorAll('[data-og]')];
    const multCore = document.getElementById('multCore');
    const multCap = document.getElementById('multCap');

    const sceneProgress = (scene) => {
      const rect = scene.getBoundingClientRect();
      const total = scene.offsetHeight - window.innerHeight;
      if (total <= 0) return 0;
      return clamp((-rect.top) / total, 0, 1);
    };

    const scenes = {};
    document.querySelectorAll('[data-scene]').forEach((scene) => {
      scenes[scene.dataset.scene] = scene;
    });

    const wr1 = [...document.querySelectorAll('#wr1 .w')];
    const updateChapterOne = (progress) => {
      const count = wr1.length;
      wr1.forEach((word, index) => {
        word.style.opacity = clamp(progress * 1.15 * count - index, 0.13, 1);
      });
      strokes.forEach((stroke, index) => {
        const local = clamp(progress * strokes.length * 1.35 - index * 0.8, 0, 1);
        stroke.element.style.strokeDashoffset = stroke.length * (1 - local);
      });
    };

    const arts = [...document.querySelectorAll('.artifact')];
    const crossQuestions = [...document.querySelectorAll('.cross-q')];
    const crossWords = [...document.querySelectorAll('[data-cw]')];
    const updateChapterTwo = (progress) => {
      const phase = progress * 2.6;
      const index = clamp(Math.round(clamp(phase, 0, 2)), 0, 2);
      arts.forEach((art, artIndex) => {
        const delta = clamp(phase, 0, 2) - artIndex;
        const visibility = clamp(1 - Math.abs(delta), 0, 1);
        art.style.opacity = visibility;
        art.style.transform = `rotateY(${delta * -55}deg) translateX(${delta * -60}px) translateZ(${(visibility - 1) * 140}px)`;
        art.style.zIndex = Math.round(visibility * 10);
      });
      crossQuestions.forEach((question, questionIndex) => {
        question.classList.toggle('on', questionIndex === index);
      });
      crossWords.forEach((word, wordIndex) => {
        const delta = clamp(phase, 0, 2) - wordIndex;
        const visibility = clamp(1 - Math.abs(delta) * 1.4, 0, 1);
        word.style.opacity = visibility * 0.9;
        word.style.transform = `translateY(${delta * -70}px) scale(${0.92 + visibility * 0.08})`;
      });
    };

    const htrack = document.getElementById('htrack');
    const hsBar = document.getElementById('hsBar');
    const hsCount = document.getElementById('hsCount');
    const updateChapterThree = (progress) => {
      const max = htrack.scrollWidth - window.innerWidth;
      htrack.style.transform = `translateX(${-progress * max}px)`;
      hsBar.style.width = `${progress * 100}%`;
      hsCount.textContent = `${1 + Math.round(progress * 3)} / 4`;
    };

    const orbit = document.getElementById('orbit');
    const orbitCore = document.querySelector('.orbit-core');
    const orbitNodes = [...document.querySelectorAll('[data-ln]')];
    const lsteps = [...document.querySelectorAll('[data-ls]')];
    const updateChapterFour = (progress) => {
      const rotation = progress * 360;
      orbit.style.transform = `rotateX(62deg) rotateZ(${-rotation}deg)`;
      orbitNodes.forEach((node) => {
        const angle = parseFloat(node.style.getPropertyValue('--a'));
        node.style.transform = `translate(-50%,-50%) rotateZ(${angle}deg) translateY(calc(min(360px,72vw)/-2)) rotateZ(${-(angle - rotation)}deg) rotateX(-62deg)`;
      });
      orbitCore.style.transform = `translate(-50%,-50%) rotateX(-62deg) rotateZ(${rotation}deg)`;
      const active = clamp(Math.floor(progress * 5.01), 0, 4);
      lsteps.forEach((step, index) => step.classList.toggle('on', index <= active));
      orbitNodes.forEach((node, index) => node.classList.toggle('on', index === active));
    };

    const updateChapterFive = (progress) => {
      threads.forEach((thread, index) => {
        const local = clamp(progress * 2.4 - index * 0.14, 0, 1);
        thread.element.style.strokeDashoffset = thread.length * (1 - local);
      });
      const coreValue = clamp((progress - 0.42) / 0.14, 0, 1);
      multCore.setAttribute('opacity', coreValue);
      outs.forEach((out, index) => {
        const local = clamp((progress - 0.55) * 3 - index * 0.18, 0, 1);
        out.element.style.strokeDashoffset = out.length * (1 - local);
      });
      outGs.forEach((group, index) => {
        group.style.opacity = clamp((progress - 0.68) * 4 - index * 0.5, 0, 1);
      });
      multCap.textContent = progress < 0.45 ? 'five skills, entering the same node…' : progress < 0.7 ? 'no handoffs. no translation loss. one owner.' : 'what POLO got back →';
    };

    const heroCard = document.getElementById('heroCard');
    const hero = document.getElementById('hero');
    const glyphs = [...document.querySelectorAll('.glyph')];
    let onHeroMove;
    let onHeroLeave;
    if (window.matchMedia('(pointer:fine)').matches && enhanced && hero) {
      let frame = null;
      onHeroMove = (event) => {
        if (frame) return;
        frame = window.requestAnimationFrame(() => {
          const rect = hero.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          heroCard.style.transform = `rotateY(${x * 5}deg) rotateX(${y * -4}deg)`;
          glyphs.forEach((glyph) => {
            const depth = parseFloat(glyph.dataset.depth);
            glyph.style.transform = `translate(${x * -30 * depth}px, ${y * -24 * depth}px)`;
          });
          frame = null;
        });
      };
      onHeroLeave = () => {
        heroCard.style.transform = '';
      };
      hero.addEventListener('mousemove', onHeroMove);
      hero.addEventListener('mouseleave', onHeroLeave);
    }

    // Chapter jump-ticks on the shared top-nav progress line.
    const routeLine = document.getElementById('routeLine');
    const chSections = [...document.querySelectorAll('[data-ch]')];
    const createdTicks = [];

    if (routeLine) {
      chSections.forEach((section) => {
        const tickEl = document.createElement('button');
        tickEl.className = 'route-tick';
        tickEl.dataset.ch = section.dataset.ch;
        tickEl.setAttribute('aria-label', `Jump to ${section.dataset.ch}`);
        tickEl.addEventListener('click', () => {
          section.scrollIntoView({ behavior: enhanced ? 'smooth' : 'auto' });
        });
        routeLine.appendChild(tickEl);
        createdTicks.push(tickEl);
      });
    }

    const placeTicks = () => {
      if (!routeLine || chSections.length === 0) return;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      createdTicks.forEach((tickEl, index) => {
        const section = chSections[index];
        if (!section) return;
        const rect = section.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        tickEl.style.left = `${clamp((top / docHeight) * 100, 0, 100)}%`;
      });
    };

    placeTicks();
    window.addEventListener('resize', placeTicks);

    document.querySelectorAll('[data-go]').forEach((button) => {
      const target = document.getElementById(button.dataset.go);
      if (!target) return;
      button.addEventListener('click', () => {
        target.scrollIntoView({ behavior: enhanced ? 'smooth' : 'auto' });
      });
    });

    let lastY = -1;
    let rafId;
    const tick = () => {
      if (window.scrollY !== lastY) {
        lastY = window.scrollY;
        if (enhanced) {
          if (scenes.ch1) updateChapterOne(sceneProgress(scenes.ch1));
          if (scenes.ch2) updateChapterTwo(sceneProgress(scenes.ch2));
          if (scenes.ch3) updateChapterThree(sceneProgress(scenes.ch3));
          if (scenes.ch4) updateChapterFour(sceneProgress(scenes.ch4));
          if (scenes.ch5) updateChapterFive(sceneProgress(scenes.ch5));

          if (heroCard) {
            const heroProgress = clamp(window.scrollY / window.innerHeight, 0, 1);
            heroCard.style.opacity = 1 - heroProgress * 1.05;
            heroCard.style.filter = `blur(${heroProgress * 5}px)`;
            heroCard.style.translate = `0 ${heroProgress * -60}px`;
          }
        }
      }
      rafId = window.requestAnimationFrame(tick);
    };

    if (enhanced) {
      rafId = window.requestAnimationFrame(tick);
    } else {
      wr1.forEach((word) => { word.style.opacity = 1; });
      strokes.forEach((stroke) => { stroke.element.style.strokeDashoffset = 0; });
      threads.forEach((thread) => { thread.element.style.strokeDashoffset = 0; });
      outs.forEach((out) => { out.element.style.strokeDashoffset = 0; });
      outGs.forEach((group) => { group.style.opacity = 1; });
      if (multCore) multCore.setAttribute('opacity', 1);
      document.querySelectorAll('.cross-q,.lstep').forEach((element) => element.classList.add('on'));
      arts.forEach((art) => {
        art.style.position = 'relative';
        art.style.opacity = 1;
        art.style.margin = '0 0 20px';
      });
      if (htrack) {
        htrack.style.flexWrap = 'wrap';
        htrack.style.height = 'auto';
      }
    }

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', placeTicks);
      rvObs.disconnect();
      document.body.classList.remove('static');
      if (hero && onHeroMove) hero.removeEventListener('mousemove', onHeroMove);
      if (hero && onHeroLeave) hero.removeEventListener('mouseleave', onHeroLeave);
      createdTicks.forEach((tickEl) => tickEl.remove());
    };
  }, []);

  return (
    <main id="top">
      {/* PROLOGUE */}
      <section className="hero" id="hero" data-ch="Prologue">
        <span className="glyph" data-depth="0.8" style={{ top: '14%', right: '8%' }}>⚡ portal-prd-v3.md</span>
        <span className="glyph" data-depth="1.2" style={{ top: '46%', right: '14%' }}>✦ claude --pair</span>
        <span className="glyph" data-depth="0.5" style={{ top: '76%', right: '7%' }}>▷ vercel --prod</span>
        <div className="wrap hero-inner">
          <div id="heroCard">
            <p className="hero-kicker">My Journey · <b>A portfolio in five chapters</b></p>
            <h1>
              <span className="l1">Every product</span><br />
              <span className="l2">is a story.</span><br />
              <span className="l3">I ship the plot.</span>
            </h1>
            <p className="hero-sub">First designer at <b>POLO</b>. Three promotions into full product ownership of the
            <b> Polarin NaaS platform</b>. Now I ship the entire loop myself — with Claude, Figma, and Vercel as co-authors.</p>
            <div className="hero-index">
              <button data-go="ch1"><b>01</b> Pixel Years</button>
              <button data-go="ch2"><b>02</b> The Crossing</button>
              <button data-go="ch3"><b>03</b> The Platform</button>
              <button data-go="ch4"><b>04</b> The Loop</button>
              <button data-go="ch5"><b>05</b> The Multiplier</button>
            </div>
          </div>
        </div>
        <ScrollHint label="Scroll to begin" />
      </section>

      {/* CH1 */}
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

      {/* CH2 */}
      <section id="ch2" data-ch="Ch.2 — The Crossing">
        <div className="wrap ch-head">
          <p className="ch-num rv"><b>Chapter 02</b> · Nov 2022 — Now · POLO · Promoted 2×</p>
          <h2 className="ch-title rv d1">The <span>Crossing.</span></h2>
          <p style={{ color: 'var(--mute)', maxWidth: '58ch', marginTop: '14px' }} className="rv d2">I joined POLO as its first designer. Three promotions later the title says product — but it was always the same question, asked three sizes bigger. Watch the artifact change as the question does.</p>
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
                    <div className="prd-metric"><span>design → dev drift</span><b>↓ near zero</b></div>
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

      {/* CH3 */}
      <section id="ch3" data-ch="Ch.3 — The Platform">
        <div className="scene hscroll" data-scene="ch3" style={{ height: '420vh' }}>
          <div className="pin">
            <div className="htrack" id="htrack">
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
              <div className="panel">
                <article className="panel-card" data-act="II">
                  <span className="pc-tag">Case II · Adoption</span>
                  <h3 className="pc-title">Teaching customers to serve themselves.</h3>
                  <p className="pc-sub">Polarin · developer & customer portals</p>
                  <div className="pc-acts">
                    <div className="pc-act"><h4>Act I · Tension</h4><p>Capability lived in the platform, but usage lived in <b>support tickets</b>. Customers asked humans for what the portal could already do.</p></div>
                    <div className="pc-act"><h4>Act II · Turn</h4><p>Rebuilt roadmap priorities around <b>support data, usage analytics, and customer interviews</b> — then redesigned the highest-friction flows so the obvious path was the self-serve path.</p></div>
                    <div className="pc-act"><h4>Act III · Resolution</h4><p>Self-service adoption grew <b>3×</b>. The portal stopped being a brochure and became the product's front door.</p></div>
                  </div>
                  <div className="pc-ai"><b>AI in this chapter</b>Interview notes and support-ticket exports synthesized with Claude into friction themes I could rank. High-fidelity prototypes of the fixes built in days, tested with users before the sprint that shipped them.</div>
                  <div className="pc-foot">
                    <div className="pc-metric">3×<small>self-service adoption</small></div>
                    <div className="pc-chips"><span className="chip">customer discovery</span><span className="chip">usage analytics</span><span className="chip">metrics-driven</span></div>
                  </div>
                </article>
              </div>
              <div className="panel">
                <article className="panel-card" data-act="III">
                  <span className="pc-tag">Case III · AI-native delivery</span>
                  <h3 className="pc-title">Cutting the distance between idea and production.</h3>
                  <p className="pc-sub">Polarin · frontend delivery pipeline</p>
                  <div className="pc-acts">
                    <div className="pc-act"><h4>Act I · Tension</h4><p>Frontend changes routed through <b>outsourced vendors</b> — slow cycles, translation loss, and specs that aged before they shipped.</p></div>
                    <div className="pc-act"><h4>Act II · Turn</h4><p>Started deploying frontend changes <b>directly via Claude and Figma in VS Code</b>. Prototypes stopped being pictures of the spec — they became the spec, then the shipped thing.</p></div>
                    <div className="pc-act"><h4>Act III · Resolution</h4><p>Outsourced vendor dependency cut <b>~50%</b>; dev handoffs down <b>40%</b>. The loop closed: the person who found the problem ships the fix.</p></div>
                  </div>
                  <div className="pc-ai"><b>AI in this chapter</b>This one <i>is</i> the AI chapter. Claude + Cursor for build, Figma & Figma Make for design-to-code, Vercel for deploys. PRD to production-adjacent frontend — one owner, days not sprints.</div>
                  <div className="pc-foot">
                    <div className="pc-metric">~50%<small>vendor dependency cut</small></div>
                    <div className="pc-chips"><span className="chip">Claude</span><span className="chip">Cursor</span><span className="chip">Figma → code</span><span className="chip">Vercel</span></div>
                  </div>
                </article>
              </div>
            </div>
            <div className="hs-progress"><span>route</span><span className="bar"><i id="hsBar"></i></span><span id="hsCount">1 / 4</span></div>
          </div>
        </div>
      </section>

      {/* CH4 */}
      <section id="ch4" data-ch="Ch.4 — The Loop">
        <div className="wrap ch-head">
          <p className="ch-num rv"><b>Chapter 04</b> · How I work now</p>
          <h2 className="ch-title rv d1">The <span>Loop.</span></h2>
          <p style={{ color: 'var(--mute)', maxWidth: '58ch', marginTop: '14px' }} className="rv d2">One person, end to end — AI collapsing the distance between a question and a shipped answer. Scroll to run one full cycle; the orbit turns with you.</p>
        </div>
        <div className="scene" data-scene="ch4" style={{ height: '320vh' }}>
          <div className="pin">
            <div className="wrap loop-grid">
              <div className="orbit-stage" aria-hidden="true">
                <div className="orbit" id="orbit">
                  <div className="ring"></div><div className="ring r2"></div>
                  <div className="node" style={{ '--a': '0deg' }} data-ln="0"><b>Discover</b></div>
                  <div className="node" style={{ '--a': '72deg' }} data-ln="1"><b>Define</b></div>
                  <div className="node" style={{ '--a': '144deg' }} data-ln="2"><b>Prototype</b></div>
                  <div className="node" style={{ '--a': '216deg' }} data-ln="3"><b>Validate</b></div>
                  <div className="node" style={{ '--a': '288deg' }} data-ln="4"><b>Deploy</b></div>
                  <div className="orbit-core"><div className="c1">AI</div><div className="c2">in the loop</div></div>
                </div>
              </div>
              <div className="loop-steps">
                <div className="lstep" data-ls="0"><div className="n">01</div><div>
                  <h3>Discover <span>hours, not weeks</span></h3>
                  <p>Support data, usage analytics, and customer interviews — synthesized with <b>Claude</b> into friction themes and jobs-to-be-done I can interrogate, rank, and challenge.</p></div></div>
                <div className="lstep" data-ls="1"><div className="n">02</div><div>
                  <h3>Define <span>PRDs that argue back</span></h3>
                  <p><b>PRDs, user stories, and OKRs</b> drafted with AI as a sparring partner — it red-teams assumptions and pressure-tests success metrics before engineering reads a word.</p></div></div>
                <div className="lstep" data-ls="2"><div className="n">03</div><div>
                  <h3>Prototype <span>high-fidelity, working</span></h3>
                  <p>Not wireframes — <b>rapid POCs on the Polarin design system</b> with Figma, Figma Make, Cursor, and Lovable. Design instincts from Chapter 1, speed from AI pair-building.</p></div></div>
                <div className="lstep" data-ls="3"><div className="n">04</div><div>
                  <h3>Validate <span>test the real thing</span></h3>
                  <p>Customers click actual software in week one. Signals sharpen, feedback gets honest, and <b>bad ideas die cheap</b> — before they cost a sprint.</p></div></div>
                <div className="lstep" data-ls="4"><div className="n">05</div><div>
                  <h3>Deploy <span>evidence, not opinions</span></h3>
                  <p>Frontend changes shipped <b>directly via Claude + Figma in VS Code, deployed on Vercel</b>. Handoffs become head starts. Then the loop turns again.</p></div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CH5 */}
      <section id="ch5" data-ch="Ch.5 — The Multiplier">
        <div className="wrap ch-head" style={{ textAlign: 'center' }}>
          <p className="ch-num rv" style={{ justifyContent: 'center' }}><b>Chapter 05</b> · Why it matters to an org</p>
          <h2 className="ch-title rv d1">The <span>Multiplier.</span></h2>
          <p style={{ color: 'var(--mute)', maxWidth: '60ch', margin: '14px auto 0' }} className="rv d2">Five disciplines usually live in five people, five backlogs, five handoffs. Scroll — and watch what happened at POLO when they routed through one.</p>
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
              <p className="mult-cap" id="multCap">five skills, entering the same node…</p>
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

      {/* EPILOGUE */}
      <section className="epi" id="epi" data-ch="Epilogue">
        <div className="wrap">
          <p className="eyebrow rv">Epilogue · Your move</p>
          <h2 className="rv d1">The next chapter is <span className="hot">unwritten.</span></h2>
          <p className="rv d2">Enterprise B2B, 5+ years, and one conviction: product, design, and AI-speed delivery should be
          one job, not three. If you're building something that agrees — let's talk.</p>
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
