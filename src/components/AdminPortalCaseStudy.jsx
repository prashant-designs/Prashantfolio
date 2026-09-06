/* ---- line-icon set for this case study ----
   the same language as KnowledgeBaseCaseStudy's ICONS / GenAICaseStudy's ICONS /
   CurrentProject's .tl-cs-icon svgs: 24x24 viewBox, no fill, stroke:
   currentColor at 1.6, round caps and joins, so every glyph inherits the
   surrounding text colour - which, now that every badge on this page carries a
   hue, means it inherits its badge's rung (see THE NINE HUES in index.css). no
   filled shapes, no external icon set, and no emoji - this file used to carry
   six mono glyphs (✓ ◎ ▦ ↗ ⇄ ₹) on its module chips, which was the last
   emoji-ish icon set in a case study feature grid. the one emoji left on the
   page is the 🔒 on .inv-brm, which is that note's own device and matches
   InvoiceCaseStudy's 🤝.

   TWELVE glyphs for FIFTEEN slots - six journey stops plus nine capabilities -
   because three of the nine capabilities name the same thing a stop names, and
   the same thing gets the same glyph: inventory (stock), infra readiness
   (infra) and KYC approval (kyc) each appear twice. the four impact cards at
   the end carry no icon at all - four one-line statements do not get clearer
   with a badge each, and the page's icon count is deliberately low. */
const ICONS = {
  /* the six stops of the journey a customer's order actually takes. stock,
     infra and kyc are also three of the nine capability glyphs. */
  order: <><path d="M6.5 3.5h8L18 7v13.5H6.5z" /><path d="M14.5 3.5V7H18" /><path d="M9.2 12h5.6M9.2 15.3h3.4" /></>,
  kyc: <><circle cx="12" cy="12" r="8.4" /><path d="M8.2 12.3l2.7 2.7 4.9-5.4" /></>,
  stock: <><rect x="3.6" y="3.6" width="7" height="7" rx="1.4" /><rect x="13.4" y="3.6" width="7" height="7" rx="1.4" /><rect x="3.6" y="13.4" width="7" height="7" rx="1.4" /><rect x="13.4" y="13.4" width="7" height="7" rx="1.4" /></>,
  infra: <><rect x="3.5" y="4" width="17" height="6" rx="1.6" /><rect x="3.5" y="14" width="17" height="6" rx="1.6" /><path d="M7 7h.01M7 17h.01" /></>,
  power: <><path d="M12 3.5v7" /><path d="M17.4 7a7.4 7.4 0 1 1-10.8 0" /></>,
  support: <><circle cx="12" cy="12" r="8.4" /><circle cx="12" cy="12" r="3.4" /><path d="M6.1 6.1l3.5 3.5M14.4 14.4l3.5 3.5M17.9 6.1l-3.5 3.5M9.6 14.4l-3.5 3.5" /></>,

  /* the six capabilities that are not also a journey stop. `swap` is the ⇄ this
     file used to set as a mono character, drawn as a stroke icon now - two
     arrows going opposite ways is what acting inside someone else's view is. */
  eye: <><path d="M2.6 12S6.2 5.8 12 5.8 21.4 12 21.4 12 17.8 18.2 12 18.2 2.6 12 2.6 12z" /><circle cx="12" cy="12" r="2.8" /></>,
  person: <><circle cx="12" cy="8" r="3.2" /><path d="M5.5 20c0-3.3 2.9-5.6 6.5-5.6s6.5 2.3 6.5 5.6" /></>,
  swap: <><path d="M3.8 9h13.4l-3.4-3.4" /><path d="M20.2 15H6.8l3.4 3.4" /></>,
  shield: <><path d="M12 3.2l7 2.6v5.4c0 4.3-2.8 7.8-7 9.6-4.2-1.8-7-5.3-7-9.6V5.8z" /><path d="M9.2 12.2l2.2 2.2 3.9-4.2" /></>,
  bill: <><path d="M6.2 3.5h11.6v17l-2.9-1.9-2.9 1.9-2.9-1.9-2.9 1.9z" /><path d="M9.4 8.4h5.2M9.4 12h5.2" /></>,
  chart: <><path d="M3.8 4v16.2h16.4" /><rect x="7.4" y="12.4" width="3.2" height="7.8" rx="0.8" /><rect x="13.4" y="8.2" width="3.2" height="12" rx="0.8" /></>,
};

function Ico({ name }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

/* the challenge, as the fragments that used to float apart rather than as a
   paragraph describing them. six short strings on the shared .chip pill, the
   same device KnowledgeBaseCaseStudy's PAIN row uses for the same job - a
   reader gets "these were six separate places to look" off six tags faster
   than off three sentences saying so. no data-cat here: a set that shares one
   meaning does not qualify for the categorical ramp (see TOKENS in
   index.css), and these six share exactly one. */
const SCATTER = [
  'inventory',
  'infra readiness',
  'KYC approval',
  'manual billing',
  'multiple teams',
  'no single view',
];

/* the operational journey - the path a customer's ORDER takes through the
   portal. this is not the old file's Collect → Analyse → Flow → Test → Deploy
   loop, which described how I iterate on the product; that beat belonged to a
   process section this pass dropped.

   it used to be the shared .dv-pipe toolchain strip - a dashed grey box of
   monochrome pills with → between them. it is .adm-rail now: one continuous
   coloured line with a coloured stop sitting on it, which is the shape a
   journey actually has. the six stops take rungs 1-6 of this page's own
   nine-hue ramp in order, so the rail is a warm-to-cool sweep and the line
   between the stops is literally that ramp drawn as a gradient - see THE NINE
   HUES and .adm-rail in index.css for the construction and for why a SEQUENCE
   is allowed a hue here when the site's shared --chip-* rule says it is not. */
const JOURNEY = [
  { i: 'order', t: 'order placed' },
  { i: 'kyc', t: 'KYC approval' },
  { i: 'stock', t: 'inventory allocation' },
  { i: 'infra', t: 'infra readiness' },
  { i: 'power', t: 'service activation' },
  { i: 'support', t: 'ongoing support' },
];

/* the nine capabilities - nine cards, one hue each, still sorted into the
   three jobs they do.

   the previous pass made this three cards (Deliver / Serve / Control) with
   three plain mono labels listed inside each, because the site's shared
   categorical ramp is exactly six rungs and nine chips would have had to
   stretch it. that reasoning still holds for --chip-*, and this file no longer
   touches it: the nine cards wear this page's OWN nine-rung ramp instead (THE
   NINE HUES in index.css - built the same way, scoped to this component, never
   rendered anywhere else).

   what survives of the grouping is the part that was doing the work: `job` is
   a mono tag on each card, and the nine are ordered so each row of three on
   desktop is one job. because rung order follows reading order, that also
   means each job lands on one arc of the colour wheel - Deliver is the warm
   three, Serve the green-to-sky three, Control the periwinkle-to-pink three -
   so the grid reads as nine distinct colours AND as three bands, which is more
   organisation than the three shared chips carried, not less. the three group
   blurbs went rather than being multiplied by three: this pass is a colour
   fix, and nine one-line descriptions is the feature dump the last pass
   removed. */
const CAPS = [
  { i: 'stock', t: 'Inventory management', job: 'deliver' },
  { i: 'infra', t: 'Infrastructure readiness', job: 'deliver' },
  { i: 'eye', t: 'Order cycle visibility', job: 'deliver' },
  { i: 'kyc', t: 'KYC approval', job: 'serve' },
  { i: 'person', t: 'Customer management', job: 'serve' },
  { i: 'swap', t: 'Impersonation', job: 'serve' },
  { i: 'shield', t: 'Role-based controls', job: 'control' },
  { i: 'bill', t: 'Billing and invoices', job: 'control' },
  { i: 'chart', t: 'Reports', job: 'control' },
];

/* the two teams who log in, and the different question each one arrives with.
   the old file listed four (CSD, CX, Sales Ops, NOC); the brief this pass is
   built from names two, so two is what the page claims. .adm-duo is the
   two-card grid that used to carry the designer/PM pair - that beat moved into
   the hero's .inv-meta, where it is one line instead of a section. */
const TEAMS = [
  {
    tag: 'CSD · customer service delivery',
    q: 'Where is this order, and who has the next action?',
    chips: ['what is blocking activation', 'who owns the next step', 'when to escalate'],
  },
  {
    tag: 'CX · customer experience',
    q: 'How is this customer’s service actually doing?',
    chips: ['visibility across their services', 'ready for the cadence call', 'reach out before they report it'],
  },
];

/* what changed, qualitative and staying that way. no percentages, no
   before/after figures, no adoption numbers - none were measured, and this
   site's established practice (see the closing note in the Knowledge Base
   block in index.css) is that a device being available is not evidence
   arriving. four labels, four one-line consequences, on the shared
   .ivx-principles / .ivp grid at its four-up cut. */
const CHANGED = [
  { t: 'delivery', p: 'CSD moves an order along instead of assembling the picture first.' },
  { t: 'visibility', p: 'Where a service sits in its lifecycle is one screen, not four people.' },
  { t: 'conversations', p: 'CX walks into a cadence call already knowing the account.' },
  { t: 'posture', p: 'Support that can start before the customer reports anything.' },
];

export default function AdminPortalCaseStudy({ onPrev, onNext, idx, total }) {
  return (
    <div className="inv-wrap">
      <div className="inv-hero">
        <p className="eyebrow">Polarin · Admin Portal</p>
        <h2>Order to activation, in one workspace.</h2>
        <p>The internal portal for the teams who deliver and support a service - not the customers who buy it.</p>
        <div className="inv-meta">
          <div><span>What it is</span><b>Internal customer ops portal</b></div>
          <div><span>Who logs in</span><b>CSD and CX teams</b></div>
          <div><span>My role</span><b>Designer 2023-2024 · PM 2025-now</b></div>
        </div>
      </div>

      {/* ---------- 1. the challenge, as six fragments ---------- */}
      <div className="inv-section">
        <div className="inv-step-tag"><i></i>The challenge</div>
        <h3 className="plain">Every step had an owner. None of them had one view.</h3>
        <div className="adm-chiprow adm-scatter">
          {SCATTER.map((s) => (
            <span className="chip" key={s}>{s}</span>
          ))}
        </div>
        <p className="dv-p">Delivery ran across multiple teams, approvals, infrastructure dependencies and manual tasks. Knowing where an order was stuck meant <b className="adm-was">asking around</b>.</p>
      </div>

      {/* ---------- 2. the journey, on its own coloured rail ---------- */}
      <div className="inv-section">
        <div className="inv-step-tag"><i></i>The journey</div>
        <h3 className="plain">One order, six stops</h3>
        {/* the line is .adm-rail's own ::before, so the stops are the only
            children - no separator element between them the way .dv-pipe
            needed an <em>→</em>. data-adm is the rung, and it sits on the
            badge because the badge is the only thing that takes the hue. */}
        <ol className="adm-rail">
          {JOURNEY.map((s, i) => (
            <li className="adm-stop" key={s.t}>
              <span className="adm-stop-ic" data-adm={i + 1}><Ico name={s.i} /></span>
              <b>{s.t}</b>
            </li>
          ))}
        </ol>
        <p className="dv-p">Some products still need a hand on the hardware - patching a cross-connect to a port so a customer router comes up. When that lands, a team starts billing manually or sets the billing start date itself.</p>
      </div>

      {/* ---------- 3. nine capabilities, nine hues, three jobs ---------- */}
      <div className="inv-section">
        <div className="inv-step-tag"><i></i>What it does</div>
        <h3 className="plain">Nine capabilities, three jobs</h3>
        <div className="adm-capgrid">
          {CAPS.map((c, i) => (
            <div className="adm-cap" key={c.t}>
              <span className="adm-cap-ic" data-adm={i + 1}><Ico name={c.i} /></span>
              <b>{c.t}</b>
              <span className="adm-cap-job">{c.job}</span>
            </div>
          ))}
        </div>
        <p className="dv-p dim">impersonation is the one worth naming: a team can act inside a customer&apos;s own view to help with an order.</p>
      </div>

      {/* ---------- 4. the two teams and their two questions ---------- */}
      <div className="inv-section">
        <div className="inv-step-tag"><i></i>Who logs in</div>
        <h3 className="plain">Two teams, two different questions</h3>
        <div className="adm-duo">
          {TEAMS.map((t) => (
            <div className="adm-duo-card" key={t.tag}>
              <span className="adm-duo-tag">{t.tag}</span>
              <b>{t.q}</b>
              <div className="adm-chiprow">
                {t.chips.map((c) => <span className="chip" key={c}>{c}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- 5. why there are no screens here ---------- */}
      <div className="inv-section">
        <div className="inv-brm">
          <span className="icon">🔒</span>
          <p>This one runs on Polarin&apos;s internal network, so there are no real screens on this page - no customer names, accounts or infrastructure detail. Every diagram here is an abstraction of the shipped product, not a screenshot of it.</p>
        </div>
      </div>

      {/* ---------- 6. what changed, without a number on it ---------- */}
      <div className="inv-section">
        <div className="inv-step-tag"><i></i>What changed</div>
        <h3 className="plain">What actually moved</h3>
        <div className="ivx-principles dv4">
          {CHANGED.map((c) => (
            <div className="ivp" key={c.t}>
              <b>{c.t}</b>
              <p>{c.p}</p>
            </div>
          ))}
        </div>
        <div className="inv-result">Less time chasing information, more time <span className="adm-verdict">delivering and supporting customers</span>.</div>
      </div>

      <div className="ovl-nav">
        <button type="button" onClick={onPrev}>← Prev</button>
        <span className="ovl-count"><b>{idx + 1}</b> / {total} surfaces</span>
        <button type="button" onClick={onNext}>Next →</button>
      </div>
    </div>
  );
}
