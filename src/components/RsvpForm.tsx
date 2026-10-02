"use client";

import { useState } from "react";
import type { Invite } from "@/invites/types";

/**
 * Visual recreation of the Canva RSVP widget. Submissions are not sent
 * anywhere yet — wire `onSubmit` to an API route / form service.
 */
export function RsvpForm({ invite }: { invite: Invite }) {
  const { rsvp } = invite;
  const [sent, setSent] = useState(false);

  return (
    <div className="rsvp__card" data-anim="rsvp">
      {sent ? (
        <p className="rsvp__thanks" role="status">
          {rsvp.thankYou}
        </p>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <div className="rsvp__group">
            <label className="rsvp__label" htmlFor="rsvp-name">
              {rsvp.nameLabel}
            </label>
            <input id="rsvp-name" name="name" className="rsvp__input" autoComplete="name" required />
          </div>

          <fieldset className="rsvp__group rsvp__options">
            <legend className="rsvp__label">{rsvp.attendanceLabel}</legend>
            {rsvp.attendanceOptions.map((option) => (
              <label key={option} className="rsvp__option rsvp__option--tall">
                <input type="radio" name="attendance" value={option} required />
                {option}
              </label>
            ))}
          </fieldset>

          <fieldset className="rsvp__group rsvp__options">
            <legend className="rsvp__label">{rsvp.mealLabel}</legend>
            {rsvp.mealOptions.map((option) => (
              <label key={option} className="rsvp__option">
                <input type="radio" name="meal" value={option} />
                {option}
              </label>
            ))}
          </fieldset>

          <button type="submit" className="rsvp__submit">
            {rsvp.submitLabel}
          </button>
        </form>
      )}
    </div>
  );
}
