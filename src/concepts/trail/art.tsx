/*
 * Illustrations for "The Trail" concept — all hand-built SVG.
 * Anything random is driven by a fixed seed so server and client markup match.
 */

export function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r1 = (n: number) => Math.round(n * 10) / 10;

/** Smooth closed curve through points (Catmull-Rom → cubic Bézier) */
function closedCurve(pts: [number, number][]) {
  const n = pts.length;
  let d = `M${r1(pts[0][0])},${r1(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${r1(c1[0])},${r1(c1[1])} ${r1(c2[0])},${r1(c2[1])} ${r1(p2[0])},${r1(p2[1])}`;
  }
  return `${d} Z`;
}

/** Topographic contour rings around a few "summits" */
export function topoPaths(seed: number, w: number, h: number, summits: number, rings: number, gap: number) {
  const rand = rng(seed);
  const paths: string[] = [];
  for (let s = 0; s < summits; s++) {
    const cx = rand() * w;
    const cy = rand() * h;
    const ph = [rand() * 6.28, rand() * 6.28, rand() * 6.28];
    for (let k = 1; k <= rings; k++) {
      const r = k * gap;
      const pts: [number, number][] = [];
      for (let i = 0; i < 36; i++) {
        const a = (i / 36) * Math.PI * 2;
        const wobble =
          1 + 0.22 * Math.sin(a * 2 + ph[0] + k * 0.15) + 0.12 * Math.sin(a * 3 + ph[1]) + 0.06 * Math.sin(a * 5 + ph[2] + k * 0.3);
        pts.push([cx + Math.cos(a) * r * wobble, cy + Math.sin(a) * r * wobble * 0.8]);
      }
      paths.push(closedCurve(pts));
    }
  }
  return paths;
}

export function Topo({
  seed,
  className,
  color = "currentColor",
  width = 1600,
  height = 1000,
  summits = 4,
  rings = 14,
  gap = 34,
}: {
  seed: number;
  className?: string;
  color?: string;
  width?: number;
  height?: number;
  summits?: number;
  rings?: number;
  gap?: number;
}) {
  return (
    <svg className={className} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid slice" aria-hidden>
      <g fill="none" stroke={color} strokeWidth="1.1">
        {topoPaths(seed, width, height, summits, rings, gap).map((d, i) => (
          <path key={i} d={d} opacity={i % 5 === 4 ? 1 : 0.55} strokeWidth={i % 5 === 4 ? 1.6 : 1} />
        ))}
      </g>
    </svg>
  );
}

/** Tiered pine silhouette */
export function pine(x: number, y: number, h: number) {
  const w = h * 0.42;
  const p = (dx: number, dy: number) => `${r1(x + dx)},${r1(y - dy)}`;
  return `M${p(0, h)} L${p(w * 0.3, h * 0.66)} L${p(w * 0.17, h * 0.66)} L${p(w * 0.42, h * 0.34)} L${p(w * 0.26, h * 0.34)} L${p(w * 0.5, h * 0.06)} L${p(w * 0.06, h * 0.06)} L${p(w * 0.06, 0)} L${p(-w * 0.06, 0)} L${p(-w * 0.06, h * 0.06)} L${p(-w * 0.5, h * 0.06)} L${p(-w * 0.26, h * 0.34)} L${p(-w * 0.42, h * 0.34)} L${p(-w * 0.17, h * 0.66)} L${p(-w * 0.3, h * 0.66)} Z`;
}

function range(seed: number, base: number, amp: number, step: number) {
  const rand = rng(seed);
  let d = `M0,1000 L0,${base}`;
  for (let x = step; x <= 1600 + step; x += step) d += ` L${x},${r1(base - rand() * amp)}`;
  return `${d} L1600,1000 Z`;
}

/* ---------------------------------------------------------------- Poster */

/** WPA national-park-poster style landscape (1600×1000, sliced to cover) */
export function PosterScene({ className }: { className?: string }) {
  const rays = Array.from({ length: 16 }, (_, i) => i);
  const treeRand = rng(5);
  const leftTrees = [
    [40, 1000, 520],
    [170, 1010, 400],
    [260, 1000, 300],
    [-60, 1000, 380],
  ];
  const rightTrees = [
    [1560, 1000, 540],
    [1430, 1010, 420],
    [1340, 1000, 310],
    [1660, 1000, 400],
  ];
  const midTrees = Array.from({ length: 22 }, (_, i) => [300 + i * 46 + treeRand() * 20, 905 + treeRand() * 20, 60 + treeRand() * 50]);

  return (
    <svg className={className} viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMax slice" aria-hidden>
      <defs>
        <linearGradient id="p-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6e6bf" />
          <stop offset="0.6" stopColor="#f3cd8a" />
          <stop offset="1" stopColor="#eaa65f" />
        </linearGradient>
      </defs>
      <rect width="1600" height="1000" fill="url(#p-sky)" />
      <g data-layer="rays" transform="translate(800 540)">
        {rays.map((i) => (
          <path
            key={i}
            d={`M0,0 L${r1(1500 * Math.cos(((i * 22.5 - 1) * Math.PI) / 180))},${r1(1500 * Math.sin(((i * 22.5 - 1) * Math.PI) / 180))} L${r1(1500 * Math.cos(((i * 22.5 + 9) * Math.PI) / 180))},${r1(1500 * Math.sin(((i * 22.5 + 9) * Math.PI) / 180))} Z`}
            fill="#fff4dc"
            opacity="0.32"
          />
        ))}
      </g>
      <circle data-layer="sun" cx="800" cy="540" r="140" fill="#f29e4c" />
      <path data-layer="far" d={range(8, 660, 210, 110)} fill="#a4b28e" />
      <path data-layer="mid" d="M0,1000 V760 L180,640 L260,690 L420,520 L520,600 L640,470 L760,590 L850,540 L1000,700 L1120,600 L1260,660 L1380,560 L1600,720 V1000 Z" fill="#6f8a69" />
      <path data-layer="mid" d="M640,470 L700,530 L680,560 L720,580 L760,590 Z M420,520 L470,560 L450,590 Z M1380,560 L1430,600 L1410,620 Z" fill="#e9efe0" opacity="0.85" />
      <g data-layer="near">
        <path d={range(14, 900, 70, 70)} fill="#45634f" />
        {midTrees.map(([x, y, h], i) => (
          <path key={i} d={pine(x, y, h)} fill="#2f4a3b" />
        ))}
      </g>
      <g data-layer="front" fill="#1d3226">
        <path d="M0,1000 V950 C300,925 500,960 800,945 S1300,925 1600,950 V1000 Z" />
        {[...leftTrees, ...rightTrees].map(([x, y, h], i) => (
          <path key={i} d={pine(x, y, h)} />
        ))}
      </g>
      <g data-layer="birds" fill="none" stroke="#3b4a40" strokeWidth="3" strokeLinecap="round" opacity="0.6">
        <path d="M560,300 q9,-10 18,0 q9,-10 18,0" />
        <path d="M610,340 q7,-8 14,0 q7,-8 14,0" />
        <path d="M1020,260 q8,-9 16,0 q8,-9 16,0" />
      </g>
    </svg>
  );
}

/* ----------------------------------------------------------- Postal bits */

export function Stamp({ className }: { className?: string }) {
  const holes: [number, number][] = [];
  for (let x = 6; x <= 114; x += 12) holes.push([x, 0], [x, 150]);
  for (let y = 6; y <= 150; y += 12) holes.push([0, y], [120, y]);
  return (
    <svg className={className} viewBox="0 0 120 150" aria-hidden>
      <defs>
        <mask id="stamp-perf">
          <rect width="120" height="150" fill="#fff" />
          {holes.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="4.2" fill="#000" />
          ))}
        </mask>
        <clipPath id="stamp-art">
          <rect x="11" y="11" width="98" height="104" />
        </clipPath>
      </defs>
      <g mask="url(#stamp-perf)">
        <rect width="120" height="150" fill="#fbf5e6" />
        <g clipPath="url(#stamp-art)">
          <rect x="11" y="11" width="98" height="104" fill="#f3cd8a" />
          <circle cx="60" cy="80" r="22" fill="#f29e4c" />
          <path d="M11,115 V82 L32,62 L44,74 L62,50 L80,72 L92,64 L109,82 V115 Z" fill="#6f8a69" />
          <path d="M62,50 L70,60 L64,64 L72,70 L62,50" fill="#e9efe0" />
          <path d="M11,115 V98 C40,92 70,102 109,95 V115 Z" fill="#2f4a3b" />
          <path d={pine(24, 112, 34)} fill="#1d3226" />
          <path d={pine(96, 112, 28)} fill="#1d3226" />
        </g>
        <text x="60" y="132" textAnchor="middle" fontFamily="var(--font-oswald)" fontWeight="700" fontSize="13" fill="#23302a" letterSpacing="1.5">
          ESTES PARK
        </text>
        <text x="60" y="143" textAnchor="middle" fontFamily="var(--font-plex-mono)" fontSize="7" fill="#23302a" letterSpacing="1">
          10 · 04 · 27
        </text>
        <text x="100" y="27" textAnchor="end" fontFamily="var(--font-oswald)" fontWeight="700" fontSize="12" fill="#23302a">
          M&amp;R
        </text>
      </g>
    </svg>
  );
}

export function Postmark({ className, text }: { className?: string; text: string }) {
  return (
    <svg className={className} viewBox="0 0 260 120" aria-hidden>
      <defs>
        <path id="pm-arc" d="M80,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
      </defs>
      <g fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="80" cy="60" r="52" />
        <circle cx="80" cy="60" r="33" />
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={i} d={`M138,${36 + i * 12} q15,-7 30,0 t30,0 t30,0 t30,0`} />
        ))}
      </g>
      <text fontFamily="var(--font-plex-mono)" fontSize="10.5" letterSpacing="2.4" fill="currentColor">
        <textPath href="#pm-arc">{text}</textPath>
      </text>
      <text x="80" y="57" textAnchor="middle" fontFamily="var(--font-oswald)" fontWeight="700" fontSize="15" fill="currentColor">
        OCT 04
      </text>
      <text x="80" y="73" textAnchor="middle" fontFamily="var(--font-plex-mono)" fontSize="11" fill="currentColor">
        2027
      </text>
    </svg>
  );
}

/** Embroidered trail patch used as the envelope's sticker and on the footer */
export function Patch({ className, initials, year }: { className?: string; initials: [string, string]; year: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" aria-hidden>
      <defs>
        <path id="patch-arc" d="M60,60 m-38,0 a38,38 0 1,1 76,0" />
        <clipPath id="patch-clip">
          <circle cx="60" cy="60" r="45" />
        </clipPath>
      </defs>
      <circle cx="60" cy="60" r="58" fill="#2f5240" />
      <circle cx="60" cy="60" r="53" fill="none" stroke="#f3ecdc" strokeWidth="1.8" strokeDasharray="4 3" />
      <g clipPath="url(#patch-clip)">
        <rect x="0" y="0" width="120" height="120" fill="#f3cd8a" />
        <circle cx="60" cy="72" r="16" fill="#f29e4c" />
        <path d="M10,110 V84 L34,62 L46,72 L62,48 L82,74 L96,66 L112,84 V110 Z" fill="#6f8a69" />
        <path d="M62,48 L70,58 L64,62 L72,68 Z" fill="#f3ecdc" />
        <path d="M0,120 V92 C40,86 80,96 120,88 V120 Z" fill="#1d3226" />
      </g>
      <text fontFamily="var(--font-oswald)" fontWeight="700" fontSize="11" letterSpacing="3" fill="#f3ecdc">
        <textPath href="#patch-arc" startOffset="50%" textAnchor="middle">
          {`${initials[0]} & ${initials[1]}`}
        </textPath>
      </text>
      <text x="60" y="104" textAnchor="middle" fontFamily="var(--font-plex-mono)" fontSize="7.5" letterSpacing="1.5" fill="#f3ecdc">
        EST. {year}
      </text>
    </svg>
  );
}

export function Compass({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="60" cy="60" r="54" />
        <circle cx="60" cy="60" r="46" strokeDasharray="1 5" strokeLinecap="round" strokeWidth="2" />
      </g>
      <g data-needle>
        <path d="M60,14 L68,60 L60,106 L52,60 Z" fill="currentColor" opacity="0.25" />
        <path d="M60,14 L68,60 L52,60 Z" fill="#e0703a" />
        <path d="M14,60 L60,53 L106,60 L60,67 Z" fill="currentColor" opacity="0.45" />
        <circle cx="60" cy="60" r="4" fill="currentColor" />
      </g>
      <g fontFamily="var(--font-oswald)" fontWeight="700" fontSize="11" fill="currentColor" textAnchor="middle">
        <text x="60" y="11">N</text>
        <text x="113" y="64">E</text>
        <text x="60" y="118">S</text>
        <text x="7" y="64">W</text>
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ Map */

/** The unfolded trail map is a 1200×300 strip made of three 400×300 panels */
export const MAP_W = 1200;
export const MAP_H = 300;
/** Where the X sits on the spread (used to zoom into it) */
export const MAP_X = { x: 1080, y: 95 };

export function MapInside({ panel, names, date }: { panel: 0 | 1 | 2; names: [string, string]; date: string }) {
  const trees = rng(31);
  const pines = Array.from({ length: 30 }, () => [trees() * MAP_W, 40 + trees() * 250, 12 + trees() * 9]);
  return (
    <svg className="map__art" viewBox={`${panel * 400} 0 400 ${MAP_H}`} preserveAspectRatio="none" aria-hidden>
      <rect width={MAP_W} height={MAP_H} fill="#f3ecdc" />
      <g fill="none" stroke="#b7a37c" strokeWidth="1">
        {topoPaths(77, MAP_W, MAP_H, 6, 8, 20).map((d, i) => (
          <path key={i} d={d} opacity="0.5" />
        ))}
      </g>
      <path d="M0,250 C160,220 260,290 420,258 S700,180 840,215 S1080,175 1200,150" fill="none" stroke="#8fb3b0" strokeWidth="7" opacity="0.65" />
      {pines.map(([x, y, h], i) => (
        <path key={i} d={pine(x, y, h)} fill="#45634f" opacity="0.75" />
      ))}
      <path
        d="M70,250 C140,200 200,240 260,190 S400,140 470,185 S600,235 690,165 S860,85 930,120 S1040,112 1080,95"
        fill="none"
        stroke="#e0703a"
        strokeWidth="4"
        strokeDasharray="10 9"
        strokeLinecap="round"
      />
      <circle cx="70" cy="250" r="9" fill="#2f5240" />
      <text x="88" y="282" fontFamily="var(--font-plex-mono)" fontSize="13" fill="#23302a">TRAILHEAD</text>
      <text x="600" y="76" textAnchor="middle" fontFamily="var(--font-caveat)" fontWeight="700" fontSize="40" fill="#2f5240">
        you&apos;re invited!
      </text>
      <text x="600" y="124" textAnchor="middle" fontFamily="var(--font-oswald)" fontWeight="700" fontSize="34" letterSpacing="4" fill="#23302a">
        {names[0].toUpperCase()} &amp; {names[1].toUpperCase()}
      </text>
      <text x="600" y="150" textAnchor="middle" fontFamily="var(--font-plex-mono)" fontSize="13" letterSpacing="3" fill="#23302a">
        {date}
      </text>
      <g transform={`translate(${MAP_X.x} ${MAP_X.y})`} stroke="#c0392b" strokeWidth="7" strokeLinecap="round">
        <circle r="30" fill="none" strokeWidth="3" strokeDasharray="5 5" />
        <path d="M-14,-14 L14,14 M14,-14 L-14,14" />
      </g>
      <text x="1012" y="160" fontFamily="var(--font-caveat)" fontWeight="700" fontSize="26" fill="#c0392b">
        the summit
      </text>
    </svg>
  );
}

export function MapCover({ initials, date }: { initials: [string, string]; date: string }) {
  return (
    <svg className="map__art" viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden>
      <rect width="400" height="300" fill="#2f5240" />
      <g fill="none" stroke="#f3ecdc" opacity="0.16">
        {topoPaths(12, 400, 300, 2, 10, 16).map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
      <rect x="14" y="14" width="372" height="272" fill="none" stroke="#f3ecdc" strokeWidth="1.5" />
      <text x="200" y="74" textAnchor="middle" fontFamily="var(--font-plex-mono)" fontSize="13" letterSpacing="5" fill="#f3cd8a">
        OFFICIAL
      </text>
      <text x="200" y="146" textAnchor="middle" fontFamily="var(--font-oswald)" fontWeight="700" fontSize="66" letterSpacing="4" fill="#f3ecdc">
        TRAIL MAP
      </text>
      <path d="M140,226 L178,186 L198,206 L224,172 L270,226 Z" fill="#a4b28e" />
      <path d="M224,172 L234,186 L226,190 Z" fill="#f3ecdc" />
      <text x="200" y="258" textAnchor="middle" fontFamily="var(--font-plex-mono)" fontSize="12" letterSpacing="3" fill="#f3ecdc">
        {initials[0]} &amp; {initials[1]} · {date}
      </text>
    </svg>
  );
}

/* -------------------------------------------------------------- Doodles */

export function ScribbleCircle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 80" aria-hidden>
      <path
        className="doodle"
        pathLength={1}
        d="M58,8 C30,4 6,18 8,40 C10,64 44,76 70,70 C94,64 98,38 84,22 C72,8 46,6 30,14"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function DoodleArrow({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 90 60" aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <path className="doodle" pathLength={1} d="M6,8 C30,6 58,14 74,44" />
        <path className="doodle" pathLength={1} d="M60,40 L75,46 L80,30" />
      </g>
    </svg>
  );
}

export function CheckMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 30 30" aria-hidden>
      <rect x="3" y="5" width="22" height="22" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
      <path className="doodle tick" pathLength={1} d="M7,15 L13,22 L28,2" fill="none" stroke="#e0703a" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Campfire({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 110" aria-hidden>
      <g data-flame>
        <path d="M60,8 C76,34 88,46 82,70 C78,88 42,90 38,70 C34,52 50,44 60,8 Z" fill="#f29e4c" />
        <path d="M60,40 C68,54 72,62 68,74 C64,84 52,84 50,74 C48,64 56,58 60,40 Z" fill="#f6d38f" />
      </g>
      <g stroke="#6b4a2e" strokeWidth="9" strokeLinecap="round">
        <path d="M22,96 L98,80" />
        <path d="M22,80 L98,96" />
      </g>
    </svg>
  );
}
