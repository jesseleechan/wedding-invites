import Image from "next/image";
import type { CSSProperties } from "react";

/** Renders copy where *words* in asterisks become italics. */
export function Rich({ text }: { text: string }) {
  return text.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.startsWith("*") && part.endsWith("*") ? (
      <em key={i}>{part.slice(1, -1)}</em>
    ) : (
      part
    ),
  );
}

/** Full-bleed background photo. The inner wrapper is what GSAP moves. */
export function BgPhoto({
  src,
  priority,
  quality = 80,
}: {
  src: string;
  priority?: boolean;
  quality?: number;
}) {
  return (
    <div className="bg-photo" aria-hidden>
      <div className="bg-photo__inner" data-parallax>
        <Image src={src} alt="" fill priority={priority} sizes="100vw" quality={quality} />
      </div>
    </div>
  );
}

/**
 * Torn paper strip used between sections. All numbers are design px at the
 * 1366px canvas; they scale with viewport width so the tear keeps its shape.
 */
export function TornEdge({
  src,
  edge,
  fill,
  stripOffset,
  stripHeight,
  stripWidth,
  stripLeft,
}: {
  src: string;
  edge: "top" | "bottom";
  fill: number;
  stripOffset: number;
  stripHeight: number;
  /** strip image width as % of the section */
  stripWidth: number;
  /** strip image left offset as % of the section */
  stripLeft: number;
}) {
  const w = (px: number) => `calc(var(--w) * ${px})`;
  return (
    <div
      className={`torn torn--${edge}`}
      aria-hidden
      style={
        {
          height: w(stripOffset + stripHeight),
          "--strip-offset": w(stripOffset),
          "--strip-width": `${stripWidth}%`,
          "--strip-left": `${stripLeft}%`,
        } as CSSProperties
      }
    >
      <div className="torn__fill" style={{ height: w(fill) }} />
      <div className="torn__strip" style={{ height: w(stripHeight) }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" />
      </div>
    </div>
  );
}

export function Polaroid({
  photo,
  frame,
  shadow,
  variant,
  alt,
}: {
  photo: string;
  frame: string;
  shadow: string;
  variant: "front" | "back";
  alt: string;
}) {
  return (
    <figure className={`photo photo--${variant} polaroid`} data-anim="polaroid">
      {/* eslint-disable @next/next/no-img-element */}
      <img className="polaroid__shadow" src={shadow} alt="" />
      <img className="polaroid__frame" src={frame} alt="" />
      {/* eslint-enable @next/next/no-img-element */}
      <Image className="polaroid__photo" src={photo} alt={alt} width={460} height={560} sizes="230px" />
    </figure>
  );
}
