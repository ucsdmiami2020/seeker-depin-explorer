# Feature plan — community submissions

Let users propose additions to the catalog: a device they own, a network that launched, a price that
moved, a score they think is wrong. Accepted proposals ship in the next release.

Status: **planned, not built.** Written 2026-09-23 against v1.4.2.

## What the user gets

A **Suggest a device** entry point (Explore header and the help sheet) opening a short form:

| Field | Required | Why |
|---|---|---|
| Device name | yes | What to add |
| Maker / company | yes | Disambiguates clones and rebadges |
| Product URL | yes | Without a vendor page nothing can be verified |
| Network / token | no | Speeds up triage; often unknown to the submitter |
| Why it belongs | yes | Forces a case: what does it earn, and for what work |
| Evidence links | no | Reviews, explorers, deployment counts — the adoption factors |
| Your handle | no | Credit in release notes, if they want it |

A second mode, **Report a correction**, reuses the same screen pre-filled from a device page, so a
wrong price or a stale spec takes two taps.

## Constraints that shape the design

1. **No backend.** The app has none, and the Security tab makes a point of it. Adding a server would
   introduce an endpoint to secure, data to hold, and a privacy policy rewrite.
2. **No data collection.** The privacy policy states the app collects nothing. A submission feature
   must not quietly become telemetry.
3. **The catalog is compiled in.** Devices live in `src/data/devices.ts`; adding one means a release,
   not a database write. That is a feature: every entry is reviewed and scored before shipping.
4. **Reviewers see whatever users can post.** Anything displayed in-app that a stranger can write is
   user-generated content, which brings moderation duties under the publisher policy.

## Options considered

| Option | Backend | UGC shown in app | Verdict |
|---|---|---|---|
| **Prefilled GitHub issue** | none | no | **Recommended.** Public, auditable, threaded discussion, zero infrastructure |
| Hosted form (Tally, Google Forms) | none of ours | no | Good fallback for people without a GitHub account; adds a third-party data processor to disclose |
| Own API + database | yes | optional | Rejected: contradicts the security posture for a low-volume feature |
| On-chain memo submission | no | no | Rejected: charges the user a fee to file a suggestion, and the data still needs off-chain triage |

## Recommended design

The screen composes the submission **locally** and opens a prefilled GitHub issue in a Chrome Custom
Tab. Nothing leaves the device until the user taps the button, and the app itself transmits nothing.

```
src/lib/submissions.ts     builds the issue URL: title, body template, labels
app/suggest.tsx            the form screen (stack route, not a tab)
.github/ISSUE_TEMPLATE/device-submission.yml
```

Implementation notes that matter:

- **Encode properly.** Every field goes through `encodeURIComponent`. Newlines and control characters
  are normalised; each field is length-capped (name 80, body fields 500) so a paste bomb cannot
  produce a broken or absurd URL.
- **Reuse the allow-list.** `github.com` is already allow-listed, so `openExternal` carries the URL
  unchanged and the existing tests keep covering it.
- **Warn before leaving.** A line above the button: the issue is public, do not include personal
  information. Then the Custom Tab shows the real URL, as with every other outbound link.
- **No drafts on disk.** Form state stays in memory, consistent with the rest of the app.
- **Offline**: if the Custom Tab cannot open, offer copy-to-clipboard of the composed text.

## Triage workflow

Labels: `submission`, `needs-evidence`, `accepted`, `duplicate`, `declined`.

A submission becomes a catalog entry when it clears the same bar as every existing one:

1. A vendor page that actually sells or documents the device.
2. A clear answer to "what work does it do, and what does it pay for that work".
3. Enough public evidence to score the five adoption factors honestly — including scoring it low.
4. A token mint that can be **verified**, or no token entry at all. Never guess a mint.

Declining is normal, and the reason belongs in the issue: a catalog that adds everything is worth
less than one that says no.

## Shipping an accepted submission

1. Append to `src/data/devices.ts`, evidence to `src/data/adoption.ts`, verified mint to
   `src/data/tokens.ts`.
2. `npm test` — asserts URL allow-listing, canonical mints, and that every network is either tracked
   or explicitly untracked.
3. Update the counts quoted in `src/data/help.ts`, the README and the listing copy.
4. Bump `version` and `versionCode`, rebuild, run `.maestro/smoke.yaml` and
   `.maestro/back-navigation.yaml`, submit through the portal.
5. Credit the submitter in "What's new" if they gave a handle.

## Privacy and security

- **Privacy policy** gains a paragraph: the suggestion form composes text on the device; tapping
  submit opens GitHub in the browser, where the issue and anything typed into it are **public**;
  GitHub's own policy applies from that point; the app sends nothing itself.
- **Security tab** gains a control under "Untrusted input": submissions are composed locally,
  URL-encoded and length-capped, and never rendered back into the app.
- **No new permissions**, no new hosts, no new dependencies.
- **In-app display of submissions is explicitly out of scope.** The moment stranger-written text
  appears in the app, moderation obligations attach.

## Testing

- Unit: `src/lib/__tests__/submissions.test.ts` — encoding of `&`, `#`, newlines and emoji; length
  caps; the built URL passes `isAllowedUrl`; an empty form produces no URL.
- Flow: `.maestro/suggest.yaml` — open the form, fill it, assert the button is disabled until the
  required fields are present. Stop before leaving the app.
- CI covers the unit tests automatically.

## Rollout

| Phase | Work | Estimate |
|---|---|---|
| 1 | `submissions.ts` + tests | half a day |
| 2 | `app/suggest.tsx`, entry points, help copy | a day |
| 3 | Issue template, labels, triage notes in the README | half a day |
| 4 | Privacy policy + Security tab updates | half a day |
| 5 | Maestro flow, build, device verification | half a day |

Ships as **v1.5.0**.

## Open questions

1. **Is GitHub-only acceptable?** It excludes people without an account. A hosted form as a second
   button covers them, at the cost of disclosing a third-party processor.
2. **Credit by handle?** Nice for contributors; means a stranger-supplied string appears in release
   notes, so it needs the same length cap and a sanity read before shipping.
3. **Corrections vs additions** — one issue template or two? One keeps triage simple; two make the
   required fields clearer.
