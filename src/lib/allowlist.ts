/**
 * Hosts the app is allowed to open. Every outbound link in the catalog must resolve
 * to one of these, over HTTPS. Anything else is dropped (and never reaches the OS),
 * so a typo or a bad data edit can't turn into an intent to an arbitrary scheme.
 * Kept free of React Native imports so it can be unit-tested with plain Node.
 */
export const ALLOWED_HOSTS: ReadonlySet<string> = new Set<string>([
  'solanamobile.com',
  'docs.solanamobile.com',
  'explorer.solana.com',
  'github.com',
  'cudis.xyz',
  'brusho.io',
  'helium.com',
  'world.helium.com',
  'beemaps.com',
  'docs.hivemapper.com',
  'geodnet.com',
  'xnet.company',
  'weatherxm.com',
  'docs.weatherxm.com',
  'wingbits.com',
  'docs.wingbits.com',
  'onocoy.com',
  'weroam.xyz',
  'natix.network',
  'starpower-market.myshopify.com',
  'depinscan.io',
]);

export function isAllowedUrl(raw: string): boolean {
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return false;
  }
  if (u.protocol !== 'https:') return false;
  if (u.username || u.password) return false;
  const host = u.hostname.toLowerCase();
  for (const allowed of ALLOWED_HOSTS) {
    if (host === allowed || host.endsWith('.' + allowed)) return true;
  }
  return false;
}
