import { useEffect, useRef, useState } from 'react';
import CompareSlider from './CompareSlider';

const ZOOM = 2.4;
const LENS_SIZE = 220;

function ZoomableShot({ src, alt, children }) {
  const [failed, setFailed] = useState(false);
  const [lens, setLens] = useState(null);
  const wrapRef = useRef(null);

  if (failed || !src) return children;

  const onMove = (e) => {
    const rect = wrapRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    setLens({
      px,
      py,
      bgW: rect.width * ZOOM,
      bgH: rect.height * ZOOM,
      bgX: -(px * ZOOM - LENS_SIZE / 2),
      bgY: -(py * ZOOM - LENS_SIZE / 2),
    });
  };

  return (
    <div className="zoom-wrap" ref={wrapRef} onMouseMove={onMove} onMouseLeave={() => setLens(null)}>
      <img src={src} alt={alt} className="zoom-base" onError={() => setFailed(true)} />
      {lens ? (
        <div
          className="zoom-lens"
          style={{
            left: lens.px,
            top: lens.py,
            backgroundImage: `url(${src})`,
            backgroundSize: `${lens.bgW}px ${lens.bgH}px`,
            backgroundPosition: `${lens.bgX}px ${lens.bgY}px`,
          }}
        />
      ) : (
        <span className="zoom-hint">hover to zoom</span>
      )}
    </div>
  );
}

const REQUIREMENTS = [
  { n: '01', title: 'Every product', body: 'Whatever a customer buys - one product or ten - it all had to show up clearly on one bill, not a pile of separate ones.' },
  { n: '02', title: 'Every contract length', body: 'From pay-as-you-go by the hour to a 5-year (60-month) lock-in - both needed an invoice that made sense for their deal.' },
  { n: '03', title: 'Every billing rhythm', body: 'Some customers get billed every month. Others every quarter, or twice a year. Same invoice logic had to work for all of them.' },
  { n: '04', title: 'Every way people pay', body: 'Pay it all upfront, pay nothing upfront, or split it 50/50 - three very different payment styles, one invoice format.' },
  { n: '05', title: 'Every mid-month change', body: "People upgrade or downgrade their plan whenever they want - sometimes more than once a month. The invoice had to show every change honestly, not just the final number." },
  { n: '06', title: 'Every currency', body: 'Customers outside India pay in dollars; customers inside India pay in rupees, with tax rules that change by state. Same invoice, different math underneath.' },
  { n: '07', title: 'How it reads', body: 'Even the font and layout mattered - a total had to be unmistakable at a glance, for someone in finance and someone in network ops.' },
];

const PAGES = [
  {
    tag: 'Page 1',
    title: 'What do I owe - and where do I pay?',
    body: 'Billed by, billed to, invoice reference, billing period, total payable in large type, due date, bank details, QR. For USD invoices - an INR equivalent at the live exchange rate.',
    tags: ['Finance-first', 'Legal'],
  },
  {
    tag: 'Page 2',
    title: 'What am I being charged for?',
    body: 'Each product as a numbered row - parent › sub-product › location, service ID, recurring charges, one-time charges, discounts, tax, row total. Every row number maps to Page 3.',
    tags: ['Ops', 'Audit'],
  },
  {
    tag: 'Page 3 · Annexure',
    title: 'Why did my charges change?',
    body: 'Per-service tables with active periods, rate tiers, upgrade callouts, add-on stacking. Fixed and PAYG sections use separate column schemas.',
    tags: ['Ops', 'Audit'],
  },
];

const SECTIONS = [
  { id: 1, label: 'Page 1 · Snapshot' },
  { id: 2, label: 'Page 2 · Breakdown' },
  { id: 3, label: 'Page 3 · Annexure' },
];

export default function InvoiceCaseStudy({ onPrev, onNext, idx, total }) {
  const [activeSection, setActiveSection] = useState(1);
  const sectionRefs = useRef({});

  useEffect(() => {
    const panel = document.querySelector('.ovl-panel');
    if (!panel) return undefined;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(Number(entry.target.dataset.secId));
          }
        });
      },
      { root: panel, rootMargin: '-72px 0px -55% 0px', threshold: 0 },
    );
    Object.values(sectionRefs.current).forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const jumpToSection = (id) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="inv-wrap">
      <div className="inv-hero">
        <p className="eyebrow">Polarin · Billing</p>
        <h2>Designing the invoice for complex NaaS billing</h2>
        <p>One invoice. Multiple products. Mid-month upgrades. PAYG hours. GST variants. Three pages that had to serve a CFO and a network engineer at the same time.</p>
        <div className="inv-meta">
          <div><span>My role</span><b>Executive Experience Designer</b></div>
          <div><span>Output</span><b>PDF invoice (with annexure)</b></div>
        </div>
      </div>

      <div className="inv-section">
        <CompareSlider beforeSrc="/invoice/existing.png" afterSrc="/invoice/new.png" beforeLabel="Existing" afterLabel="New" />
      </div>

      <div className="inv-section">
        <div className="inv-step-tag"><i></i>Step 1 · The problem</div>
        <h3 className="plain">Where it started</h3>
        <p className="body">Two teams kept flagging the same bill - for opposite reasons. Finance said they couldn't tell if a number was right without calling someone. Customers said they didn't know what they were being charged for until they called support. Same invoice, two very different complaints - which meant the real problem wasn't the numbers. It was that one page was trying to answer two completely different questions at once.</p>
      </div>

      <div className="inv-section">
        <div className="inv-step-tag"><i></i>Step 2 · Listening first</div>
        <h3 className="plain">Talking to the people who read it</h3>
        <p className="body">Before sketching anything, I sat with both sides - pulled real invoices, walked through actual disputes, and wrote down every scenario a bill needed to survive.</p>
        <div className="inv-quotes">
          <div className="inv-quote">
            <span className="who">Finance team</span>
            <p>"I have to open three tabs and cross-check every line before I can approve payment."</p>
          </div>
          <div className="inv-quote">
            <span className="who">Customer</span>
            <p>"My bill went up and I have no idea why - did I get charged twice?"</p>
          </div>
        </div>
      </div>

      <div className="inv-section">
        <div className="inv-step-tag"><i></i>Step 3 · Writing it down</div>
        <h3 className="plain">Turning conversations into <span>requirements</span></h3>
        <p className="body">Every conversation became a rule the new invoice had to follow - not just for the common cases, but for every scenario Polarin actually sells.</p>
        <div className="inv-problems">
          {REQUIREMENTS.map((r) => (
            <div className="inv-problem" key={r.n}>
              <span className="ip-n">{r.n}</span>
              <h4>{r.title}</h4>
              <p>{r.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="inv-section">
        <div className="inv-step-tag"><i></i>Step 4 · Designing it</div>
        <h3 className="ch-title t-lead">Three pages. <span>One job each.</span></h3>
        <p className="body">One page can't answer "what do I owe," "what am I paying for," and "why did it change" at the same time - so it stopped trying to.</p>
        <div className="inv-pages">
          {PAGES.map((p) => (
            <div className="inv-page-card" key={p.tag}>
              <b className="pn">{p.tag}</b>
              <h4>{p.title}</h4>
              <p>{p.body}</p>
              <div>{p.tags.map((t) => <span className="chip" key={t}>{t}</span>)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="inv-section inv-explore">
        <p className="eyebrow">The new invoice</p>
        <h3 className="ch-title t-sub">Explore the <span>three pages.</span></h3>
        <div className="inv-tabs inv-tabs-sticky">
          {SECTIONS.map((s) => (
            <button key={s.id} type="button" className={`inv-tab ${activeSection === s.id ? 'on' : ''}`} onClick={() => jumpToSection(s.id)}>
              {s.label}
            </button>
          ))}
        </div>

        <div className="inv-page-shot" ref={(el) => { sectionRefs.current[1] = el; }} data-sec-id="1">
          <ZoomableShot src="/invoice/page1.png" alt="Page 1 - invoice snapshot">
            <div className="inv-mock">
              <div className="inv-mock-brand"><i></i>Polarin <span className="inv-mock-tag">Tax Invoice</span></div>
              <div className="inv-mock-grid">
                <div><span>Billed by</span><b>XXX Communications Pvt Ltd</b></div>
                <div><span>Billed to</span><b>XXX Enterprises Ltd</b></div>
                <div><span>Invoice number</span><b>XX-XXLTXXXX#####</b></div>
                <div><span>Billing period</span><b>XX Mon - XX Mon 2026</b></div>
              </div>
              <div className="inv-mock-amount">
                <div>
                  <div className="lbl">Total amount payable</div>
                  <div className="val">₹X,XX,XXX</div>
                </div>
                <div className="inv-mock-qr" aria-hidden="true"></div>
              </div>
            </div>
          </ZoomableShot>
        </div>

        <div className="inv-page-shot" ref={(el) => { sectionRefs.current[2] = el; }} data-sec-id="2">
          <ZoomableShot src="/invoice/page2.png" alt="Page 2 - charge breakdown">
            <div className="inv-mock">
              <div className="inv-mock-brand"><i></i>Polarin <span className="inv-mock-tag">Charge breakdown</span></div>
              <div className="inv-mock-table">
                <div className="inv-mock-row head"><span>Sl. · product</span><span>Recurring</span><span>Total</span></div>
                <div className="inv-mock-row"><span>01 · Port - <b>XXX</b></span><span>₹X,XX,XXX</span><b>₹X,XX,XXX</b></div>
                <div className="inv-mock-row"><span>02 · Virtual Connection</span><span>₹X,XX,XXX</span><b>₹X,XX,XXX</b></div>
                <div className="inv-mock-row"><span>03 · Port - <b>XXX</b></span><span>₹X,XX,XXX</span><b>₹X,XX,XXX</b></div>
              </div>
              <div className="inv-mock-total"><span>Final payable amount</span><b>₹X,XX,XXX.XX</b></div>
            </div>
          </ZoomableShot>
        </div>

        <div className="inv-page-shot" ref={(el) => { sectionRefs.current[3] = el; }} data-sec-id="3">
          <ZoomableShot src="/invoice/page3.png" alt="Page 3 - annexure">
            <div className="inv-mock">
              <div className="inv-mock-brand"><i></i>Polarin <span className="inv-mock-tag">Annexure · per-service</span></div>
              <div className="inv-mock-tiers">
                <div className="inv-tier"><span>01a · Base rate</span><b>10 Gbps</b><span className="tag">15 days</span></div>
                <div className="inv-tier"><span>02b · Permanent upgrade</span><b>120 Mbps</b><span className="tag">↑ upgrade</span></div>
                <div className="inv-tier"><span>02c · Add-on active</span><b>+30 Mbps</b><span className="tag">add-on</span></div>
              </div>
            </div>
          </ZoomableShot>
        </div>
      </div>

      <div className="inv-section">
        <div className="inv-step-tag"><i></i>Step 5 · Getting it live</div>
        <h3 className="plain">A design doesn't ship itself</h3>
        <div className="inv-brm">
          <span className="icon">🤝</span>
          <p>A new format doesn't matter until it's actually on the bill. I worked with the <b>BRM (Business Relationship Management) team</b> - who own how invoices actually get generated - walking them through every rule so the new template could go live for every customer, not just the ones in my mockups.</p>
        </div>
      </div>

      <div className="inv-section">
        <div className="inv-step-tag"><i></i>Final result</div>
        <h3 className="plain">What changed</h3>
        <div className="inv-result">One invoice format that finance trusts and customers understand - built to handle every contract Polarin sells, from a one-month trial to a five-year deal.</div>
        <div className="inv-learn">
          <div className="inv-learn-card">
            <h4>One page can't serve two readers.</h4>
            <p>Once we accepted that finance and ops have completely different jobs, splitting the invoice into three pages became obvious, not clever.</p>
          </div>
          <div className="inv-learn-card">
            <h4>Duplicate numbers read as contradictions.</h4>
            <p>The summary and the detail table used to show the same number differently. Finance filed tickets asking which was correct - removing it wasn't a design choice, it was conflict resolution.</p>
          </div>
          <div className="inv-learn-card">
            <h4>Scalability isn't optional.</h4>
            <p>The old format assumed one simple product. The new one handles every term, every currency, every payment style - from the same system.</p>
          </div>
        </div>
      </div>

      <div className="ovl-nav">
        <button type="button" onClick={onPrev}>← Prev</button>
        <span className="ovl-count"><b>{idx + 1}</b> / {total} surfaces</span>
        <button type="button" onClick={onNext}>Next →</button>
      </div>
    </div>
  );
}
