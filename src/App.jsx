import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import PageLoader from './components/PageLoader';

/* The progress rail is full-bleed, so a mark at 100% sits exactly on the
   viewport's right edge - the running head riding it ("05 EPILOGUE") hung 2px
   past it with no air at all, and the last tick's 18px hit area overflowed by
   9. Both are positioned by percentage, so both are pulled in by up to this
   much at the far end and not at all at the near end - which fixes the edge
   without insetting the rail itself. */
const RAIL_GUARD = 22;

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const CurrentProject = lazy(() => import('./pages/CurrentProject'));
const PersonalProject = lazy(() => import('./pages/PersonalProject'));
const OtherProject = lazy(() => import('./pages/OtherProject'));
const MyJourney = lazy(() => import('./pages/MyJourney'));
const NotFound = lazy(() => import('./pages/NotFound'));

/* the light-flip trigger (see SECTION THEME FLIP in index.css).
   ONE theme value for the whole page, computed once per scroll frame and
   written to ONE node - the document element - so every visible pixel reads
   the same palette at the same instant.

   this replaces two hooks that each answered "is the page light?" on their
   own. an IntersectionObserver toggled .theme-light onto each .flip section
   individually, and a second probe toggled .light onto the nav. sections are
   not viewport-height, so a section that had already flipped and its
   still-dark neighbour were regularly on screen together: half the viewport
   paper, half of it ink, with the bar picking a side. the trigger was never
   the bug - two elements deciding their own colour from their own geometry
   was. there is nothing left to keep in sync here: .flip is now only a marker
   saying "this section is a light chapter", the sections paint no background
   of their own, and the nav inherits from the same class as everything else.

   the test is the old observer's root margin, expressed as a rect read: is
   any .flip section crossing the middle 20% band of the viewport (-40% top,
   -40% bottom). so a chapter still turns the page over once it is the
   dominant thing on screen rather than at its first visible pixel, and turns
   it back on the way out. .flip-lock is the always-on marker for a page that
   is light from mount with nothing to alternate against; no page declares it
   today - Other Projects was the one that did, and it dropped the marker when
   the four inner pages moved onto one hero template that opens dark on all four
   (see PAGE HERO RECIPE in src/index.css). the branch below is kept: a one-fold
   light page is a real case and it is two lines.

   deliberately imperative, like the pinned-scene hooks and useScrollBeat: a
   class toggle on one node per scroll frame, never React state, so scrolling
   never re-renders the tree. the read is rAF-throttled, the write is a no-op
   when the class is already right, and a childList MutationObserver covers
   the moment a page mounts behind Suspense or a scene changes the DOM without
   a scroll. */
const THEME_LIGHT = 'theme-light';

function useGlobalTheme(pageRef, routeKey) {
  useEffect(() => {
    const pageEl = pageRef.current;
    if (!pageEl) return undefined;

    const root = document.documentElement;
    let raf = null;

    const apply = () => {
      raf = null;
      let light = pageEl.querySelector('.flip-lock') !== null;
      if (!light) {
        const bandTop = window.innerHeight * 0.4;
        const bandBottom = window.innerHeight * 0.6;
        const chapters = pageEl.querySelectorAll('.flip');
        for (let i = 0; i < chapters.length; i += 1) {
          const rect = chapters[i].getBoundingClientRect();
          if (rect.bottom > bandTop && rect.top < bandBottom) {
            light = true;
            break;
          }
        }
      }
      root.classList.toggle(THEME_LIGHT, light);
    };

    const request = () => {
      if (raf === null) raf = window.requestAnimationFrame(apply);
    };

    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    const mo = new MutationObserver(request);
    mo.observe(pageEl, { childList: true, subtree: true });
    apply();

    return () => {
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
      mo.disconnect();
      if (raf !== null) window.cancelAnimationFrame(raf);
      root.classList.remove(THEME_LIGHT);
    };
  }, [pageRef, routeKey]);
}

function AppContent() {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [hasScroll, setHasScroll] = useState(false);
  // the [data-ch] section names, in document order, and which one the reader is
  // currently inside. the tick marks were already built from these sections -
  // this is the same list, kept in React so the route line can print the
  // current one as a running head instead of only revealing it on hover.
  const [chapters, setChapters] = useState([]);
  const [activeCh, setActiveCh] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const pageRef = useRef(null);

  const currentPage = location.pathname.replace('/', '') || 'home';
  // clamped rather than trusted: `chapters` and `activeCh` are written by two
  // different effects, so for one render after a route change the index can
  // still point past the new page's shorter section list.
  const chapterIdx = Math.min(activeCh, Math.max(0, chapters.length - 1));
  const chapterName = chapters[chapterIdx];

  useGlobalTheme(pageRef, location.pathname);

  useEffect(() => {
    const handleScroll = () => {
      const doc = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = doc > 0 ? window.scrollY / doc : 0;
      setProgress(scrolled * 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setMenuOpen(false);
    // the scroll listener below only updates `progress` on a real 'scroll'
    // event, so without this a page with nothing to scroll would otherwise
    // keep showing wherever the packet sat on the previous page - a single-
    // fold page (Other Projects) doesn't fire a scroll event to correct it.
    setProgress(0);
    setActiveCh(0);
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle('ovl-lock', menuOpen);
    return () => document.body.classList.remove('ovl-lock');
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  // reveal-on-scroll (.rv) + section jump-ticks on the shared top-nav progress
  // line. Both re-scan whenever the page's DOM actually changes (not just on
  // route change) since pages mount asynchronously behind Suspense.
  useEffect(() => {
    const pageEl = pageRef.current;
    if (!pageEl) return undefined;

    const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
    const routeLine = document.getElementById('routeLine');
    const observedRv = new Set();
    let createdTicks = [];
    // document-space tops of the [data-ch] sections, re-measured whenever the
    // ticks are placed. read by syncActive below, which is the only thing on
    // this effect's scroll listener.
    let chTops = [];
    let activeRaf = null;

    const rvObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            rvObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' },
    );

    const scanRv = () => {
      pageEl.querySelectorAll('.rv').forEach((el) => {
        if (!observedRv.has(el)) {
          observedRv.add(el);
          rvObserver.observe(el);
        }
      });
    };

    // which section the reader is inside: the last one whose top has passed a
    // line about a third down the viewport, so a section becomes "current" once
    // it is genuinely the thing being read rather than at its first visible
    // pixel. writes the class the tall ruler mark reads, and the index the
    // running head prints - setActiveCh with an unchanged value is a no-op in
    // React, so this costs nothing on the frames where nothing moved.
    const syncActive = () => {
      if (chTops.length === 0) return;
      const line = window.scrollY + window.innerHeight * 0.34;
      let idx = 0;
      for (let i = 0; i < chTops.length; i += 1) {
        if (chTops[i] <= line) idx = i;
      }
      setActiveCh(idx);
      createdTicks.forEach((tickEl, i) => tickEl.classList.toggle('on', i === idx));
    };

    const placeTicks = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setHasScroll(docHeight > 4);
      const chSections = [...pageEl.querySelectorAll('[data-ch]')];
      chTops = chSections.map((s) => s.getBoundingClientRect().top + window.scrollY);
      if (!routeLine || chSections.length === 0) return;
      if (docHeight <= 0) return;
      createdTicks.forEach((tickEl, i) => {
        const section = chSections[i];
        if (!section) return;
        const top = section.getBoundingClientRect().top + window.scrollY;
        const pct = clamp((top / docHeight) * 100, 0, 100);
        // pulled in by up to RAIL_GUARD at the far end - see the constant.
        tickEl.style.left = `calc(${pct}% - ${(pct / 100) * RAIL_GUARD}px)`;
      });
      syncActive();
    };

    const rebuildTicks = () => {
      createdTicks.forEach((tickEl) => tickEl.remove());
      createdTicks = [];
      const sections = [...pageEl.querySelectorAll('[data-ch]')];
      // same array identity when the names haven't changed, so the MutationObserver
      // firing on every timeline beat doesn't re-render the header each time.
      const names = sections.map((s) => s.dataset.ch);
      setChapters((prev) => (
        prev.length === names.length && prev.every((n, i) => n === names[i]) ? prev : names
      ));
      if (!routeLine) return;
      sections.forEach((section) => {
        const tickEl = document.createElement('button');
        tickEl.className = 'route-tick';
        tickEl.dataset.ch = section.dataset.ch;
        tickEl.setAttribute('aria-label', `Jump to ${section.dataset.ch}`);
        tickEl.addEventListener('click', () => section.scrollIntoView({ behavior: 'smooth' }));
        routeLine.appendChild(tickEl);
        createdTicks.push(tickEl);
      });
      placeTicks();
    };

    const onScroll = () => {
      if (activeRaf !== null) return;
      activeRaf = window.requestAnimationFrame(() => {
        activeRaf = null;
        syncActive();
      });
    };

    scanRv();
    rebuildTicks();
    window.addEventListener('resize', placeTicks);
    window.addEventListener('scroll', onScroll, { passive: true });

    const mo = new MutationObserver(() => {
      scanRv();
      rebuildTicks();
    });
    mo.observe(pageEl, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('resize', placeTicks);
      window.removeEventListener('scroll', onScroll);
      if (activeRaf !== null) window.cancelAnimationFrame(activeRaf);
      mo.disconnect();
      rvObserver.disconnect();
      createdTicks.forEach((tickEl) => tickEl.remove());
    };
  }, [location.pathname]);

  return (
    <>
      <header className="top">
        <div className="top-row">
          <a
            href="#/"
            className={`tab-ic ${currentPage === 'home' ? 'active' : ''}`}
            aria-label="Home"
            title="Home"
          >
            <img
              alt=""
              src="/image.png"
              onError={(e) => { e.target.onerror = null; e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 64 64%27%3E%3Crect width=%2764%27 height=%2764%27 fill=%27%23202020%27/%3E%3Ctext x=%2732%27 y=%2739%27 font-family=%27monospace%27 font-size=%2717%27 fill=%27%23F5F4F2%27 text-anchor=%27middle%27%3EPK%3C/text%3E%3C/svg%3E'; }}
            />
          </a>
          <nav className="tabs" aria-label="Main navigation">
            <a
              href="#/about"
              className={`tab ${currentPage === 'about' ? 'active' : ''}`}
            >
              About
            </a>
            <a
              href="#/current"
              className={`tab ${currentPage === 'current' ? 'active' : ''}`}
            >
              Current Project
            </a>
            <a
              href="#/personal"
              className={`tab ${currentPage === 'personal' ? 'active' : ''}`}
            >
              Personal Project
            </a>
            <a
              href="#/other"
              className={`tab ${currentPage === 'other' ? 'active' : ''}`}
            >
              Other Projects<span className="soon">soon</span>
            </a>
            <a
              href="#/journey"
              className={`tab ${currentPage === 'journey' ? 'active' : ''}`}
            >
              My Journey
            </a>
          </nav>
          <button
            type="button"
            className={`mnav-toggle ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
        <div className="route-line" id="routeLine">
          {hasScroll && <div className="route-fill" style={{ width: `${progress}%` }}></div>}
          {hasScroll && (
            <div
              className="route-packet"
              style={{ left: `calc(${progress}% - ${(progress / 100) * RAIL_GUARD}px)` }}
            >
              {chapterName && (
                /* translated by its own progress percentage so it never leaves
                   the viewport: at 0% it hangs off the right of the caret, at
                   100% off the left, sliding across itself in between. */
                <span className="route-now" style={{ transform: `translateX(-${progress}%)` }}>
                  <i>{String(chapterIdx + 1).padStart(2, '0')}</i>{chapterName}
                </span>
              )}
            </div>
          )}
        </div>
      </header>

      <div className={`mnav ${menuOpen ? 'open' : ''}`}>
        <nav className="mnav-list" aria-label="Mobile navigation">
          <a href="#/about" className={currentPage === 'about' ? 'active' : ''}>About</a>
          <a href="#/current" className={currentPage === 'current' ? 'active' : ''}>Current Project</a>
          <a href="#/personal" className={currentPage === 'personal' ? 'active' : ''}>Personal Project</a>
          <a href="#/other" className={currentPage === 'other' ? 'active' : ''}>Other Projects <span className="soon">soon</span></a>
          <a href="#/journey" className={currentPage === 'journey' ? 'active' : ''}>My Journey</a>
        </nav>
      </div>

      <div className="page active" ref={pageRef}>
        <ErrorBoundary key={location.pathname}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/current" element={<CurrentProject />} />
              <Route path="/personal" element={<PersonalProject />} />
              <Route path="/other" element={<OtherProject />} />
              <Route path="/journey" element={<MyJourney />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </div>

      <footer>
        <span>© 2026 Prashant Kumar · Gurugram / New Delhi, IN</span>
        <span className="footer-links">
          <a className="footer-link" href="/Prashant_Resume.pdf" target="_blank" rel="noopener noreferrer">Résumé ↓</a>
          <a className="footer-link" href="https://github.com/prashant-designs" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
        </span>
        <span><span className="g">●</span> made with love, fun & a dash of curiosity</span>
      </footer>
    </>
  );
}

function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}

export default App;

