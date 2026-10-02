import type { Metadata } from "next";
import {
  Caveat,
  Cinzel,
  Great_Vibes,
  IBM_Plex_Mono,
  Josefin_Sans,
  Lora,
  Marcellus,
  Oswald,
  Parisienne,
  Playfair_Display,
} from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const ebGaramond = localFont({
  variable: "--font-eb-garamond",
  display: "swap",
  src: [
    { path: "../fonts/EBGaramond-Regular.woff", weight: "400", style: "normal" },
    { path: "../fonts/EBGaramond-Italic.woff", weight: "400", style: "italic" },
    { path: "../fonts/EBGaramond-SemiBold.woff", weight: "600", style: "normal" },
  ],
});

const cormorant = localFont({
  variable: "--font-cormorant",
  display: "swap",
  src: [
    { path: "../fonts/CormorantGaramond-Regular.woff", weight: "400", style: "normal" },
    { path: "../fonts/CormorantGaramond-Bold.woff", weight: "700", style: "normal" },
  ],
});

const pinyon = localFont({
  variable: "--font-pinyon",
  display: "swap",
  src: "../fonts/PinyonScript-Regular.woff",
});

const sloop = localFont({
  variable: "--font-sloop",
  display: "swap",
  src: "../fonts/SloopScriptPro-Regular.woff",
});

// Extra families used by the design variations
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel", display: "swap" });
const greatVibes = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--font-great-vibes", display: "swap" });
const parisienne = Parisienne({ subsets: ["latin"], weight: "400", variable: "--font-parisienne", display: "swap" });
const marcellus = Marcellus({ subsets: ["latin"], weight: "400", variable: "--font-marcellus", display: "swap" });
const josefin = Josefin_Sans({ subsets: ["latin"], weight: ["300", "400"], variable: "--font-josefin", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-playfair", display: "swap" });
// "The Trail" concept
const oswald = Oswald({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-oswald", display: "swap" });
const caveat = Caveat({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-caveat", display: "swap" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono", display: "swap" });
const lora = Lora({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-lora", display: "swap" });

const fontVars = [
  ebGaramond, cormorant, pinyon, sloop, cinzel, greatVibes, parisienne, marcellus, josefin, playfair, lora,
  oswald, caveat, plexMono,
]
  .map((f) => f.variable)
  .join(" ");

export const metadata: Metadata = {
  title: "Wedding Invitations",
  description: "Wedding invitation websites",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={fontVars}
    >
      <head>
        {/* Lets CSS hide animated elements before first paint; GSAP reveals them. */}
        <script
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
