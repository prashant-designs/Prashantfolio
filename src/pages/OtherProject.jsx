import { useEffect, useState } from 'react';

const PROJECTS = [
  'Jeevika App - empowering street vendors',
  'Enote - seamless e-paper note-taking',
  'Portico - HR & payroll suite',
  'Giesecke + Devrient - cash counting UI',
];

function useTypewriter(words) {
  const [text, setText] = useState('');
  const [idx, setIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[idx];
    let delay = deleting ? 28 : 45;
    if (!deleting && text === current) delay = 1500;
    if (deleting && text === '') delay = 350;

    const t = setTimeout(() => {
      if (!deleting && text === current) {
        setDeleting(true);
        return;
      }
      if (deleting && text === '') {
        setDeleting(false);
        setIdx((i) => (i + 1) % words.length);
        return;
      }
      setText(deleting ? current.slice(0, text.length - 1) : current.slice(0, text.length + 1));
    }, delay);
    return () => clearTimeout(t);
  }, [text, deleting, idx, words]);

  return text;
}

function ComingBuilder() {
  return (
    <span className="op-coming">
      <span className="op-bounce">
        {'coming.'.split('').map((ch, i) => (
          <span key={i} style={{ animationDelay: `${i * 0.07}s` }}>{ch}</span>
        ))}
      </span>
      <svg className="op-builder" viewBox="0 0 60 60" aria-hidden="true">
        <circle cx="30" cy="13" r="7" fill="none" stroke="var(--mute)" strokeWidth="2.4" />
        <line x1="30" y1="20" x2="30" y2="40" stroke="var(--mute)" strokeWidth="2.4" strokeLinecap="round" />
        <line x1="30" y1="40" x2="21" y2="56" stroke="var(--mute)" strokeWidth="2.4" strokeLinecap="round" />
        <line x1="30" y1="40" x2="39" y2="56" stroke="var(--mute)" strokeWidth="2.4" strokeLinecap="round" />
        <line x1="30" y1="28" x2="17" y2="24" stroke="var(--mute)" strokeWidth="2.4" strokeLinecap="round" />
        <g>
          <line x1="30" y1="28" x2="46" y2="16" stroke="var(--mute)" strokeWidth="2.4" strokeLinecap="round" />
          <rect x="43" y="9" width="14" height="7" rx="2" fill="var(--mute)" transform="rotate(-38 50 12.5)" />
          <animateTransform attributeName="transform" type="rotate" values="0 30 28; -30 30 28; 8 30 28; 0 30 28" keyTimes="0; 0.35; 0.6; 1" dur="1.1s" repeatCount="indefinite" />
        </g>
      </svg>
    </span>
  );
}

export default function OtherProject() {
  const typed = useTypewriter(PROJECTS);

  // light stock, permanently: this page is one section tall, so there is
  // nothing to alternate against and no reason to trigger on scroll. .flip-lock
  // is the marker useGlobalTheme reads for exactly that case - it holds the
  // page's one global .theme-light flag on for as long as this page is mounted,
  // which paints the same paper the flipped chapters get, nav and footer
  // included. it is a marker only: the section itself declares no theme.
  return (
    <section className="soon-page zone zone-sink zone-cool flip-lock">
      <div className="wrap">
        <div className="soon-box rv">
          <h2>More projects, <ComingBuilder /></h2>
          <p>Design work from before and alongside Polarin - full case studies are being written up, one at a time.</p>
          <div className="soon-term">
            <span className="k">$</span> writing-case-study.sh<br />
            <span className="k">&gt;</span> <span className="a">{typed}</span><span className="cur"></span>
            <div className="soon-bar"><i></i></div>
          </div>
          <div className="soon-ctas">
            <a className="btn-big" href="https://www.behance.net/NAYA_DESIGN" target="_blank" rel="noopener noreferrer">Explore these case studies on Behance <span aria-hidden="true">→</span></a>
            <a className="btn-ghost" href="#/">Back to home</a>
          </div>
        </div>
      </div>
    </section>
  );
}
