import { Network } from './types';

export const networks: Network[] = [
  {
    id: 'solana-mobile',
    name: 'Solana Mobile',
    chain: 'Solana',
    category: 'phone',
    token: 'SKR',
    summary: 'Maker of Saga and Seeker, the Solana Mobile Stack and the dApp Store.',
    whatItDoes:
      'Solana Mobile builds crypto-native Android phones and the software stack (Mobile Wallet Adapter, Seed Vault, dApp Store) that lets any Android app talk to a hardware-secured Solana wallet. SKR is the ecosystem token that powers incentives and governance across devices and the dApp Store.',
    icon: { set: 'mci', name: 'cellphone-link' },
    links: [
      { label: 'solanamobile.com', url: 'https://solanamobile.com/' },
      { label: 'Docs', url: 'https://docs.solanamobile.com/' },
    ],
  },
  {
    id: 'helium',
    name: 'Helium',
    chain: 'Solana',
    category: 'wireless',
    token: 'HNT',
    summary: 'The largest DePIN: community-built IoT and mobile wireless coverage.',
    whatItDoes:
      'Helium rewards people for deploying LoRaWAN hotspots and Wi‑Fi / CBRS radios that carry real traffic — including carrier offload for major US operators through Helium Mobile. The network migrated to Solana in April 2023 and, since January 2025, pays every sub-network reward directly in HNT.',
    icon: { set: 'mci', name: 'wifi-star' },
    links: [
      { label: 'helium.com', url: 'https://www.helium.com/' },
      { label: 'Explorer', url: 'https://world.helium.com/' },
    ],
  },
  {
    id: 'cudis',
    name: 'CUDIS',
    chain: 'Solana',
    category: 'wearable',
    token: 'CUDIS',
    summary: 'Longevity DePIN built around an AI smart ring and user-owned health data.',
    whatItDoes:
      'CUDIS pairs a titanium smart ring with an AI coach and stores health data under a Longevity DID the wearer controls. Daily quests and consistent wear earn $CUDIS; anonymised, consented data feeds longevity research partners.',
    icon: { set: 'mci', name: 'ring' },
    links: [{ label: 'cudis.xyz', url: 'https://www.cudis.xyz/' }],
  },
  {
    id: 'brusho',
    name: 'BrushO',
    chain: 'Solana',
    category: 'wearable',
    token: 'BRUSH',
    summary: 'Oral-health DePIN: brush twice a day, earn tokens, own your data.',
    whatItDoes:
      'BrushO turns an AI-scored smart toothbrush into a data-contribution device. Each verified brushing session earns tokens and adds to a decentralized oral-health dataset that users govern collectively.',
    icon: { set: 'mci', name: 'toothbrush' },
    links: [{ label: 'brusho.io', url: 'https://www.brusho.io/' }],
  },
  {
    id: 'hivemapper',
    name: 'Hivemapper / Bee Maps',
    chain: 'Solana',
    category: 'mapping',
    token: 'HONEY',
    summary: 'A decentralized global map built by dashcam-equipped drivers.',
    whatItDoes:
      'Drivers with a Bee dashcam collect fresh street-level imagery that is stitched into a continuously updated map sold to automotive, logistics and AI customers. Contributors are paid in HONEY on Solana, weighted toward areas that need fresh coverage.',
    icon: { set: 'mci', name: 'map-search' },
    links: [{ label: 'beemaps.com', url: 'https://beemaps.com/' }],
  },
  {
    id: 'geodnet',
    name: 'GEODNET',
    chain: 'Solana',
    category: 'positioning',
    token: 'GEOD',
    summary: 'Community GNSS reference stations delivering centimetre RTK positioning.',
    whatItDoes:
      'Thousands of rooftop triple-band GNSS stations stream corrections that let robots, drones and precision-agriculture equipment position themselves to a few centimetres. Customers buy RTK access with GEOD, part of which is burned, while station owners earn the token for uptime.',
    icon: { set: 'mci', name: 'satellite-uplink' },
    links: [{ label: 'geodnet.com', url: 'https://geodnet.com/' }],
  },
  {
    id: 'xnet',
    name: 'XNET Mobile',
    chain: 'Solana',
    category: 'wireless',
    token: 'XNET',
    summary: 'Community-operated CBRS LTE/5G small cells for carrier offload.',
    whatItDoes:
      'XNET lets deployers install carrier-grade CBRS radios that offload traffic for mobile operators. Rewards are paid in XNET on Solana for verified coverage and data carried.',
    icon: { set: 'mci', name: 'radio-tower' },
    links: [{ label: 'xnet.company', url: 'https://xnet.company/' }],
  },
  {
    id: 'weatherxm',
    name: 'WeatherXM',
    chain: 'Solana',
    category: 'sensing',
    token: 'WXM',
    summary: 'Community weather network selling hyperlocal forecasts; app in the Solana dApp Store.',
    whatItDoes:
      'Thousands of rooftop stations feed a weather data marketplace used by insurers, farms and energy traders. WXM began on Arbitrum and is bridged to Solana, where the network launched the first weather app in the Solana dApp Store in 2025.',
    icon: { set: 'mci', name: 'weather-windy' },
    links: [{ label: 'weatherxm.com', url: 'https://weatherxm.com/' }],
  },
  {
    id: 'wingbits',
    name: 'Wingbits',
    chain: 'Solana',
    category: 'sensing',
    token: 'WINGS',
    summary: 'Decentralized ADS-B flight tracking with WINGS on Solana since April 2026.',
    whatItDoes:
      'Swedish-founded network of ADS-B receivers that sells aviation data. Stations earn WINGS for verified aircraft messages; the MGW310 dual-mines GEODNET.',
    icon: { set: 'mci', name: 'airplane-takeoff' },
    links: [{ label: 'wingbits.com', url: 'https://wingbits.com/' }],
  },
  {
    id: 'onocoy',
    name: 'onocoy',
    chain: 'Solana',
    category: 'positioning',
    token: 'ONO',
    summary: 'Swiss GNSS correction network — ~7,900 stations in ~180 countries.',
    whatItDoes:
      'A GEODNET competitor with a location-scaled reward model: the best three stations in each 15 km radius earn full rewards, so new deployments are pushed toward gaps. RTK customers pay in ONO, part of which is burned.',
    icon: { set: 'mci', name: 'satellite-variant' },
    links: [{ label: 'onocoy.com', url: 'https://onocoy.com/' }],
  },
  {
    id: 'roam',
    name: 'Roam',
    chain: 'Solana',
    category: 'wireless',
    token: 'ROAM',
    summary: 'OpenRoaming Wi‑Fi network with millions of app users across 190+ countries.',
    whatItDoes:
      'Roam lets anyone share Wi‑Fi through the app or a Rainier router and rewards uptime and visitor traffic with Roam Points that convert to ROAM. Adoption is strongest in Korea and Southeast Asia.',
    icon: { set: 'mci', name: 'wifi-arrow-up-down' },
    links: [{ label: 'weroam.xyz', url: 'https://weroam.xyz/' }],
  },
  {
    id: 'natix',
    name: 'NATIX Network',
    chain: 'Solana',
    category: 'mapping',
    token: 'NATIX',
    summary: 'Drive-to-earn mapping via smartphone app and the Tesla VX360 device.',
    whatItDoes:
      'NATIX turns phone and Tesla cameras into a privacy-preserving mapping fleet for "physical AI" customers. Footage is anonymised on-device; drivers earn NATIX on Solana.',
    icon: { set: 'mci', name: 'map-marker-radius' },
    links: [{ label: 'natix.network', url: 'https://www.natix.network/' }],
  },
  {
    id: 'starpower',
    name: 'Starpower',
    chain: 'Solana',
    category: 'energy',
    token: 'STAR',
    summary: 'Consumer-device virtual power plant: smart plugs today, batteries next.',
    whatItDoes:
      'Starpower aggregates plugs, batteries and (planned) thermostats into flexible load it can sell to grids, paying device owners in STAR on Solana.',
    icon: { set: 'mci', name: 'home-lightning-bolt' },
    links: [{ label: 'DePIN Scan', url: 'https://depinscan.io/projects/starpower' }],
  },
  {
    id: 'playsolana',
    name: 'Play Solana',
    chain: 'Solana',
    category: 'gaming',
    token: 'PLAY',
    summary: 'Handheld console plus a curated game store with a tokenised player economy.',
    whatItDoes:
      'Play Solana builds the PSG1 handheld and PlayVerse, the curated store that is the only way to install titles on consumer units. Games are submitted through PlayGate and built against a Unity SDK, and $PLAY is the ecosystem token used for store and player rewards. The console signs on-chain actions with its built-in SvalGuard wallet instead of a connected phone.',
    icon: { set: 'mci', name: 'gamepad-variant' },
    links: [{ label: 'playsolana.com', url: 'https://www.playsolana.com/' }],
  },
];

export const getNetwork = (id: string) => networks.find((n) => n.id === id);
