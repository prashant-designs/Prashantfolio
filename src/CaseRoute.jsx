import { useEffect, useRef, useState } from 'react';

/* The section bar that sits at the top of a case study: a ruler of ticks,
   a fill that tracks how far through the reader is, and a label naming the
   section they're in. Shared because four case studies now want it and it
   is the same behaviour every time - the only thing that differs is the
   list of sections.

   Tracking is REF-BASED: a case study hands over refs to its own section
   elements, and the bar reads their offsets. That works for the ones built
   out of flowing sections. The Knowledge Base keeps its own copy because
   its whole narrative is a single pinned scene - there are no section
   elements to observe there, only beats, so it derives the same bar from
   scroll progress through that one scene instead.

   Everything is measured against .ovl-panel, the overlay's own scroll
   container - the window never scrolls while a case study is open (body
   carries .ovl-lock), so anything read from window.scrollY would sit still
   forever. */

export default function CaseRoute({ refs, labels }) {
  const [pos, setPos] = useState(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [tickLeft, setTickLeft] = useState([]);
  // a click jumps; without pinning the answer the bar would immediately
  // re-derive `active` from a scroll position that hasn't settled yet and
  // flick back to the previous section for a frame.
  const pinned = useRef(null);
  const pinnedTop = useRef(0);

  useEffect(() => {
    const panel = document.querySelector('.ovl-panel');
    if (!panel) return undefined;
    let raf = null;

    const place = () => {
      const r = panel.getBoundingClientRect();
      /* .ovl-close sits OUTSIDE the panel's right edge, so stopping short of
         the button alone lets the bar - and the label riding its right end -
         run past the panel and get clipped by its rounded corner. Whichever
         limit comes first wins. */
      const closeBtn = document.querySelector('.ovl-close');
      const closeLeft = closeBtn ? closeBtn.getBoundingClientRect().left : r.right - 28;
      const rightLimit = Math.min(closeLeft - 14, r.right - 28);
      setPos({ top: r.top, left: r.left + 28, width: Math.max(120, rightLimit - (r.left + 28)) });

      const scrollable = panel.scrollHeight - panel.clientHeight;
      setTickLeft(refs.current.map((el) => {
        if (!el || scrollable <= 0) return 0;
        const top = el.getBoundingClientRect().top - r.top + panel.scrollTop;
        return Math.min(100, Math.max(0, (top / scrollable) * 100));
      }));
    };

    // the line a section has to cross to count as current - generous, so a
    // section registers once it is meaningfully in view rather than only
    // when flush with the top.
    const LINE = 120;
    const update = () => {
      const scrollable = panel.scrollHeight - panel.clientHeight;
      setProgress(scrollable > 0 ? Math.min(100, Math.max(0, (panel.scrollTop / scrollable) * 100)) : 0);

      if (pinned.current !== null) {
        if (Math.abs(panel.scrollTop - pinnedTop.current) < 40) return;
        pinned.current = null;
      }
      if (panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 4) {
        setActive(labels.length - 1);
        return;
      }
      const r = panel.getBoundingClientRect();
      let next = 0;
      refs.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top - r.top <= LINE) next = i;
      });
      setActive(next);
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { raf = null; place(); update(); });
    };
    panel.addEventListener('scroll', onScroll, { passive: true });
    // the case study stays mounted while the overlay is closed, and .ovl is
    // display:none until .open - so the first measurement can run against a
    // genuinely 0x0 panel. the resize to real geometry is what corrects it.
    const ro = new ResizeObserver(() => { place(); update(); });
    ro.observe(panel);
    place();
    update();

    return () => {
      ro.disconnect();
      panel.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [refs, labels]);

  // always instant, never 'smooth': a case study's pinned scenes each span
  // several viewport heights, so an eased jump takes real seconds and drags
  // the reader through every scene in between, firing their reveals on the
  // way. an instant jump is the one that behaves like an index.
  const jump = (i) => {
    const panel = document.querySelector('.ovl-panel');
    refs.current[i]?.scrollIntoView({ block: 'start', behavior: 'auto' });
    if (panel) { pinned.current = i; pinnedTop.current = panel.scrollTop; }
    setActive(i);
  };

  if (!pos) return null;

  return (
    <div className="cp-route-wrap" style={{ top: pos.top, left: pos.left, width: pos.width }}>
      <div className="route-line" aria-label="Jump to section">
        <div className="route-fill" style={{ width: `${progress}%` }}></div>
        <div className="route-packet" style={{ left: `${progress}%` }}>
          <span className="route-now" style={{ transform: `translateX(-${progress}%)` }}>
            <i>{String(active + 1).padStart(2, '0')}</i>{labels[active]}
          </span>
        </div>
        {labels.map((label, i) => (
          <button
            key={label}
            type="button"
            className={`route-tick ${i === active ? 'on' : ''}`}
            data-cp-ch={label}
            aria-label={`Jump to ${label}`}
            style={{ left: `${tickLeft[i] || 0}%` }}
            onClick={() => jump(i)}
          />
        ))}
      </div>
    </div>
  );
}
