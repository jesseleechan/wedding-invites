"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger, MotionPathPlugin);

// Dev helper: add ?fast to the URL to speed animations up while designing.
if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
  if (new URLSearchParams(window.location.search).has("fast")) {
    gsap.ticker.lagSmoothing(0);
    gsap.globalTimeline.timeScale(20);
  }
}

/**
 * ScrollTrigger config for a reveal that plays once.
 * Deliberately not `once: true`: after a client-side navigation the new page
 * mounts while the window is still scrolled down, so `once` triggers that are
 * already past fire and kill themselves inside ScrollTrigger's refresh loop,
 * which throws ("reading 'end'") and takes the page down.
 */
export function revealOnce(trigger: Element | null | undefined, start = "top 85%") {
  return { trigger, start, toggleActions: "play none none none" };
}

export { gsap, ScrollTrigger, useGSAP };
