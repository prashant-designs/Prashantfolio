import { useState } from 'react';

export default function Home() {
  const [mode, setMode] = useState(null);

  return (
    <section className="home-hero" data-mode={mode} onMouseLeave={() => setMode(null)}>
      <div className="home-kicker rv">
        <span className="home-status">
          <i></i>Prashant Kumar · Open to interesting problems · Gurugram
        </span>
      </div>
      
      <div className="duo rv d1">
        <div className="hzone l" onClick={() => setMode('design')} aria-hidden="true" style={{ cursor: 'pointer' }}></div>
        <div className="hzone r" onClick={() => setMode('pm')} aria-hidden="true" style={{ cursor: 'pointer' }}></div>
        
        <div className="side side-design">
          <span className="tagl">2017 — 2025</span>
          <h2>designer</h2>
          <p>Four years of pixels — enterprise UI, the Polarin design system, every portal module taken 0 → 1.</p>
        </div>
        
        <div className="face" id="face">
          <div className="layer face-real">
            <img src="profile.jpg" alt="Prashant Kumar"
              onError={(e) => { e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 400 460%27%3E%3Crect width=%27400%27 height=%27460%27 fill=%27%23141A2B%27/%3E%3Ccircle cx=%27200%27 cy=%27170%27 r=%2768%27 fill=%27none%27 stroke=%27%238FA0FF%27 stroke-width=%272.5%27/%3E%3Cpath d=%27M85 400 C 115 305, 285 305, 315 400%27 fill=%27none%27 stroke=%27%238FA0FF%27 stroke-width=%272.5%27/%3E%3Ctext x=%27200%27 y=%27182%27 font-family=%27monospace%27 font-size=%2732%27 fill=%27%23EAEEF9%27 text-anchor=%27middle%27%3EPK%3C/text%3E%3C/svg%3E' }}
            />
          </div>
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
          <a className="btn-big" href="#/journey">Read my journey <span aria-hidden="true">→</span></a>
          <a className="btn-ghost" href="#/current">Current project</a>
        </div>
      </div>
    </section>
  );
}
