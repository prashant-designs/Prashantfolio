import { useState } from 'react';

export default function Home() {
  const [mode, setMode] = useState('both');

  // deliberately not a .flip section (see SECTION THEME FLIP in index.css).
  // two reasons: it is the one screen a recruiter sees first and it should
  // land on-brand dark, and it is the *only* section on this page - the
  // device is an alternation, and a single fold with nothing under it to
  // alternate against would just be one unexplained colour change. it also
  // sits at the middle of the viewport at scroll 0, so it would trip the
  // trigger on load rather than on a scroll. adding "flip" to the class list
  // below is all it takes if a second section ever lands on this page.
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
          <span className="tagl">2021 - 2024</span>
          <h2>designer</h2>
          <p>Three years of pixels - enterprise UI, a design system built from scratch, every portal module taken 0 → 1.</p>
          <div className="side-skills">
            <span className="chip">Figma</span>
            <span className="chip">Design systems</span>
            <span className="chip">UI/UX</span>
          </div>
        </div>

        <div className="face-wrap">
          {/* the "systems" half of the portrait: flattened to luminance, then
              mapped shadows → highlights through a two-stop ramp, so it reads as
              a technical print of the same face rather than the painted one
              beside it. the ramp used to end on pure blue (0.56 / 0.63 / 1.00),
              which made this the single largest piece of blue on the site - and
              blue is not an accent here any more, see --link in src/index.css.
              it ends on near-white now, with only 2-3 points of blue over red
              held through the ramp - the same whisper of tint the neutral ladder
              itself carries, enough to keep the print reading cool against the
              warm painted layer without being a colour. the two halves are still
              told apart the way they always actually were: one is painted and
              one is monochrome. */}
          <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
            <defs>
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
                  <feFuncR type="table" tableValues="0.05 0.94" />
                  <feFuncG type="table" tableValues="0.06 0.95" />
                  <feFuncB type="table" tableValues="0.08 0.97" />
                </feComponentTransfer>
              </filter>
            </defs>
          </svg>

          <div className="face" id="face">
            <div className="layer face-real">
              <img src="/image.png" alt="Prashant Kumar"
                onError={(e) => { e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 400 460%27%3E%3Crect width=%27400%27 height=%27460%27 fill=%27%23202020%27/%3E%3Ccircle cx=%27200%27 cy=%27170%27 r=%2768%27 fill=%27none%27 stroke=%27%23A3A3A3%27 stroke-width=%272.5%27/%3E%3Cpath d=%27M85 400 C 115 305, 285 305, 315 400%27 fill=%27none%27 stroke=%27%23A3A3A3%27 stroke-width=%272.5%27/%3E%3Ctext x=%27200%27 y=%27182%27 font-family=%27monospace%27 font-size=%2732%27 fill=%27%23F5F4F2%27 text-anchor=%27middle%27%3EPK%3C/text%3E%3C/svg%3E' }}
              />
            </div>

            <div className="layer face-paint" aria-hidden="true">
              <img src="/image-designer.png" alt="" />
            </div>

            <div className="layer face-systems" aria-hidden="true">
              <img src="/image.png" alt="" />
              <div className="face-grid"></div>
              <div className="face-scan"></div>
            </div>

            <div className="face-vignette" aria-hidden="true"></div>
          </div>

          <span className="face-tag face-tag-design" aria-hidden="true">in motion · daily craft</span>

          <div className="face-hud" aria-hidden="true">
            <span className="face-bracket tl"></span>
            <span className="face-bracket tr"></span>
            <span className="face-bracket bl"></span>
            <span className="face-bracket br"></span>
            <span className="face-tag face-tag-pm">systems · online</span>
          </div>
        </div>

        <div className="side side-pm">
          <span className="tagl">2025 - Now</span>
          <h2><span className="br">&lt;</span>product manager<span className="br">/&gt;</span></h2>
          <p>AI-assisted product manager who owns the full loop - discovery, PRDs, prototypes, frontend builds, and every deploy. One pair of hands, end to end.</p>
          <div className="side-skills">
            <span className="chip">PRDs & roadmaps</span>
            <span className="chip">Customer discovery</span>
            <span className="chip">Ships to prod</span>
          </div>
        </div>
      </div>

      <div className="disc-cycle" aria-hidden="true">
        <span style={{ animationDelay: '0s' }}>designing interfaces</span>
        <span style={{ animationDelay: '2s' }}>writing code</span>
        <span style={{ animationDelay: '4s' }}>shipping product</span>
        <span style={{ animationDelay: '6s' }}>growing the business</span>
      </div>

      <p className="face-cap rv d2">hover a side - <b>same person, both halves</b></p>
      
      <div className="home-foot rv d2">
        <div className="home-ctas">
          <a className="btn-big" href="#/journey">Read my journey <span aria-hidden="true">→</span></a>
          <a className="btn-ghost" href="#/current">Current project</a>
        </div>
      </div>
    </section>
  );
}
