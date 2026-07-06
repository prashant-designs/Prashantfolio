import { useState } from 'react';

const CJ_STEPS = [
  { d: 0, i: '📢', t: 'the need', x: 'Alex needs to connect their new Mumbai datacenter to AWS ap-south-1.', w: '' },
  { d: 3, i: '🔍', t: 'research vendors', x: 'Googling begins. Every pricing page says "Contact Sales."', w: 'no way to compare options, pricing or availability in one place' },
  { d: 10, i: '📞', t: 'call vendor #1', x: 'Transferred 3 times. Finally a rep — who asks for a Letter of Authorization and a site survey.', w: '47-minute average hold time · no self-serve · no portal' },
  { d: 14, i: '📞', t: 'call vendor #2', x: 'A backup quote from another carrier. Different process, different forms, different timelines.', w: 'every vendor has its own workflow — nothing is standardised' },
  { d: 16, i: '📝', t: 'fill out forms', x: 'PDF order forms over email. Circuit IDs, cross-connects, billing codes — typed by hand.', w: '~34% error rate in manual forms · one typo = weeks of delay' },
  { d: 21, i: '💰', t: 'negotiate pricing', x: 'A quote arrives. Alex asks for a discount — forwarded to "the commercial team." Email chains.', w: 'pricing is opaque · no benchmarks · no market visibility' },
  { d: 66, i: '⏳', t: 'wait', x: 'Order placed. ETA? "4–6 weeks." Then… silence.', w: 'zero real-time visibility · status updates by email, if at all' },
  { d: 80, i: '🔧', t: 'installation day', x: 'A technician arrives — but the form had a typo in the rack ID. The technician leaves.', w: 'a new ticket is raised · back in the queue' },
  { d: 90, i: '🔁', t: 'start over', x: 'Three months in. The circuit still is not live. Alex picks up the phone again.', w: 'the entire cycle repeats — for every single connection' },
];

const AUDIT = [
  { name: 'Megaport', serve: 'strong', onboard: 'complex', india: '✕' },
  { name: 'Console Connect', serve: 'partial', onboard: 'dev only', india: '✕' },
  { name: 'PacketFabric', serve: 'API-first', onboard: 'dev only', india: '✕' },
  { name: 'Equinix Fabric', serve: 'partial', onboard: 'moderate', india: 'limited' },
];

const SHOTS = {
  globe: { src: 'https://framerusercontent.com/images/iNQgdhiTrGehsbW3uNIK6gccao.gif', cap: "the customer's network, alive — global connections, regions & performance alerts at a glance", label: '3D globe' },
  map: { src: 'https://framerusercontent.com/images/N28toXGNVp0F6zjQVyvnzOtfPp4.gif', cap: 'the flat view — service locations, active connections & alerts, manageable at a glance', label: '2D map' },
  order: { src: 'https://framerusercontent.com/images/fI6NHQWcKIbiG4ZvJjYJfmjLPYY.gif', cap: 'pick both endpoints, check committed availability upfront — feasibility before commitment', label: 'order flow' },
  services: { src: 'https://framerusercontent.com/images/qOOUZKo67cDJ1Gv7BzoImGUWtkU.gif', cap: 'the full connectivity portfolio — explore, understand use cases, choose the right service', label: 'all services' },
};
const SHOT_ORDER = ['globe', 'map', 'order', 'services'];

const LEARNED = [
  { t: 'simplicity is a decision', p: "complexity doesn't simplify itself — someone does that work, and it's invisible to the person who benefits" },
  { t: 'visibility is a feature', p: 'when enterprises can watch their network work in real time, they relax — visual feedback builds trust' },
  { t: 'systems are the product', p: 'screens age and get replaced; the system built in month one is what made four years of solo delivery possible' },
];

export default function CustomerPortalCaseStudy({ onPrev, onNext, idx, total }) {
  const [shot, setShot] = useState('globe');
  const [imgOk, setImgOk] = useState(true);
  const sh = SHOTS[shot];

  const selectShot = (key) => {
    setShot(key);
    setImgOk(true);
  };

  return (
    <div className="inv-wrap">
      <div className="inv-hero">
        <p className="eyebrow">Polarin · Customer Portal</p>
        <h2>90 days → 10 minutes.</h2>
        <p>In 2022, ordering enterprise connectivity in India meant phone calls, PDF forms and ~90 days of waiting — an industry running on processes unchanged since the 1990s. Polarin was a name on a whiteboard, and I was POLO&apos;s first designer, with no telecom background and no template to copy. Four years later it&apos;s a live platform enterprises trust, and I&apos;ve gone from designing it to running it.</p>
        <div className="inv-meta">
          <div><span>My role</span><b>First designer, 0 → 1 → now Product Manager</b></div>
          <div><span>Team</span><b>1 designer · 3 PMs · 12 devs</b></div>
        </div>
      </div>

      <div className="inv-section">
        <div className="inv-step-tag"><i></i>Meet Alex</div>
        <h3 className="plain">What &quot;before&quot; felt like</h3>
        <p className="dv-p">A VP of Infrastructure at a Mumbai fintech needs one connection: datacenter → AWS ap-south-1.</p>
        <div className="cj-timeline">
          {CJ_STEPS.map((s) => (
            <div className="cj" key={s.t}>
              <div className="cj-top">
                <div className="cj-day">day <b>{s.d}</b></div>
              </div>
              <div className="cj-body">
                <span className="cj-ico">{s.i}</span>
                <div>
                  <b className="cj-t">{s.t}</b>
                  <p className="cj-x">{s.x}</p>
                  {s.w ? <p className="cj-w">⚠ {s.w}</p> : null}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="cj-result">
          <span><b>~90</b> days to provision</span>
          <span><b>5+</b> vendors contacted</span>
          <span><b>34%</b> form error rate</span>
          <span><b>0</b> visibility into status</span>
        </div>
        <p className="dv-p dim">this was the standard. for decades.</p>
      </div>

      <div className="inv-section">
        <div className="inv-step-tag"><i></i>The bet</div>
        <h3 className="plain">Alex doesn&apos;t call anyone. He opens <span>Polarin.</span></h3>
        <p className="dv-p">A Network-as-a-Service platform with pre-established NNIs across datacenters, cloud on-ramps and PoPs — the fabric already connects everywhere Alex needs.</p>
        <div className="dv-pipe bet-pipe">
          <span className="dvp"><b>discover</b></span><em>→</em>
          <span className="dvp"><b>compare</b></span><em>→</em>
          <span className="dvp"><b>order</b></span><em>→</em>
          <span className="dvp"><b>provision</b></span><em>→</em>
          <span className="dvp last"><b>manage</b><i>live</i></span>
        </div>
        <p className="bet-90"><s className="from">~90 days</s><span className="arr">→</span><b className="to">10 minutes.</b></p>
        <div className="bet-swaps">
          <span><s>5+ vendor calls</s><b>1 platform</b></span>
          <span><s>PDF order forms</s><b>self-serve</b></span>
          <span><s>zero visibility</s><b>real-time tracking</b></span>
        </div>
      </div>

      <div className="inv-section">
        <div className="inv-step-tag"><i></i>Discovery</div>
        <h3 className="dv-h" style={{ marginTop: '10px' }}>4 months before touching Figma</h3>
        <div className="ivx-principles">
          <div className="ivp"><b>technical immersion</b><p>learned networking from the architects — L1/L2/L3, ports, VRs, VCs — sat in sales calls, walked the manual provisioning workflows</p></div>
          <div className="ivp"><b>12 user interviews</b><p>IT managers, network engineers, enterprise buyers — mapped where every competitor demo broke</p></div>
          <div className="ivp"><b>competitive audit</b><p>4 global NaaS platforms — every UX gap became a design requirement</p></div>
        </div>
        <div className="aud">
          <div className="aud-r aud-h"><span>platform</span><span>self-serve</span><span>onboarding</span><span>india</span></div>
          {AUDIT.map((a) => (
            <div className="aud-r" key={a.name}><span>{a.name}</span><span>{a.serve}</span><span>{a.onboard}</span><span>{a.india}</span></div>
          ))}
          <div className="aud-r aud-p"><span>Polarin →</span><span>full</span><span>15 minutes</span><span>native</span></div>
        </div>
        <p className="aud-insight">every one of them chose engineering power over buyer accessibility. the person who approves a ₹50L contract <em>can&apos;t place an order without help.</em> that&apos;s the gap Polarin closes.</p>
      </div>

      <div className="inv-section">
        <div className="inv-step-tag"><i></i>The screens</div>
        <h3 className="dv-h" style={{ marginTop: '10px' }}>Scroll through the product</h3>
        <div className="cs-tabs">
          {SHOT_ORDER.map((key) => (
            <button key={key} type="button" className={shot === key ? 'on' : ''} onClick={() => selectShot(key)}>{SHOTS[key].label}</button>
          ))}
        </div>
        <figure className="cs-shot">
          {imgOk ? (
            <img src={sh.src} alt="Polarin customer portal screen" loading="lazy" onError={() => setImgOk(false)} />
          ) : (
            <div className="dv-shot" aria-hidden="true" style={{ marginTop: 0 }}>
              <div className="shot-bar"><i></i><i></i><i></i><em></em></div>
              <div className="shot-body">
                <div className="shot-side"><i></i><i className="on"></i><i></i><i></i><i></i></div>
                <div className="shot-main">
                  <div className="shot-code"><i style={{ '--w': '68%' }}></i><i style={{ '--w': '48%' }}></i><i style={{ '--w': '58%' }}></i></div>
                  <div className="shot-run"></div>
                </div>
              </div>
            </div>
          )}
          <figcaption>{sh.cap}</figcaption>
        </figure>
      </div>

      <div className="inv-section">
        <div className="inv-step-tag"><i></i>Why solo scaled</div>
        <h3 className="dv-h" style={{ marginTop: '10px' }}>The system before the screens</h3>
        <p className="dv-p">With 12 developers and 3 PMs shipping against one designer, consistency wasn&apos;t optional — it was survival. Before a single product screen, I built the design system:</p>
        <div className="cj-result" style={{ marginTop: '16px' }}>
          <span><b>100+</b> reusable components</span>
          <span><b>20+</b> design tokens</span>
          <span><b>4 yrs</b> of solo delivery, scaled by it</span>
        </div>
        <p className="dv-p dim">systems are the real product — screens age and get replaced; the system is what made four years of great screens fast to build.</p>
      </div>

      <div className="inv-section">
        <div className="inv-step-tag"><i></i>What moved</div>
        <h3 className="dv-h" style={{ marginTop: '10px' }}>Impact</h3>
        <div className="ivx-principles dv4">
          <div className="ivp"><b>95% faster</b><p>onboarding & deployment — 5–7 days → 15 minutes</p></div>
          <div className="ivp"><b>3× self-serve</b><p>non-technical users now order & manage independently</p></div>
          <div className="ivp"><b>40% handoff cut</b><p>design-to-dev time reduced by the system</p></div>
          <div className="ivp"><b>CSAT 6.2 → 9.1</b><p>enterprise customers rate the experience</p></div>
        </div>
      </div>

      <div className="inv-section">
        <div className="inv-step-tag"><i></i>Four years</div>
        <h3 className="dv-h" style={{ marginTop: '10px' }}>Three things I know for sure</h3>
        <div className="inv-learn">
          {LEARNED.map((l) => (
            <div className="inv-learn-card" key={l.t}><h4>{l.t}</h4><p>{l.p}</p></div>
          ))}
        </div>
      </div>

      <div className="inv-section">
        <div className="inv-step-tag"><i></i>Final result</div>
        <h3 className="plain">What changed</h3>
        <div className="inv-result">3× self-serve adoption · 90 days → 10 minutes · India&apos;s first self-serve NaaS platform.</div>
      </div>

      <div className="ovl-nav">
        <button type="button" onClick={onPrev}>← Prev</button>
        <span className="ovl-count"><b>{idx + 1}</b> / {total} surfaces</span>
        <button type="button" onClick={onNext}>Next →</button>
      </div>
    </div>
  );
}
