import { useState } from 'react';

const PIPELINE = ['content strategy', 'site map', 'article system', 'AI workflow', 'frontend build', 'ship'];

const FAILS = [
  { code: 'release-notes.md', status: 'stale', body: 'updated sprints after the release - customers learn about features from support, not from us' },
  { code: '"how do I…?"', status: 'ticket', body: 'answers that should be one search away become tickets in the queue' },
  { code: 'every-edit.invoice', status: 'cost', body: 'an external vendor bills for edits a product team member could make in minutes' },
  { code: 'new-joiner.training', status: 'drift', body: 'internal teams learn by shoulder-tapping - no single source of truth to point at' },
];

const SITEMAP = [
  { k: 'getting started', note: 'the first 10 minutes - onboarding a customer without a human in the loop' },
  { k: 'platform & features', note: 'every surface & feature in plain english - for customers and internal teams alike' },
  { k: 'release notes', note: "what changed, the day it changed - customers aware of releases without asking" },
  { k: 'billing & accounts', note: 'billing, invoices & subscriptions - the answers finance actually asks' },
  { k: 'integrations', note: 'APIs & integrations - developers self-serve next to the developer portal' },
  { k: 'troubleshooting', note: "troubleshooting written to deflect the ticket before it's raised" },
];

const PRINCIPLES = [
  { t: 'findable', p: 'organised by task and audience - search-first navigation, no folder archaeology' },
  { t: 'skimmable', p: 'one answer per page - a reader lands, gets the answer, leaves' },
  { t: 'honest', p: 'every article dated, versioned & owned - trust comes from freshness' },
];

export default function KnowledgeBaseCaseStudy({ onPrev, onNext, idx, total }) {
  const [note, setNote] = useState(SITEMAP[0].note);
  const [activeK, setActiveK] = useState(SITEMAP[0].k);

  return (
    <div className="inv-wrap">
      <div className="inv-hero">
        <p className="eyebrow">Polarin · Knowledge Base</p>
        <h2>Answers before tickets.</h2>
        <p>Polarin&apos;s knowledge base lived on an external wiki - every update meant a developer or an outsourced vendor. Release notes waited on someone else&apos;s queue. I&apos;m moving it in-house as an AI-assisted platform: content strategy, site map, article system, AI workflow, frontend - one pair of hands, end to end.</p>
        <div className="inv-meta">
          <div><span>My role</span><b>Content strategy → site map → AI workflow → build</b></div>
          <div><span>Output</span><b>In-house, AI-assisted knowledge base</b></div>
        </div>
      </div>

      <div className="inv-section">
        <div className="dv-pipe">
          {PIPELINE.map((p, i) => (
            <span key={p} className={`dvp ${i === PIPELINE.length - 1 ? 'last' : ''}`}>
              <b>{p}</b>{i === PIPELINE.length - 1 ? <i>…</i> : <i>200</i>}
            </span>
          ))}
        </div>
      </div>

      <div className="inv-section">
        <div className="inv-step-tag"><i></i>The problem</div>
        <h3 className="dv-h" style={{ marginTop: '10px' }}>The cost of a stale wiki</h3>
        <p className="dv-p">When knowledge depends on other people&apos;s sprints, four things happen - quietly, every month:</p>
        <div className="dv-fails">
          {FAILS.map((f) => (
            <div className="dvf" key={f.code}>
              <code>{f.code}</code>
              <span className="dvf-code">{f.status}</span>
              <p>{f.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="inv-section">
        <div className="inv-step-tag"><i></i>Architecture first</div>
        <h3 className="dv-h" style={{ marginTop: '10px' }}>Content strategy & the site map</h3>
        <p className="dv-p">Before a single article: a task-first information architecture. Not &quot;what do we want to say&quot; - <b style={{ color: 'var(--text)' }}>&quot;what does someone need, the moment they need it.&quot;</b> Hover the map:</p>
        <div className="kb-map">
          <div className="kb-root">Polarin KB</div>
          <div className="kb-tier">
            {SITEMAP.map((s) => (
              <button
                key={s.k}
                type="button"
                className={`kbn ${activeK === s.k ? 'on' : ''}`}
                onMouseEnter={() => { setActiveK(s.k); setNote(s.note); }}
                onFocus={() => { setActiveK(s.k); setNote(s.note); }}
                onClick={() => { setActiveK(s.k); setNote(s.note); }}
              >
                {s.k}
              </button>
            ))}
          </div>
          <p className="kb-note">{note}</p>
        </div>
        <div className="ivx-principles">
          {PRINCIPLES.map((pr) => (
            <div className="ivp" key={pr.t}><b>{pr.t}</b><p>{pr.p}</p></div>
          ))}
        </div>
      </div>

      <div className="inv-section">
        <div className="inv-step-tag"><i></i>How it&apos;s made</div>
        <h3 className="dv-h" style={{ marginTop: '10px' }}>The AI-enabled build</h3>
        <p className="dv-p">The platform is AI-assisted on both sides - how it&apos;s built, and how it&apos;s written:</p>
        <div className="dv-pipe" style={{ marginTop: '14px' }}>
          <span className="dvp"><b>figma designs</b></span><em>→</em>
          <span className="dvp"><b>AI draft · via MCP</b></span><em>→</em>
          <span className="dvp last"><b>frontend screens</b><i>faster · cheaper</i></span>
        </div>
        <div className="dv-pipe">
          <span className="dvp"><b>PRD / release</b></span><em>→</em>
          <span className="dvp"><b>AI draft</b></span><em>→</em>
          <span className="dvp"><b>human edit</b></span><em>→</em>
          <span className="dvp last"><b>published</b><i>same day</i></span>
        </div>
        <p className="dv-p dim">designs pull straight into the model over MCP - screens get built faster at lower token cost. articles draft themselves from PRDs and release commits; a human keeps the judgement.</p>
      </div>

      <div className="inv-section">
        <div className="inv-step-tag"><i></i>Where the cost disappears</div>
        <h3 className="dv-h" style={{ marginTop: '10px' }}>Self-serve updates</h3>
        <div className="kb-cmp">
          <div className="kbc">
            <b className="bad">before · external wiki</b>
            <p>write request → vendor queue → their sprint → publish</p>
            <span>days per edit · billed per edit · knowledge waits</span>
          </div>
          <div className="kbc good-card">
            <b className="good">after · in-house platform</b>
            <p>product team member edits → publish</p>
            <span>minutes per edit · ₹0 external cost · always current</span>
          </div>
        </div>
        <p className="dv-p dim">next up: an update flow simpler than design tools - so <b style={{ color: 'var(--text)' }}>anyone</b> on the product team can ship release notes or feature docs, no dev support, no design-tool skills required.</p>
      </div>

      <div className="inv-section">
        <div className="inv-step-tag"><i></i>Where it stands</div>
        <h3 className="dv-h" style={{ marginTop: '10px' }}>Shipped so far</h3>
        <p className="dv-p">Core structure built - article layout, navigation, key articles refreshed - and a responsive test build is live and clickable. Coverage expands article by article.</p>
        <div className="dv-shot" aria-hidden="true">
          <span className="mg-tag">- kb walkthrough - placeholder</span>
          <div className="shot-bar"><i></i><i></i><i></i><em></em></div>
          <div className="shot-body">
            <div className="shot-side"><i></i><i className="on"></i><i></i><i></i><i></i></div>
            <div className="shot-main">
              <div className="shot-code"><i style={{ '--w': '52%' }}></i><i style={{ '--w': '84%' }}></i><i style={{ '--w': '76%' }}></i><i style={{ '--w': '64%' }}></i></div>
              <div className="shot-run"></div>
              <div className="shot-res"><i style={{ '--w': '90%' }}></i><i style={{ '--w': '58%' }}></i></div>
            </div>
          </div>
        </div>
      </div>

      <div className="inv-section">
        <div className="inv-step-tag"><i></i>Final result</div>
        <h3 className="plain">What changed</h3>
        <div className="inv-result">Fewer tickets, faster training, customers aware of every release - and ₹0 external cost per update, from one source of truth.</div>
      </div>

      <div className="ovl-nav">
        <button type="button" onClick={onPrev}>← Prev</button>
        <span className="ovl-count"><b>{idx + 1}</b> / {total} surfaces</span>
        <button type="button" onClick={onNext}>Next →</button>
      </div>
    </div>
  );
}
