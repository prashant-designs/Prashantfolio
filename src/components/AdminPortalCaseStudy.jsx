const MODULES = [
  { ic: '✓', title: 'KYC Approval', line: 'Verify before anything goes live' },
  { ic: '◎', title: 'User Management', line: 'Who can act, and where' },
  { ic: '▦', title: 'Inventory Management', line: 'Every circuit, tracked to the port' },
  { ic: '↗', title: 'Reports', line: 'Generate reports for audits & reviews' },
  { ic: '⇄', title: 'Order → Live Cycle', line: 'Signed order to switched-on service' },
  { ic: '₹', title: 'Billing & Invoicing', line: 'Where the money math lives' },
];

const TEAMS = [
  { code: 'CSD', name: 'Customer Service Delivery', line: 'keeps every order moving' },
  { code: 'CX', name: 'Customer Experience', line: 'fixes what the customer feels' },
  { code: 'Sales Ops', name: 'Sales Operations', line: 'owns the deal after it’s signed' },
  { code: 'NOC', name: 'Network Ops Center', line: 'keeps inventory honest' },
];

const NEVER_SLIP = [
  { n: '01', t: 'Access', s: 'who can act' },
  { n: '02', t: 'Inventory', s: 'what’s in stock' },
  { n: '03', t: 'Money', s: 'what’s owed' },
];

const LOOP = [
  { n: '01', t: 'Collect', s: 'Sit with CSD, CX, Sales Ops, NOC' },
  { n: '02', t: 'Analyse', s: 'Patterns, not one-off fixes' },
  { n: '03', t: 'Flow', s: 'Map the journey before any UI' },
  { n: '04', t: 'Test', s: 'Walk it with the team that’ll use it' },
  { n: '05', t: 'Deploy', s: 'Ship, watch adoption, loop back' },
];

export default function AdminPortalCaseStudy({ onPrev, onNext, idx, total }) {
  return (
    <div className="inv-wrap">
      <div className="inv-hero">
        <p className="eyebrow">Polarin · Internal Ops</p>
        <h2>One console. Every team that keeps Polarin running.</h2>
        <p>Built from a blank screen for the people who never see a sales deck — the teams who approve, provision, and bill every order after it&apos;s signed.</p>
        <div className="inv-meta">
          <div><span>My role</span><b>Designer, 0 → 1 → now Product Manager</b></div>
          <div><span>Output</span><b>6-module internal console</b></div>
        </div>
      </div>

      <div className="inv-section">
        <div className="inv-step-tag"><i></i>The console</div>
        <h3 className="plain">Six modules. One login.</h3>
        <div className="adm-modgrid">
          {MODULES.map((m) => (
            <div className="adm-mod" key={m.title}>
              <span className="adm-mod-ic">{m.ic}</span>
              <b>{m.title}</b>
              <p>{m.line}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="inv-section">
        <div className="inv-brm">
          <span className="icon">🔒</span>
          <p>This one runs on Polarin&apos;s internal network, so I can&apos;t show real screens here — the modules, teams and loop above are exactly what shipped.</p>
        </div>
      </div>

      <div className="inv-section">
        <div className="inv-step-tag"><i></i>What it never lets slip</div>
        <div className="adm-trio">
          {NEVER_SLIP.map((x) => (
            <div className="adm-trio-card" key={x.n}>
              <span className="adm-trio-n">{x.n}</span>
              <b>{x.t}</b>
              <p>{x.s}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="inv-section">
        <div className="inv-step-tag"><i></i>Who logs in</div>
        <h3 className="plain">Four teams, one console</h3>
        <div className="adm-teams">
          {TEAMS.map((t) => (
            <div className="adm-team" key={t.code}>
              <b>{t.code}</b>
              <span>{t.name}</span>
              <p>{t.line}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="inv-section">
        <div className="inv-step-tag"><i></i>Built twice</div>
        <h3 className="ch-title" style={{ fontSize: 'clamp(24px,3.4vw,38px)' }}>Same console. <span>Two hats.</span></h3>
        <div className="adm-duo">
          <div className="adm-duo-card">
            <span className="adm-duo-tag">2023 – 2024 · as designer</span>
            <b>Zero to shipped</b>
            <div className="adm-chiprow">
              <span className="chip">Wireframes → shipped UI</span>
              <span className="chip">All 6 modules, end to end</span>
              <span className="chip">KYC, inventory & billing flows — from scratch</span>
            </div>
          </div>
          <div className="adm-duo-card">
            <span className="adm-duo-tag">2025 – now · as PM</span>
            <b>Now I run the loop</b>
            <div className="adm-chiprow">
              <span className="chip">Own the roadmap</span>
              <span className="chip">Requirements → flow → test → ship</span>
              <span className="chip">Same teams, tighter loop</span>
            </div>
          </div>
        </div>
      </div>

      <div className="inv-section">
        <div className="inv-step-tag"><i></i>The loop, today</div>
        <h3 className="plain">Collect. Analyse. Flow. Test. Deploy.</h3>
        <div className="adm-loop">
          {LOOP.map((s, i) => (
            <div className="adm-loop-step" key={s.n}>
              <div className="adm-loop-card">
                <span className="adm-loop-n">{s.n}</span>
                <b>{s.t}</b>
                <p>{s.s}</p>
              </div>
              {i < LOOP.length - 1 ? <span className="adm-loop-arrow">→</span> : <span className="adm-loop-arrow loopback">↩ back to 01</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="inv-section">
        <div className="inv-step-tag"><i></i>Final result</div>
        <h3 className="plain">What changed</h3>
        <div className="inv-result">One console instead of four teams working off spreadsheets and Slack threads — every user, circuit, order and rupee traceable end to end, by the people who actually run the network.</div>
      </div>

      <div className="ovl-nav">
        <button type="button" onClick={onPrev}>← Prev</button>
        <span className="ovl-count"><b>{idx + 1}</b> / {total} surfaces</span>
        <button type="button" onClick={onNext}>Next →</button>
      </div>
    </div>
  );
}
