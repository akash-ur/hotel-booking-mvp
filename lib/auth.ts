/**
 * TEMPORARY auth stub.
 * The Identity module (Clerk / Auth.js) isn't wired up yet — per the
 * meeting, auth is optional for this MVP pass. Booking creation still
 * requires "some" userId per BE-6, so we hardcode one here.
 *
 * When real auth is added, replace `getCurrentUserId()` with a call to
 * the session/auth provider (e.g. Clerk's `auth()`), and nothing else
 * in the booking flow needs to change.
 */
export function getCurrentUserId(): string {
  return "demo-user-001";
}
