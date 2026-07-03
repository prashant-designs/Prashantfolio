import { useEffect } from 'react';

const styles = `
:root{
  --ink:#0C101B; --ink2:#0F1524; --raise:#141A2B; --raise2:#1A2136;
  --line:rgba(143,160,255,.14); --line2:rgba(143,160,255,.30);
  --text:#EAEEF9; --mute:#96A0BA; --dim:#5D667E;
  --signal:#FFC46B; --link:#8FA0FF; --up:#5CE0A8; --rose:#FF8FA8;
  --disp:"Bricolage Grotesque",sans-serif;
  --body:"Instrument Sans", -apple-system, "Segoe UI", sans-serif;
  --mono:"IBM Plex Mono", monospace;
  --ease:cubic-bezier(.22,1,.36,1);
}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:auto}
body{background:var(--ink);color:var(--text);font-family:var(--body);line-height:1.6;overflow-x:hidden}
::selection{background:var(--signal);color:var(--ink)}
a{color:inherit}
:focus-visible{outline:2px solid var(--signal);outline-offset:3px;border-radius:4px}
.mono{font-family:var(--mono)}
body::before{content:"";position:fixed;inset:0;z-index:-2;
  background-image:radial-gradient(rgba(143,160,255,.09) 1px,transparent 1px);background-size:36px 36px;
  mask-image:radial-gradient(ellipse 90% 75% at 50% 30%,black,transparent);
  -webkit-mask-image:radial-gradient(ellipse 90% 75% at 50% 30%,black,transparent)}
body::after{content:"";position:fixed;inset:0;z-index:-1;pointer-events:none;
  background:radial-gradient(1100px 650px at 80% -10%,rgba(143,160,255,.09),transparent 60%),
             radial-gradient(900px 600px at -10% 55%,rgba(255,196,107,.05),transparent 55%)}
.route{position:fixed;top:0;left:0;right:0;height:44px;z-index:90;display:flex;align-items:center;padding:0 20px;background:linear-gradient(to bottom,rgba(12,16,27,.94),rgba(12,16,27,.6) 70%,transparent);backdrop-filter:blur(6px)}
.route-line{position:relative;flex:1;height:2px;background:rgba(143,160,255,.15);border-radius:2px;margin:0 18px}
.route-fill{position:absolute;left:0;top:0;bottom:0;width:0%;border-radius:2px;background:linear-gradient(90deg,var(--link),var(--signal))}
.route-packet{position:absolute;top:50%;left:0%;width:9px;height:9px;border-radius:50%;background:var(--signal);transform:translate(-50%,-50%);box-shadow:0 0 12px rgba(255,196,107,.8)}
.route-tick{position:absolute;top:50%;width:5px;height:5px;border-radius:50%;background:var(--dim);transform:translate(-50%,-50%);cursor:pointer;transition:all .3s;border:none;padding:0}
.route-tick:hover{background:var(--text);transform:translate(-50%,-50%) scale(1.7)}
.route-tick::after{content:attr(data-ch);position:absolute;top:14px;left:50%;transform:translateX(-50%);font-family:var(--mono);font-size:9.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--mute);white-space:nowrap;opacity:0;transition:opacity .25s;pointer-events:none;background:var(--raise);border:1px solid var(--line);border-radius:5px;padding:3px 8px}
.route-tick:hover::after{opacity:1}
.route .logo{font-family:var(--mono);font-size:12.5px;text-decoration:none;display:flex;gap:8px;align-items:center;color:var(--text)}
.route .logo i{width:7px;height:7px;border-radius:50%;background:var(--up);animation:ping 2.4s infinite}
@keyframes ping{0%{box-shadow:0 0 0 0 rgba(92,224,168,.45)}70%{box-shadow:0 0 0 8px rgba(92,224,168,0)}100%{box-shadow:0 0 0 0 rgba(92,224,168,0)}}
.route .cta{font-family:var(--mono);font-size:11px;text-decoration:none;color:var(--ink);background:var(--signal);padding:6px 14px;border-radius:99px;font-weight:500;transition:transform .25s var(--ease)}
.route .cta:hover{transform:translateY(-2px)}
.ch-now{font-family:var(--mono);font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;color:var(--dim);min-width:150px;text-align:right}
@media(max-width:760px){.ch-now{display:none}.route-tick::after{display:none}}
.wrap{max-width:1240px;margin:0 auto;padding:0 clamp(22px,5.5vw,80px)}
.chip{font-family:var(--mono);font-size:11px;letter-spacing:.08em;color:var(--mute);border:1px solid var(--line);border-radius:99px;padding:5px 12px;display:inline-block}
.eyebrow{font-family:var(--mono);font-size:12px;letter-spacing:.24em;text-transform:uppercase;color:var(--link);display:flex;align-items:center;gap:12px;margin-bottom:20px}
.eyebrow::before{content:"";width:28px;height:1px;background:var(--link)}
.rv{opacity:0;transform:translateY(24px);transition:opacity .8s var(--ease),transform .8s var(--ease)}
.rv.in{opacity:1;transform:none}
.rv.d1{transition-delay:.1s}.rv.d2{transition-delay:.2s}.rv.d3{transition-delay:.3s}
.ch-head{padding:120px 0 40px}
.ch-num{font-family:var(--mono);font-size:12px;letter-spacing:.3em;text-transform:uppercase;color:var(--dim)}
.ch-num b{color:var(--signal);font-weight:500}
.ch-title{font-family:var(--disp);font-weight:700;font-size:clamp(34px,6vw,72px);letter-spacing:-.03em;line-height:1;margin-top:12px}
.ch-title span{color:var(--link)}
.wr{font-family:var(--disp);font-weight:500;font-size:clamp(20px,3.1vw,36px);line-height:1.4;letter-spacing:-.01em;max-width:24ch}
.wr .w{opacity:.13;transition:opacity .15s linear}
.wr .w.hot{color:var(--signal)}
.wr .w.lnk{color:var(--link)}
.hero{min-height:100vh;display:flex;align-items:center;position:relative;overflow:hidden}
.hero-inner{width:100%;perspective:1000px}
#heroCard{transform-style:preserve-3d;will-change:transform;transition:transform .15s ease-out}
.hero-kicker{font-family:var(--mono);font-size:12px;letter-spacing:.3em;text-transform:uppercase;color:var(--mute);margin-bottom:22px;transform:translateZ(26px)}
.hero h1{font-family:var(--disp);font-weight:700;font-size:clamp(42px,8.4vw,112px);line-height:.99;letter-spacing:-.035em;transform:translateZ(55px)}
.hero h1 .l2{color:var(--signal)}
.hero h1 .l3{color:transparent;-webkit-text-stroke:1.2px var(--link)}
.hero-sub{margin-top:28px;color:var(--mute);max-width:54ch;font-size:clamp(15px,1.5vw,18px);transform:translateZ(20px)}
.hero-sub b{color:var(--text)}
.hero-toc{display:flex;flex-wrap:wrap;gap:10px;margin-top:44px;transform:translateZ(12px)}
.hero-toc button{font-family:var(--mono);font-size:11.5px;letter-spacing:.1em;color:var(--mute);cursor:pointer;background:rgba(20,26,43,.6);border:1px solid var(--line);border-radius:99px;padding:9px 16px;transition:all .3s var(--ease)}
.hero-toc button:hover{color:var(--ink);background:var(--signal);border-color:var(--signal);transform:translateY(-3px)}
.hero-scroll{position:absolute;bottom:30px;left:50%;transform:translateX(-50%);font-family:var(--mono);font-size:10.5px;letter-spacing:.24em;text-transform:uppercase;color:var(--dim);display:flex;flex-direction:column;align-items:center;gap:8px}
.hero-scroll i{display:block;width:1px;height:38px;background:linear-gradient(var(--signal),transparent);animation:fall 1.7s var(--ease) infinite}
@keyframes fall{0%{transform:scaleY(0);transform-origin:top}45%{transform:scaleY(1);transform-origin:top}55%{transform:scaleY(1);transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom}}
.glyph{position:absolute;font-family:var(--mono);font-size:12px;color:var(--dim);opacity:.5;border:1px solid var(--line);border-radius:8px;padding:6px 11px;background:rgba(15,21,36,.5);will-change:transform;pointer-events:none;white-space:nowrap}
.scene{position:relative}
.scene .pin{position:sticky;top:0;height:100vh;display:flex;align-items:center;overflow:hidden}
body.static .scene .pin{position:relative;height:auto;padding:60px 0;overflow:visible}
body.static .scene{height:auto!important}
.ch1-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:70px;align-items:center;width:100%}
.blueprint{width:100%;max-width:520px;justify-self:center}
.blueprint svg{width:100%;height:auto;display:block}
.blueprint .draw{stroke:var(--link);stroke-width:1.6;fill:none;stroke-linecap:round}
.blueprint .draw.amber{stroke:var(--signal)}
.blueprint .draw.faint{stroke:rgba(143,160,255,.35)}
.bp-cap{font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--dim);text-align:center;margin-top:16px}
.bp-cap b{color:var(--signal);font-weight:500}
.ch1-creds{display:flex;gap:9px;flex-wrap:wrap;margin-top:16px}
.cross-stage{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;width:100%}
.cross-word{position:absolute;inset:0;display:grid;place-items:center;pointer-events:none;z-index:0}
.cross-word span{position:absolute;font-family:var(--disp);font-weight:800;font-size:clamp(80px,17vw,240px);letter-spacing:-.04em;color:transparent;-webkit-text-stroke:1px rgba(143,160,255,.14);white-space:nowrap;will-change:transform,opacity}
.cross-left{position:relative;z-index:2}
.cross-q{margin-bottom:34px;opacity:.16;transform:translateX(-14px);transition:opacity .4s,transform .4s var(--ease)}
.cross-q.on{opacity:1;transform:none}
.cross-q .yr{font-family:var(--mono);font-size:11.5px;letter-spacing:.22em;color:var(--dim);text-transform:uppercase}
.cross-q .yr b{color:var(--signal);font-weight:500}
.cross-q h3{font-family:var(--disp);font-weight:600;font-size:clamp(21px,2.6vw,32px);letter-spacing:-.015em;line-height:1.15;margin-top:6px}
.cross-q h3 em{font-style:normal;color:var(--link)}
.cross-q.on h3 em{color:var(--signal)}
.cross-q p{color:var(--mute);font-size:14.5px;max-width:46ch;margin-top:8px}
.cross-right{position:relative;z-index:2;height:420px;perspective:1200px}
.artifact{position:absolute;inset:0;margin:auto;width:min(400px,100%);height:400px;border:1px solid var(--line2);border-radius:18px;background:var(--raise);box-shadow:0 40px 90px rgba(0,0,0,.55);will-change:transform,opacity;overflow:hidden;display:flex;flex-direction:column}
.art-bar{display:flex;align-items:center;gap:7px;padding:12px 15px;border-bottom:1px solid var(--line);background:var(--raise2);font-family:var(--mono);font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--dim)}
.art-bar i{width:8px;height:8px;border-radius:50%}
.art-body{flex:1;padding:20px;position:relative}
.wf-el{border:1.4px solid rgba(143,160,255,.5);border-radius:7px;margin-bottom:12px}
.wf-el.bar{height:14px;width:55%}
.wf-el.hero{height:100px;display:grid;place-items:center;color:var(--dim);font-family:var(--mono);font-size:10px;letter-spacing:.2em}
.wf-row{display:flex;gap:12px}
.wf-el.card{flex:1;height:88px}
.wf-el.btn{height:34px;width:40%;border-color:var(--signal);background:rgba(255,196,107,.1)}
.prd-line{height:9px;border-radius:5px;background:rgba(150,160,186,.28);margin-bottom:11px}
.prd-h{height:15px;width:64%;background:rgba(234,238,249,.75)}
.prd-tag{display:inline-block;font-family:var(--mono);font-size:9.5px;letter-spacing:.14em;color:var(--signal);border:1px solid rgba(255,196,107,.4);border-radius:5px;padding:2px 8px;margin:0 6px 12px 0;text-transform:uppercase}
.prd-metric{display:flex;justify-content:space-between;font-family:var(--mono);font-size:11px;color:var(--mute);border:1px dashed var(--line2);border-radius:8px;padding:9px 12px;margin-top:14px}
.prd-metric b{color:var(--up);font-weight:500}
.db-kpis{display:flex;gap:10px;margin-bottom:16px}
.db-kpi{flex:1;border:1px solid var(--line);border-radius:9px;padding:10px 11px}
.db-kpi .v{font-family:var(--disp);font-weight:600;font-size:19px}
.db-kpi .v.g{color:var(--up)}.db-kpi .v.a{color:var(--signal)}
.db-kpi .l{font-family:var(--mono);font-size:8.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--dim);margin-top:2px}
.db-chart{display:flex;align-items:flex-end;gap:7px;height:130px;border-bottom:1px solid var(--line2);padding-bottom:2px}
.db-chart i{flex:1;background:linear-gradient(to top,rgba(143,160,255,.25),rgba(143,160,255,.7));border-radius:4px 4px 0 0}
.db-chart i.hot{background:linear-gradient(to top,rgba(255,196,107,.3),var(--signal))}
.db-note{font-family:var(--mono);font-size:10px;color:var(--dim);margin-top:12px}
.db-note b{color:var(--up);font-weight:500}
.cross-hint{position:absolute;bottom:26px;left:50%;transform:translateX(-50%);font-family:var(--mono);font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:var(--dim);z-index:3}
.hscroll .pin{align-items:stretch}
.htrack{display:flex;height:100%;will-change:transform}
.panel{flex:0 0 auto;width:min(88vw,880px);height:100%;display:flex;align-items:center;padding:90px clamp(20px,4vw,60px) 50px}
.panel-intro{width:min(70vw,640px)}
.panel-card{width:100%;border:1px solid var(--line);border-radius:22px;background:var(--raise);padding:clamp(24px,3.4vw,44px);position:relative;overflow:hidden;max-height:calc(100vh - 150px);overflow-y:auto}
.panel-card::before{content:attr(data-act);position:absolute;top:18px;right:24px;font-family:var(--disp);font-weight:800;font-size:clamp(60px,8vw,110px);letter-spacing:-.04em;line-height:1;color:transparent;-webkit-text-stroke:1px rgba(143,160,255,.16);pointer-events:none}
.pc-tag{font-family:var(--mono);font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--link)}
.pc-title{font-family:var(--disp);font-weight:700;font-size:clamp(24px,3.2vw,40px);letter-spacing:-.02em;line-height:1.05;margin:12px 0 6px;max-width:17ch}
.pc-sub{font-family:var(--mono);font-size:11.5px;color:var(--dim);letter-spacing:.12em;text-transform:uppercase}
.pc-acts{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:26px}
.pc-act h4{font-family:var(--mono);font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;color:var(--signal);margin-bottom:8px;font-weight:500}
.pc-act p{font-size:13.8px;color:var(--mute)}
.pc-act p b{color:var(--text)}
.pc-ai{margin-top:20px;border:1px solid rgba(255,196,107,.25);background:rgba(255,196,107,.06);border-radius:12px;padding:14px 16px;font-size:13.5px;color:var(--mute)}
.pc-ai b{display:block;font-family:var(--mono);font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;color:var(--signal);margin-bottom:6px;font-weight:500}
.pc-foot{display:flex;justify-content:space-between;align-items:center;margin-top:22px;flex-wrap:wrap;gap:12px}
.pc-metric{font-family:var(--disp);font-weight:700;font-size:clamp(28px,3.4vw,42px);color:var(--up);letter-spacing:-.02em}
.pc-metric small{display:block;font-family:var(--mono);font-weight:400;font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--dim)}
.pc-chips{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}
.hs-progress{position:absolute;bottom:26px;left:50%;transform:translateX(-50%);z-index:3;display:flex;align-items:center;gap:12px;font-family:var(--mono);font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--dim)}
.hs-progress .bar{width:130px;height:2px;background:rgba(143,160,255,.18);border-radius:2px;overflow:hidden}
.hs-progress .bar i{display:block;height:100%;width:0%;background:var(--signal)}
.loop-grid{display:grid;grid-template-columns:minmax(280px,440px) 1fr;gap:64px;align-items:center;width:100%}
.orbit-stage{perspective:900px;display:grid;place-items:center}
.orbit{position:relative;width:min(360px,72vw);height:min(360px,72vw);transform-style:preserve-3d;transform:rotateX(62deg);will-change:transform}
.orbit .ring{position:absolute;inset:0;border-radius:50%;border:1px dashed var(--line2)}
.orbit .ring.r2{inset:13%;border-style:solid;border-color:var(--line);opacity:.7}
.orbit .node{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotateZ(var(--a)) translateY(calc(min(360px,72vw)/-2)) rotateZ(calc(var(--a)*-1)) rotateX(-62deg)}
.orbit .node b{display:block;font-family:var(--mono);font-weight:500;font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--mute);background:var(--raise2);border:1px solid var(--line2);border-radius:99px;padding:8px 15px;white-space:nowrap;box-shadow:0 10px 30px rgba(0,0,0,.5);transition:all .35s}
.orbit .node.on b{color:var(--ink);background:var(--signal);border-color:var(--signal);box-shadow:0 0 26px rgba(255,196,107,.4)}
.orbit-core{position:absolute;top:50%;left:50%;text-align:center;transform:translate(-50%,-50%) rotateX(-62deg)}
.orbit-core .c1{font-family:var(--disp);font-weight:700;font-size:24px;color:var(--signal);letter-spacing:-.02em}
.orbit-core .c2{font-family:var(--mono);font-size:10px;letter-spacing:.26em;text-transform:uppercase;color:var(--dim);margin-top:4px}
.loop-steps{display:flex;flex-direction:column;gap:12px}
.lstep{border:1px solid var(--line);border-radius:14px;background:var(--raise);padding:16px 20px;display:grid;grid-template-columns:auto 1fr;gap:16px;align-items:start;opacity:.28;transform:translateX(16px);transition:all .45s var(--ease)}
.lstep.on{opacity:1;transform:none;border-color:rgba(255,196,107,.4);background:var(--raise2)}
.lstep .n{font-family:var(--mono);font-size:11.5px;color:var(--signal);border:1px solid rgba(255,196,107,.35);width:30px;height:30px;border-radius:9px;display:grid;place-items:center;margin-top:2px}
.lstep h3{font-family:var(--disp);font-size:16.5px;font-weight:600}
.lstep h3 span{font-family:var(--mono);font-weight:400;font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--dim);margin-left:9px}
.lstep p{font-size:13.5px;color:var(--mute);margin-top:3px}
.lstep p b{color:var(--text)}
.mult-stage{width:100%;text-align:center}
.mult-svg{width:100%;max-width:1060px;margin:0 auto;display:block}
.mult-svg text{font-family:var(--mono);letter-spacing:.14em;text-transform:uppercase}
.mult-svg .in-label{fill:var(--mute);font-size:12px}
.mult-svg .thread{fill:none;stroke-width:1.6;stroke-linecap:round}
.mult-svg .out-g{opacity:0;transition:opacity .5s}
.mult-svg .out-label{fill:var(--text);font-size:12.5px}
.mult-svg .out-num{font-family:var(--disp);font-weight:700;font-size:30px;fill:var(--up);letter-spacing:0;text-transform:none}
.mult-svg .core-t1{font-family:var(--disp);font-weight:700;font-size:17px;fill:var(--text);letter-spacing:-.01em;text-transform:none}
.mult-svg .core-t2{fill:var(--dim);font-size:9.5px}
.mult-cap{font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--dim);margin-top:6px}
.mult-cap b{color:var(--signal);font-weight:500}
.skill-strip{display:flex;flex-wrap:wrap;gap:9px;justify-content:center;max-width:860px;margin:30px auto 0}
.epi{min-height:88vh;display:flex;align-items:center}
.epi h2{font-family:var(--disp);font-weight:700;font-size:clamp(38px,7vw,92px);letter-spacing:-.03em;line-height:1;max-width:14ch}
.epi h2 .hot{color:var(--signal)}
.epi p{color:var(--mute);max-width:54ch;margin-top:22px;font-size:clamp(15px,1.4vw,17.5px)}
.epi-row{display:flex;flex-wrap:wrap;gap:14px;margin-top:38px}
.btn-big{font-family:var(--mono);font-size:13.5px;text-decoration:none;background:var(--signal);color:var(--ink);padding:15px 28px;border-radius:99px;font-weight:500;display:inline-flex;gap:11px;align-items:center;transition:transform .3s var(--ease),box-shadow .3s}
.btn-big:hover{transform:translateY(-3px) scale(1.02);box-shadow:0 16px 44px rgba(255,196,107,.3)}
.btn-ghost{font-family:var(--mono);font-size:12.5px;text-decoration:none;color:var(--mute);border:1px solid var(--line2);padding:14px 24px;border-radius:99px;transition:all .3s}
.btn-ghost:hover{color:var(--text);border-color:var(--text)}
footer{padding:24px clamp(22px,5.5vw,80px);border-top:1px solid var(--line);display:flex;justify-content:space-between;gap:14px;flex-wrap:wrap;font-family:var(--mono);font-size:11px;color:var(--dim);letter-spacing:.08em;max-width:1240px;margin:0 auto}
footer .g{color:var(--up)}
@media(max-width:980px){.ch1-grid{grid-template-columns:1fr;gap:40px}.cross-stage{grid-template-columns:1fr;gap:26px}.cross-right{height:340px}.artifact{height:330px;width:min(340px,100%)}.loop-grid{grid-template-columns:1fr;gap:30px}.orbit-stage{order:-1}.pc-acts{grid-template-columns:1fr}.panel{width:90vw}.scene .pin{align-items:flex-start;padding-top:70px}.hscroll .pin{padding-top:0;align-items:stretch}}
@media(max-width:640px){.cross-q p{display:none}.cross-word span{font-size:26vw}.lstep p{font-size:12.5px}.panel{padding:70px 14px 46px}.panel-card{max-height:calc(100vh - 130px)}}
@media(prefers-reduced-motion:reduce){*{animation:none!important;transition-duration:.01ms!important}.rv{opacity:1;transform:none}}
`;

export default function About() {
  useEffect(() => {
    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
    const noMotion = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    const enhanced = !noMotion;

    if (!enhanced) {
      document.body.classList.add('static');
    }

    const rvObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            rvObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    document.querySelectorAll('.rv').forEach((el) => rvObs.observe(el));

    document.querySelectorAll('.wr').forEach((paragraph) => {
      const fragment = document.createDocumentFragment();
      [...paragraph.childNodes].forEach((node) => {
        if (node.nodeType === 3) {
          node.textContent.split(/\s+/).filter(Boolean).forEach((word) => {
            const span = document.createElement('span');
            span.className = 'w';
            span.textContent = `${word} `;
            fragment.appendChild(span);
          });
        } else if (node.nodeType === 1) {
          const className = node.tagName === 'I' ? node.className || '' : '';
          node.textContent.split(/\s+/).filter(Boolean).forEach((word) => {
            const span = document.createElement('span');
            span.className = `w ${className}`.trim();
            span.textContent = `${word} `;
            fragment.appendChild(span);
          });
        }
      });
      paragraph.innerHTML = '';
      paragraph.appendChild(fragment);
    });

    const strokes = [...document.querySelectorAll('.sd')].map((element) => {
      let length = 300;
      try {
        length = element.getTotalLength();
      } catch {
        // ignore
      }
      element.style.strokeDasharray = length;
      element.style.strokeDashoffset = length;
      return { element, length };
    });

    const threads = [...document.querySelectorAll('[data-th]')].map((element) => {
      const length = element.getTotalLength();
      element.style.strokeDasharray = length;
      element.style.strokeDashoffset = length;
      return { element, length };
    });

    const outs = [...document.querySelectorAll('[data-out]')].map((element) => {
      const length = element.getTotalLength();
      element.style.strokeDasharray = length;
      element.style.strokeDashoffset = length;
      return { element, length };
    });

    const outGs = [...document.querySelectorAll('[data-og]')];
    const multCore = document.getElementById('multCore');
    const multCap = document.getElementById('multCap');

    const sceneProgress = (scene) => {
      const rect = scene.getBoundingClientRect();
      const total = scene.offsetHeight - window.innerHeight;
      if (total <= 0) return 0;
      return clamp((-rect.top) / total, 0, 1);
    };

    const scenes = {};
    document.querySelectorAll('[data-scene]').forEach((scene) => {
      scenes[scene.dataset.scene] = scene;
    });

    const wr1 = [...document.querySelectorAll('#wr1 .w')];
    const updateChapterOne = (progress) => {
      const count = wr1.length;
      wr1.forEach((word, index) => {
        word.style.opacity = clamp(progress * 1.15 * count - index, 0.13, 1);
      });
      strokes.forEach((stroke, index) => {
        const local = clamp(progress * strokes.length * 1.35 - index * 0.8, 0, 1);
        stroke.element.style.strokeDashoffset = stroke.length * (1 - local);
      });
    };

    const arts = [...document.querySelectorAll('.artifact')];
    const crossQuestions = [...document.querySelectorAll('.cross-q')];
    const crossWords = [...document.querySelectorAll('[data-cw]')];
    const updateChapterTwo = (progress) => {
      const phase = progress * 2.6;
      const index = clamp(Math.round(clamp(phase, 0, 2)), 0, 2);
      arts.forEach((art, artIndex) => {
        const delta = clamp(phase, 0, 2) - artIndex;
        const visibility = clamp(1 - Math.abs(delta), 0, 1);
        art.style.opacity = visibility;
        art.style.transform = `rotateY(${delta * -55}deg) translateX(${delta * -60}px) translateZ(${(visibility - 1) * 140}px)`;
        art.style.zIndex = Math.round(visibility * 10);
      });
      crossQuestions.forEach((question, questionIndex) => {
        question.classList.toggle('on', questionIndex === index);
      });
      crossWords.forEach((word, wordIndex) => {
        const delta = clamp(phase, 0, 2) - wordIndex;
        const visibility = clamp(1 - Math.abs(delta) * 1.4, 0, 1);
        word.style.opacity = visibility * 0.9;
        word.style.transform = `translateY(${delta * -70}px) scale(${0.92 + visibility * 0.08})`;
      });
    };

    const htrack = document.getElementById('htrack');
    const hsBar = document.getElementById('hsBar');
    const hsCount = document.getElementById('hsCount');
    const updateChapterThree = (progress) => {
      const max = htrack.scrollWidth - window.innerWidth;
      htrack.style.transform = `translateX(${-progress * max}px)`;
      hsBar.style.width = `${progress * 100}%`;
      hsCount.textContent = `${1 + Math.round(progress * 3)} / 4`;
    };

    const orbit = document.getElementById('orbit');
    const orbitCore = document.querySelector('.orbit-core');
    const orbitNodes = [...document.querySelectorAll('[data-ln]')];
    const lsteps = [...document.querySelectorAll('[data-ls]')];
    const updateChapterFour = (progress) => {
      const rotation = progress * 360;
      orbit.style.transform = `rotateX(62deg) rotateZ(${-rotation}deg)`;
      orbitNodes.forEach((node) => {
        const angle = parseFloat(node.style.getPropertyValue('--a'));
        node.style.transform = `translate(-50%,-50%) rotateZ(${angle}deg) translateY(calc(min(360px,72vw)/-2)) rotateZ(${-(angle - rotation)}deg) rotateX(-62deg)`;
      });
      orbitCore.style.transform = `translate(-50%,-50%) rotateX(-62deg) rotateZ(${rotation}deg)`;
      const active = clamp(Math.floor(progress * 5.01), 0, 4);
      lsteps.forEach((step, index) => step.classList.toggle('on', index <= active));
      orbitNodes.forEach((node, index) => node.classList.toggle('on', index === active));
    };

    const updateChapterFive = (progress) => {
      threads.forEach((thread, index) => {
        const local = clamp(progress * 2.4 - index * 0.14, 0, 1);
        thread.element.style.strokeDashoffset = thread.length * (1 - local);
      });
      const coreValue = clamp((progress - 0.42) / 0.14, 0, 1);
      multCore.setAttribute('opacity', coreValue);
      outs.forEach((out, index) => {
        const local = clamp((progress - 0.55) * 3 - index * 0.18, 0, 1);
        out.element.style.strokeDashoffset = out.length * (1 - local);
      });
      outGs.forEach((group, index) => {
        group.style.opacity = clamp((progress - 0.68) * 4 - index * 0.5, 0, 1);
      });
      multCap.textContent = progress < 0.45 ? 'five skills, entering the same node…' : progress < 0.7 ? 'no handoffs. no translation loss. one owner.' : 'what POLO got back →';
    };

    const heroCard = document.getElementById('heroCard');
    const hero = document.getElementById('hero');
    const glyphs = [...document.querySelectorAll('.glyph')];
    if (window.matchMedia('(pointer:fine)').matches && enhanced) {
      let frame = null;
      hero.addEventListener('mousemove', (event) => {
        if (frame) return;
        frame = window.requestAnimationFrame(() => {
          const rect = hero.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          heroCard.style.transform = `rotateY(${x * 6}deg) rotateX(${y * -5}deg)`;
          glyphs.forEach((glyph) => {
            const depth = parseFloat(glyph.dataset.depth);
            glyph.style.transform = `translate(${x * -30 * depth}px, ${y * -24 * depth}px)`;
          });
          frame = null;
        });
      });
      hero.addEventListener('mouseleave', () => {
        heroCard.style.transform = '';
      });
    }

    const routeFill = document.getElementById('routeFill');
    const routePacket = document.getElementById('routePacket');
    const routeLine = document.getElementById('routeLine');
    const chNow = document.getElementById('chNow');
    const chSections = [...document.querySelectorAll('[data-ch]')];

    if (routeLine) {
      chSections.forEach((section) => {
        const tick = document.createElement('button');
        tick.className = 'route-tick';
        tick.dataset.ch = section.dataset.ch;
        tick.setAttribute('aria-label', `Jump to ${section.dataset.ch}`);
        tick.addEventListener('click', () => {
          section.scrollIntoView({ behavior: enhanced ? 'smooth' : 'auto' });
        });
        routeLine.appendChild(tick);
      });
    }

    const placeTicks = () => {
      if (!routeLine || chSections.length === 0) return;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      [...routeLine.querySelectorAll('.route-tick')].forEach((tick, index) => {
        const section = chSections[index];
        if (!section) return;
        const rect = section.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        tick.style.left = `${clamp((top / docHeight) * 100, 0, 100)}%`;
      });
    };

    placeTicks();
    window.addEventListener('resize', placeTicks);

    document.querySelectorAll('[data-go]').forEach((button) => {
      const target = document.getElementById(button.dataset.go);
      if (!target) return;
      button.addEventListener('click', () => {
        target.scrollIntoView({ behavior: enhanced ? 'smooth' : 'auto' });
      });
    });

    let lastY = -1;
    let rafId;
    const tick = () => {
      if (window.scrollY !== lastY) {
        lastY = window.scrollY;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = clamp(window.scrollY / documentHeight, 0, 1);

        routeFill.style.width = `${progress * 100}%`;
        routePacket.style.left = `${progress * 100}%`;

        let current = 'Prologue';
        chSections.forEach((section) => {
          if (section.getBoundingClientRect().top < window.innerHeight * 0.5) {
            current = section.dataset.ch;
          }
        });
        chNow.textContent = current;

        if (enhanced) {
          if (scenes.ch1) updateChapterOne(sceneProgress(scenes.ch1));
          if (scenes.ch2) updateChapterTwo(sceneProgress(scenes.ch2));
          if (scenes.ch3) updateChapterThree(sceneProgress(scenes.ch3));
          if (scenes.ch4) updateChapterFour(sceneProgress(scenes.ch4));
          if (scenes.ch5) updateChapterFive(sceneProgress(scenes.ch5));

          const heroProgress = clamp(window.scrollY / window.innerHeight, 0, 1);
          heroCard.style.opacity = 1 - heroProgress * 1.05;
          heroCard.style.filter = `blur(${heroProgress * 5}px)`;
          heroCard.style.translate = `0 ${heroProgress * -60}px`;
        }
      }
      rafId = window.requestAnimationFrame(tick);
    };

    if (enhanced) {
      rafId = window.requestAnimationFrame(tick);
    } else {
      wr1.forEach((word) => {
        word.style.opacity = 1;
      });
      strokes.forEach((stroke) => {
        stroke.element.style.strokeDashoffset = 0;
      });
      threads.forEach((thread) => {
        thread.element.style.strokeDashoffset = 0;
      });
      outs.forEach((out) => {
        out.element.style.strokeDashoffset = 0;
      });
      outGs.forEach((group) => {
        group.style.opacity = 1;
      });
      multCore.setAttribute('opacity', 1);
      document.querySelectorAll('.cross-q,.lstep').forEach((element) => element.classList.add('on'));
      arts.forEach((art) => {
        art.style.position = 'relative';
        art.style.opacity = 1;
        art.style.margin = '0 0 20px';
      });
      htrack.style.flexWrap = 'wrap';
      htrack.style.height = 'auto';
      window.addEventListener(
        'scroll',
        () => {
          const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = clamp(window.scrollY / documentHeight, 0, 1);
          routeFill.style.width = `${progress * 100}%`;
          routePacket.style.left = `${progress * 100}%`;
        },
        { passive: true },
      );
    }

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', placeTicks);
      rvObs.disconnect();
      document.body.classList.remove('static');
    };
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div className="about-page">
        <div className="route">
          <a className="logo" href="#top"><i></i>PK://story</a>
          <div className="route-line" id="routeLine">
            <div className="route-fill" id="routeFill"></div>
            <div className="route-packet" id="routePacket"></div>
          </div>
          <span className="ch-now" id="chNow">Prologue</span>
          <a className="cta" href="#epi">Say hello →</a>
        </div>

        <main id="top">
          <section className="hero" id="hero" data-ch="Prologue">
            <span className="glyph" data-depth="0.9" style={{ top: '16%', left: '8%' }}>◇ polarin-ds.fig</span>
            <span className="glyph" data-depth="0.5" style={{ top: '24%', right: '10%' }}>□ lightstorm-ux.md</span>
            <span className="glyph" data-depth="1.3" style={{ top: '66%', left: '12%' }}>▷ vercel --prod</span>
            <span className="glyph" data-depth="0.7" style={{ top: '74%', right: '16%' }}>↑ routing maps ×3</span>
            <span className="glyph" data-depth="1.1" style={{ top: '44%', right: '4%' }}>↓ vendor dep −50%</span>
            <span className="glyph" data-depth="0.4" style={{ top: '58%', left: '44%' }}>✦ figma --vars</span>
            <div className="wrap hero-inner">
              <div id="heroCard">
                <p className="hero-kicker rv">Prashant Kumar · Senior Product Designer at Lightstorm · Five chapters</p>
                <h1 className="rv d1">
                  <span className="l1">Every complex</span><br />
                  <span className="l2">product has a story.</span><br />
                  <span className="l3">I shape the plot.</span>
                </h1>
                <p className="hero-sub rv d2">
                  I lead UX/UI design system work, build intricate data visualizations, and design interactive routing topology maps for the <b>Polarin Network-as-a-Service</b> platform. My work turns dense systems into calm, useful experiences.
                </p>
                <div className="hero-toc rv d3">
                  <button data-go="ch1">Ch.1 The Foundation</button>
                  <button data-go="ch2">Ch.2 The Crossing</button>
                  <button data-go="ch3">Ch.3 The Platform</button>
                  <button data-go="ch4">Ch.4 The Loop</button>
                  <button data-go="ch5">Ch.5 The Multiplier</button>
                </div>
              </div>
            </div>
            <div className="hero-scroll"><i></i>scroll</div>
          </section>

          <section id="ch1" data-ch="Ch.1 — The Foundation">
            <div className="wrap ch-head">
              <p className="ch-num rv"><b>Chapter 01</b> · Design education → early systems craft</p>
              <h2 className="ch-title rv d1">The <span>Foundation.</span></h2>
              <div className="ch1-creds rv d2">
                <span className="chip">B.Des · FDDI Noida</span>
                <span className="chip">UI/UX design foundations</span>
                <span className="chip">Systems thinking + product craft</span>
              </div>
            </div>
            <div className="scene" data-scene="ch1" style={{ height: '220vh' }}>
              <div className="pin">
                <div className="wrap ch1-grid">
                  <p className="wr" id="wr1">
                    I learned early that the clearest interfaces often come from the deepest understanding of the system behind them. Great product work pairs visual craft with strong reasoning, and that discipline shaped how I approach design systems and data-first experiences.
                  </p>
                  <div className="blueprint">
                    <svg viewBox="0 0 460 340" aria-hidden="true">
                      <rect className="draw sd" x="10" y="10" width="440" height="320" rx="16" />
                      <line className="draw faint sd" x1="10" y1="58" x2="450" y2="58" />
                      <circle className="draw sd" cx="36" cy="34" r="9" />
                      <line className="draw faint sd" x1="60" y1="34" x2="150" y2="34" />
                      <line className="draw faint sd" x1="330" y1="34" x2="430" y2="34" />
                      <rect className="draw sd" x="34" y="82" width="250" height="90" rx="10" />
                      <line className="draw faint sd" x1="52" y1="108" x2="240" y2="108" />
                      <line className="draw faint sd" x1="52" y1="128" x2="200" y2="128" />
                      <rect className="draw amber sd" x="52" y="142" width="86" height="18" rx="9" />
                      <rect className="draw sd" x="304" y="82" width="122" height="90" rx="10" />
                      <path className="draw amber sd" d="M316 156 L336 128 L354 142 L376 108 L398 124 L414 96" />
                      <rect className="draw sd" x="34" y="196" width="120" height="104" rx="10" />
                      <rect className="draw sd" x="170" y="196" width="120" height="104" rx="10" />
                      <rect className="draw sd" x="306" y="196" width="120" height="104" rx="10" />
                      <line className="draw faint sd" x1="50" y1="224" x2="138" y2="224" />
                      <line className="draw faint sd" x1="186" y1="224" x2="274" y2="224" />
                      <line className="draw faint sd" x1="322" y1="224" x2="410" y2="224" />
                      <circle className="draw amber sd" cx="94" cy="266" r="16" />
                      <circle className="draw amber sd" cx="230" cy="266" r="16" />
                      <circle className="draw amber sd" cx="366" cy="266" r="16" />
                    </svg>
                    <p className="bp-cap">fig. 1 — design as a system, not a surface — <b>clarity first</b></p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="ch2" data-ch="Ch.2 — The Crossing">
            <div className="wrap ch-head">
              <p className="ch-num rv"><b>Chapter 02</b> · Lightstorm + Polarin</p>
              <h2 className="ch-title rv d1">The <span>Crossing.</span></h2>
              <p style={{ color: 'var(--mute)', maxWidth: '58ch', marginTop: '14px' }} className="rv d2">I moved from visual execution into design systems, product strategy, and data-rich product experiences. Each step widened the scope of the question: first, does it look right? Then, does it scale? And finally, is it the right thing for the people using it?</p>
            </div>
            <div className="scene" data-scene="ch2" style={{ height: '340vh' }}>
              <div className="pin">
                <div className="cross-word" aria-hidden="true">
                  <span data-cw="0">PIXELS</span>
                  <span data-cw="1">SYSTEMS</span>
                  <span data-cw="2">OUTCOMES</span>
                </div>
                <div className="wrap cross-stage">
                  <div className="cross-left">
                    <div className="cross-q" data-cq="0">
                      <div className="yr"><b>2022</b> · UI/UX foundations</div>
                      <h3>"Does it <em>look</em> right?"</h3>
                      <p>Built early product surfaces for enterprise experiences, sharpening the connection between visual clarity and product usefulness.</p>
                    </div>
                    <div className="cross-q" data-cq="1">
                      <div className="yr"><b>2024</b> · Design systems at scale</div>
                      <h3>"Does it <em>scale</em> right?"</h3>
                      <p>Created design system foundations using Figma variables so teams could move faster without sacrificing coherence.</p>
                    </div>
                    <div className="cross-q" data-cq="2">
                      <div className="yr"><b>2026</b> · Product leadership</div>
                      <h3>"Is it the <em>right thing</em> at all?"</h3>
                      <p>Now I shape the product context itself—working across systems, analytics, and strategy to ensure the experience solves the right problem.</p>
                    </div>
                  </div>
                  <div className="cross-right" aria-hidden="true">
                    <div className="artifact" data-art="0">
                      <div className="art-bar"><i style={{ background: 'var(--link)' }}></i>portal-module-v1.fig · first systems</div>
                      <div className="art-body">
                        <div className="wf-el bar"></div>
                        <div className="wf-el hero">MODULE / 0 → 1</div>
                        <div className="wf-row"><div className="wf-el card"></div><div className="wf-el card"></div></div>
                        <div className="wf-el btn"></div>
                      </div>
                    </div>
                    <div className="artifact" data-art="1">
                      <div className="art-bar"><i style={{ background: 'var(--rose)' }}></i>polarin-ds · tokens · components</div>
                      <div className="art-body">
                        <div className="prd-line prd-h"></div>
                        <span className="prd-tag">Tokens</span><span className="prd-tag">Components</span><span className="prd-tag">Patterns</span>
                        <div className="prd-line" style={{ width: '92%' }}></div>
                        <div className="prd-line" style={{ width: '84%' }}></div>
                        <div className="prd-line" style={{ width: '70%' }}></div>
                        <div className="prd-metric"><span>surfaces aligned</span><b>all of them</b></div>
                        <div className="prd-metric"><span>design → dev drift</span><b>▼ near zero</b></div>
                      </div>
                    </div>
                    <div className="artifact" data-art="2">
                      <div className="art-bar"><i style={{ background: 'var(--up)' }}></i>roadmap-review · portals · analytics</div>
                      <div className="art-body">
                        <div className="db-kpis">
                          <div className="db-kpi"><div className="v g">3×</div><div className="l">self-serve adoption</div></div>
                          <div className="db-kpi"><div className="v a">−40%</div><div className="l">dev handoffs</div></div>
                          <div className="db-kpi"><div className="v">−50%</div><div className="l">vendor dependency</div></div>
                        </div>
                        <div className="db-chart">
                          <i style={{ height: '30%' }}></i><i style={{ height: '42%' }}></i><i style={{ height: '38%' }}></i>
                          <i style={{ height: '56%' }}></i><i style={{ height: '64%' }}></i><i className="hot" style={{ height: '82%' }}></i>
                          <i className="hot" style={{ height: '95%' }}></i>
                        </div>
                        <div className="db-note">▲ shipped · adopted · <b>measured</b></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="cross-hint">keep scrolling — the question grows</div>
              </div>
            </div>
          </section>

          <section id="ch3" data-ch="Ch.3 — The Platform">
            <div className="scene hscroll" data-scene="ch3" style={{ height: '420vh' }}>
              <div className="pin">
                <div className="htrack" id="htrack">
                  <div className="panel">
                    <div className="panel-intro">
                      <p className="ch-num"><b>Chapter 03</b> · Polarin NaaS platform</p>
                      <h2 className="ch-title" style={{ marginTop: '12px' }}>The <span>Platform.</span></h2>
                      <p style={{ color: 'var(--mute)', marginTop: '18px', maxWidth: '44ch' }}>Three problems that shaped the work — told in three acts. Scroll sideways and watch the story move the way real product roadmaps do.</p>
                    </div>
                  </div>

                  <div className="panel">
                    <article className="panel-card" data-act="I">
                      <span className="pc-tag">Case I · Foundation</span>
                      <h3 className="pc-title">A platform that started as a blank Figma file.</h3>
                      <p className="pc-sub">Polarin · customer portal & design system</p>
                      <div className="pc-acts">
                        <div className="pc-act"><h4>Act I · Tension</h4><p>A NaaS platform with <b>no shared language</b> and no mature surface area — and the work needed to begin from first principles.</p></div>
                        <div className="pc-act"><h4>Act II · Turn</h4><p>Took customer-facing modules <b>0 → 1</b> while building the design system beneath them, using Figma variables to scale the language.</p></div>
                        <div className="pc-act"><h4>Act III · Resolution</h4><p>The system became the shared vocabulary across design, engineering, and iteration — making each new surface easier to ship.</p></div>
                      </div>
                      <div className="pc-ai"><b>AI in this chapter</b>Design systems are a prompt library you can see. By codifying structure in Figma and code, the same logic can be extended into rapid prototyping and production-adjacent frontends.</div>
                      <div className="pc-foot">
                        <div className="pc-metric">0 → 1<small>platform + system</small></div>
                        <div className="pc-chips"><span className="chip">0→1 delivery</span><span className="chip">design systems</span><span className="chip">IA & flows</span></div>
                      </div>
                    </article>
                  </div>

                  <div className="panel">
                    <article className="panel-card" data-act="II">
                      <span className="pc-tag">Case II · Adoption</span>
                      <h3 className="pc-title">Teaching customers to serve themselves.</h3>
                      <p className="pc-sub">Polarin · developer & customer portals</p>
                      <div className="pc-acts">
                        <div className="pc-act"><h4>Act I · Tension</h4><p>Capability existed in the platform, but the path to value was still too hidden. Customers needed clarity and confidence.</p></div>
                        <div className="pc-act"><h4>Act II · Turn</h4><p>Rebuilt roadmap priorities around <b>support data, usage analytics, and customer interviews</b>, then redesigned the highest-friction flows.</p></div>
                        <div className="pc-act"><h4>Act III · Resolution</h4><p>Self-service adoption rose sharply because the portal stopped being a brochure and became a usable front door.</p></div>
                      </div>
                      <div className="pc-ai"><b>AI in this chapter</b>Interview notes, support data, and usage signals were synthesized into friction themes I could rank and refine before designing the next iteration.</div>
                      <div className="pc-foot">
                        <div className="pc-metric">3×<small>self-service adoption</small></div>
                        <div className="pc-chips"><span className="chip">customer discovery</span><span className="chip">analytics</span><span className="chip">metrics-driven</span></div>
                      </div>
                    </article>
                  </div>

                  <div className="panel">
                    <article className="panel-card" data-act="III">
                      <span className="pc-tag">Case III · AI-native delivery</span>
                      <h3 className="pc-title">Cutting the distance between idea and production.</h3>
                      <p className="pc-sub">Polarin · frontend delivery pipeline</p>
                      <div className="pc-acts">
                        <div className="pc-act"><h4>Act I · Tension</h4><p>Frontend changes flowed through slow, translated handoffs and the loop became longer than the product problem demanded.</p></div>
                        <div className="pc-act"><h4>Act II · Turn</h4><p>Started shipping frontends faster with <b>Figma, Claude, Cursor, and Vercel</b> — prototypes became the spec and then the shipped thing.</p></div>
                        <div className="pc-act"><h4>Act III · Resolution</h4><p>Vendor dependency fell, handoffs reduced, and the loop closed: the person who found the problem could help ship the fix.</p></div>
                      </div>
                      <div className="pc-ai"><b>AI in this chapter</b>This one is the AI chapter. Claude + Cursor for build, Figma and Figma Make for design-to-code, Vercel for delivery. PRD to production-adjacent frontend — one owner, days not sprints.</div>
                      <div className="pc-foot">
                        <div className="pc-metric">~50%<small>vendor dependency cut</small></div>
                        <div className="pc-chips"><span className="chip">Claude</span><span className="chip">Cursor</span><span className="chip">Figma → code</span><span className="chip">Vercel</span></div>
                      </div>
                    </article>
                  </div>
                </div>
                <div className="hs-progress"><span>route</span><span className="bar"><i id="hsBar"></i></span><span id="hsCount">1 / 4</span></div>
              </div>
            </div>
          </section>

          <section id="ch4" data-ch="Ch.4 — The Loop">
            <div className="wrap ch-head">
              <p className="ch-num rv"><b>Chapter 04</b> · How I work now</p>
              <h2 className="ch-title rv d1">The <span>Loop.</span></h2>
              <p style={{ color: 'var(--mute)', maxWidth: '58ch', marginTop: '14px' }} className="rv d2">One person, end to end — AI collapsing the distance between a question and a shipped answer. Scroll to run one full cycle; the orbit turns with you.</p>
            </div>
            <div className="scene" data-scene="ch4" style={{ height: '320vh' }}>
              <div className="pin">
                <div className="wrap loop-grid">
                  <div className="orbit-stage" aria-hidden="true">
                    <div className="orbit" id="orbit">
                      <div className="ring"></div><div className="ring r2"></div>
                      <div className="node" style={{ '--a': '0deg' }} data-ln="0"><b>Discover</b></div>
                      <div className="node" style={{ '--a': '72deg' }} data-ln="1"><b>Define</b></div>
                      <div className="node" style={{ '--a': '144deg' }} data-ln="2"><b>Prototype</b></div>
                      <div className="node" style={{ '--a': '216deg' }} data-ln="3"><b>Validate</b></div>
                      <div className="node" style={{ '--a': '288deg' }} data-ln="4"><b>Deploy</b></div>
                      <div className="orbit-core"><div className="c1">AI</div><div className="c2">in the loop</div></div>
                    </div>
                  </div>
                  <div className="loop-steps">
                    <div className="lstep" data-ls="0"><div className="n">01</div><div>
                      <h3>Discover <span>hours, not weeks</span></h3>
                      <p>Support data, usage analytics, and customer interviews — synthesized with <b>Claude</b> into friction themes and jobs-to-be-done I can interrogate, rank, and challenge.</p></div></div>
                    <div className="lstep" data-ls="1"><div className="n">02</div><div>
                      <h3>Define <span>PRDs that argue back</span></h3>
                      <p><b>PRDs, user stories, and OKRs</b> drafted with AI as a sparring partner — pressure-testing assumptions before engineering reads a word.</p></div></div>
                    <div className="lstep" data-ls="2"><div className="n">03</div><div>
                      <h3>Prototype <span>high-fidelity, working</span></h3>
                      <p>Rapid POCs on the Polarin design system with Figma, Figma Make, Cursor, and Lovable — turning ideas into testable experiences quickly.</p></div></div>
                    <div className="lstep" data-ls="3"><div className="n">04</div><div>
                      <h3>Validate <span>test the real thing</span></h3>
                      <p>Customers click actual software in week one. Signals sharpen, feedback gets honest, and bad ideas die cheap before they cost a sprint.</p></div></div>
                    <div className="lstep" data-ls="4"><div className="n">05</div><div>
                      <h3>Deploy <span>evidence, not opinions</span></h3>
                      <p>Frontend changes shipped directly via Claude + Figma in VS Code, deployed on Vercel. Handoffs become head starts, then the loop turns again.</p></div></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="ch5" data-ch="Ch.5 — The Multiplier">
            <div className="wrap ch-head" style={{ textAlign: 'center' }}>
              <p className="ch-num rv" style={{ justifyContent: 'center' }}><b>Chapter 05</b> · Why it matters to an org</p>
              <h2 className="ch-title rv d1">The <span>Multiplier.</span></h2>
              <p style={{ color: 'var(--mute)', maxWidth: '60ch', margin: '14px auto 0' }} className="rv d2">Five disciplines usually live in five people, five backlogs, and five handoffs. Scroll — and watch what happens when they route through one owner.</p>
            </div>
            <div className="scene" data-scene="ch5" style={{ height: '300vh' }}>
              <div className="pin">
                <div className="wrap mult-stage">
                  <svg className="mult-svg" viewBox="0 0 1060 480" aria-hidden="true">
                    <path className="thread" data-th style={{ stroke: 'var(--link)' }} d="M150 70  C 330 70,  330 226, 500 232" />
                    <path className="thread" data-th style={{ stroke: 'var(--rose)' }} d="M150 155 C 320 155, 330 230, 500 236" />
                    <path className="thread" data-th style={{ stroke: 'var(--signal)' }} d="M150 240 C 320 240, 330 240, 500 240" />
                    <path className="thread" data-th style={{ stroke: 'var(--up)' }} d="M150 325 C 320 325, 330 250, 500 244" />
                    <path className="thread" data-th style={{ stroke: '#B79CFF' }} d="M150 410 C 330 410, 330 254, 500 248" />
                    <text className="in-label" x="140" y="74" textAnchor="end">Design craft</text>
                    <text className="in-label" x="140" y="159" textAnchor="end">Design systems</text>
                    <text className="in-label" x="140" y="244" textAnchor="end">Customer discovery</text>
                    <text className="in-label" x="140" y="329" textAnchor="end">Data & analytics</text>
                    <text className="in-label" x="140" y="414" textAnchor="end">AI × frontend</text>
                    <g id="multCore" opacity="0">
                      <circle cx="545" cy="240" r="52" fill="rgba(255,196,107,.08)" stroke="var(--signal)" strokeWidth="1.4" />
                      <circle cx="545" cy="240" r="66" fill="none" stroke="rgba(255,196,107,.25)" strokeDasharray="3 7" />
                      <text className="core-t1" x="545" y="236" textAnchor="middle">One PM</text>
                      <text className="core-t2" x="545" y="254" textAnchor="middle">END TO END</text>
                    </g>
                    <path className="thread" data-out style={{ stroke: 'rgba(92,224,168,.7)' }} d="M612 232 C 740 210, 760 110, 880 96" />
                    <path className="thread" data-out style={{ stroke: 'rgba(92,224,168,.7)' }} d="M612 240 C 760 240, 760 240, 880 240" />
                    <path className="thread" data-out style={{ stroke: 'rgba(92,224,168,.7)' }} d="M612 248 C 740 270, 760 370, 880 384" />
                    <g className="out-g" data-og>
                      <text className="out-num" x="895" y="88">3×</text>
                      <text className="out-label" x="895" y="112">self-service adoption</text>
                    </g>
                    <g className="out-g" data-og>
                      <text className="out-num" x="895" y="234">−50%</text>
                      <text className="out-label" x="895" y="258">outsourced vendor dependency</text>
                    </g>
                    <g className="out-g" data-og>
                      <text className="out-num" x="895" y="378">−40%</text>
                      <text className="out-label" x="895" y="402">dev handoffs per feature</text>
                    </g>
                  </svg>
                  <p className="mult-cap" id="multCap">five skills, entering the same node…</p>
                  <div className="skill-strip">
                    <span className="chip">product strategy</span><span className="chip">PRDs & user stories</span><span className="chip">roadmap planning</span>
                    <span className="chip">OKRs</span><span className="chip">stakeholder management</span><span className="chip">customer discovery</span>
                    <span className="chip">0→1 delivery</span><span className="chip">AI-assisted prototyping</span><span className="chip">rapid POC</span>
                    <span className="chip">design systems</span><span className="chip">cross-functional delivery</span><span className="chip">metrics-driven decisions</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="epi" id="epi" data-ch="Epilogue">
            <div className="wrap">
              <p className="eyebrow rv">Epilogue · Your move</p>
              <h2 className="rv d1">The next chapter is <span className="hot">unwritten.</span></h2>
              <p className="rv d2">Enterprise B2B, 5+ years, and one conviction: product, design, and AI-speed delivery should be one job, not three. If you're building something that agrees — let's talk.</p>
              <div className="epi-row rv d3">
                <a className="btn-big" href="mailto:hello@prashant.design">hello@prashant.design <span aria-hidden="true">→</span></a>
                <a className="btn-ghost" href="#">LinkedIn</a>
                <a className="btn-ghost" href="#">prashantfolio.in</a>
              </div>
            </div>
          </section>
        </main>

        <footer>
          <span>© 2026 Prashant Kumar · Gurugram / New Delhi, IN</span>
          <span><span className="g">●</span> written, prototyped & shipped with AI in the loop</span>
        </footer>
      </div>
    </>
  );
}
