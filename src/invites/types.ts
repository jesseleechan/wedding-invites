export type EventIcon = "champagne" | "rings";

export type InviteTheme = {
  /** Page / paper background */
  paper: string;
  /** Headings, names, schedule text */
  ink: string;
  /** Paragraph copy */
  body: string;
  /** Active date circle + date numerals */
  accent: string;
  /** Text on top of the accent colour */
  onAccent: string;
  /** Inactive date circles */
  circle: string;
  /** Small italic labels ("oct", swatch names) */
  label: string;
  /** RSVP card */
  formBg: string;
  formInk: string;
  /** RSVP option background */
  field: string;
  /** RSVP submit button */
  button: string;
  /** Text on top of photos / scenes (envelope page) */
  onPhoto: string;
  /** Hero card paper + text */
  cardBg: string;
  cardInk: string;
  /** Fallback behind the hero / RSVP backdrop */
  heroBg: string;
  /** "The Weekend" section background */
  weekendBg: string;
  /** Timeline line + dots (defaults to body) */
  timeline?: string;
  /** Text shadow for headings sitting on the backdrop */
  photoTextShadow?: string;
};

export type InviteAssets = {
  envelope: string;
  card: string;
  waxSeal: string;
  tornPaper: string;
  sagePaper: string;
  sprig: string;
  rings: string;
  champagne: string;
  branch: string;
  mountain: string;
  polaroidFrame: string;
  polaroidShadow: string;
};

export type SceneName = "night" | "garden" | "desert";

/** Colour an image (envelope, wax seal) while keeping its paper texture */
export type Tint = {
  color: string;
  /** CSS mix-blend-mode, defaults to "color" */
  blend?: string;
  /** Extra CSS filter on the source image, e.g. "brightness(.7)" */
  filter?: string;
};

export type FontSet = {
  /** Script headings ("Welcome", "The Weekend") */
  script: string;
  /** Spaced capitals ("THE BIG DAY") */
  caps: string;
  /** Paragraph copy */
  body: string;
  /** Couple's names on the hero card */
  names: string;
  /** Letter spacing for .caps */
  capsTracking?: string;
  /** Multiplier for script heading sizes (fonts differ in x-height) */
  scriptScale?: number;
  /** Italic display instead of a true script (e.g. Playfair italic) */
  scriptItalic?: boolean;
  /** Letter spacing + size multiplier for the names on the hero card */
  namesTracking?: string;
  namesScale?: number;
  /** Multiplier for paragraph copy (wide fonts like Lora) */
  bodyScale?: number;
};

export type Design = {
  fonts: FontSet;
  /** Hero, envelope page and RSVP backdrop */
  backdrop: { kind: "photo"; src: string } | { kind: "scene"; scene: SceneName };
  card: "ticket" | "deco" | "lace" | "sunset";
  divider: "torn" | "deco" | "scallop" | "dunes";
  dateShape: "circle" | "ring" | "arch";
  swatchShape: "circle" | "diamond" | "arch";
  photoFrame: "polaroid" | "deco" | "arch";
  weekendArt: "mountain" | "wreath" | "desert";
  /** "reverse" puts the illustration / photos on the left */
  weekendLayout: "split" | "reverse";
  wordsLayout: "split" | "reverse";
  /** Sage paper texture on the weekend section */
  weekendTexture: boolean;
  /** CSS filter for the pencil sketches (rings, branches, mountain) */
  sketchFilter?: string;
  envelopeTint?: Tint;
  sealTint?: Tint;
  /** Keep Canva's small off-centre offsets (the original design only) */
  canvaOffsets?: boolean;
};

export type StoryChapter = {
  year: string;
  title: string;
  body: string;
  /** Pencil sketch shown beside the chapter */
  art: "mountain" | "champagne" | "branch" | "rings" | "seal";
};

/** Optional "Our Story" page (/[invite]/our-story) */
export type Story = {
  hero: { kicker: string; title: string; since: string };
  intro: { title: string; body: string };
  journey: { title: string; subtitle: string; chapters: StoryChapter[] };
  quote: string;
  proposal: { title: string; subtitle: string; body: string; photos: [string, string] };
  closing: { title: string; body: string; invitationCta: string; rsvpCta: string };
  /** Link text on the invitation page */
  linkLabel: string;
};

export type Invite = {
  slug: string;
  /** Short name for the gallery */
  name: string;
  tagline: string;
  meta: { title: string; description: string };
  theme: InviteTheme;
  design: Design;
  assets: InviteAssets;
  envelope: {
    heading: string;
    cta: string;
    monogram: [string, string];
  };
  hero: {
    kicker: string[];
    names: string;
    date: string;
  };
  welcome: {
    title: string;
    /** Wrap words in *asterisks* for italics */
    body: string;
    daysLabel: string;
    days: { day: string; month: string; active?: boolean }[];
  };
  weekend: {
    title: string;
    subtitle: string;
    events: { time: string; title: string; place: string; icon: EventIcon }[];
  };
  dressCode: {
    title: string;
    subtitle: string;
    body: string;
    note: string;
    swatches: { name: string; color: string }[];
  };
  fewWords: {
    title: string;
    body: string;
    /** [back photo, front photo] */
    photos: [string, string];
  };
  rsvp: {
    nameLabel: string;
    attendanceLabel: string;
    attendanceOptions: string[];
    mealLabel: string;
    mealOptions: string[];
    submitLabel: string;
    thankYou: string;
  };
  story?: Story;
};

/* ------------------------------------------------------------------ *
 * "The Trail" concept — a field-guide hike rather than a themed card.
 * ------------------------------------------------------------------ */

export type TrailStop = {
  /** Shown on the mile sign + journal page, e.g. "0.0" */
  mile: string;
  /** Short sign label, e.g. "Trailhead" */
  sign: string;
  title: string;
};

export type TrailInvite = {
  concept: "trail";
  slug: string;
  name: string;
  tagline: string;
  meta: { title: string; description: string };
  couple: { names: [string, string]; initials: [string, string] };
  date: {
    /** As printed on the poster, e.g. "10.04.27" */
    short: string;
    long: string;
    year: number;
    /** 0-based like JS Date */
    month: number;
    day: number;
    /** Highlighted range on the calendar */
    weekend: [number, number];
  };
  place: { name: string; region: string; coords: string; elevation: string };
  envelope: { kicker: string; to: string[]; from: string; cta: string };
  hero: { eyebrow: string; tagline: string; scrollHint: string };
  welcome: TrailStop & { body: string; note: string; signature: string };
  bigDay: TrailStop & { note: string };
  weekend: TrailStop & {
    events: { time: string; title: string; place: string }[];
  };
  pack: TrailStop & { intro: string; items: string[]; swatches: { name: string; color: string }[] };
  notes: TrailStop & { body: string; photos: [string, string]; captions: [string, string] };
  register: TrailStop & {
    intro: string;
    nameLabel: string;
    attendanceLabel: string;
    attendanceOptions: string[];
    mealLabel: string;
    mealOptions: string[];
    submitLabel: string;
    stamp: string;
    thankYou: string;
  };
  footer: { line: string; sub: string };
};
