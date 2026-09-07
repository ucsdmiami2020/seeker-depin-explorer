// Run with: npx tsx src/lib/__tests__/allowlist.test.ts
import assert from 'node:assert/strict';
import { isAllowedUrl } from '../allowlist';
import { devices } from '../../data/devices';
import { networks } from '../../data/networks';

const cases: [string, boolean][] = [
  ['https://www.helium.com/mobile', true],
  ['https://DOCS.SolanaMobile.com/x', true],
  ['http://www.helium.com/', false],            // no cleartext
  ['https://helium.com.evil.io/', false],       // suffix spoof
  ['https://evilhelium.com/', false],           // substring spoof
  ['https://user:pw@docs.solanamobile.com/', false], // credentials in URL
  ['javascript:alert(1)', false],
  ['intent://x#Intent;scheme=http;end', false],
  ['seekerdepin://device/x', false],
  ['file:///etc/hosts', false],
  ['not a url', false],
];
for (const [u, expected] of cases) assert.equal(isAllowedUrl(u), expected, `isAllowedUrl(${u})`);

const catalogUrls = [
  ...devices.flatMap((d) => d.links.map((l) => l.url)),
  ...networks.flatMap((n) => n.links.map((l) => l.url)),
];
for (const u of catalogUrls) assert.ok(isAllowedUrl(u), `catalog URL not allow-listed: ${u}`);

console.log(`ok — ${cases.length} cases, ${catalogUrls.length} catalog URLs`);
