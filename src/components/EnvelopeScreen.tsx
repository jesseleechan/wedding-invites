"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import { Backdrop, TintImage } from "@/components/variants";
import { themeStyle } from "@/invites";
import type { Invite } from "@/invites/types";
import { gsap, useGSAP } from "@/lib/gsap";

export function EnvelopeScreen({ invite }: { invite: Invite }) {
  const root = useRef<HTMLElement>(null);
  const opening = useRef(false);
  const router = useRouter();
  const href = `/${invite.slug}/home`;
  const { envelope, assets, design } = invite;

  useGSAP(
    () => {
      router.prefetch(href);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.fromTo("[data-parallax]", { scale: 1.12 }, { scale: 1, duration: 2.8, ease: "power2.out" }, 0)
          .fromTo(".envelope-page__heading", { autoAlpha: 0, y: -18 }, { autoAlpha: 1, y: 0, duration: 1.1 }, 0.3)
          .fromTo(
            ".envelope__body",
            { autoAlpha: 0, y: 60, scale: 0.94 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 1.3 },
            0.45,
          )
          .fromTo(
            ".envelope__seal",
            { autoAlpha: 0, scale: 0.2, rotation: -40 },
            { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.9, ease: "back.out(2.2)" },
            1.15,
          )
          .fromTo(
            ".envelope__monogram",
            { autoAlpha: 0, y: 6 },
            { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.15 },
            1.5,
          )
          .fromTo(".envelope-page__cta", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.9 }, 1.6)
          .add(() => {
            // Idle: gentle float + breathing call to action
            gsap.to(".envelope", { y: -7, duration: 2.4, ease: "sine.inOut", yoyo: true, repeat: -1 });
            gsap.to(".envelope-page__cta", { opacity: 0.55, duration: 1.4, ease: "sine.inOut", yoyo: true, repeat: -1 });
          });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set("[data-anim]", { autoAlpha: 1 });
      });
    },
    { scope: root },
  );

  function open() {
    if (opening.current || !root.current) return;
    opening.current = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      router.push(href);
      return;
    }

    const q = gsap.utils.selector(root.current);
    gsap.killTweensOf(q(".envelope, .envelope-page__cta"));
    gsap
      .timeline({ onComplete: () => router.push(href) })
      .to(q(".envelope__seal"), { scale: 1.15, duration: 0.22, ease: "power2.out" })
      .to(q(".envelope__seal"), { scale: 0, rotation: 60, autoAlpha: 0, duration: 0.45, ease: "back.in(2)" })
      .to(q(".envelope-page__heading, .envelope-page__cta"), { autoAlpha: 0, y: 10, duration: 0.4 }, "<")
      .to(q(".envelope"), { y: -18, scale: 1.04, duration: 0.35, ease: "power2.out" }, "-=0.1")
      .to(q(".envelope"), { y: "70vh", rotation: 5, scale: 0.9, autoAlpha: 0, duration: 0.8, ease: "power3.in" })
      .to(q("[data-parallax]"), { scale: 1.08, duration: 1.1, ease: "power2.in" }, "<-0.3")
      .to(q(".page-veil"), { autoAlpha: 1, duration: 0.55, ease: "power1.inOut" }, "-=0.45");
  }

  return (
    <main ref={root} className="envelope-page" style={themeStyle(invite)}>
      <Backdrop backdrop={design.backdrop} priority />

      <h1 className="envelope-page__heading" data-anim>
        {envelope.heading}
      </h1>

      <button type="button" className="envelope" onClick={open} aria-label={envelope.cta}>
        <span className="envelope__body" data-anim>
          <TintImage src={assets.envelope} width={1600} height={1418} tint={design.envelopeTint} priority sizes="(max-width: 700px) 100vw, 740px" />
        </span>
        <span className="envelope__seal" data-anim>
          <TintImage className="envelope__wax" src={assets.waxSeal} width={685} height={672} tint={design.sealTint} sizes="180px" />
          <span className="envelope__monogram envelope__monogram--a" data-anim>
            {envelope.monogram[0]}
          </span>
          <span className="envelope__monogram envelope__monogram--b" data-anim>
            {envelope.monogram[1]}
          </span>
        </span>
      </button>

      <p className="envelope-page__cta" data-anim aria-hidden>
        {envelope.cta}
      </p>

      <div className="page-veil" />
    </main>
  );
}
