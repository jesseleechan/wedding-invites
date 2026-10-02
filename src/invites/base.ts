import type { Invite, InviteAssets } from "./types";

const g = (file: string) => `/invites/green/${file}`;

/** The assets recovered from the original Canva design; variations reuse them. */
export const baseAssets: InviteAssets = {
  envelope: g("envelope.png"),
  card: g("card.png"),
  waxSeal: g("wax-seal.png"),
  tornPaper: g("torn-paper.png"),
  sagePaper: g("sage-paper.png"),
  sprig: g("sprig.png"),
  rings: g("rings.svg"),
  champagne: g("champagne.svg"),
  branch: g("branch.svg"),
  mountain: g("mountain.svg"),
  polaroidFrame: g("polaroid-frame.png"),
  polaroidShadow: g("polaroid-shadow.png"),
};

export const basePhotos: [string, string] = [g("photo-embrace.jpg"), g("photo-forest.jpg")];

export const baseRsvp: Invite["rsvp"] = {
  nameLabel: "Your name",
  attendanceLabel: "Will you be attending our wedding?",
  attendanceOptions: ["Joyfully accepts", "Regretfully declines"],
  mealLabel: "Choice of entrée",
  mealOptions: ["Meat", "Seafood", "Vegetarian"],
  submitLabel: "Submit",
  thankYou: "Thank you — we can’t wait to celebrate with you.",
};
