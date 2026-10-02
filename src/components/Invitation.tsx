"use client";

import Link from "next/link";
import { useRef } from "react";
import { RsvpForm } from "@/components/RsvpForm";
import { BgPhoto, Rich } from "@/components/shared";
import { Backdrop, CardFace, CardOrnament, Divider, PhotoFrame, TintImage, WeekendArt } from "@/components/variants";
import { designClasses, themeStyle } from "@/invites";
import type { Invite } from "@/invites/types";
import { gsap, revealOnce, ScrollTrigger, useGSAP } from "@/lib/gsap";

/* eslint-disable @next/next/no-img-element -- decorative SVG illustrations */

export function Invitation({ invite }: { invite: Invite }) {
  const root = useRef<HTMLElement>(null);
  useInvitationMotion(root);

  const { assets, design, hero, welcome, weekend, dressCode, fewWords } = invite;
  const edge = { kind: design.divider, src: assets.tornPaper };

  return (
    <main
      ref={root}
      className={`invite ${designClasses(invite)}`}
      style={themeStyle(invite)}
      data-quirks={design.canvaOffsets || undefined}
    >
      <div className="page-veil page-veil--start" />

      {/* ---------- Hero ---------- */}
      <section className="hero" data-section="hero">
        <Backdrop backdrop={design.backdrop} priority />
        <div className="hero__stack">
          <div className="hero__envelope" data-anim="hero-envelope">
            <TintImage src={assets.envelope} width={1600} height={1418} tint={design.envelopeTint} priority sizes="700px" />
          </div>
          <div className="hero__card" data-anim="hero-card">
            <CardFace kind={design.card} card={assets.card} />
            <CardOrnament kind={design.card} sprig={assets.sprig} />
            <p className="hero__kicker caps" data-anim="hero-item">
              {hero.kicker.map((line) => (
                <span key={line} style={{ display: "block" }}>
                  {line}
                </span>
              ))}
            </p>
            <h1 className="hero__names" data-anim="hero-item">
              {hero.names}
            </h1>
            <span className="rule hero__rule" data-anim="hero-rule" />
            <p className="hero__date caps" data-anim="hero-item">
              {hero.date}
            </p>
          </div>
        </div>
        <Divider {...edge} edge="bottom" fill={133.6} stripOffset={0} stripHeight={211} stripWidth={237.7} stripLeft={-68.67} />
      </section>

      {/* ---------- Welcome ---------- */}
      <section className="welcome" data-section="welcome">
        <div className="welcome__head">
          <img className="welcome__rings sketch" src={assets.rings} alt="" data-anim="rings" />
          <div className="welcome__title-row">
            <img className="welcome__branch sketch" src={assets.branch} alt="" data-anim="branch-left" />
            <h2 className="welcome__title script" data-anim="reveal">
              {welcome.title}
            </h2>
            <img className="welcome__branch welcome__branch--flip sketch" src={assets.branch} alt="" data-anim="branch-right" />
          </div>
        </div>
        <p className="welcome__body copy" data-anim="reveal">
          <Rich text={welcome.body} />
        </p>
        <h3 className="welcome__label caps" data-anim="reveal">
          {welcome.daysLabel}
        </h3>
        <ol className="days">
          {welcome.days.map((d) => (
            <li key={d.day} className={`day${d.active ? " day--active" : ""}`} data-anim="day">
              <span className="day__circle">
                {d.active && <span className="day__pulse" aria-hidden />}
                {d.day}
              </span>
              <span className="day__month">{d.month}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- The Weekend ---------- */}
      <section className="weekend" data-section="weekend">
        {design.weekendTexture && <BgPhoto src={assets.sagePaper} quality={70} />}
        <Divider {...edge} edge="top" fill={65.8} stripOffset={9.1} stripHeight={190.7} stripWidth={214.8} stripLeft={-57.17} />
        <div className="weekend__inner">
          <div className="weekend__col">
            <div className="weekend__heading" data-anim="reveal">
              <h2 className="weekend__title script">{weekend.title}</h2>
              <p className="weekend__subtitle caps">{weekend.subtitle}</p>
            </div>
            <div className="timeline">
              <span className="timeline__line" aria-hidden data-anim="timeline-line" />
              <ol className="timeline__list">
              {weekend.events.map((e, i) => (
                <li key={i} className="event" data-anim="event">
                  <span className="event__dot" aria-hidden />
                  <span className={`event__icon event__icon--${e.icon}`} aria-hidden>
                    <img className="sketch" src={e.icon === "rings" ? assets.rings : assets.champagne} alt="" />
                  </span>
                  <span className="event__text">
                    <span className="event__time">{e.time}</span>
                    <span className="event__title">{e.title}</span>
                    <span className="event__place">{e.place}</span>
                  </span>
                </li>
              ))}
              </ol>
            </div>
          </div>
          <div className={`weekend__art weekend__art--${design.weekendArt}`} data-anim="mountain">
            <WeekendArt kind={design.weekendArt} assets={assets} />
          </div>
        </div>
        <Divider {...edge} edge="bottom" fill={126.7} stripOffset={11.9} stripHeight={190.7} stripWidth={214.8} stripLeft={-57.17} />
      </section>

      {/* ---------- Dress code ---------- */}
      <section className="dress" data-section="dress">
        <h2 className="dress__title script" data-anim="reveal">
          {dressCode.title}
        </h2>
        <p className="dress__subtitle caps" data-anim="reveal">
          {dressCode.subtitle}
        </p>
        <p className="dress__body copy" data-anim="reveal">
          <Rich text={dressCode.body} />
        </p>
        <ul className="swatches">
          {dressCode.swatches.map((s) => (
            <li key={s.name} className="swatch" data-anim="swatch">
              <span className="swatch__chip" style={{ "--swatch": s.color } as React.CSSProperties}>
                <span />
              </span>
              <span className="swatch__name">{s.name}</span>
            </li>
          ))}
        </ul>
        <span className="rule dress__rule" data-anim="rule" />
        <p className="dress__note copy" data-anim="reveal">
          <Rich text={dressCode.note} />
        </p>
      </section>

      {/* ---------- A few words ---------- */}
      <section className="words" data-section="words">
        <div className="polaroids">
          <PhotoFrame kind={design.photoFrame} position="back" photo={fewWords.photos[0]} assets={assets} />
          <PhotoFrame kind={design.photoFrame} position="front" photo={fewWords.photos[1]} assets={assets} />
        </div>
        <div className="words__col">
          <h2 className="words__title script" data-anim="reveal">
            {fewWords.title}
          </h2>
          <p className="words__body copy" data-anim="reveal">
            <Rich text={fewWords.body} />
          </p>
          {invite.story && (
            <Link className="story-link caps" href={`/${invite.slug}/our-story`} data-anim="reveal">
              {invite.story.linkLabel}
            </Link>
          )}
          <img className="words__branch sketch" src={assets.branch} alt="" data-anim="words-branch" />
        </div>
      </section>

      {/* ---------- RSVP ---------- */}
      <section className="rsvp" data-section="rsvp" id="rsvp">
        <Backdrop backdrop={design.backdrop} />
        <Divider {...edge} edge="top" fill={79.6} stripOffset={5.9} stripHeight={211} stripWidth={237.7} stripLeft={-68.67} />
        <RsvpForm invite={invite} />
      </section>
    </main>
  );
}

function useInvitationMotion(root: React.RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(q("[data-anim]"), { autoAlpha: 1 });
        gsap.set(q(".page-veil"), { autoAlpha: 0 });
      });

      // gsap.from() animates *to* each element's CSS state, so static CSS
      // rotate/scale (polaroids, mirrored branch) survive the animation.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const inView = (trigger: Element, start = "top 85%") => revealOnce(trigger, start);

        /* Hero intro */
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .to(q(".page-veil"), { autoAlpha: 0, duration: 0.8, ease: "power1.out" }, 0)
          .from(q(".hero [data-parallax]"), { scale: 1.14, duration: 2.8, ease: "power2.out" }, 0)
          .from(q("[data-anim=hero-card]"), { autoAlpha: 0, y: 70, scale: 0.94, duration: 1.3 }, 0.25)
          .from(q("[data-anim=hero-envelope]"), { autoAlpha: 0, y: 90, duration: 1.2 }, 0.75)
          .from(q("[data-anim=hero-item]"), { autoAlpha: 0, y: 14, duration: 0.9, stagger: 0.14 }, 1.0)
          .from(q("[data-anim=hero-rule]"), { autoAlpha: 0, scaleX: 0, duration: 0.9, ease: "power2.inOut" }, 1.35);

        /* Background parallax */
        gsap.to(q(".hero [data-parallax]"), {
          yPercent: 6,
          ease: "none",
          scrollTrigger: { trigger: q(".hero")[0], start: "top top", end: "bottom top", scrub: true },
        });
        gsap.fromTo(
          q(".rsvp [data-parallax]"),
          { yPercent: -5 },
          { yPercent: 5, ease: "none", scrollTrigger: { trigger: q(".rsvp")[0], start: "top bottom", end: "bottom top", scrub: true } },
        );

        /* Generic reveals */
        q("[data-anim=reveal]").forEach((el) => {
          gsap.from(el, { autoAlpha: 0, y: 34, duration: 1.1, ease: "power3.out", scrollTrigger: inView(el) });
        });

        /* Welcome */
        gsap
          .timeline({ scrollTrigger: inView(q(".welcome__head")[0], "top 80%"), defaults: { ease: "power3.out", duration: 1.2 } })
          .from(q("[data-anim=rings]"), { autoAlpha: 0, y: -30, rotation: -10 })
          .from(q("[data-anim=branch-left]"), { autoAlpha: 0, x: -40, rotation: -8 }, 0.15)
          .from(q("[data-anim=branch-right]"), { autoAlpha: 0, x: 40, rotation: 8 }, 0.15);

        gsap.from(q("[data-anim=day]"), {
          autoAlpha: 0,
          y: 20,
          scale: 0.7,
          duration: 0.8,
          ease: "back.out(1.8)",
          stagger: 0.09,
          scrollTrigger: inView(q(".days")[0], "top 90%"),
        });
        gsap.fromTo(
          q(".day__pulse"),
          { opacity: 0.7, scale: 1 },
          { opacity: 0, scale: 1.45, duration: 2, ease: "power1.out", repeat: -1, repeatDelay: 0.6, delay: 1 },
        );

        /* Weekend timeline */
        gsap.fromTo(
          q("[data-anim=timeline-line]"),
          { autoAlpha: 1, scaleY: 0 },
          { scaleY: 1, duration: 1.8, ease: "power2.inOut", scrollTrigger: inView(q(".timeline")[0], "top 80%") },
        );
        q("[data-anim=event]").forEach((el) => {
          gsap
            .timeline({ scrollTrigger: inView(el, "top 82%"), defaults: { ease: "power3.out" } })
            .from(el, { autoAlpha: 0, x: -24, duration: 0.9 })
            .from(el.querySelector(".event__dot"), { scale: 0, duration: 0.6, ease: "back.out(3)" }, 0.1)
            .from(el.querySelector(".event__icon img"), { rotation: -12, scale: 0.85, duration: 1 }, 0.1);
        });
        const mountain = q("[data-anim=mountain]")[0];
        gsap.from(mountain, { autoAlpha: 0, y: 50, duration: 1.6, ease: "power2.out", scrollTrigger: inView(mountain, "top 80%") });
        gsap.fromTo(
          mountain.firstElementChild,
          { yPercent: 3 },
          { yPercent: -3, ease: "none", scrollTrigger: { trigger: mountain, start: "top bottom", end: "bottom top", scrub: true } },
        );

        /* Dress code */
        gsap.from(q("[data-anim=swatch]"), {
          autoAlpha: 0,
          y: 30,
          scale: 0.75,
          duration: 0.85,
          ease: "back.out(1.7)",
          stagger: 0.1,
          scrollTrigger: inView(q(".swatches")[0], "top 88%"),
        });
        q("[data-anim=rule]").forEach((el) => {
          gsap.from(el, { autoAlpha: 0, scaleX: 0, duration: 1, ease: "power2.inOut", scrollTrigger: inView(el, "top 92%") });
        });

        /* A few words */
        gsap.from(q("[data-anim=polaroid]"), {
          autoAlpha: 0,
          y: -70,
          rotation: (i: number) => (i === 0 ? "+=14" : "-=16"),
          duration: 1.3,
          ease: "back.out(1.3)",
          stagger: 0.3,
          scrollTrigger: inView(q(".polaroids")[0], "top 80%"),
        });
        const branch = q("[data-anim=words-branch]")[0];
        gsap.from(branch, { autoAlpha: 0, x: -30, rotation: "-=12", duration: 1.4, ease: "power3.out", scrollTrigger: inView(branch, "top 92%") });

        /* RSVP */
        const card = q("[data-anim=rsvp]")[0];
        gsap.from(card, { autoAlpha: 0, y: 80, duration: 1.3, ease: "power3.out", scrollTrigger: inView(card, "top 90%") });

        // Web fonts can shift layout after load; keep trigger positions honest.
        document.fonts?.ready.then(() => ScrollTrigger.refresh());
      });
    },
    { scope: root },
  );
}
