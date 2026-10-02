"use client";

/* eslint-disable @next/next/no-img-element -- decorative SVG illustrations */

import Link from "next/link";
import { useRef } from "react";
import { BgPhoto, Rich } from "@/components/shared";
import { Backdrop, Divider, PhotoFrame, TintImage } from "@/components/variants";
import { designClasses, themeStyle } from "@/invites";
import type { Invite, Story, StoryChapter } from "@/invites/types";
import { gsap, revealOnce, ScrollTrigger, useGSAP } from "@/lib/gsap";

export function OurStory({ invite, story }: { invite: Invite; story: Story }) {
  const root = useRef<HTMLElement>(null);
  useStoryMotion(root);

  const { assets, design, slug } = invite;
  const edge = { kind: design.divider, src: assets.tornPaper };
  const home = `/${slug}/home`;
  const sprigMask = { "--mask": `url(${assets.sprig})` } as React.CSSProperties;

  return (
    <main ref={root} className={`invite story ${designClasses(invite)}`} style={themeStyle(invite)}>
      <div className="page-veil page-veil--start" />

      {/* ---------- Hero ---------- */}
      <section className="story-hero">
        <Backdrop backdrop={design.backdrop} priority />
        <nav className="story-nav caps" aria-label="Wedding" data-anim="hero-item">
          <Link href={home}>Invitation</Link>
          <span aria-current="page">{story.hero.title}</span>
          <Link href={`${home}#rsvp`}>RSVP</Link>
        </nav>
        <div className="story-hero__content">
          <span className="story-hero__sprig" style={sprigMask} data-anim="hero-item" />
          <p className="story-hero__kicker caps" data-anim="hero-item">
            {story.hero.kicker}
          </p>
          <h1 className="story-hero__title script" data-anim="hero-title">
            {story.hero.title}
          </h1>
          <span className="rule story-hero__rule" data-anim="hero-rule" />
          <p className="story-hero__since caps" data-anim="hero-item">
            {story.hero.since}
          </p>
        </div>
        <Divider {...edge} edge="bottom" fill={133.6} stripOffset={0} stripHeight={211} stripWidth={237.7} stripLeft={-68.67} />
      </section>

      {/* ---------- How it began ---------- */}
      <section className="story-intro">
        <div className="story-intro__head">
          <img className="story-intro__branch sketch" src={assets.branch} alt="" data-anim="branch-left" />
          <h2 className="story-intro__title script" data-anim="reveal">
            {story.intro.title}
          </h2>
          <img className="story-intro__branch story-intro__branch--flip sketch" src={assets.branch} alt="" data-anim="branch-right" />
        </div>
        <p className="story-intro__body copy" data-anim="reveal">
          <Rich text={story.intro.body} />
        </p>
      </section>

      {/* ---------- Journey timeline ---------- */}
      <section className="story-journey">
        {design.weekendTexture && <BgPhoto src={assets.sagePaper} quality={70} />}
        <Divider {...edge} edge="top" fill={65.8} stripOffset={9.1} stripHeight={190.7} stripWidth={214.8} stripLeft={-57.17} />
        <div className="story-journey__inner">
          <header className="story-journey__head" data-anim="reveal">
            <h2 className="story-journey__title script">{story.journey.title}</h2>
            <p className="story-journey__subtitle caps">{story.journey.subtitle}</p>
          </header>
          <div className="chapters">
            <span className="chapters__line" aria-hidden data-anim="chapters-line" />
            <ol className="chapters__list">
              {story.journey.chapters.map((c, i) => (
                <li
                  key={c.year}
                  className={`chapter chapter--${i % 2 ? "right" : "left"}${i === story.journey.chapters.length - 1 ? " chapter--last" : ""}`}
                  data-anim="chapter"
                >
                  <div className="chapter__text">
                    <h3 className="chapter__title script">{c.title}</h3>
                    <p className="chapter__body copy">{c.body}</p>
                  </div>
                  <span className="chapter__year">{c.year}</span>
                  <div className={`chapter__art chapter__art--${c.art}`} aria-hidden>
                    <ChapterArt art={c.art} invite={invite} />
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <Divider {...edge} edge="bottom" fill={126.7} stripOffset={11.9} stripHeight={190.7} stripWidth={214.8} stripLeft={-57.17} />
      </section>

      {/* ---------- Quote ---------- */}
      <section className="story-quote">
        <span className="story-quote__sprig" style={sprigMask} data-anim="reveal" />
        <blockquote className="story-quote__text script" data-anim="reveal">
          <Rich text={story.quote} />
        </blockquote>
        <span className="rule story-quote__rule" data-anim="rule" />
      </section>

      {/* ---------- The proposal ---------- */}
      <section className="story-proposal">
        <div className="story-proposal__col">
          <h2 className="story-proposal__title script" data-anim="reveal">
            {story.proposal.title}
          </h2>
          <p className="story-proposal__subtitle caps" data-anim="reveal">
            {story.proposal.subtitle}
          </p>
          <p className="story-proposal__body copy" data-anim="reveal">
            <Rich text={story.proposal.body} />
          </p>
          <img className="story-proposal__rings sketch" src={assets.rings} alt="" data-anim="proposal-rings" />
        </div>
        <div className="polaroids">
          <PhotoFrame kind={design.photoFrame} position="back" photo={story.proposal.photos[0]} assets={assets} />
          <PhotoFrame kind={design.photoFrame} position="front" photo={story.proposal.photos[1]} assets={assets} />
        </div>
      </section>

      {/* ---------- To be continued ---------- */}
      <section className="story-closing">
        <Backdrop backdrop={design.backdrop} />
        <Divider {...edge} edge="top" fill={79.6} stripOffset={5.9} stripHeight={211} stripWidth={237.7} stripLeft={-68.67} />
        <div className="story-closing__card" data-anim="closing">
          <h2 className="story-closing__title script">{story.closing.title}</h2>
          <p className="story-closing__body copy">
            <Rich text={story.closing.body} />
          </p>
          <div className="story-closing__actions">
            <Link className="story-btn" href={home}>
              {story.closing.invitationCta}
            </Link>
            <Link className="story-btn story-btn--ghost" href={`${home}#rsvp`}>
              {story.closing.rsvpCta}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function ChapterArt({ art, invite }: { art: StoryChapter["art"]; invite: Invite }) {
  const { assets, design, envelope } = invite;
  if (art === "seal") {
    // The envelope's wax seal, monogrammed — closes the story where the invitation opens
    return (
      <span className="chapter__seal">
        <TintImage className="chapter__wax" src={assets.waxSeal} width={685} height={672} tint={design.sealTint} sizes="160px" />
        <span className="chapter__monogram chapter__monogram--a">{envelope.monogram[0]}</span>
        <span className="chapter__monogram chapter__monogram--b">{envelope.monogram[1]}</span>
      </span>
    );
  }
  return <img className="sketch" src={assets[art]} alt="" />;
}

function useStoryMotion(root: React.RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(q("[data-anim]"), { autoAlpha: 1 });
        gsap.set(q(".page-veil"), { autoAlpha: 0 });
      });

      // gsap.from() animates to the CSS state, so static rotations / flips survive
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const inView = (trigger: Element, start = "top 85%") => revealOnce(trigger, start);

        /* Hero */
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .to(q(".page-veil"), { autoAlpha: 0, duration: 0.8, ease: "power1.out" }, 0)
          .from(q(".story-hero [data-parallax]"), { scale: 1.14, duration: 2.8, ease: "power2.out" }, 0)
          .from(q("[data-anim=hero-title]"), { autoAlpha: 0, y: 40, scale: 0.94, duration: 1.4 }, 0.35)
          .from(q("[data-anim=hero-item]"), { autoAlpha: 0, y: 14, duration: 0.9, stagger: 0.14 }, 0.6)
          .from(q("[data-anim=hero-rule]"), { autoAlpha: 0, scaleX: 0, duration: 0.9, ease: "power2.inOut" }, 1.1);

        gsap.to(q(".story-hero [data-parallax]"), {
          yPercent: 6,
          ease: "none",
          scrollTrigger: { trigger: q(".story-hero")[0], start: "top top", end: "bottom top", scrub: true },
        });
        gsap.fromTo(
          q(".story-closing [data-parallax]"),
          { yPercent: -5 },
          { yPercent: 5, ease: "none", scrollTrigger: { trigger: q(".story-closing")[0], start: "top bottom", end: "bottom top", scrub: true } },
        );

        /* Reveals */
        q("[data-anim=reveal]").forEach((el) => {
          gsap.from(el, { autoAlpha: 0, y: 34, duration: 1.1, ease: "power3.out", scrollTrigger: inView(el) });
        });
        q("[data-anim=rule]").forEach((el) => {
          gsap.from(el, { autoAlpha: 0, scaleX: 0, duration: 1, ease: "power2.inOut", scrollTrigger: inView(el, "top 92%") });
        });

        /* Intro branches */
        gsap
          .timeline({ scrollTrigger: inView(q(".story-intro")[0], "top 80%"), defaults: { ease: "power3.out", duration: 1.2 } })
          .from(q("[data-anim=branch-left]"), { autoAlpha: 0, x: -40, rotation: -8 })
          .from(q("[data-anim=branch-right]"), { autoAlpha: 0, x: 40, rotation: 8 }, 0);

        /* Journey: line draws, chapters slide in from their side */
        gsap.fromTo(
          q("[data-anim=chapters-line]"),
          { autoAlpha: 1, scaleY: 0 },
          { scaleY: 1, duration: 2.4, ease: "power1.inOut", scrollTrigger: inView(q(".chapters")[0], "top 75%") },
        );
        q("[data-anim=chapter]").forEach((el) => {
          const fromRight = el.classList.contains("chapter--right");
          const s = gsap.utils.selector(el);
          gsap
            .timeline({ scrollTrigger: inView(el, "top 80%"), defaults: { ease: "power3.out" } })
            .from(el, { autoAlpha: 0, duration: 0.6 })
            .from(s(".chapter__year"), { scale: 0.5, duration: 0.8, ease: "back.out(2)" }, 0)
            .from(s(".chapter__text"), { x: fromRight ? 40 : -40, autoAlpha: 0, duration: 1 }, 0.1)
            .from(s(".chapter__art > *"), { x: fromRight ? -40 : 40, rotation: fromRight ? -10 : 10, autoAlpha: 0, duration: 1.1 }, 0.2);
        });

        /* Proposal */
        gsap.from(q("[data-anim=polaroid]"), {
          autoAlpha: 0,
          y: -70,
          rotation: (i: number) => (i === 0 ? "+=14" : "-=16"),
          duration: 1.3,
          ease: "back.out(1.3)",
          stagger: 0.3,
          scrollTrigger: inView(q(".story-proposal .polaroids")[0], "top 80%"),
        });
        const rings = q("[data-anim=proposal-rings]")[0];
        gsap.from(rings, { autoAlpha: 0, y: -24, rotation: -12, duration: 1.2, ease: "power3.out", scrollTrigger: inView(rings, "top 92%") });

        /* Closing card */
        const card = q("[data-anim=closing]")[0];
        gsap.from(card, { autoAlpha: 0, y: 80, duration: 1.3, ease: "power3.out", scrollTrigger: inView(card, "top 90%") });

        document.fonts?.ready.then(() => ScrollTrigger.refresh());
      });
    },
    { scope: root },
  );
}
