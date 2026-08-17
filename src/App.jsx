import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import PageLoader from './components/PageLoader';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const CurrentProject = lazy(() => import('./pages/CurrentProject'));
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
   is light from mount with nothing to alternate against (Other Projects).

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
  const [menuOpen, setMenuOpen] = useState(false);
  const pageRef = useRef(null);

  const currentPage = location.pathname.replace('/', '') || 'home';

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

    const placeTicks = () => {
      const chSections = [...pageEl.querySelectorAll('[data-ch]')];
      if (!routeLine || chSections.length === 0) return;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      createdTicks.forEach((tickEl, i) => {
        const section = chSections[i];
        if (!section) return;
        const top = section.getBoundingClientRect().top + window.scrollY;
        tickEl.style.left = `${clamp((top / docHeight) * 100, 0, 100)}%`;
      });
    };

    const rebuildTicks = () => {
      createdTicks.forEach((tickEl) => tickEl.remove());
      createdTicks = [];
      if (!routeLine) return;
      pageEl.querySelectorAll('[data-ch]').forEach((section) => {
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

    scanRv();
    rebuildTicks();
    window.addEventListener('resize', placeTicks);

    const mo = new MutationObserver(() => {
      scanRv();
      rebuildTicks();
    });
    mo.observe(pageEl, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('resize', placeTicks);
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
          <div className="route-fill" style={{ width: `${progress}%` }}></div>
          <div className="route-packet" style={{ left: `${progress}%` }}></div>
        </div>
      </header>

      <div className={`mnav ${menuOpen ? 'open' : ''}`}>
        <nav className="mnav-list" aria-label="Mobile navigation">
          <a href="#/about" className={currentPage === 'about' ? 'active' : ''}>About</a>
          <a href="#/current" className={currentPage === 'current' ? 'active' : ''}>Current Project</a>
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
              <Route path="/other" element={<OtherProject />} />
              <Route path="/journey" element={<MyJourney />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </div>

      <footer>
        <span>© 2026 Prashant Kumar · Gurugram / New Delhi, IN</span>
        <a className="footer-link" href="/Prashant_Resume.pdf" target="_blank" rel="noopener noreferrer">Résumé ↓</a>
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

