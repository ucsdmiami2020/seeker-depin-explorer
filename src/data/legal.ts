/**
 * Legal texts shown in-app under About → Legal, and mirrored as Markdown in /docs for hosting.
 * The dApp Store submission form asks for hosted URLs to a privacy policy, EULA/terms and a
 * copyright notice; keep /docs and this file in sync. Placeholders in <angle brackets> must be
 * filled before submission.
 */
export const PUBLISHER = {
  name: 'Rene Chacon',
  contactEmail: 'rchac005@gmail.com',
  website: 'https://ucsdmiami2020.github.io/seeker-depin-legal/',
  lastUpdated: '2026-09-11',
};

export type LegalDocId = 'privacy' | 'terms' | 'copyright';

export interface LegalDoc {
  id: LegalDocId;
  title: string;
  sections: { heading: string; body: string }[];
}

export const legalDocs: Record<LegalDocId, LegalDoc> = {
  privacy: {
    id: 'privacy',
    title: 'Privacy Policy',
    sections: [
      {
        heading: 'Summary',
        body:
          'Seeker DePIN Explorer does not collect, store, transmit or sell any personal data. The app has no account system, no analytics SDK, no advertising SDK, no crash-reporting service and no backend of its own. Everything you see is bundled inside the app.',
      },
      {
        heading: 'Data the app processes on your device',
        body:
          'Favourites and compare selections are kept in memory only and are discarded when the app closes. Search text is processed locally and never leaves the device. The app does not read your wallet, contacts, location, files, camera, microphone or clipboard.',
      },
      {
        heading: 'Network access',
        body:
          'Until you connect a wallet, the app makes no network requests of its own. When you tap a vendor or documentation link, the page opens in an Android Custom Tab (Chrome) or your default browser over HTTPS. From that point the vendor\'s own privacy policy applies; we do not receive any information about what you do there. Only a fixed allow-list of vendor domains can be opened. If you connect a wallet, the app queries a public Solana RPC endpoint over HTTPS to read balances for that address — see "Wallet and on-chain data" below.',
      },
      {
        heading: 'Permissions',
        body:
          'The app requests no dangerous Android permissions. It uses INTERNET (to open links in the browser) and VIBRATE (for light haptic feedback). Backup of app data to Google is disabled.',
      },
      {
        heading: 'Wallet and on-chain data',
        body:
          'Connecting a wallet is optional and off by default. If you connect one, the app uses Mobile Wallet Adapter to ask your wallet app (or Seed Vault on a Seeker) to share a public address. The app never sees, requests or stores your seed phrase or private keys, and it never creates or submits a transaction — the only signature it can ask for is an off-chain text message you read first. Your address and the authorisation token are held in memory for the session and are cleared when you disconnect or close the app. To show balances, the address is sent to a public Solana RPC endpoint (api.mainnet-beta.solana.com or api.devnet.solana.com, or an endpoint configured at build time); that provider necessarily sees the address and your IP address and is governed by its own policy. Anything you sign or hold on-chain is public data on Solana.',
      },
      {
        heading: 'Children',
        body: 'The app is informational and suitable for general audiences. It is not directed at children under 13 and collects no data from anyone.',
      },
      {
        heading: 'Changes and contact',
        body: `We will update this policy if the app's data practices change, and note the date above. Questions: ${PUBLISHER.contactEmail}.`,
      },
    ],
  },
  terms: {
    id: 'terms',
    title: 'Terms of Use & EULA',
    sections: [
      {
        heading: 'Licence',
        body: `${PUBLISHER.name} grants you a personal, non-exclusive, non-transferable, revocable licence to install and use Seeker DePIN Explorer on Android devices you own or control, for informational purposes, subject to these terms and the Solana dApp Store Terms of Use.`,
      },
      {
        heading: 'Informational content only',
        body:
          'The app is an independent catalog of third-party hardware. Specifications, prices, availability, token details and reward mechanics are compiled from public vendor materials and press coverage, may be out of date, and are provided "as is" without warranty of accuracy. Always confirm details with the vendor before purchasing.',
      },
      {
        heading: 'Wallet features',
        body:
          'Connecting a wallet is optional. Balances shown in the app are read from a public Solana RPC endpoint and may be delayed, incomplete or unavailable; only tokens whose mints we could verify are labelled by name. The app never creates or submits transactions, and the ownership proof it offers is an off-chain message you can read before signing. You are responsible for what you sign and for keeping your wallet and recovery phrase secure. Nothing shown in the wallet view is financial advice or a statement of value.',
      },
      {
        heading: 'No financial, investment or legal advice',
        body:
          'Nothing in the app is an offer, solicitation or recommendation to buy hardware or any token, or to participate in any network. Token rewards are set by third-party networks, fluctuate, and may be zero. You are solely responsible for your decisions and for complying with the laws of your jurisdiction.',
      },
      {
        heading: 'No affiliation',
        body:
          'The app is not affiliated with, endorsed by or sponsored by Solana Mobile, the Solana Foundation, or any vendor or network listed. Product and network names are the trademarks of their respective owners and are used for identification only.',
      },
      {
        heading: 'Acceptable use',
        body: 'You may not reverse engineer, resell, or redistribute the app or its data, or use it in a way that violates applicable law or the Solana dApp Store policies.',
      },
      {
        heading: 'Disclaimer and limitation of liability',
        body:
          'To the maximum extent permitted by law, the app is provided without warranties of any kind and the publisher is not liable for any loss arising from use of, or reliance on, the app or its content, including purchase decisions or token-related losses.',
      },
      {
        heading: 'Changes and termination',
        body: 'We may update the app or these terms at any time. Continued use after an update constitutes acceptance. You may stop using the app at any time by uninstalling it.',
      },
    ],
  },
  copyright: {
    id: 'copyright',
    title: 'Copyright & Attribution',
    sections: [
      {
        heading: 'Copyright',
        body: `© ${new Date().getFullYear()} ${PUBLISHER.name}. All rights reserved. Application code and original editorial content may not be copied, modified or redistributed without written permission. Third-party open-source components remain under their own licences.`,
      },
      {
        heading: 'Trademarks',
        body:
          'Solana, Solana Mobile, Saga, Seeker, Seed Vault, CUDIS, BrushO, Helium, Nova Labs, RAKwireless, SenseCAP, Bobcat, Hivemapper, Bee Maps, GEODNET, Hyfix, XNET, WeatherXM, Wingbits, onocoy, Roam, NATIX and Starpower are trademarks of their respective owners. The app uses these names nominatively to identify products and does not imply endorsement.',
      },
      {
        heading: 'Imagery and icons',
        body:
          'The app intentionally contains no vendor product photography or logos. Device and category glyphs are from the Ionicons and Material Design Icons sets (MIT / Apache 2.0), via @expo/vector-icons.',
      },
      {
        heading: 'Takedown',
        body: `If you believe content in the app infringes your rights, contact ${PUBLISHER.contactEmail} with the item, your claim and your contact details, and we will respond promptly.`,
      },
    ],
  },
};
