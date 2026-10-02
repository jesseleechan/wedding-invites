"use client";

import { useRef } from "react";
import type { SceneName } from "@/invites/types";
import { gsap, useGSAP } from "@/lib/gsap";

/*
 * Illustrated backdrops drawn in SVG (1600×1000, sliced to cover).
 * Geometry is generated from a fixed seed so server and client markup match.
 * Layers marked data-depth drift at different speeds while scrolling.
 */

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r1 = (n: number) => Math.round(n * 10) / 10;

/** Jagged mountain ridge from left to right, closed along the bottom */
function ridge(seed: number, base: number, amp: number, step: number) {
  const rand = rng(seed);
  let d = `M0,1000 L0,${base}`;
  for (let x = step; x <= 1600 + step; x += step) {
    const y = base - rand() * amp;
    d += ` L${x},${r1(y)}`;
  }
  return `${d} L1600,1000 Z`;
}

/** Soft rolling curve built from cubic segments */
function hills(seed: number, base: number, amp: number, segments: number) {
  const rand = rng(seed);
  const w = 1600 / segments;
  let d = `M0,1000 L0,${base}`;
  let prevY = base;
  for (let i = 1; i <= segments; i++) {
    const x = i * w;
    const y = base - (rand() - 0.35) * amp;
    d += ` C${r1(x - w * 0.6)},${r1(prevY)} ${r1(x - w * 0.4)},${r1(y)} ${r1(x)},${r1(y)}`;
    prevY = y;
  }
  return `${d} L1600,1000 Z`;
}

function useSceneMotion(root: React.RefObject<SVGSVGElement | null>, setup: (q: (s: string) => Element[]) => void) {
  useGSAP(
    () => {
      const svg = root.current;
      if (!svg) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(svg);
        setup(q);
        const section = svg.closest("section, main");
        q("[data-depth]").forEach((layer) => {
          const depth = Number(layer.getAttribute("data-depth"));
          gsap.to(layer, {
            y: depth * 60,
            ease: "none",
            scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
          });
        });
      });
    },
    { scope: root },
  );
}

/* ---------------------------------------------------------------- Night */

function NightScene() {
  const ref = useRef<SVGSVGElement>(null);
  const rand = rng(7);
  const stars = Array.from({ length: 170 }, () => ({
    x: r1(rand() * 1600),
    y: r1(Math.pow(rand(), 1.6) * 720),
    r: r1(0.5 + rand() * 1.6),
    o: r1(0.35 + rand() * 0.65),
  }));
  const treeRand = rng(21);
  const trees = Array.from({ length: 46 }, (_, i) => {
    const x = r1(i * 36 + treeRand() * 20 - 10);
    const h = r1(40 + treeRand() * 70);
    const base = r1(925 - treeRand() * 25);
    return { x, h, base };
  });

  useSceneMotion(ref, (q) => {
    q(".star").forEach((s) => {
      gsap.to(s, {
        opacity: 0.15,
        duration: 0.8 + Math.random() * 2.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: Math.random() * 3,
      });
    });
    gsap.from(q(".moon"), { y: 60, opacity: 0, duration: 3, ease: "power2.out" });
    gsap
      .timeline({ repeat: -1, repeatDelay: 5, delay: 2.5 })
      .fromTo(
        q(".shooting-star"),
        { x: 0, y: 0, opacity: 0 },
        { x: -420, y: 210, opacity: 1, duration: 0.25, ease: "none" },
      )
      .to(q(".shooting-star"), { x: -840, y: 420, opacity: 0, duration: 0.65, ease: "power1.in" });
  });

  return (
    <svg ref={ref} className="bg-scene" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="n-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#040914" />
          <stop offset="0.45" stopColor="#0c1630" />
          <stop offset="0.78" stopColor="#1d2c50" />
          <stop offset="1" stopColor="#34446a" />
        </linearGradient>
        <radialGradient id="n-horizon" cx="0.5" cy="1" r="0.7">
          <stop offset="0" stopColor="#c9a45c" stopOpacity="0.28" />
          <stop offset="1" stopColor="#c9a45c" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="n-moonglow">
          <stop offset="0" stopColor="#f3e6c4" stopOpacity="0.35" />
          <stop offset="1" stopColor="#f3e6c4" stopOpacity="0" />
        </radialGradient>
        <mask id="n-crescent">
          <circle r="46" fill="#fff" />
          <circle cx="20" cy="-12" r="42" fill="#000" />
        </mask>
        <linearGradient id="n-trail" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="1600" height="1000" fill="url(#n-sky)" />
      <rect width="1600" height="1000" fill="url(#n-horizon)" />
      <g data-depth="-0.4">
        {stars.map((s, i) => (
          <circle key={i} className="star" cx={s.x} cy={s.y} r={s.r} fill="#fdf6e3" opacity={s.o} />
        ))}
      </g>
      <g className="shooting-star">
        <line x1="1300" y1="80" x2="1420" y2="20" stroke="url(#n-trail)" strokeWidth="2" strokeLinecap="round" />
      </g>
      <g className="moon" transform="translate(1210 190)">
        <circle r="150" fill="url(#n-moonglow)" />
        <circle r="46" fill="#f3e6c4" mask="url(#n-crescent)" />
      </g>
      <path data-depth="0.1" d={ridge(3, 700, 150, 80)} fill="#1b2a4c" />
      <path data-depth="0.25" d={ridge(11, 800, 110, 60)} fill="#121f3b" />
      <g data-depth="0.45">
        <path d={hills(5, 900, 50, 6)} fill="#0a1328" />
        {trees.map((t, i) => (
          <path
            key={i}
            d={`M${t.x},${t.base} l-${r1(t.h * 0.22)},0 l${r1(t.h * 0.22)},-${t.h} l${r1(t.h * 0.22)},${t.h} z`}
            fill="#0a1328"
          />
        ))}
      </g>
    </svg>
  );
}

/* --------------------------------------------------------------- Garden */

function GardenScene() {
  const ref = useRef<SVGSVGElement>(null);
  const rand = rng(42);
  const flowers = Array.from({ length: 70 }, () => ({
    x: r1(rand() * 1600),
    y: r1(845 + rand() * 120),
    r: r1(3 + rand() * 5),
    c: rand() > 0.5 ? "#fff6f2" : rand() > 0.5 ? "#e7a3a0" : "#f4c9c3",
  }));
  const petalRand = rng(9);
  const petals = Array.from({ length: 22 }, () => ({
    x: r1(petalRand() * 1600),
    y: r1(petalRand() * 700),
    s: r1(1.1 + petalRand() * 1.2),
    c: petalRand() > 0.5 ? "#e79e97" : "#f5c4bd",
  }));

  useSceneMotion(ref, (q) => {
    q(".petal").forEach((p) => {
      gsap.fromTo(
        p,
        { y: () => -80 - Math.random() * 200, x: 0, rotation: () => Math.random() * 180, opacity: 0 },
        {
          y: 1050,
          x: () => -150 + Math.random() * 300,
          rotation: () => 180 + Math.random() * 360,
          opacity: 1,
          duration: () => 9 + Math.random() * 8,
          ease: "none",
          repeat: -1,
          repeatRefresh: true,
          delay: Math.random() * 6,
        },
      );
    });
    gsap.to(q(".cloud"), { x: 60, duration: 14, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: 2 });
  });

  return (
    <svg ref={ref} className="bg-scene" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="g-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbeee8" />
          <stop offset="0.55" stopColor="#f8dbd2" />
          <stop offset="1" stopColor="#f1c3b8" />
        </linearGradient>
        <radialGradient id="g-sun" cx="0.5" cy="0.62" r="0.45">
          <stop offset="0" stopColor="#fffaf2" stopOpacity="0.95" />
          <stop offset="1" stopColor="#fffaf2" stopOpacity="0" />
        </radialGradient>
        <filter id="g-soft" x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
        <filter id="g-wash">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="4" />
          <feDisplacementMap in="SourceGraphic" scale="22" />
        </filter>
        <path id="g-petal" d="M0,-9 C6,-6 6,6 0,9 C-6,6 -6,-6 0,-9 Z" />
      </defs>
      <rect width="1600" height="1000" fill="url(#g-sky)" />
      <rect width="1600" height="1000" fill="url(#g-sun)" />
      <g filter="url(#g-soft)" opacity="0.8">
        <ellipse className="cloud" cx="330" cy="210" rx="210" ry="46" fill="#fff" />
        <ellipse className="cloud" cx="1250" cy="150" rx="260" ry="52" fill="#fff" />
        <ellipse className="cloud" cx="880" cy="300" rx="170" ry="34" fill="#fff" />
      </g>
      <g filter="url(#g-wash)">
        <path data-depth="0.1" d={hills(12, 650, 120, 4)} fill="#efc2b9" opacity="0.85" />
        <path data-depth="0.2" d={hills(4, 720, 110, 5)} fill="#e3a7a0" opacity="0.75" />
        <path data-depth="0.3" d={hills(8, 780, 90, 4)} fill="#c7ceb5" />
        <path data-depth="0.45" d={hills(15, 850, 70, 5)} fill="#aab794" />
      </g>
      <g data-depth="0.45">
        {flowers.map((f, i) => (
          <circle key={i} cx={f.x} cy={f.y} r={f.r} fill={f.c} opacity="0.9" />
        ))}
      </g>
      <g>
        {petals.map((p, i) => (
          <g key={i} transform={`translate(${p.x} ${p.y}) scale(${p.s})`}>
            <use className="petal" href="#g-petal" fill={p.c} opacity="0" />
          </g>
        ))}
      </g>
    </svg>
  );
}

/* --------------------------------------------------------------- Desert */

function Saguaro({ x, y, s, fill }: { x: number; y: number; s: number; fill: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill={fill}>
      <rect x="-14" y="-190" width="28" height="190" rx="14" />
      <path d="M-14,-80 h-22 a14,14 0 0 1 -14,-14 v-46 a12,12 0 0 1 24,0 v36 h12 z" />
      <path d="M14,-110 h20 a14,14 0 0 0 14,-14 v-38 a12,12 0 0 0 -24,0 v28 h-10 z" />
    </g>
  );
}

function DesertScene() {
  const ref = useRef<SVGSVGElement>(null);
  const stripes = [0, 1, 2, 3, 4].map((i) => ({ y: 560 + i * 24, h: 3 + i * 2.6 }));

  useSceneMotion(ref, (q) => {
    gsap.from(q(".sun"), { y: 260, duration: 3.2, ease: "power2.out" });
    gsap.from(q(".sun-glow"), { opacity: 0, scale: 0.6, transformOrigin: "50% 50%", duration: 3.6, ease: "power2.out" });
    gsap.to(q(".bird"), { x: 140, y: -30, duration: 18, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: 1.5 });
    gsap.to(q(".bird path"), { scaleY: 0.4, transformOrigin: "50% 50%", duration: 0.35, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: 0.12 });
  });

  return (
    <svg ref={ref} className="bg-scene" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="d-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbe8d2" />
          <stop offset="0.5" stopColor="#f7c8a0" />
          <stop offset="1" stopColor="#ef9d74" />
        </linearGradient>
        <radialGradient id="d-glow">
          <stop offset="0" stopColor="#fff3dc" stopOpacity="0.85" />
          <stop offset="1" stopColor="#fff3dc" stopOpacity="0" />
        </radialGradient>
        <mask id="d-stripes">
          <rect x="0" y="0" width="1600" height="1000" fill="#fff" />
          {stripes.map((s, i) => (
            <rect key={i} x="0" y={s.y} width="1600" height={s.h} fill="#000" />
          ))}
        </mask>
      </defs>
      <rect width="1600" height="1000" fill="url(#d-sky)" />
      <circle className="sun-glow" cx="1180" cy="540" r="420" fill="url(#d-glow)" />
      <g mask="url(#d-stripes)">
        <circle className="sun" cx="1180" cy="540" r="150" fill="#fbe0b3" />
      </g>
      <g fill="none" stroke="#9b4a2c" strokeWidth="3" strokeLinecap="round" opacity="0.55">
        <g className="bird" transform="translate(420 260)">
          <path d="M-14,0 q7,-8 14,0 q7,-8 14,0" />
        </g>
        <g className="bird" transform="translate(480 300) scale(0.7)">
          <path d="M-14,0 q7,-8 14,0 q7,-8 14,0" />
        </g>
        <g className="bird" transform="translate(1120 230) scale(0.8)">
          <path d="M-14,0 q7,-8 14,0 q7,-8 14,0" />
        </g>
      </g>
      <path
        data-depth="0.1"
        d="M0,1000 V700 H120 L160,640 H360 L400,700 H560 L585,670 H700 L720,720 H1000 L1040,620 H1250 L1290,690 H1460 L1490,650 H1600 V1000 Z"
        fill="#e4936b"
      />
      <path data-depth="0.22" d={hills(31, 800, 70, 4)} fill="#cf7650" />
      <g data-depth="0.35">
        <path d={hills(17, 870, 60, 3)} fill="#b85d39" />
        <Saguaro x={230} y={890} s={1.05} fill="#8a3b1f" />
        <Saguaro x={1390} y={880} s={0.8} fill="#8a3b1f" />
      </g>
      <path data-depth="0.5" d={hills(23, 945, 45, 3)} fill="#9c4a2b" />
    </svg>
  );
}

export function Scene({ name }: { name: SceneName }) {
  if (name === "night") return <NightScene />;
  if (name === "garden") return <GardenScene />;
  return <DesertScene />;
}
