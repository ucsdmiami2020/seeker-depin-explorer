export type Category =
  | 'phone'
  | 'wearable'
  | 'wireless'
  | 'mapping'
  | 'positioning'
  | 'sensing'
  | 'energy'
  | 'gaming';

export type DeviceStatus = 'shipping' | 'preorder' | 'discontinued';

export type IconSet = 'ion' | 'mci';

export interface Spec {
  label: string;
  value: string;
}

export interface Link {
  label: string;
  url: string;
}

export interface Milestone {
  date: string; // YYYY-MM or YYYY
  title: string;
}

export type AdoptionFactorKey = 'tenure' | 'installed' | 'reviews' | 'community' | 'trackRecord';
export type AdoptionTier = 'established' | 'growing' | 'early' | 'new';

export interface AdoptionFactor {
  value: 0 | 1 | 2;
  note: string; // the evidence behind the value, shown in-app
}

export interface Adoption {
  factors: Record<AdoptionFactorKey, AdoptionFactor>;
  evidence: string[]; // where to look: subreddits, YouTube search terms, explorers
  asOf: string; // YYYY-MM
}

export interface Device {
  id: string;
  name: string;
  maker: string;
  category: Category;
  tagline: string;
  description: string;
  status: DeviceStatus;
  price: string; // human string, e.g. "$500"
  priceNote?: string;
  releaseYear: number;
  token?: { symbol: string; role: string };
  network: string; // network id
  icon: { set: IconSet; name: string };
  specs: Spec[];
  earn: string[]; // how the owner earns / participates
  chainNote?: string; // e.g. multi-chain caveats
  adoption: Adoption;
  seekerReady: boolean; // has an Android app usable on Seeker
  seekerNote?: string;
  highlights: string[];
  milestones: Milestone[];
  links: Link[];
}

export interface Network {
  id: string;
  name: string;
  chain: 'Solana';
  category: Category;
  token: string;
  summary: string;
  whatItDoes: string;
  icon: { set: IconSet; name: string };
  links: Link[];
}
