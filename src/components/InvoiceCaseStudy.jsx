import { useState } from 'react';

const PROBLEMS = [
  {
    n: '01',
    title: 'Products within products',
    body: 'A Polarin port can have virtual connections as children. Both appear on the same invoice but with different billing logic, different columns, different terms.',
  },
  {
    n: '02',
    title: 'Mid-month changes',
    body: 'An upgrade mid-month means old rate for the days before, new rate for the days after. An add-on a week later creates a third tier — three billing periods, one row on the summary, full drill-down on the annexure.',
  },
  {
    n: '03',
    title: 'Two billing models',
    body: 'Fixed subscriptions (prorated days × monthly rate) and Pay-As-You-Go (hours used × rate/hr) coexist in the same invoice — different table schemas, different columns, same page.',
  },
  {
    n: '04',
    title: 'Multi-currency + GST variants',
    body: 'International customers billed in USD. Indian entities need a CGST + SGST split. Cross-state is IGST. Each variant is legally distinct and must be e-invoice compliant.',
  },
];

const PAGES = [
  {
    tag: 'Page 1',
    title: 'What do I owe — and where do I pay?',
    body: 'Billed by, billed to, invoice reference, billing period, total payable in large type, due date, bank details, QR. For USD invoices — an INR equivalent at the live exchange rate.',
    tags: ['Finance-first', 'Legal'],
  },
  {
    tag: 'Page 2',
    title: 'What am I being charged for?',
    body: 'Each product as a numbered row — parent › sub-product › location, service ID, recurring charges, one-time charges, discounts, tax, row total. Every row number maps to Page 3.',
    tags: ['Ops', 'Audit'],
  },
  {
    tag: 'Page 3 · Annexure',
    title: 'Why did my charges change?',
    body: 'Per-service tables with active periods, rate tiers, upgrade callouts, add-on stacking. Fixed and PAYG sections use separate column schemas.',
    tags: ['Ops', 'Audit'],
  },
];

const TABS = [
  { id: 1, label: 'Page 1 · Snapshot' },
  { id: 2, label: 'Page 2 · Breakdown' },
  { id: 3, label: 'Page 3 · Annexure' },
];

export default function InvoiceCaseStudy({ onPrev, onNext, idx, total }) {
  const [tab, setTab] = useState(1);

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
        <p className="eyebrow">The challenge</p>
        <h3 className="inv-highlight">A large bill — with <mark>no explanation.</mark></h3>
        <p className="body">Polarin customers can buy a port, add a virtual connection on top, upgrade bandwidth mid-month, stack a PAYG add-on, then get billed — all in a single invoice. The old flat table had no hierarchy. Finance teams couldn't reconcile charges. Network ops couldn't match circuits to line items. Every bill triggered a support query.</p>
        <p className="body">Two audiences. Completely different needs. One document.</p>
        <div className="inv-transition"><b>4</b> Not one problem.</div>
      </div>

      <div className="inv-section">
        <div className="inv-problems">
          {PROBLEMS.map((p) => (
            <div className="inv-problem" key={p.n}>
              <span className="ip-n">{p.n}</span>
              <h4>{p.title}</h4>
              <p>{p.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="inv-section">
        <p className="eyebrow">Solution</p>
        <h3 className="ch-title" style={{ fontSize: 'clamp(24px,3.4vw,38px)' }}>Three pages. <span>One job each.</span></h3>
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
        <h3 className="ch-title" style={{ fontSize: 'clamp(22px,3vw,32px)' }}>Explore the <span>three pages.</span></h3>
        <div className="inv-tabs">
          {TABS.map((t) => (
            <button key={t.id} type="button" className={`inv-tab ${tab === t.id ? 'on' : ''}`} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="inv-explore-body">
          {tab === 1 && (
            <>
              <div className="inv-mock" key="mock-1">
                <div className="inv-mock-brand"><i></i>Polarin <span className="inv-mock-tag">Tax Invoice</span></div>
                <div className="inv-mock-grid">
                  <div><span>Billed by</span><b>XXX Communications Pvt Ltd</b></div>
                  <div><span>Billed to</span><b>XXX Enterprises Ltd</b></div>
                  <div><span>Invoice number</span><b>XX-XXLTXXXX#####</b></div>
                  <div><span>Billing period</span><b>XX Mon — XX Mon 2026</b></div>
                </div>
                <div className="inv-mock-amount">
                  <div>
                    <div className="lbl">Total amount payable</div>
                    <div className="val">₹X,XX,XXX</div>
                  </div>
                  <div className="inv-mock-qr" aria-hidden="true"></div>
                </div>
              </div>
              <div className="inv-callout">
                <h5>⚡ Quick scan</h5>
                <p>Hero amount section: large, bold total with a QR code for instant payment.</p>
                <ul>
                  <li>Customers know what to pay in 3 seconds</li>
                  <li>Reduces "how much do I owe?" support calls</li>
                </ul>
              </div>
            </>
          )}

          {tab === 2 && (
            <>
              <div className="inv-mock" key="mock-2">
                <div className="inv-mock-brand"><i></i>Polarin <span className="inv-mock-tag">Charge breakdown</span></div>
                <div className="inv-mock-table">
                  <div className="inv-mock-row head"><span>Sl. · product</span><span>Recurring</span><span>Total</span></div>
                  <div className="inv-mock-row"><span>01 · Port — <b>XXX</b></span><span>₹X,XX,XXX</span><b>₹X,XX,XXX</b></div>
                  <div className="inv-mock-row"><span>02 · Virtual Connection</span><span>₹X,XX,XXX</span><b>₹X,XX,XXX</b></div>
                  <div className="inv-mock-row"><span>03 · Port — <b>XXX</b></span><span>₹X,XX,XXX</span><b>₹X,XX,XXX</b></div>
                </div>
                <div className="inv-mock-total"><span>Final payable amount</span><b>₹X,XX,XXX.XX</b></div>
              </div>
              <div className="inv-callout">
                <h5>📋 Product breakdown</h5>
                <p>The second page gives a comprehensive view of every active product and service with clear categorization — parent, sub-product, and location, in one numbered list.</p>
              </div>
            </>
          )}

          {tab === 3 && (
            <>
              <div className="inv-mock" key="mock-3">
                <div className="inv-mock-brand"><i></i>Polarin <span className="inv-mock-tag">Annexure · per-service</span></div>
                <div className="inv-mock-tiers">
                  <div className="inv-tier"><span>01a · Base rate</span><b>10 Gbps</b><span className="tag">15 days</span></div>
                  <div className="inv-tier"><span>02b · Permanent upgrade</span><b>120 Mbps</b><span className="tag">↑ upgrade</span></div>
                  <div className="inv-tier"><span>02c · Add-on active</span><b>+30 Mbps</b><span className="tag">add-on</span></div>
                </div>
              </div>
              <div className="inv-callout">
                <h5>📊 Detailed usage tables</h5>
                <p>Granular consumption data — what's included:</p>
                <ul>
                  <li>Daily / hourly usage breakdowns</li>
                  <li>Peak vs. off-peak consumption</li>
                  <li>Bandwidth burst instances</li>
                  <li>API call counts & limits</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="inv-section">
        <p className="eyebrow">What I learned</p>
        <h3 className="ch-title" style={{ fontSize: 'clamp(22px,3vw,32px)' }}>Redesigning a document is redesigning the <span>decision flow</span> inside it.</h3>
        <div className="inv-learn">
          <div className="inv-learn-card">
            <h4>One page can't serve two readers.</h4>
            <p>The old invoice put everything on one page because it couldn't decide who was reading. Once we accepted that finance and ops have completely different jobs, the three-page structure became obvious.</p>
          </div>
          <div className="inv-learn-card">
            <h4>Duplication in a bill reads as contradiction.</h4>
            <p>The summary table and the main table showed the same number. Finance teams filed tickets asking which was correct. Removing the duplicate wasn't a design choice — it was conflict resolution.</p>
          </div>
          <div className="inv-learn-card">
            <h4>Scalability is a requirement, not a nice-to-have.</h4>
            <p>The old format was a one-product template. The new one handles many circuits, mid-month upgrades, PAYG billing, international currency, and every GST variant — from the same system.</p>
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
