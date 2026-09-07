/**
 * Legal texts shown in-app under About → Legal, and mirrored as Markdown in /docs for hosting.
 * The dApp Store submission form asks for hosted URLs to a privacy policy, EULA/terms and a
 * copyright notice; keep /docs and this file in sync. Placeholders in <angle brackets> must be
 * filled before submission.
 */
export const PUBLISHER = {
  name: '<Your publisher / company name>',
  contactEmail: '<contact@yourdomain.com>',
  website: '<https://yourdomain.com>',
  lastUpdated: '2026-09-07',
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
          'The app itself makes no network requests. When you tap a vendor or documentation link, the page opens in an Android Custom Tab (Chrome) or your default browser over HTTPS. From that point the vendor\'s own privacy policy applies; we do not receive any information about what you do there. Only a fixed allow-list of vendor domains can be opened.',
      },
      {
        heading: 'Permissions',
        body:
          'The app requests no dangerous Android permissions. It uses INTERNET (to open links in the browser) and VIBRATE (for light haptic feedback). Backup of app data to Google is disabled.',
      },
      {
        heading: 'Wallets and blockchain',
        body:
          'This version does not connect to a wallet, request signatures, or read on-chain data. If a future version adds Mobile Wallet Adapter support, it will only request the minimum permissions needed, will never have access to your seed phrase or private keys (which stay in Seed Vault or your wallet app), and this policy will be updated before release.',
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
        body: `© ${new Date().getFullYear()} ${PUBLISHER.name}. Application code and original editorial content are licensed under Apache 2.0 unless stated otherwise in the repository.`,
      },
      {
        heading: 'Trademarks',
        body:
          'Solana, Solana Mobile, Saga, Seeker, Seed Vault, CUDIS, BrushO, Helium, Hivemapper, Bee Maps, GEODNET and XNET are trademarks of their respective owners. The app uses these names nominatively to identify products and does not imply endorsement.',
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
