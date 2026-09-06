export type Category = 'phone' | 'wearable' | 'wireless' | 'mapping' | 'positioning';

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
