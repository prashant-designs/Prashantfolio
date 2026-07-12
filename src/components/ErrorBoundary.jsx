import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Portfolio render error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="notfound">
          <div className="wrap">
            <p className="eyebrow">Error · Something broke</p>
            <h1 className="nf-title">Well, that&apos;s <span>not supposed to happen.</span></h1>
            <p className="nf-sub">A rendering error crashed this page. Reloading usually fixes it — if it keeps happening, the bug&apos;s on me, not you.</p>
            <button type="button" className="btn-big" onClick={() => window.location.reload()}>Reload page <span aria-hidden="true">→</span></button>
          </div>
        </section>
      );
    }
    return this.props.children;
  }
}
