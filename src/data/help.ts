/**
 * Copy for the first-run tour and the help sheet. Kept as data so both surfaces stay in sync and
 * the wording can be reviewed in one place — it is the first thing a dApp Store reviewer reads.
 */
import type { IconSet } from './types';

export interface HelpTopic {
  id: string;
  icon: { set: IconSet; name: string };
  title: string;
  body: string;
  /** Short, concrete thing the reader can do right now. */
  action?: string;
}

export const TOUR: HelpTopic[] = [
  {
    id: 'what',
    icon: { set: 'ion', name: 'compass-outline' },
    title: 'A field guide to Solana hardware',
    body:
      'DePIN is the part of crypto you can hold: phones, rings, hotspots, dashcams and sensors that earn on Solana. This app catalogues 16 of them across 13 networks, with specs, prices and how each one earns.',
    action: 'No account, no signup, nothing to install.',
  },
  {
    id: 'explore',
    icon: { set: 'ion', name: 'search-outline' },
    title: 'Explore, search and sort',
    body:
      'Browse every device, filter by category, and sort by adoption, price or release date. Each card opens a full profile: specs, how you earn, the network behind it, and links to the vendor.',
    action: 'Try the category chips at the top of Explore.',
  },
  {
    id: 'adoption',
    icon: { set: 'mci', name: 'chart-line' },
    title: 'Adoption confidence, not hype',
    body:
      'Every device carries a 0-10 score built from five evidence factors: how long the network has run, verifiable installed base, independent reviews, active community, and reward track record. The evidence behind each score is shown in the app.',
    action: 'Tap any score badge to see the full rubric.',
  },
  {
    id: 'compare',
    icon: { set: 'ion', name: 'git-compare-outline' },
    title: 'Compare before you buy',
    body:
      'Add up to three devices and see them side by side: price, specs, rewards and adoption lined up row by row, so the trade-offs are obvious.',
    action: 'Tap the compare icon on any device.',
  },
  {
    id: 'wallet',
    icon: { set: 'ion', name: 'wallet-outline' },
    title: 'See the networks you already hold',
    body:
      'Optionally connect a wallet with Mobile Wallet Adapter to read your SOL and DePIN token balances straight from Solana, matched to the devices in this catalog. The app never sees your seed phrase or private keys, and it cannot create or send a transaction.',
    action: 'Wallet tab — a devnet toggle is there for testing.',
  },
  {
    id: 'privacy',
    icon: { set: 'ion', name: 'shield-checkmark-outline' },
    title: 'Private by design',
    body:
      'No accounts, no analytics, no ads and no tracking. The catalog is bundled in the app, so it works offline; the only network request happens when you connect a wallet. Vendor links open in a Chrome Custom Tab from a fixed allow-list.',
    action: 'About - Legal has the full policy.',
  },
];

/** Extra cards shown only in the help sheet, after the tour topics. */
export const HELP_EXTRA: HelpTopic[] = [
  {
    id: 'rewards',
    icon: { set: 'ion', name: 'alert-circle-outline' },
    title: 'About reward claims',
    body:
      'Reward mechanics come from public vendor materials and change often. Token rewards are set by third-party networks, fluctuate, and may be zero. Nothing here is financial advice — always confirm with the vendor before buying.',
  },
  {
    id: 'data',
    icon: { set: 'ion', name: 'refresh-outline' },
    title: 'How current is this?',
    body:
      'Specs and prices were gathered from vendor sites and press coverage in September 2026 and are list prices from that time. Every device links out to its vendor for the live number.',
  },
];
