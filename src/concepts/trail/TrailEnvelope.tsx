"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import type { TrailInvite } from "@/invites/types";
import { gsap, useGSAP } from "@/lib/gsap";
import { DoodleArrow, MAP_H, MAP_W, MAP_X, MapCover, MapInside, Patch, Postmark, Stamp, Topo } from "./art";
import "./trail.css";

/**
 * Kraft mailer → flip → peel sticker → open flap → slide out the folded trail
 * map → unfold its panels → zoom into the X → the invitation.
 */
export function TrailEnvelope({ invite }: { invite: TrailInvite }) {
  const root = useRef<HTMLElement>(null);
  const opening = useRef(false);
  const router = useRouter();
  const href = `/${invite.slug}/home`;
  const { envelope, couple, date, place } = invite;

  useGSAP(
    () => {
      router.prefetch(href);
      const q = gsap.utils.selector(root);
      // Folded state of the map (side panels lie on top of the centre panel)
      gsap.set(q(".map__panel--left"), { rotationY: 180, z: 2, transformOrigin: "100% 50%" });
      gsap.set(q(".map__panel--right"), { rotationY: -180, z: 1, transformOrigin: "0% 50%" });

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(q(".tenv__topo"), { autoAlpha: 0, scale: 1.08, duration: 2.4, ease: "power2.out" }, 0)
          .from(q(".tenv__kicker"), { autoAlpha: 0, y: -16, duration: 0.9 }, 0.2)
          .from(q(".tenv__env"), { autoAlpha: 0, y: 120, rotation: -8, duration: 1.3, ease: "back.out(1.2)" }, 0.35)
          .from(q(".tenv__stamp"), { autoAlpha: 0, scale: 1.6, rotation: 20, duration: 0.6, ease: "back.out(2)" }, 1.1)
          .from(q(".tenv__postmark"), { autoAlpha: 0, scale: 1.4, duration: 0.25, ease: "power4.in" }, 1.55)
          .from(q(".tenv__address p"), { autoAlpha: 0, x: -14, duration: 0.6, stagger: 0.12 }, 1.2)
          .from(q(".tenv__cta"), { autoAlpha: 0, y: 12, duration: 0.8 }, 1.7)
          .add(() => {
            gsap.to(q(".tenv__env"), { y: -8, rotation: 0.6, duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1 });
            gsap.to(q(".tenv__cta svg"), { x: 6, y: 4, duration: 0.9, ease: "sine.inOut", yoyo: true, repeat: -1 });
          });
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(q("[data-anim]"), { autoAlpha: 1 });
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
    const env = q(".tenv__env")[0] as HTMLElement;
    const wrap = q(".map-wrap")[0] as HTMLElement;
    const map = q(".map")[0] as HTMLElement;
    gsap.killTweensOf([env, q(".tenv__cta svg")]);

    const envBox = () => env.getBoundingClientRect();
    const mapBox = () => wrap.getBoundingClientRect();
    // Unfolded map is three panels wide; keep it inside the viewport
    const fitScale = () => Math.min(1.35, (window.innerWidth * 0.94) / (mapBox().width * 3));

    gsap
      .timeline({ defaults: { ease: "power3.inOut" }, onComplete: () => router.push(href) })
      .to(q(".tenv__cta, .tenv__kicker"), { autoAlpha: 0, duration: 0.4 }, 0)
      .to(env, { y: -14, rotation: 0, scale: 1.03, duration: 0.4 }, 0)
      // flip the envelope over
      .to(q(".tenv__front"), { scaleX: 0, duration: 0.32, ease: "power2.in" }, 0.25)
      .set(q(".tenv__back"), { autoAlpha: 1, scaleX: 0 })
      .to(q(".tenv__back"), { scaleX: 1, duration: 0.38, ease: "power2.out" })
      // peel the trail patch
      .to(q(".tenv__sticker"), { rotation: 28, x: 90, y: -70, autoAlpha: 0, duration: 0.6, ease: "power2.in" }, "+=0.1")
      // open the flap; once past vertical it tucks behind the map
      .to(q(".tenv__flap"), { rotationX: 180, transformPerspective: 1600, duration: 0.75, ease: "power2.inOut" }, "-=0.15")
      .set(q(".tenv__flap"), { zIndex: 1 }, "-=0.38")
      // slide the folded map out
      .to(wrap, { y: () => -mapBox().height * 0.95, duration: 0.8, ease: "power2.out" })
      // drop the envelope away and bring the map to centre
      .to(q(".tenv__inside, .tenv__pocket, .tenv__flap"), { y: "70vh", rotation: 6, autoAlpha: 0, duration: 0.8, ease: "power2.in" }, "+=0.05")
      .to(
        wrap,
        {
          y: () => {
            const e = envBox();
            const m = mapBox();
            const current = Number(gsap.getProperty(wrap, "y"));
            return current + (e.top + e.height / 2) - (m.top + m.height / 2);
          },
          duration: 0.8,
        },
        "<",
      )
      .to(map, { scale: fitScale, duration: 0.8 }, "<")
      // unfold the panels
      .to(q(".map__panel--left"), { rotationY: 0, duration: 0.85 })
      .to(q(".map__panel--right"), { rotationY: 0, duration: 0.85 }, "-=0.35")
      .to(q(".tenv__mapnote"), { autoAlpha: 1, y: 0, duration: 0.5 }, "-=0.2")
      // zoom into the X, then hand over to the invitation
      // the wrapper isn't scaled yet, so moving its origin onto the X doesn't jump
      .set(
        wrap,
        {
          transformOrigin: () => {
            const w = wrap.offsetWidth;
            const h = wrap.offsetHeight;
            const s = Number(gsap.getProperty(map, "scale"));
            const x = (MAP_X.x / MAP_W) * 3 * w - w;
            const y = (MAP_X.y / MAP_H) * h;
            return `${w / 2 + (x - w / 2) * s}px ${h / 2 + (y - h / 2) * s}px`;
          },
        },
        "+=0.9",
      )
      .to(wrap, { scale: 6, duration: 1.2, ease: "power3.in" })
      .to(q(".tenv__mapnote"), { autoAlpha: 0, duration: 0.3 }, "<")
      .to(q(".page-veil"), { autoAlpha: 1, duration: 0.45, ease: "power1.in" }, "-=0.45");
  }

  return (
    <main ref={root} className="trail-root tenv">
      <Topo className="tenv__topo" seed={3} summits={5} rings={16} gap={30} />

      <p className="tenv__kicker" data-anim>
        {envelope.kicker} · {place.name}, {place.region}
      </p>

      <div className="tenv__stage">
        <button type="button" className="tenv__env" onClick={open} aria-label={`${envelope.cta} — invitation from ${couple.names.join(" & ")}`} data-anim>
          {/* Back: interior, folded map, pocket flaps, top flap and sticker */}
          <span className="tenv__back">
            <span className="tenv__inside" />
            <span className="map-wrap">
            <span className="map">
              <span className="map__panel map__panel--left">
                <span className="map__face">
                  <MapInside panel={0} names={couple.names} date={date.long} />
                </span>
                <span className="map__face map__face--back">
                  <MapCover initials={couple.initials} date={date.short} />
                </span>
              </span>
              <span className="map__panel map__panel--center">
                <span className="map__face">
                  <MapInside panel={1} names={couple.names} date={date.long} />
                </span>
              </span>
              <span className="map__panel map__panel--right">
                <span className="map__face">
                  <MapInside panel={2} names={couple.names} date={date.long} />
                </span>
                <span className="map__face map__face--back map__face--plain" />
              </span>
            </span>
            </span>
            <svg className="tenv__pocket" viewBox="0 0 300 200" preserveAspectRatio="none" aria-hidden>
              <path d="M0,0 L150,112 L0,200 Z" fill="#bd9168" />
              <path d="M300,0 L150,112 L300,200 Z" fill="#b88b62" />
              <path d="M0,200 L150,92 L300,200 Z" fill="#c69c72" />
              <path d="M0,200 L150,92 L300,200" fill="none" stroke="#9c7450" strokeWidth="0.6" />
            </svg>
            <span className="tenv__flap">
              <svg viewBox="0 0 300 124" preserveAspectRatio="none" aria-hidden>
                <path d="M0,0 H300 L162,118 Q150,128 138,118 Z" fill="#c59a70" />
                <path d="M0,0 L138,118 Q150,128 162,118 L300,0" fill="none" stroke="#9c7450" strokeWidth="0.8" />
              </svg>
            </span>
            <Patch className="tenv__sticker" initials={couple.initials} year={String(date.year)} />
          </span>

          {/* Front: airmail border, stamp, postmark, handwritten address */}
          <span className="tenv__front">
            <span className="tenv__label">First class · Handle with love</span>
            <Stamp className="tenv__stamp" />
            <Postmark className="tenv__postmark" text={`${place.name.toUpperCase()} · ${place.region.toUpperCase()} · `} />
            <span className="tenv__address">
              {envelope.to.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </span>
            <span className="tenv__from">from: {envelope.from}</span>
          </span>
        </button>
        <p className="tenv__mapnote" aria-hidden>
          follow the trail ↗
        </p>
      </div>

      <p className="tenv__cta" data-anim>
        {envelope.cta}
        <DoodleArrow />
      </p>

      <div className="page-veil trail-veil" />
    </main>
  );
}
