import type { Metadata } from "next";
import Link from "next/link";
import { conceptList, inviteList } from "@/invites";

export const metadata: Metadata = {
  title: "Invitation designs",
  description: "Wedding invitation design variations",
};

export default function Gallery() {
  return (
    <main className="gallery">
      <header className="gallery__head">
        <p className="gallery__eyebrow">Wedding invitation websites</p>
        <h1 className="gallery__title">Design variations</h1>
      </header>
      <ul className="gallery__grid">
        {inviteList.map((invite) => {
          const t = invite.theme;
          return (
            <li key={invite.slug} className="gallery__card" style={{ background: t.paper, color: t.ink }}>
              <div className="gallery__swatches" aria-hidden>
                {[t.heroBg, t.accent, t.weekendBg, t.cardBg, t.button].map((c, i) => (
                  <span key={i} style={{ background: c }} />
                ))}
              </div>
              <h2 className="gallery__name" style={{ fontFamily: invite.design.fonts.script }}>
                {invite.name}
              </h2>
              <p className="gallery__names" style={{ fontFamily: invite.design.fonts.names, color: t.body }}>
                {invite.hero.names} · {invite.hero.date}
              </p>
              <p className="gallery__tagline" style={{ color: t.body }}>
                {invite.tagline}
              </p>
              <div className="gallery__links">
                <Link href={`/${invite.slug}`} style={{ background: t.button, color: t.formBg }}>
                  Envelope
                </Link>
                <Link href={`/${invite.slug}/home`} style={{ borderColor: t.accent, color: t.ink }}>
                  Invitation
                </Link>
              </div>
            </li>
          );
        })}
      </ul>

      <header className="gallery__head gallery__head--concepts">
        <p className="gallery__eyebrow">Same content, new format</p>
        <h2 className="gallery__title">New concepts</h2>
      </header>
      <ul className="gallery__grid gallery__grid--fill">
        {conceptList.map((c) => (
          <li key={c.slug} className="gallery__card gallery__card--trail">
            <div className="gallery__swatches" aria-hidden>
              {["#1f3a2e", "#e0703a", "#f3cd8a", "#c9a27a", "#6f8a69"].map((col) => (
                <span key={col} style={{ background: col }} />
              ))}
            </div>
            <h3 className="gallery__name" style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, textTransform: "uppercase" }}>
              {c.name}
            </h3>
            <p className="gallery__names" style={{ fontFamily: "var(--font-plex-mono)" }}>
              {c.couple.names.join(" & ").toUpperCase()} · {c.date.short}
            </p>
            <p className="gallery__tagline">{c.tagline}</p>
            <div className="gallery__links">
              <Link href={`/${c.slug}`} style={{ background: "#e0703a", color: "#1f3a2e" }}>
                Envelope
              </Link>
              <Link href={`/${c.slug}/home`} style={{ borderColor: "#f3cd8a", color: "#f3ecdc" }}>
                Invitation
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
