import { useEffect, useRef, useState } from 'react';

export function ImageOrFallback({ src, alt, children }) {
  const [failed, setFailed] = useState(false);
  if (failed || !src) return children;
  return <img src={src} alt={alt} onError={() => setFailed(true)} style={{ width: '100%', borderRadius: '12px', display: 'block' }} />;
}

export default function CompareSlider({ beforeSrc, afterSrc, beforeLabel = 'Existing', afterLabel = 'New', hint = 'Drag to compare - existing invoice vs. the new design' }) {
  const [pos, setPos] = useState(50);
  const [beforeError, setBeforeError] = useState(false);
  const [afterError, setAfterError] = useState(false);
  const frameRef = useRef(null);
  const dragging = useRef(false);

  const updateFromClientX = (clientX) => {
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(97, Math.max(3, pct)));
  };

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current) return;
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      updateFromClientX(x);
    };
    const onUp = () => { dragging.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, []);

  const startDrag = (e) => {
    dragging.current = true;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    updateFromClientX(x);
  };

  return (
    <div className="cmp-slider">
      <div className="cmp-frame" ref={frameRef} onMouseDown={startDrag} onTouchStart={startDrag}>
        <div className="cmp-pane cmp-after">
          {afterError || !afterSrc ? (
            <div className="cmp-placeholder alt">
              <span>✦</span>
              <b>New invoice</b>
              <span>image coming soon</span>
            </div>
          ) : (
            <img src={afterSrc} alt={afterLabel} onError={() => setAfterError(true)} />
          )}
          <span className="cmp-label r">{afterLabel}</span>
        </div>
        <div className="cmp-pane cmp-before" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          {beforeError || !beforeSrc ? (
            <div className="cmp-placeholder">
              <span>◇</span>
              <b>Existing invoice</b>
              <span>image coming soon</span>
            </div>
          ) : (
            <img src={beforeSrc} alt={beforeLabel} onError={() => setBeforeError(true)} />
          )}
          <span className="cmp-label l">{beforeLabel}</span>
        </div>
        <div className="cmp-handle" style={{ left: `${pos}%` }}>
          <span className="cmp-knob">↔</span>
        </div>
      </div>
      <p className="cmp-hint">{hint}</p>
    </div>
  );
}
