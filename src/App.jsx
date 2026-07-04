import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import CurrentProject from './pages/CurrentProject';
import OtherProject from './pages/OtherProject';
import MyJourney from './pages/MyJourney';

function AppContent() {
  const location = useLocation();
  const [progress, setProgress] = useState(0);

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
    document.querySelectorAll('.rv').forEach((el) => rvObserver.observe(el));
    return () => rvObserver.disconnect();
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
                src="profile.jpg"
                onError={(e) => { e.target.onerror = null; e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 64 64%27%3E%3Crect width=%2764%27 height=%2764%27 fill=%27%23141A2B%27/%3E%3Ctext x=%2732%27 y=%2739%27 font-family=%27monospace%27 font-size=%2717%27 fill=%27%23EAEEF9%27 text-anchor=%27middle%27%3EPK%3C/text%3E%3C/svg%3E'; }}
              />
            </a>
            <a
              href="#/about"
              className={`tab ${currentPage === 'about' ? 'active' : ''}`}
            >
              About<span className="soon">soon</span>
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

      <div className="page active">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/current" element={<CurrentProject />} />
          <Route path="/other" element={<OtherProject />} />
          <Route path="/journey" element={<MyJourney />} />
        </Routes>
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

