/* Framed product media for a case study, with the explanation that rides
   under it - an icon, a claim, and the sentence that backs the claim.

   The Invoice case study does this with a callout baked into its own
   artwork, which works because that artwork was drawn in Figma on a white
   invoice. Everything else here is frames of a screen recording, so the
   annotation is markup: sharper than a bitmap, it reflows on a phone, and
   it can be edited without going back to Figma.

   Two variants, because the two kinds of case study on this site size
   media differently:

     beat  the media sits inside a pinned scene whose stage is a fixed
           height, so the image is capped by HEIGHT and the frame shrinks
           to fit it. A width-driven frame would push the annotation off
           the bottom of the stage.
     flow  the media sits in an ordinary scrolling section, so the image
           is capped by WIDTH and the section grows to whatever height it
           needs.

   `icon` is a node rather than a name so this file does not have to own
   an icon set - each case study passes its own glyph. */

function Frame({ variant, eyebrow, note, icon, children }) {
  return (
    <div className={`kbm kbm-${variant}`}>
      {eyebrow ? <span className="kbs-eyebrow">{eyebrow}</span> : null}
      <figure className="kbm-frame">
        {children}
        {note ? (
          <figcaption className={`kbm-note${icon ? '' : ' kbm-note-plain'}`}>
            {icon ? <span className="kbm-note-i" aria-hidden="true">{icon}</span> : null}
            <span className="kbm-note-t">
              <b>{note.title}</b>
              <span>{note.body}</span>
            </span>
          </figcaption>
        ) : null}
      </figure>
    </div>
  );
}

export function Shot({ src, alt, eyebrow, note, icon, variant = 'beat', className = '' }) {
  return (
    <div className={`${variant === 'beat' ? 'kbs-wide ' : ''}${className}`.trim() || undefined}>
      <Frame variant={variant} eyebrow={eyebrow} note={note} icon={icon}>
        <img src={src} alt={alt} loading="lazy" />
      </Frame>
    </div>
  );
}

/* muted + loop + playsInline so it behaves like a gif and still autoplays
   on iOS. preload is metadata only: in a pinned scene the clip mounts when
   its beat is reached, and in a flowing section it sits below the fold, so
   neither should pull the whole file before anyone can see it. */
export function Clip({ src, eyebrow, note, icon, variant = 'beat', className = '' }) {
  return (
    <div className={`${variant === 'beat' ? 'kbs-wide ' : ''}${className}`.trim() || undefined}>
      <Frame variant={variant} eyebrow={eyebrow} note={note} icon={icon}>
        <video src={src} autoPlay muted loop playsInline preload="metadata" />
      </Frame>
    </div>
  );
}
