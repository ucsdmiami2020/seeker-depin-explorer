/**
 * Adoption-confidence model.
 *
 * Five factors, each scored 0–2 from public evidence, summed to 0–10. The point is not
 * "is this a good product" but "how much independent, time-tested signal exists about it" —
 * so a brand-new device with a great spec sheet scores low until reviews and deployments exist.
 *
 * Factor rubric
 *   tenure      0: < 1 year shipping   1: 1–3 years            2: 3+ years
 *   installed   0: unknown or < 5k     1: 5k–50k units/nodes   2: 50k+ units/nodes
 *   reviews     0: none / vendor-only  1: a handful of independent long-form reviews (YouTube, press)
 *               2: many independent reviews incl. long-term ("30 days / 1 year later") pieces
 *   community   0: little discussion   1: active but small (Discord, X threads, small subreddit)
 *               2: large, multi-year communities (established subreddit, sustained X/YouTube coverage)
 *   trackRecord 0: token/rewards not live or unproven   1: rewards paying < 2 years, some volatility
 *               2: rewards paid reliably for years, network survived at least one downturn
 *
 * Evidence is stored alongside the score so the app can show *why*, and so a reader can disagree.
 */
import type { Adoption, AdoptionFactorKey, AdoptionTier } from '../data/types';

export const FACTOR_META: Record<AdoptionFactorKey, { label: string; short: string }> = {
  tenure: { label: 'Time on market', short: 'Tenure' },
  installed: { label: 'Installed base', short: 'Installed' },
  reviews: { label: 'Independent reviews', short: 'Reviews' },
  community: { label: 'Community discussion', short: 'Community' },
  trackRecord: { label: 'Reward track record', short: 'Track record' },
};

export const FACTOR_ORDER: AdoptionFactorKey[] = ['tenure', 'installed', 'reviews', 'community', 'trackRecord'];

export const TIER_META: Record<AdoptionTier, { label: string; color: string; blurb: string }> = {
  established: {
    label: 'Established',
    color: '#14F195',
    blurb: 'Years of real-world use, large communities and plenty of independent long-term reviews.',
  },
  growing: {
    label: 'Growing',
    color: '#19D4FF',
    blurb: 'Shipping at scale with a real community, but the track record is still short or uneven.',
  },
  early: {
    label: 'Early',
    color: '#FFB84D',
    blurb: 'Real hardware in customers’ hands, but few independent reviews and a young reward model.',
  },
  new: {
    label: 'Very new',
    color: '#FF5C7A',
    blurb: 'Recently launched or pre-token. Little independent evidence yet — treat claims as unverified.',
  },
};

export function scoreOf(a: Adoption): number {
  return FACTOR_ORDER.reduce((sum, k) => sum + a.factors[k].value, 0);
}

export function tierOf(score: number): AdoptionTier {
  if (score >= 8) return 'established';
  if (score >= 5) return 'growing';
  if (score >= 2) return 'early';
  return 'new';
}

export function tierMeta(a: Adoption) {
  const score = scoreOf(a);
  const tier = tierOf(score);
  return { score, tier, ...TIER_META[tier] };
}
