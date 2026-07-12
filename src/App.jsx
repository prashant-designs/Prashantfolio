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

function AppContent() {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const pageRef = useRef(null);

  const currentPage = location.pathname.replace('/', '') || 'home';

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
  }, [location.pathname]);

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
      { threshold: 0.12 },
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
          <nav className="tabs" aria-label="Main navigation">
            <a
              href="#/"
              className={`tab tab-ic ${currentPage === 'home' ? 'active' : ''}`}
              aria-label="Home"
              title="Home"
            >
              <img
                alt=""
                src="/image.png"
                onError={(e) => { e.target.onerror = null; e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 64 64%27%3E%3Crect width=%2764%27 height=%2764%27 fill=%27%23141A2B%27/%3E%3Ctext x=%2732%27 y=%2739%27 font-family=%27monospace%27 font-size=%2717%27 fill=%27%23EAEEF9%27 text-anchor=%27middle%27%3EPK%3C/text%3E%3C/svg%3E'; }}
              />
            </a>
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
        </div>
        <div className="route-line" id="routeLine">
          <div className="route-fill" style={{ width: `${progress}%` }}></div>
          <div className="route-packet" style={{ left: `${progress}%` }}></div>
        </div>
      </header>

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

