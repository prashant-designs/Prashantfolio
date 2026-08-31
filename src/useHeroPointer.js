import { useEffect } from 'react';

/* THE HERO POINTER LAYER - the one cursor interaction an opening fold has, and
 * the only part of PAGE HERO RECIPE (src/index.css) that is JS rather than CSS.
 *
 * It does two things off one rAF-throttled mousemove read of the fold's own
 * bounding box, expressed as -0.5..0.5 fractions of it:
 *
 *   TILT     the fold itself gets --hero-tilt-y = x * 5deg and
 *            --hero-tilt-x = y * -4deg written onto it as custom properties.
 *            Those inherit, and .hero-tilt in index.css is the rule that spends
 *            them: `rotateY(var(--hero-tilt-y)) rotateX(var(--hero-tilt-x))`.
 *            So the hook publishes the lean and the stylesheet decides what
 *            leans - see WHY THE TILT IS A CUSTOM PROPERTY below.
 *   DRIFT    every [data-depth] element inside the fold gets
 *            translate(x * depth, y * depth) px, so decoration set at
 *            different depths separates as the cursor crosses the fold.
 *            `data-depth` is the per-element amount; the default is 20.
 *
 * WHY THIS IS ONE MODULE AND NOT FOUR COPIES. The house habit is small hooks
 * living inline in whichever file uses them - useStackFade, useTypewriter,
 * useGlobalTheme, and useReveal twice over - and that habit is right when two
 * pages happen to want the same *shape* of effect. This is the opposite case:
 * the four folds do not happen to want the same numbers, they are REQUIRED to
 * agree on them, because the whole point of the recipe is that a reader moving
 * between two pages meets one interaction and not four. Four copies of 5deg /
 * -4deg / 20 is precisely the drift PAGE HERO RECIPE was written to undo (four
 * heroes, four answers to the same six questions), so the numbers are declared
 * once, here, and the pages import them. It sits at src/ root beside App.jsx
 * and index.css - the other two things that are shared by the whole site -
 * rather than opening a src/hooks/ directory for a single file.
 *
 * WHY THE TILT IS A CUSTOM PROPERTY AND NOT A REF. It used to be a second
 * argument - `useHeroPointer(heroRef, tiltRef)` - and the hook wrote
 * `style.transform` straight onto that one element. One ref is one tilting
 * element per fold, and that ceiling is what put three of the four folds in the
 * wrong place: My Journey handed the ref to #heroCard, the card its whole
 * eyebrow/headline/lede/CTA sits in, so its COPY leaned; About, Current Project
 * and Other Projects each handed it to their motif (the portrait, the stacked
 * panes, the terminal panel), so on those three the only thing that answered
 * the cursor was a decoration in the corner while the words a reader is
 * actually looking at sat dead still. Same hook, same numbers, and still four
 * different interactions - which is the exact failure PAGE HERO RECIPE exists
 * to undo.
 *
 * Publishing the two angles as inherited custom properties on the fold fixes
 * that by taking the choice away from the hook. The hook's job is the one thing
 * only JS can do - measure the cursor against the fold - and "which elements
 * lean" goes back to being a styling question answered in index.css, where
 * every other styling question on this site is answered. A fold can now have
 * one tilting element or three, added or removed in markup alone, with no JS
 * change and no chance of two of them disagreeing: they are all reading the
 * same two numbers off the same ancestor, not each getting their own write.
 * (What each fold actually spends them on is listed under .hero-tilt.)
 *
 * WHAT IT DELIBERATELY DOES NOT DO:
 *
 *   - It does not run on a coarse pointer. `(pointer:fine)` is checked before
 *     anything is attached, so on a phone or tablet there is no listener, no
 *     rAF, and no transform ever written - a tilt that cannot be aimed is not
 *     an interaction, it is jitter.
 *   - It does not run under prefers-reduced-motion. Same gate, same place: the
 *     listener is never attached rather than attached-and-neutered, so reduced
 *     motion costs nothing instead of costing a suppressed callback per frame.
 *     (My Journey's original version of this effect checked the pointer but not
 *     the motion setting - that gap is closed here rather than copied.)
 *   - It does not write `transform` on anything but the DRIFTERS, and on those
 *     it writes the whole property. So no [data-depth] element may carry a base
 *     transform of its own: the transform channel on those elements belongs to
 *     this hook, which is why the chips' coordinates are top/right rather than
 *     a translate, and why .cp-motif keeps its translateY(-50%) placement on
 *     the wrapper outside the panes that drift. The tilt has no such rule any
 *     more - it is a custom property, so .hero-tilt's transform is an ordinary
 *     CSS declaration that a later rule can compose or override normally.
 *   - It does not tilt a [data-depth] element. `:not(.hero-tilt)` keeps the two
 *     roles apart at the query, for the reason the old ref-based version
 *     excluded the tilt card by identity: an element cannot both be the plane
 *     that leans and a plane that drifts inside it.
 *   - It does not re-check the media queries after mount. Same call as
 *     useStackFade's `noMotion`: both are read once, and a reader who changes
 *     their OS motion setting mid-page gets the new answer on the next route
 *     change. A change listener on two queries for four folds buys a case that
 *     does not happen.
 *   - It owns no easing. The settle is `transition: transform` on .hero-tilt in
 *     index.css, so the tilt reads as one material with the rest of the fold
 *     and the global reduced-motion override can reach it.
 */

// the shared numbers. small on purpose: the fold has to answer to the cursor,
// not perform for it.
const TILT_Y_DEG = 5;
const TILT_X_DEG = 4;
const DRIFT_DEFAULT = 20;

export default function useHeroPointer(heroRef) {
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return undefined;
    if (!window.matchMedia('(pointer:fine)').matches) return undefined;
    if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) return undefined;

    // the two roles are kept apart at the query: a .hero-tilt element takes its
    // lean from the custom properties below and must not also be handed a
    // translate, because the drift branch writes the whole transform property.
    const drifters = [...hero.querySelectorAll('[data-depth]:not(.hero-tilt)')];
    const hasTilt = hero.querySelector('.hero-tilt') !== null;
    if (!hasTilt && drifters.length === 0) return undefined;

    let frame = null;

    const reset = () => {
      hero.style.removeProperty('--hero-tilt-x');
      hero.style.removeProperty('--hero-tilt-y');
      drifters.forEach((el) => { el.style.transform = ''; });
    };

    const onMove = (event) => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = null;
        const rect = hero.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        // one write per axis, on the fold. every .hero-tilt inside it inherits
        // these and spends them in CSS - see .hero-tilt in index.css.
        hero.style.setProperty('--hero-tilt-y', `${x * TILT_Y_DEG}deg`);
        hero.style.setProperty('--hero-tilt-x', `${y * -TILT_X_DEG}deg`);
        drifters.forEach((el) => {
          const depth = Number(el.dataset.depth) || DRIFT_DEFAULT;
          el.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
        });
      });
    };

    hero.addEventListener('mousemove', onMove);
    hero.addEventListener('mouseleave', reset);

    return () => {
      hero.removeEventListener('mousemove', onMove);
      hero.removeEventListener('mouseleave', reset);
      if (frame) window.cancelAnimationFrame(frame);
      reset();
    };
  }, [heroRef]);
}
