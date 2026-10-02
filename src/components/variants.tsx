"use client";

/* eslint-disable @next/next/no-img-element -- decorative SVG illustrations */

import Image from "next/image";
import { useRef } from "react";
import type { CSSProperties } from "react";
import { BgPhoto, Polaroid, TornEdge } from "@/components/shared";
import { Scene } from "@/components/scenes";
import type { Design, InviteAssets, Tint } from "@/invites/types";
import { gsap, revealOnce, useGSAP } from "@/lib/gsap";

/* ------------------------------------------------------------ Backdrop */

export function Backdrop({ backdrop, priority }: { backdrop: Design["backdrop"]; priority?: boolean }) {
  if (backdrop.kind === "photo") return <BgPhoto src={backdrop.src} priority={priority} />;
  return (
    <div className="bg-photo" aria-hidden>
      <div className="bg-photo__inner" data-parallax>
        <Scene name={backdrop.scene} />
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- Tint */

/** next/image with an optional colour wash that keeps the paper texture */
export function TintImage({
  src,
  width,
  height,
  tint,
  className,
  priority,
  sizes,
}: {
  src: string;
  width: number;
  height: number;
  tint?: Tint;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const img = <Image src={src} alt="" width={width} height={height} priority={priority} sizes={sizes} />;
  if (!tint) return <span className={`tinted ${className ?? ""}`}>{img}</span>;
  return (
    <span
      className={`tinted ${className ?? ""}`}
      style={
        {
          "--tint": tint.color,
          "--tint-blend": tint.blend ?? "color",
          "--tint-filter": tint.filter ?? "none",
          "--tint-mask": `url(${src})`,
        } as CSSProperties
      }
    >
      {img}
      <span className="tinted__layer" />
    </span>
  );
}

/* ---------------------------------------------------------- Card faces */

const CW = 621;
const CH = 456;

function scallopRect(x: number, y: number, w: number, h: number, size: number) {
  const nx = Math.round(w / size);
  const ny = Math.round(h / size);
  const sx = w / nx;
  const sy = h / ny;
  let d = `M${x},${y}`;
  for (let i = 0; i < nx; i++) d += ` a${sx / 2},${sx / 2} 0 0 1 ${sx},0`;
  for (let i = 0; i < ny; i++) d += ` a${sy / 2},${sy / 2} 0 0 1 0,${sy}`;
  for (let i = 0; i < nx; i++) d += ` a${sx / 2},${sx / 2} 0 0 1 ${-sx},0`;
  for (let i = 0; i < ny; i++) d += ` a${sy / 2},${sy / 2} 0 0 1 0,${-sy}`;
  return `${d} Z`;
}

function chamfer(i: number, c: number) {
  const [x0, y0, x1, y1] = [i, i, CW - i, CH - i];
  return `M${x0 + c},${y0} H${x1 - c} L${x1},${y0 + c} V${y1 - c} L${x1 - c},${y1} H${x0 + c} L${x0},${y1 - c} V${y0 + c} Z`;
}

/** Art-deco fan tucked into each corner of the frame */
function DecoCorner({ corner }: { corner: 0 | 1 | 2 | 3 }) {
  const m = 36;
  const [x, y, sx, sy] = [
    [m, m, 1, 1],
    [CW - m, m, -1, 1],
    [CW - m, CH - m, -1, -1],
    [m, CH - m, 1, -1],
  ][corner];
  return (
    <g transform={`translate(${x} ${y}) scale(${sx} ${sy})`}>
      <path d="M0,22 A22,22 0 0 0 22,0" />
      <path d="M0,34 A34,34 0 0 0 34,0" opacity="0.6" />
      {[15, 45, 75].map((a) => (
        <line key={a} x1="0" y1="0" x2={30 * Math.cos((a * Math.PI) / 180)} y2={30 * Math.sin((a * Math.PI) / 180)} strokeWidth="0.7" />
      ))}
      <rect x="-3" y="-3" width="6" height="6" transform="rotate(45)" fill="currentColor" stroke="none" />
    </g>
  );
}

export function CardFace({ kind, card }: { kind: Design["card"]; card: string }) {
  if (kind === "ticket") {
    return (
      <Image className="hero__card-bg" src={card} alt="" width={1600} height={1174} priority sizes="(max-width: 700px) 100vw, 700px" />
    );
  }
  return (
    <svg className="hero__card-bg hero__card-svg" viewBox={`0 0 ${CW} ${CH}`} aria-hidden>
      {kind === "deco" && (
        <g fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d={chamfer(8, 26)} fill="var(--card-bg)" stroke="none" />
          <path d={chamfer(22, 18)} />
          <path d={chamfer(29, 14)} strokeWidth="0.6" opacity="0.7" />
          {([0, 1, 2, 3] as const).map((c) => (
            <DecoCorner key={c} corner={c} />
          ))}
        </g>
      )}
      {kind === "lace" && (
        <g fill="none" stroke="currentColor">
          <path d={scallopRect(14, 14, CW - 28, CH - 28, 16)} fill="var(--card-bg)" stroke="none" />
          <rect x="30" y="30" width={CW - 60} height={CH - 60} rx="6" strokeWidth="1.8" strokeDasharray="0.1 7" strokeLinecap="round" opacity="0.5" />
          <rect x="38" y="38" width={CW - 76} height={CH - 76} rx="4" strokeWidth="0.7" opacity="0.35" />
        </g>
      )}
      {kind === "sunset" && (
        <g fill="none">
          <rect x="8" y="8" width={CW - 16} height={CH - 16} rx="24" fill="var(--card-bg)" />
          <rect x="24" y="24" width={CW - 48} height={CH - 48} rx="14" stroke="currentColor" strokeWidth="1" opacity="0.45" />
          {[70, CW - 70].map((cx) => (
            <g key={cx} strokeWidth="6" strokeLinecap="round">
              <path d={`M${cx - 38},${CH - 40} A38,38 0 0 1 ${cx + 38},${CH - 40}`} stroke="var(--accent)" />
              <path d={`M${cx - 26},${CH - 40} A26,26 0 0 1 ${cx + 26},${CH - 40}`} stroke="#e7ad84" />
              <path d={`M${cx - 14},${CH - 40} A14,14 0 0 1 ${cx + 14},${CH - 40}`} stroke="var(--circle)" />
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}

/** Small motif above the kicker text on the hero card */
export function CardOrnament({ kind, sprig }: { kind: Design["card"]; sprig: string }) {
  if (kind === "ticket" || kind === "lace") {
    return <span className="hero__sprig" data-anim="hero-item" style={{ "--mask": `url(${sprig})` } as CSSProperties} />;
  }
  return (
    <svg className="hero__sprig hero__sprig--svg" viewBox="0 0 95 51" data-anim="hero-item" aria-hidden>
      {kind === "deco" ? (
        <g fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M27.5,46 A20,20 0 0 1 67.5,46" />
          <path d="M17.5,46 A30,30 0 0 1 77.5,46" opacity="0.6" />
          {[200, 225, 250, 270, 290, 315, 340].map((a) => (
            <line key={a} x1="47.5" y1="46" x2={47.5 + 40 * Math.cos((a * Math.PI) / 180)} y2={46 + 40 * Math.sin((a * Math.PI) / 180)} strokeWidth="0.8" />
          ))}
          <line x1="5" y1="46" x2="90" y2="46" />
        </g>
      ) : (
        <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M31.5,44 A16,16 0 0 1 63.5,44 Z" fill="currentColor" />
          {[190, 210, 230, 250, 270, 290, 310, 330, 350].map((a) => (
            <line key={a} x1={47.5 + 22 * Math.cos((a * Math.PI) / 180)} y1={44 + 22 * Math.sin((a * Math.PI) / 180)} x2={47.5 + 31 * Math.cos((a * Math.PI) / 180)} y2={44 + 31 * Math.sin((a * Math.PI) / 180)} />
          ))}
          <line x1="12" y1="44" x2="83" y2="44" />
        </g>
      )}
    </svg>
  );
}

/* ------------------------------------------------------------ Dividers */

type EdgeProps = {
  kind: Design["divider"];
  src: string;
  edge: "top" | "bottom";
  fill: number;
  stripOffset: number;
  stripHeight: number;
  stripWidth: number;
  stripLeft: number;
};

/** Section edge. Torn paper uses the Canva strip; the others are drawn in SVG. */
export function Divider(props: EdgeProps) {
  const { kind, edge, stripOffset, stripHeight } = props;
  if (kind === "torn") return <TornEdge {...props} />;

  const H = stripOffset + stripHeight;
  const by = H - 64; // where the next section's colour begins
  let shapes: React.ReactNode;

  if (kind === "scallop") {
    const bumps = Array.from({ length: 32 }, (_, i) => i * 44);
    shapes = (
      <>
        <path d={`M0,${H} V${by} ${bumps.map(() => "a22,22 0 0 1 44,0").join(" ")} V${H} Z`} fill="var(--paper)" />
        {bumps.map((x) => (
          <circle key={x} cx={x + 22} cy={by - 34} r="3.2" fill="var(--paper)" />
        ))}
      </>
    );
  } else if (kind === "dunes") {
    shapes = (
      <>
        <path
          d={`M0,${by - 28} C220,${by - 78} 420,${by + 10} 700,${by - 36} S1150,${by - 70} 1366,${by - 18} V${H} H0 Z`}
          fill="color-mix(in srgb, var(--accent) 45%, var(--paper))"
        />
        <path d={`M0,${by + 6} C260,${by - 40} 520,${by + 30} 820,${by - 6} S1220,${by - 30} 1366,${by + 4} V${H} H0 Z`} fill="var(--paper)" />
      </>
    );
  } else {
    const rays = [200, 220, 240, 260, 280, 300, 320, 340];
    shapes = (
      <>
        <rect x="0" y={by} width="1366" height={H - by} fill="var(--paper)" />
        <g stroke="var(--accent)" fill="none">
          <line x1="0" x2="1366" y1={by - 10} y2={by - 10} strokeWidth="1.5" />
          <line x1="0" x2="1366" y1={by - 17} y2={by - 17} strokeWidth="0.7" opacity="0.6" />
          {rays.map((a) => (
            <line key={a} x1="683" y1={by - 10} x2={683 + 46 * Math.cos((a * Math.PI) / 180)} y2={by - 10 + 46 * Math.sin((a * Math.PI) / 180)} strokeWidth="0.9" />
          ))}
          <path d={`M653,${by - 10} A30,30 0 0 1 713,${by - 10}`} strokeWidth="1.2" />
          {[341, 1025].map((x) => (
            <rect key={x} x={x - 5} y={by - 15} width="10" height="10" transform={`rotate(45 ${x} ${by - 10})`} fill="var(--paper)" strokeWidth="1.2" />
          ))}
        </g>
        <rect x="676" y={by - 17} width="14" height="14" transform={`rotate(45 683 ${by - 10})`} fill="var(--accent)" />
      </>
    );
  }

  return (
    <div className={`torn torn--${edge} divider`} aria-hidden style={{ height: `calc(var(--w) * ${H})` }}>
      <svg className="divider__svg" viewBox={`0 0 1366 ${H}`} preserveAspectRatio="none">
        {shapes}
      </svg>
    </div>
  );
}

/* --------------------------------------------------------- Photo frames */

export function PhotoFrame({
  kind,
  position,
  photo,
  assets,
}: {
  kind: Design["photoFrame"];
  position: "back" | "front";
  photo: string;
  assets: InviteAssets;
}) {
  if (kind === "polaroid") {
    return <Polaroid variant={position} photo={photo} frame={assets.polaroidFrame} shadow={assets.polaroidShadow} alt="" />;
  }
  return (
    <figure className={`photo photo--${position} frame-${kind}`} data-anim="polaroid">
      <Image className="frame__img" src={photo} alt="" width={460} height={580} sizes="230px" />
    </figure>
  );
}

/* --------------------------------------------------------- Weekend art */

function Wreath({ branch, rings }: { branch: string; rings: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(ref);
        gsap
          .timeline({ scrollTrigger: revealOnce(ref.current, "top 75%") })
          .from(q(".wreath__slot img"), { scale: 0, rotation: -40, opacity: 0, duration: 0.9, stagger: 0.08, ease: "back.out(1.6)" })
          .from(q(".wreath__rings"), { scale: 0.4, opacity: 0, duration: 1, ease: "back.out(2)" }, "-=0.4");
        gsap.to(q(".wreath"), { rotation: 4, duration: 6, yoyo: true, repeat: -1, ease: "sine.inOut" });
      });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className="wreath-wrap">
      <div className="wreath">
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} className="wreath__slot" style={{ "--a": `${i * 30}deg` } as CSSProperties}>
            <img src={branch} alt="" />
          </span>
        ))}
      </div>
      <img className="wreath__rings" src={rings} alt="" />
    </div>
  );
}

function cactus(x: number, y: number, s: number) {
  return [
    `M${x - 12 * s},${y} V${y - 130 * s} a${12 * s},${12 * s} 0 0 1 ${24 * s},0 V${y}`,
    `M${x - 12 * s},${y - 55 * s} h${-14 * s} a${10 * s},${10 * s} 0 0 1 ${-10 * s},${-10 * s} v${-34 * s} a${9 * s},${9 * s} 0 0 1 ${18 * s},0 v${26 * s} h${6 * s}`,
    `M${x + 12 * s},${y - 80 * s} h${12 * s} a${10 * s},${10 * s} 0 0 0 ${10 * s},${-10 * s} v${-26 * s} a${9 * s},${9 * s} 0 0 0 ${-18 * s},0 v${18 * s} h${-4 * s}`,
  ];
}

function DesertLineArt() {
  const ref = useRef<SVGSVGElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(ref);
        gsap
          .timeline({ scrollTrigger: revealOnce(ref.current, "top 75%") })
          .from(q(".sunfill"), { scale: 0, transformOrigin: "50% 50%", duration: 1.4, ease: "power3.out" })
          .fromTo(q(".draw"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2.2, stagger: 0.06, ease: "power2.inOut" }, 0.2);
      });
    },
    { scope: ref },
  );

  const rays = Array.from({ length: 17 }, (_, i) => 180 + i * 11.25);
  const dots = [
    [90, 120], [160, 70], [250, 150], [600, 90], [700, 160], [760, 60], [520, 40], [330, 50],
  ];
  const mesa = "M30,470 H130 L160,400 H330 L360,470 H470 L492,430 H600 L625,470 H812";
  const lines = [
    "M20,540 C160,500 300,560 440,530 S700,500 822,540",
    "M60,604 C220,574 380,624 540,598 S760,584 800,604",
    "M560,250 q8,-9 16,0 q8,-9 16,0",
    "M600,285 q6,-7 12,0 q6,-7 12,0",
  ];
  const cacti = [...cactus(150, 560, 1.15), ...cactus(690, 575, 0.85)];
  const draw = { className: "draw", pathLength: 1, strokeDasharray: "1" } as const;

  return (
    <svg ref={ref} className="desert-art" viewBox="0 0 842 666" aria-hidden>
      <circle className="sunfill" cx="421" cy="400" r="120" fill="var(--circle)" />
      <g fill="none" stroke="var(--ink)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <circle {...draw} cx="421" cy="400" r="120" />
        {rays.map((a) => (
          <line
            key={a}
            {...draw}
            x1={421 + 140 * Math.cos((a * Math.PI) / 180)}
            y1={400 + 140 * Math.sin((a * Math.PI) / 180)}
            x2={421 + 172 * Math.cos((a * Math.PI) / 180)}
            y2={400 + 172 * Math.sin((a * Math.PI) / 180)}
          />
        ))}
        {/* the sun sets behind the mesa: fill hides what's below the ridge */}
        <path d={`${mesa} V666 H30 Z`} fill="var(--weekend-bg)" stroke="none" />
        <path {...draw} d={mesa} />
        {lines.map((d, i) => (
          <path key={i} {...draw} d={d} />
        ))}
        {cacti.map((d, i) => (
          <path key={i} {...draw} d={d} fill="var(--weekend-bg)" />
        ))}
      </g>
      <g fill="var(--ink)">
        {dots.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="2.2" opacity="0.6" />
        ))}
      </g>
    </svg>
  );
}

export function WeekendArt({ kind, assets }: { kind: Design["weekendArt"]; assets: InviteAssets }) {
  if (kind === "wreath") return <Wreath branch={assets.branch} rings={assets.rings} />;
  if (kind === "desert") return <DesertLineArt />;
  return <img className="sketch" src={assets.mountain} alt="" />;
}
