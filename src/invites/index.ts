import { blush } from "./blush";
import { desert } from "./desert";
import { green } from "./green";
import { midnight } from "./midnight";
import { trail } from "./trail";
import type { Invite, TrailInvite } from "./types";

/** Themed variations of the Canva layout */
export const inviteList: Invite[] = [green, midnight, blush, desert];

/** Completely different concepts with their own components */
export const conceptList: TrailInvite[] = [trail];

export type AnyInvite = Invite | TrailInvite;

export const invites: Record<string, AnyInvite> = Object.fromEntries(
  [...inviteList, ...conceptList].map((i) => [i.slug, i]),
);

export const defaultInvite = green;

export function getInvite(slug: string): AnyInvite | undefined {
  return invites[slug];
}

export function isTrail(invite: AnyInvite): invite is TrailInvite {
  return "concept" in invite && invite.concept === "trail";
}

export function themeStyle(invite: Invite): React.CSSProperties {
  const t = invite.theme;
  const f = invite.design.fonts;
  return {
    "--paper": t.paper,
    "--ink": t.ink,
    "--body": t.body,
    "--accent": t.accent,
    "--on-accent": t.onAccent,
    "--circle": t.circle,
    "--label": t.label,
    "--form-bg": t.formBg,
    "--form-ink": t.formInk,
    "--field": t.field,
    "--button": t.button,
    "--on-photo": t.onPhoto,
    "--card-bg": t.cardBg,
    "--card-ink": t.cardInk,
    "--hero-bg": t.heroBg,
    "--weekend-bg": t.weekendBg,
    "--timeline": t.timeline ?? t.body,
    "--photo-text-shadow": t.photoTextShadow ?? "none",
    "--body-scale": f.bodyScale ?? 1,
    "--f-script": f.script,
    "--f-caps": f.caps,
    "--f-body": f.body,
    "--f-names": f.names,
    "--caps-tracking": f.capsTracking ?? "0.153em",
    "--names-tracking": f.namesTracking ?? "0.08em",
    "--names-scale": f.namesScale ?? 1,
    "--script-scale": f.scriptScale ?? 1,
    "--script-style": f.scriptItalic ? "italic" : "normal",
    "--sketch-filter": invite.design.sketchFilter ?? "none",
  } as React.CSSProperties;
}

/** Class names that switch the CSS variants for an invite's design */
export function designClasses(invite: Invite): string {
  const d = invite.design;
  return [
    `card--${d.card}`,
    `dates--${d.dateShape}`,
    `swatches--${d.swatchShape}`,
    `weekend--${d.weekendLayout}`,
    `words--${d.wordsLayout}`,
  ].join(" ");
}
