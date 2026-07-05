import { useEffect, useRef } from 'react';

export default function ScrollHint({ label = 'Scroll', className = '', style }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let rafId = null;
    const update = () => {
      rafId = null;
      el.style.opacity = Math.max(0, 1 - window.scrollY / (window.innerHeight * 0.3));
    };
    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className={`scroll-hint ${className}`} style={style} ref={ref} aria-hidden="true">
      <span className="scroll-hint-lane"><i className="scroll-hint-bar"></i></span>
      <em>{label}</em>
    </div>
  );
}
