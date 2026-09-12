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

/* ---------------------------------------------------------------------------
   THE TWO REVEALS ON THIS PAGE, and why there are two rather than one.

   both read their scroll position from .ovl-panel - the overlay's own internal
   scroll container - and NOT from window.scrollY. the panel is what actually
   scrolls when a case study is open (body carries .ovl-lock), so window scroll
   never moves and anything measured against it would simply never fire.
   the block reveal passes the panel as the IntersectionObserver `root`; the word
   reveal reads panel.getBoundingClientRect() and listens on the panel's own
   `scroll` event.

   NEITHER one pins the section or touches scroll speed. that is deliberate and
   it is the lesson of the timeline rewrite earlier this session: a pinned,
   scroll-scrubbed stage was torn out of Current Project for reading as
   disorienting, and doing it INSIDE a modal - where the reader's scroll is
   already one level removed from the page - would be a worse version of the
   same mistake. what is scroll-linked here is only WHEN a word turns bright,
   never how far the panel moves per wheel tick.

     1. useBlockReveal   the site's ordinary .rv entrance (fade + 18px rise, once,
                         on first scroll-into-view) applied to the blocks this
                         case study is built out of. it is GenAI's and the
                         Knowledge Base's [data-rv] hook verbatim, kept local for
                         the same reason theirs are (react/only-export-components
                         means a component file exports its component and nothing
                         else). --d on an element staggers it behind its siblings,
                         which is what makes a section arrive as tag → heading →
                         lede → block instead of all at once.

     2. useWordReveal    the same idea one granularity down: the three sentences
                         that carry the actual narrative turn light up WORD BY
                         WORD as they cross the panel, so the reader's eye moves
                         through the sentence at the speed they are scrolling it.
                         three blocks only, named at their call sites - the
                         problem, the decision, the result. a spec table does not
                         get this and neither does every paragraph, or the device
                         stops meaning "read this one slowly" and becomes a tic.
   --------------------------------------------------------------------------- */

/* MyJourney's wrapWords, adapted. same mechanism - walk the text nodes, split on
   whitespace, wrap each chunk in <span class="w"> and put the whitespace back as
   plain text so the paragraph still wraps normally - with one difference: this
   version RECURSES into element children instead of flattening them. MyJourney
   collapses an <i> into a single .w because there the italic is one word; here
   the inline children are the colour marks (.ivs-was, .ivs-em, .ivs-verdict) and
   they have to survive as wrappers, so the words inside them inherit the mark's
   colour and still get their own .w to fade. this is also why those three marks
   are SOLID colours rather than a gradient text-clip: a clip is painted by the
   parent, so a per-word opacity underneath it would have nothing to fade. */
function splitWords(el) {
  const walk = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === 3) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((chunk) => {
          if (chunk.trim() === '') { frag.appendChild(document.createTextNode(chunk)); return; }
          const span = document.createElement('span');
          span.className = 'w';
          span.textContent = chunk;
          frag.appendChild(span);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === 1) {
        walk(child);
      }
    });
  };
  walk(el);
  return [...el.querySelectorAll('.w')];
}

function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* the pinned-scene reader, same shape as Customer Portal's. the note above
   about never pinning a section in this modal predates that case study -
   it now runs its whole narrative on pinned beats, and reads better for it,
   so the rule it describes no longer holds. what is still true is the part
   that mattered: scroll speed is never scrubbed, only WHICH beat is on. */
function useScrollBeat(ref, beats) {
  const [beat, setBeat] = useState(prefersReducedMotion() ? beats - 1 : 0);

  useEffect(() => {
    const panel = document.querySelector('.ovl-panel');
    const el = ref.current;
    if (!panel || !el) return undefined;
    let raf = null;
    const update = () => {
      const stage = el.firstElementChild;
      if (!stage) return;
      const top = el.getBoundingClientRect().top - panel.getBoundingClientRect().top + panel.scrollTop;
      const span = el.offsetHeight - stage.offsetHeight;
      if (span <= 0) return;
      const p = Math.min(1, Math.max(0, (panel.scrollTop - top) / span));
      setBeat(Math.min(beats - 1, Math.floor(p * beats)));
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { raf = null; update(); });
    };
    panel.addEventListener('scroll', onScroll);
    update();
    return () => panel.removeEventListener('scroll', onScroll);
  }, [ref, beats]);

  return beat;
}

/* the case study's narrative, one idea per beat. the density is deliberate
   in exactly two places - the seven requirements and the three learnings -
   because those ARE the content there; every other beat is a sentence. */
function InvoiceStoryScene() {
  const ref = useRef(null);
  const beat = useScrollBeat(ref, 6);
  const reduced = prefersReducedMotion();

  const beats = [
    <h3 className="ivs-big" key="two">
      Two teams kept flagging the same bill.<br /><em className="ivs-was">For opposite reasons.</em>
    </h3>,
    <div className="ivs-quotes" key="quotes">
      <div className="inv-quote">
        <span className="who">Finance team</span>
        <p>&quot;I have to open three tabs and cross-check every line before I can approve payment.&quot;</p>
      </div>
      <div className="inv-quote">
        <span className="who">Customer</span>
        <p>&quot;My bill went up and I have no idea why - did I get charged twice?&quot;</p>
      </div>
    </div>,
    <h3 className="ivs-big" key="diag">
      The problem was never the numbers.<br />One page was answering <em className="ivs-was">two questions at once</em>.
    </h3>,
    <div className="ivs-reqs" key="reqs">
      <span className="ivs-eyebrow">Every scenario the bill had to survive</span>
      <div className="inv-problems">
        {REQUIREMENTS.map((r) => (
          <div className="inv-problem" key={r.n}>
            <span className="ip-n">{r.n}</span>
            <h4>{r.title}</h4>
          </div>
        ))}
      </div>
    </div>,
    <h3 className="ivs-big" key="three">
      Three pages.<br /><em className="ivs-em">One job each.</em>
    </h3>,
    <div className="ivs-pages" key="pages">
      {PAGES.map((pg) => (
        <div className="inv-page-card" key={pg.tag}>
          <b className="pn">{pg.tag}</b>
          <h4>{pg.title}</h4>
        </div>
      ))}
    </div>,
  ];

  if (reduced) return <div className="ivs-static">{beats}</div>;

  return (
    <div className="oscn ivs-oscn" ref={ref} style={{ '--beats': beats.length }}>
      <div className="oscn-stage ivs-stage" key={beat}>{beats[beat]}</div>
    </div>
  );
}

function InvoiceCloseScene() {
  const ref = useRef(null);
  const beat = useScrollBeat(ref, 3);
  const reduced = prefersReducedMotion();

  const beats = [
    <h3 className="ivs-big" key="ship">
      A design doesn&apos;t ship itself.<br /><em className="ivs-em">The BRM team put it on every bill.</em>
    </h3>,
    <div className="inv-result ivs-verdictwrap" key="verdict">
      One format that <span className="ivs-verdict">finance trusts and customers understand</span>.
    </div>,
    <div className="ivs-learn" key="learn">
      <span className="ivs-eyebrow">What it taught</span>
      <div className="inv-learn">
        <div className="inv-learn-card"><h4>One page can&apos;t serve two readers.</h4></div>
        <div className="inv-learn-card"><h4>Duplicate numbers read as contradictions.</h4></div>
        <div className="inv-learn-card"><h4>Scalability isn&apos;t optional.</h4></div>
      </div>
    </div>,
  ];

  if (reduced) return <div className="ivs-static">{beats}</div>;

  return (
    <div className="oscn ivs-oscn" ref={ref} style={{ '--beats': beats.length }}>
      <div className="oscn-stage ivs-stage" key={beat}>{beats[beat]}</div>
    </div>
  );
}

function useBlockReveal(ref) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    const nodes = root.querySelectorAll('[data-rv]');
    if (typeof IntersectionObserver === 'undefined') {
      nodes.forEach((n) => n.classList.add('on'));
      return undefined;
    }
    const panel = root.closest('.ovl-panel') || document.querySelector('.ovl-panel');
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('on');
            obs.unobserve(e.target);
          }
        });
      },
      { root: panel || null, rootMargin: '0px 0px -8% 0px', threshold: 0.1 },
    );
    nodes.forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, [ref]);
}

function useWordReveal(ref) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    const blocks = [...root.querySelectorAll('[data-words]')];
    if (blocks.length === 0) return undefined;

    /* reduced motion: the words are never split at all, so what renders is the
       original paragraph - one text node, full colour, no transition to be
       caught half-finished. the CSS guard further down index.css is the second
       half of this and covers the case where the preference is turned ON after
       the split has already happened. */
    if (prefersReducedMotion()) return undefined;

    const panel = root.closest('.ovl-panel') || document.querySelector('.ovl-panel');
    if (!panel) return undefined;

    /* split once, then RE-COLLECT on any later run rather than bailing out.
       StrictMode mounts every effect twice in dev, and the first version of this
       skipped an already-split block and returned before attaching the scroll
       listener - so the words existed in the markup and nothing ever lit them.
       clearing .lit here keeps `lit: 0` honest against the DOM; the paint() call
       below immediately restores whatever the current scroll position deserves. */
    const tracked = blocks.map((el) => {
      const words = el.dataset.split === '1' ? [...el.querySelectorAll('.w')] : splitWords(el);
      el.dataset.split = '1';
      words.forEach((w) => w.classList.remove('lit'));
      return { el, words, lit: 0 };
    });

    let raf = null;
    const paint = () => {
      raf = null;
      const pr = panel.getBoundingClientRect();
      /* the travel window: a block starts lighting when its top has risen to 90%
         of the panel's height and is fully lit by the time that top reaches 55%,
         i.e. just above the middle. the window is 35% of the panel rather than
         something wider because the LAST word block on the page (.inv-result)
         has only ~400px of content under it - with a wider window its closing
         words could never reach the finish line no matter how far the reader
         scrolled. the bottomed-out check below is the belt to that braces. */
      const enter = pr.top + pr.height * 0.9;
      const done = pr.top + pr.height * 0.55;
      const span = enter - done || 1;
      const atEnd = panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 8;
      tracked.forEach((t) => {
        const p = atEnd ? 1 : Math.min(1, Math.max(0, (enter - t.el.getBoundingClientRect().top) / span));
        const want = Math.round(p * t.words.length);
        if (want === t.lit) return;
        if (want > t.lit) {
          for (let i = t.lit; i < want; i += 1) t.words[i].classList.add('lit');
        } else {
          for (let i = t.lit - 1; i >= want; i -= 1) t.words[i].classList.remove('lit');
        }
        t.lit = want;
      });
    };
    const onScroll = () => {
      if (raf === null) raf = window.requestAnimationFrame(paint);
    };

    paint();
    panel.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      panel.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf !== null) window.cancelAnimationFrame(raf);
    };
  }, [ref]);
}

export default function InvoiceCaseStudy({ onPrev, onNext, idx, total }) {
  const [activeSection, setActiveSection] = useState(1);
  const sectionRefs = useRef({});
  const wrap = useRef(null);
  useBlockReveal(wrap);
  useWordReveal(wrap);

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
    <div className="inv-wrap ivs" ref={wrap}>
      <div className="inv-hero">
        <p className="eyebrow">Polarin · Billing</p>
        <h2>Designing the invoice for complex NaaS billing</h2>
        <p>One invoice. Multiple products. Mid-month upgrades. PAYG hours. GST variants. Three pages that had to serve a CFO and a network engineer at the same time.</p>
        <div className="inv-meta">
          <div><span>My role</span><b>Executive Experience Designer</b></div>
          <div><span>Output</span><b>PDF invoice (with annexure)</b></div>
        </div>
      </div>

      <div className="inv-section ivs-rv" data-rv>
        <CompareSlider beforeSrc="/invoice/existing.png" afterSrc="/invoice/new.png" beforeLabel="Existing" afterLabel="New" />
      </div>

      <InvoiceStoryScene />

      <div className="inv-section inv-explore">
        <p className="eyebrow ivs-rv" data-rv>The new invoice</p>
        <h3 className="ch-title t-sub ivs-rv" data-rv style={{ '--d': '90ms' }}>Explore the <span>three pages.</span></h3>
        <div className="inv-tabs inv-tabs-sticky">
          {SECTIONS.map((s) => (
            <button key={s.id} type="button" className={`inv-tab ${activeSection === s.id ? 'on' : ''}`} onClick={() => jumpToSection(s.id)}>
              {s.label}
            </button>
          ))}
        </div>

        <div className="inv-page-shot ivs-rv" data-rv ref={(el) => { sectionRefs.current[1] = el; }} data-sec-id="1">
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

        <div className="inv-page-shot ivs-rv" data-rv ref={(el) => { sectionRefs.current[2] = el; }} data-sec-id="2">
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

        <div className="inv-page-shot ivs-rv" data-rv ref={(el) => { sectionRefs.current[3] = el; }} data-sec-id="3">
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

      <InvoiceCloseScene />

      <div className="ovl-nav">
        <button type="button" onClick={onPrev}>← Prev</button>
        <span className="ovl-count"><b>{idx + 1}</b> / {total} surfaces</span>
        <button type="button" onClick={onNext}>Next →</button>
      </div>
    </div>
  );
}
