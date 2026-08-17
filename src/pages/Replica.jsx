import React from 'react';

export default function Replica() {
  return (
    <div style={{minHeight: '100vh', background: '#121212'}}>
      <iframe
        title="Replica"
        src="/replica.html"
        style={{
          width: '100%',
          height: '100vh',
          border: 'none',
          display: 'block',
          background: 'transparent',
        }}
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
      <noscript style={{color: '#A3A3A3', padding: 12}}>
        This page requires JavaScript - open the replica directly: <a href="/replica.html">/replica.html</a>
      </noscript>
    </div>
  );
}
