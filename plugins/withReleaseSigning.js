/**
 * Expo config plugin: adds a real `release` signingConfig to android/app/build.gradle.
 *
 * Reads credentials from android/keystore.properties (git-ignored) with keys:
 *   storeFile=../../keystores/dapp-store-release.jks   (relative to android/app)
 *   storePassword=...
 *   keyAlias=...
 *   keyPassword=...
 *
 * or from environment variables DAPP_STORE_STORE_FILE / _STORE_PASSWORD / _KEY_ALIAS / _KEY_PASSWORD
 * (useful in CI). If neither is present the release build falls back to the debug keystore and prints
 * a loud warning, so local `expo run:android --variant release` still works but you can't ship it by
 * accident without noticing.
 */
const { withAppBuildGradle } = require('expo/config-plugins');

const SIGNING_BLOCK = `
    // --- dApp Store release signing (injected by plugins/withReleaseSigning.js) ---
    def keystorePropertiesFile = rootProject.file("keystore.properties")
    def keystoreProperties = new Properties()
    if (keystorePropertiesFile.exists()) {
        keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
    }
    def releaseStoreFile = keystoreProperties['storeFile'] ?: System.getenv("DAPP_STORE_STORE_FILE")
    def releaseStorePassword = keystoreProperties['storePassword'] ?: System.getenv("DAPP_STORE_STORE_PASSWORD")
    def releaseKeyAlias = keystoreProperties['keyAlias'] ?: System.getenv("DAPP_STORE_KEY_ALIAS")
    def releaseKeyPassword = keystoreProperties['keyPassword'] ?: System.getenv("DAPP_STORE_KEY_PASSWORD")
    def hasReleaseSigning = releaseStoreFile != null && releaseStorePassword != null && releaseKeyAlias != null && releaseKeyPassword != null
    if (!hasReleaseSigning) {
        logger.warn("!!! No release keystore configured (android/keystore.properties or DAPP_STORE_* env). Release APK will be DEBUG-signed and will be rejected by the Solana dApp Store.")
    }
`;

module.exports = function withReleaseSigning(config) {
  return withAppBuildGradle(config, (cfg) => {
    let s = cfg.modResults.contents;
    if (s.includes('withReleaseSigning.js')) return cfg;

    // 1) declare properties near the top of the android {} block
    s = s.replace(/android \{\n/, `android {\n${SIGNING_BLOCK}`);

    // 2) add a release signingConfig after the debug one
    s = s.replace(
      /signingConfigs \{\n(\s*)debug \{([\s\S]*?)\n\1\}\n/,
      (m, indent) =>
        `${m}${indent}release {\n` +
        `${indent}    if (hasReleaseSigning) {\n` +
        `${indent}        storeFile file(releaseStoreFile)\n` +
        `${indent}        storePassword releaseStorePassword\n` +
        `${indent}        keyAlias releaseKeyAlias\n` +
        `${indent}        keyPassword releaseKeyPassword\n` +
        `${indent}        v1SigningEnabled true\n` +
        `${indent}        v2SigningEnabled true\n` +
        `${indent}    }\n` +
        `${indent}}\n`,
    );

    // 3) point buildTypes.release at it. Anchored on `buildTypes {` so the match can't start at the
    //    signingConfigs.release block inserted above and rewrite buildTypes.debug instead.
    s = s.replace(
      /(buildTypes \{[\s\S]*?release \{[\s\S]*?)signingConfig signingConfigs\.debug/,
      '$1signingConfig hasReleaseSigning ? signingConfigs.release : signingConfigs.debug',
    );

    // Fail prebuild rather than silently shipping a debug-signed release if the template changes.
    const buildTypes = s.slice(s.indexOf('buildTypes {'));
    const wired =
      s.includes('def hasReleaseSigning') &&
      s.includes('if (hasReleaseSigning) {') &&
      /release \{[^}]*signingConfig hasReleaseSigning/.test(buildTypes);
    if (!wired) {
      throw new Error('[withReleaseSigning] Could not wire the release signingConfig into buildTypes.release; the build.gradle template has changed.');
    }
    cfg.modResults.contents = s;
    return cfg;
  });
};
