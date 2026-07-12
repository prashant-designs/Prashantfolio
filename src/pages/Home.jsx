import { useState } from 'react';

export default function Home() {
  const [mode, setMode] = useState('both');

  return (
    <section className="home-hero" data-mode={mode} onMouseLeave={() => setMode('both')}>
      <div className="home-kicker rv">
        <span className="home-status">
          <i></i>Prashant Kumar · Open to interesting problems · Gurugram
        </span>
      </div>

      <div className="duo rv d1">
        <div className="hzone l" onMouseEnter={() => setMode('design')} aria-hidden="true"></div>
        <div className="hzone c" onMouseEnter={() => setMode('both')} aria-hidden="true"></div>
        <div className="hzone r" onMouseEnter={() => setMode('pm')} aria-hidden="true"></div>

        <div className="side side-design">
          <span className="tagl">2021 — 2024</span>
          <h2>designer</h2>
          <p>Three years of pixels — enterprise UI, the Polarin design system, every portal module taken 0 → 1.</p>
          <div className="side-skills">
            <span className="chip">Figma</span>
            <span className="chip">Design systems</span>
            <span className="chip">UI/UX</span>
          </div>
        </div>

        <div className="face" id="face">
          <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
            <defs>
              <filter id="paintize" colorInterpolationFilters="sRGB">
                <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="soft" />
                <feTurbulence type="fractalNoise" baseFrequency="0.03 0.05" numOctaves="3" seed="7" result="noise" />
                <feDisplacementMap in="soft" in2="noise" scale="11" xChannelSelector="R" yChannelSelector="G" result="warped" />
                <feColorMatrix in="warped" type="saturate" values="1.85" result="sat" />
                <feComponentTransfer in="sat" result="toned">
                  <feFuncR type="gamma" amplitude="1" exponent="0.8" offset="0" />
                  <feFuncG type="gamma" amplitude="1" exponent="0.8" offset="0" />
                  <feFuncB type="gamma" amplitude="1" exponent="0.86" offset="0" />
                </feComponentTransfer>
                <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="grain" />
                <feColorMatrix in="grain" type="matrix" values="0 0 0 0 1  0 0 0 0 0.77  0 0 0 0 0.42  0 0 0 0.06 0" result="grainTint" />
                <feBlend in="toned" in2="grainTint" mode="overlay" />
              </filter>
              <filter id="duotoneSystems" colorInterpolationFilters="sRGB">
                <feColorMatrix
                  type="matrix"
                  values="0.33 0.33 0.33 0 0
                          0.33 0.33 0.33 0 0
                          0.33 0.33 0.33 0 0
                          0    0    0    1 0"
                  result="gray"
                />
                <feComponentTransfer>
                  <feFuncR type="table" tableValues="0.04 0.56" />
                  <feFuncG type="table" tableValues="0.07 0.63" />
                  <feFuncB type="table" tableValues="0.16 1" />
                </feComponentTransfer>
              </filter>
            </defs>
          </svg>

          <div className="layer face-real">
            <img src="/image.png" alt="Prashant Kumar"
              onError={(e) => { e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 400 460%27%3E%3Crect width=%27400%27 height=%27460%27 fill=%27%23141A2B%27/%3E%3Ccircle cx=%27200%27 cy=%27170%27 r=%2768%27 fill=%27none%27 stroke=%27%238FA0FF%27 stroke-width=%272.5%27/%3E%3Cpath d=%27M85 400 C 115 305, 285 305, 315 400%27 fill=%27none%27 stroke=%27%238FA0FF%27 stroke-width=%272.5%27/%3E%3Ctext x=%27200%27 y=%27182%27 font-family=%27monospace%27 font-size=%2732%27 fill=%27%23EAEEF9%27 text-anchor=%27middle%27%3EPK%3C/text%3E%3C/svg%3E' }}
            />
          </div>

          <div className="layer face-paint" aria-hidden="true">
            <img src="/image.png" alt="" />
            <span className="face-tag face-tag-design">painted · daily craft</span>
          </div>

          <div className="layer face-systems" aria-hidden="true">
            <img src="/image.png" alt="" />
            <div className="face-grid"></div>
            <div className="face-scan"></div>
            <span className="face-bracket tl"></span>
            <span className="face-bracket tr"></span>
            <span className="face-bracket bl"></span>
            <span className="face-bracket br"></span>
            <span className="face-tag face-tag-pm">systems · online</span>
          </div>
        </div>

        <div className="side side-pm">
          <span className="tagl">2025 — Now</span>
          <h2><span className="br">&lt;</span>product manager<span className="br">/&gt;</span></h2>
          <p>AI-native PM who ships the whole loop on Polarin NaaS — discovery, PRDs, prototypes, deploys — with Claude, Figma & Vercel.</p>
          <div className="side-skills">
            <span className="chip">PRDs & roadmaps</span>
            <span className="chip">Customer discovery</span>
            <span className="chip">Claude + Vercel</span>
          </div>
        </div>
      </div>

      <div className="disc-cycle" aria-hidden="true">
        <span style={{ animationDelay: '0s' }}>designing interfaces</span>
        <span style={{ animationDelay: '2s' }}>writing code</span>
        <span style={{ animationDelay: '4s' }}>shipping product</span>
        <span style={{ animationDelay: '6s' }}>growing the business</span>
      </div>

      <p className="face-cap rv d2">hover a side — <b>same person, both halves</b></p>
      
      <div className="home-foot rv d2">
        <div className="home-ctas">
          <a className="btn-big" href="#/journey">Read my journey <span aria-hidden="true">→</span></a>
          <a className="btn-ghost" href="#/current">Current project</a>
        </div>
      </div>
    </section>
  );
}
