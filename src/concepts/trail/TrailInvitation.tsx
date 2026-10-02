"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import { Rich } from "@/components/shared";
import type { TrailInvite, TrailStop } from "@/invites/types";
import { gsap, revealOnce, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { Campfire, CheckMark, Compass, DoodleArrow, Patch, pine, PosterScene, ScribbleCircle, Stamp, Topo } from "./art";
import "./trail.css";

export function TrailInvitation({ invite }: { invite: TrailInvite }) {
  const root = useRef<HTMLElement>(null);
  const trailRef = useRef<HTMLElement>(null);
  const path = useTrailPath(trailRef);
  useTrailMotion(root, path.d);

  const { couple, date, place, hero, welcome, bigDay, weekend, pack, notes, register, footer } = invite;

  return (
    <main ref={root} className="trail-root tinv">
      <div className="page-veil page-veil--start trail-veil" />

      {/* ---------------- Poster hero ---------------- */}
      <section className="thero">
        <div className="thero__scene">
          <PosterScene className="thero__svg" />
        </div>
        <div className="thero__frame" aria-hidden />
        <header className="thero__top">
          <p className="thero__eyebrow" data-anim="hero">
            {hero.eyebrow}
          </p>
          <h1 className="thero__names" aria-label={`${couple.names[0]} & ${couple.names[1]}`}>
            <SplitWord word={couple.names[0]} />
            <span className="thero__amp" data-anim="hero" aria-hidden>
              &amp;
            </span>
            <SplitWord word={couple.names[1]} />
          </h1>
        </header>
        <Compass className="thero__compass" />
        <div className="thero__bottom">
        <div className="thero__band" data-anim="hero">
          <span>
            {place.name}, {place.region}
          </span>
          <strong>{date.short}</strong>
          <span>Elev. {place.elevation}</span>
        </div>
        <a className="thero__hint" href="#trail" data-anim="hero">
          {hero.scrollHint}
          <span aria-hidden />
        </a>
        </div>
      </section>

      {/* ---------------- The hike ---------------- */}
      <section className="trail" id="trail" ref={trailRef}>
        <Topo className="trail__topo" seed={9} width={1600} height={3200} summits={9} rings={13} gap={30} />
        <svg className="trail__svg" viewBox={`0 0 ${path.w} ${path.h}`} aria-hidden>
          <path className="trail__ghost" d={path.d} />
          <path className="trail__progress" d={path.d} />
        </svg>
        <span className="trail__hiker" aria-hidden>
          <span />
        </span>

        <p className="trail__intro" data-anim="reveal">
          {hero.tagline}
        </p>

        <ol className="trail__stops">
          <Stop index={0} stop={welcome}>
            <p className="journal__body">
              <Rich text={welcome.body} />
            </p>
            <p className="hand hand--note">
              {welcome.note}
              <svg viewBox="0 0 40 36" className="hand__heart" aria-hidden>
                <path className="doodle" pathLength={1} d="M20,33 C4,22 0,12 8,6 C14,2 19,6 20,11 C21,6 26,2 32,6 C40,12 36,22 20,33 Z" />
              </svg>
            </p>
            <p className="hand hand--sig">{welcome.signature}</p>
          </Stop>

          <Stop index={1} stop={bigDay}>
            <Calendar date={date} note={bigDay.note} />
          </Stop>

          <Stop index={2} stop={weekend}>
            <ElevationProfile count={weekend.events.length} />
            <ol className="itinerary">
              {weekend.events.map((e, i) => (
                <li key={i} data-anim="event">
                  <span className="itinerary__num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="itinerary__text">
                    <span className="itinerary__time">{e.time}</span>
                    <span className="itinerary__title">{e.title}</span>
                    <span className="itinerary__place">{e.place}</span>
                  </span>
                </li>
              ))}
            </ol>
          </Stop>

          <Stop index={3} stop={pack}>
            <p className="journal__body">{pack.intro}</p>
            <ul className="checklist">
              {pack.items.map((item) => (
                <li key={item}>
                  <CheckMark className="checklist__box" />
                  {item}
                </li>
              ))}
            </ul>
            <ul className="patches" aria-label="Colour palette">
              {pack.swatches.map((s) => (
                <li key={s.name} data-anim="patch">
                  <span className="patches__chip" style={{ "--swatch": s.color } as React.CSSProperties} />
                  <span className="hand">{s.name}</span>
                </li>
              ))}
            </ul>
          </Stop>

          <Stop index={4} stop={notes}>
            <div className="taped">
              {notes.photos.map((src, i) => (
                <figure key={src} className={`taped__photo taped__photo--${i}`} data-anim="photo">
                  <Image src={src} alt="" width={420} height={520} sizes="240px" />
                  <figcaption className="hand">{notes.captions[i]}</figcaption>
                </figure>
              ))}
            </div>
            <p className="journal__body">{notes.body}</p>
            <Campfire className="campfire" />
          </Stop>

          <Stop index={5} stop={register} summit>
            <TrailRegister invite={invite} />
          </Stop>
        </ol>
      </section>

      {/* ---------------- Footer ---------------- */}
      <footer className="tfoot">
        <Topo className="tfoot__topo" seed={21} summits={3} rings={12} gap={28} />
        <Patch className="tfoot__patch" initials={couple.initials} year={String(date.year)} />
        <p className="tfoot__line" data-anim="reveal">
          {footer.line}
        </p>
        <p className="tfoot__sub">{footer.sub}</p>
        <p className="tfoot__coords">{place.coords}</p>
      </footer>
    </main>
  );
}

/* ------------------------------------------------------------------ Parts */

function SplitWord({ word }: { word: string }) {
  return (
    <span className="thero__word" aria-hidden>
      {word.toUpperCase().split("").map((ch, i) => (
        <span key={i} className="thero__char">
          <span data-char>{ch}</span>
        </span>
      ))}
    </span>
  );
}

function Stop({ index, stop, summit, children }: { index: number; stop: TrailStop; summit?: boolean; children: React.ReactNode }) {
  const side = index % 2 === 0 ? "left" : "right";
  return (
    <li className={`stop stop--${side}${summit ? " stop--summit" : ""}`}>
      <article className="journal" data-anim="card">
        <p className="journal__mile">
          Mile {stop.mile} · {stop.sign}
        </p>
        <h2 className="journal__title">{stop.title}</h2>
        {children}
      </article>
      <div className="stop__marker" data-marker aria-hidden>
        <span>{summit ? "▲" : String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className="stop__aside" aria-hidden>
        <div className="signpost" data-anim="sign">
          <div className="signpost__board">
            <span className="signpost__mile">Mile {stop.mile}</span>
            <span className="signpost__name">{stop.sign}</span>
          </div>
          <span className="signpost__post" />
          <svg className="signpost__trees" viewBox="0 0 160 90">
            <path d={pine(40, 90, 80)} />
            <path d={pine(78, 90, 56)} />
            <path d={pine(118, 90, 70)} />
          </svg>
        </div>
      </div>
    </li>
  );
}

function Calendar({ date, note }: { date: TrailInvite["date"]; note: string }) {
  const first = new Date(Date.UTC(date.year, date.month, 1));
  const daysInMonth = new Date(Date.UTC(date.year, date.month + 1, 0)).getUTCDate();
  const offset = first.getUTCDay();
  const monthName = first.toLocaleString("en-US", { month: "long", timeZone: "UTC" });
  const cells = [...Array.from({ length: offset }, () => 0), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  return (
    <div className="cal">
      <div className="cal__head">
        <span>{monthName}</span>
        <span>{date.year}</span>
      </div>
      <div className="cal__grid" role="grid" aria-label={`${monthName} ${date.year}`}>
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={i} className="cal__dow" role="columnheader">
            {d}
          </span>
        ))}
        {cells.map((n, i) => {
          const inWeekend = n >= date.weekend[0] && n <= date.weekend[1];
          const isDay = n === date.day;
          return (
            <span
              key={i}
              role="gridcell"
              className={`cal__day${n ? "" : " cal__day--empty"}${inWeekend ? " cal__day--weekend" : ""}${isDay ? " cal__day--big" : ""}`}
              aria-current={isDay ? "date" : undefined}
            >
              {inWeekend && <span className="cal__hl" data-hl />}
              {n || ""}
              {isDay && <ScribbleCircle className="cal__circle" />}
              {isDay && (
                <span className="cal__note hand">
                  <DoodleArrow className="cal__arrow" />
                  {note}
                </span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}

/** Climbing elevation profile with a numbered pin per event */
function ElevationProfile({ count }: { count: number }) {
  const pts: [number, number][] = [
    [0, 205],
    [60, 168],
    [140, 186],
    [220, 122],
    [300, 142],
    [380, 74],
    [460, 98],
    [540, 42],
    [600, 56],
  ];
  // Smooth open curve through the points
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const [p1, p2] = [pts[i], pts[i + 1]];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    d += ` C${p1[0] + (p2[0] - p0[0]) / 6},${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6},${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]},${p2[1]}`;
  }
  const peaks = [pts[1], pts[3], pts[5], pts[7]].slice(0, count);

  return (
    <svg className="profile" viewBox="0 0 600 240" aria-hidden>
      <g className="profile__grid">
        {[60, 110, 160, 210].map((y) => (
          <line key={y} x1="0" x2="600" y1={y} y2={y} />
        ))}
      </g>
      <path className="profile__fill" d={`${d} L600,240 L0,240 Z`} />
      <path className="profile__line doodle" pathLength={1} d={d} />
      {peaks.map(([x, y], i) => (
        <g key={i} className="profile__pin" transform={`translate(${x} ${y})`}>
          <line x1="0" y1="0" x2="0" y2="-44" />
          <path d="M0,-44 L22,-37 L0,-30 Z" />
          <circle r="11" />
          <text y="4">{i + 1}</text>
        </g>
      ))}
      <text className="profile__label" x="4" y="234">
        Trailhead
      </text>
      <text className="profile__label" x="596" y="234" textAnchor="end">
        I do
      </text>
    </svg>
  );
}

function TrailRegister({ invite }: { invite: TrailInvite }) {
  const r = invite.register;
  const [signed, setSigned] = useState(false);
  const stampRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!signed || !stampRef.current) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.fromTo(
        stampRef.current,
        { autoAlpha: 0, scale: reduce ? 1 : 3.2, rotation: -30 },
        { autoAlpha: 1, scale: 1, rotation: -12, duration: reduce ? 0 : 0.45, ease: "power4.in" },
      );
      if (!reduce) gsap.fromTo(".register", { x: -6 }, { x: 0, duration: 0.4, ease: "elastic.out(1.2, 0.3)", delay: 0.42 });
    },
    { dependencies: [signed] },
  );

  return (
    <div className="register">
      <p className="journal__body">{r.intro}</p>
      {signed ? (
        <p className="register__thanks hand" role="status">
          {r.thankYou}
        </p>
      ) : (
        <form
          className="register__form"
          onSubmit={(e) => {
            e.preventDefault();
            setSigned(true);
          }}
        >
          <label className="register__field">
            <span className="register__label">{r.nameLabel}</span>
            <input name="name" autoComplete="name" required className="register__input" />
          </label>
          <fieldset className="register__group">
            <legend className="register__label">{r.attendanceLabel}</legend>
            <div className="register__options">
              {r.attendanceOptions.map((o) => (
                <label key={o} className="register__option">
                  <input type="radio" name="attendance" value={o} required />
                  <span>{o}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset className="register__group">
            <legend className="register__label">{r.mealLabel}</legend>
            <div className="register__options">
              {r.mealOptions.map((o) => (
                <label key={o} className="register__option">
                  <input type="radio" name="meal" value={o} />
                  <span>{o}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <button type="submit" className="register__submit">
            {r.submitLabel}
          </button>
        </form>
      )}
      {signed && (
        <div ref={stampRef} className="register__stamp" aria-hidden>
          <Stamp className="register__stamp-art" />
          <span>{r.stamp}</span>
        </div>
      )}
    </div>
  );
}

/* --------------------------------------------------------- Trail geometry */

/**
 * Measures the stop markers and threads a winding path through them, so the
 * trail always lines up with the flex layout at any screen size.
 */
function useTrailPath(trailRef: React.RefObject<HTMLElement | null>) {
  const [path, setPath] = useState({ w: 1, h: 1, d: "M0,0" });

  useLayoutEffect(() => {
    const trail = trailRef.current;
    if (!trail) return;

    const measure = () => {
      const box = trail.getBoundingClientRect();
      const markers = [...trail.querySelectorAll<HTMLElement>("[data-marker]")].map((m) => {
        const r = m.getBoundingClientRect();
        return [r.left - box.left + r.width / 2, r.top - box.top + r.height / 2] as [number, number];
      });
      if (!markers.length) return;
      const narrow = box.width < 900;
      const swing = narrow ? 16 : Math.min(84, box.width * 0.06);
      const pts: [number, number][] = [[markers[0][0], 0], ...markers, [markers[markers.length - 1][0], box.height]];
      let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
      for (let i = 1; i < pts.length; i++) {
        const [xa, ya] = pts[i - 1];
        const [xb, yb] = pts[i];
        const dy = yb - ya;
        // swing away from each journal page, toward its signpost
        const s = (i % 2 === 0 ? -1 : 1) * swing;
        d += ` C${(xa + s).toFixed(1)},${(ya + dy * 0.4).toFixed(1)} ${(xb + s).toFixed(1)},${(yb - dy * 0.4).toFixed(1)} ${xb.toFixed(1)},${yb.toFixed(1)}`;
      }
      setPath((prev) => (prev.d === d ? prev : { w: box.width, h: box.height, d }));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(trail);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [trailRef]);

  return path;
}

/* ------------------------------------------------------------- Animation */

function useTrailMotion(root: React.RefObject<HTMLElement | null>, d: string) {
  // One-off intro + reveals (not tied to the trail geometry)
  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(q("[data-anim]"), { autoAlpha: 1 });
        gsap.set(q(".page-veil"), { autoAlpha: 0 });
        gsap.set(q(".doodle"), { strokeDashoffset: 0 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const inView = (trigger: Element, start = "top 80%") => revealOnce(trigger, start);

        /* Poster */
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .to(q(".page-veil"), { autoAlpha: 0, duration: 0.7 }, 0)
          .from(q(".thero [data-layer=sun]"), { y: 260, duration: 2.4, ease: "power2.out" }, 0)
          .from(q(".thero [data-layer=rays]"), { rotation: -25, opacity: 0, transformOrigin: "0 0", duration: 2.6 }, 0)
          .from(q(".thero [data-layer=far], .thero [data-layer=mid]"), { y: 120, duration: 2, stagger: 0.1 }, 0.1)
          .from(q(".thero [data-layer=near], .thero [data-layer=front]"), { y: 160, duration: 1.8, stagger: 0.1 }, 0.25)
          .from(q(".thero__frame"), { autoAlpha: 0, scale: 1.04, duration: 1.2 }, 0.5)
          .from(q(".thero__eyebrow"), { autoAlpha: 0, y: -14, duration: 0.8 }, 0.7)
          .from(q("[data-char]"), { yPercent: 110, duration: 0.9, stagger: 0.04, ease: "power4.out" }, 0.8)
          .from(q(".thero__amp"), { autoAlpha: 0, scale: 0.3, rotation: -30, duration: 0.8, ease: "back.out(2)" }, 1.2)
          .from(q(".thero__band"), { autoAlpha: 0, y: 40, duration: 0.9 }, 1.3)
          .from(q(".thero__compass"), { autoAlpha: 0, rotation: -120, duration: 1.4 }, 1.3)
          .from(q(".thero__hint"), { autoAlpha: 0, y: 10, duration: 0.8 }, 1.7);

        // Poster layers drift apart as you scroll away
        const depth: Record<string, number> = { rays: 40, sun: 140, far: 90, mid: 60, near: 30, front: 0 };
        Object.entries(depth).forEach(([layer, y]) => {
          gsap.to(q(`.thero [data-layer=${layer}]`), {
            y,
            ease: "none",
            scrollTrigger: { trigger: q(".thero")[0], start: "top top", end: "bottom top", scrub: true },
          });
        });
        // Compass needle swings the whole way down the page
        gsap.to(q(".thero__compass [data-needle]"), {
          rotation: 540,
          svgOrigin: "60 60",
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 1 },
        });

        /* Generic reveals */
        q("[data-anim=reveal]").forEach((el) => gsap.from(el, { autoAlpha: 0, y: 30, duration: 1, ease: "power3.out", scrollTrigger: inView(el, "top 88%") }));

        /* Each stop */
        q(".stop").forEach((stop) => {
          const s = gsap.utils.selector(stop);
          const right = stop.classList.contains("stop--right");
          const tl = gsap.timeline({ scrollTrigger: inView(stop, "top 72%"), defaults: { ease: "power3.out" } });
          tl.from(s("[data-anim=card]"), { autoAlpha: 0, y: 60, rotation: right ? 4 : -4, duration: 1.1 })
            .from(s("[data-anim=sign]"), { autoAlpha: 0, rotation: right ? 10 : -10, transformOrigin: "50% 100%", duration: 1, ease: "back.out(1.6)" }, 0.2)
            .to(s(".doodle:not(.tick)"), { strokeDashoffset: 0, duration: 1, stagger: 0.15, ease: "power2.inOut" }, 0.6)
            .from(s("[data-hl]"), { scaleX: 0, transformOrigin: "0 50%", duration: 0.35, stagger: 0.08, ease: "power1.inOut" }, 0.5)
            .from(s(".profile__pin"), { autoAlpha: 0, y: -30, duration: 0.6, stagger: 0.18, ease: "bounce.out" }, 0.9)
            .from(s("[data-anim=event]"), { autoAlpha: 0, x: -16, duration: 0.6, stagger: 0.1 }, 1)
            .to(s(".tick"), { strokeDashoffset: 0, duration: 0.45, stagger: 0.3, ease: "power2.out" }, 0.8)
            .from(s("[data-anim=patch]"), { autoAlpha: 0, scale: 0.4, rotation: -40, duration: 0.6, stagger: 0.08, ease: "back.out(2)" }, 1)
            .from(s("[data-anim=photo]"), { autoAlpha: 0, y: -50, rotation: (i: number) => (i ? 18 : -18), duration: 0.9, stagger: 0.2, ease: "back.out(1.4)" }, 0.4);
        });

        // Campfire flicker
        gsap.to(q(".campfire [data-flame]"), {
          scaleY: 1.12,
          scaleX: 0.94,
          transformOrigin: "50% 100%",
          duration: 0.18,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          repeatRefresh: true,
        });

        /* Footer */
        gsap.from(q(".tfoot__patch"), { autoAlpha: 0, rotation: -180, scale: 0.4, duration: 1.4, ease: "back.out(1.5)", scrollTrigger: inView(q(".tfoot")[0], "top 85%") });
      });
    },
    { scope: root },
  );

  // Trail drawing + hiker — rebuilt whenever the measured path changes
  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const progress = root.current?.querySelector<SVGPathElement>(".trail__progress");
      const hiker = q(".trail__hiker")[0];
      if (!progress || d === "M0,0") return;
      const length = progress.getTotalLength();
      const trigger = { trigger: q(".trail")[0], start: "top 55%", end: "bottom 75%", scrub: 0.8 };

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(progress, { strokeDasharray: "none" });
        gsap.set(hiker, { autoAlpha: 0 });
      });
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(progress, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, ease: "none", scrollTrigger: trigger });
        gsap.to(hiker, {
          ease: "none",
          motionPath: { path: progress, align: progress, alignOrigin: [0.5, 0.5] },
          scrollTrigger: trigger,
        });
        q("[data-marker]").forEach((m) => {
          ScrollTrigger.create({ trigger: m, start: "top 55%", toggleClass: { targets: m, className: "is-reached" } });
        });
      });
      ScrollTrigger.refresh();
    },
    { scope: root, dependencies: [d], revertOnUpdate: true },
  );
}
