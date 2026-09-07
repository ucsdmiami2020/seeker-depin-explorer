import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { Link } from 'expo-router';
import { colors, font, spacing } from '../../src/theme';
import { openExternal } from '../../src/lib/links';
import { Bullet, Card, SectionTitle } from '../../src/components/ui';

const ROADMAP = [
  'Wallet connect via Mobile Wallet Adapter — see which device NFTs / tokens you already hold',
  'Live token prices and network stats pulled from public APIs',
  'Helium hotspot lookup by wallet address, with reward history',
  'Community-submitted devices with on-chain attestation',
];

export default function About() {
  const insets = useSafeAreaInsets();
  const version = Constants.expoConfig?.version ?? '1.0.0';
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingHorizontal: spacing.lg, paddingBottom: 100 }}
    >
      <Text style={styles.title}>About</Text>
      <Text style={styles.sub}>Seeker DePIN Explorer v{version}</Text>

      <Card style={{ marginTop: spacing.lg }}>
        <Text style={styles.body}>
          A field guide to the physical hardware that plugs into Solana: the phones that hold your keys, the
          wearables that pay you for healthy habits, and the radios, cameras and antennas that sell real-world
          coverage for tokens. Built for the Solana Seeker and any Android device.
        </Text>
      </Card>

      <SectionTitle>How to read the catalog</SectionTitle>
      <Card>
        <Bullet>Prices are vendor list prices when this version shipped. Tap a vendor link for the live number.</Bullet>
        <Bullet>
          The Adoption confidence badge (0–10) measures how much independent, time-tested evidence exists — reviews,
          communities, deployments, reward history — not product quality. Tap any badge for the method.
        </Bullet>
        <Bullet>"Seeker-ready" means the device has an Android companion app or web console that works on Seeker.</Bullet>
        <Bullet>Token rewards vary with network demand and are never guaranteed. Nothing here is financial advice.</Bullet>
        <Bullet>Device icons are illustrative glyphs, not product imagery.</Bullet>
        <Bullet>The app collects no data and makes no network requests of its own; links open in your browser.</Bullet>
      </Card>

      <SectionTitle>Roadmap</SectionTitle>
      <Card>
        {ROADMAP.map((r) => (
          <Bullet key={r}>{r}</Bullet>
        ))}
      </Card>

      <SectionTitle>Legal</SectionTitle>
      <Card>
        {(
          [
            ['privacy', 'Privacy policy', 'shield-checkmark-outline'],
            ['terms', 'Terms of use & EULA', 'document-text-outline'],
            ['copyright', 'Copyright & attribution', 'ribbon-outline'],
          ] as const
        ).map(([id, label, icon]) => (
          <Link key={id} href={`/legal/${id}`} asChild>
            <Pressable style={styles.linkRow} accessibilityRole="link">
              <Ionicons name={icon} size={18} color={colors.solanaBlue} />
              <Text style={styles.linkText}>{label}</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textFaint} style={{ marginLeft: 'auto' }} />
            </Pressable>
          </Link>
        ))}
      </Card>

      <SectionTitle>Build with Solana Mobile</SectionTitle>
      <Card>
        <Pressable style={styles.linkRow} onPress={() => openExternal('https://docs.solanamobile.com/')}>
          <Ionicons name="book-outline" size={18} color={colors.solanaBlue} />
          <Text style={styles.linkText}>docs.solanamobile.com</Text>
        </Pressable>
        <Pressable style={styles.linkRow} onPress={() => openExternal('https://github.com/solana-mobile')}>
          <Ionicons name="logo-github" size={18} color={colors.solanaBlue} />
          <Text style={styles.linkText}>github.com/solana-mobile</Text>
        </Pressable>
      </Card>

      <View style={{ alignItems: 'center', marginTop: spacing.xxl }}>
        <Text style={styles.foot}>Not affiliated with Solana Mobile or any listed vendor.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { ...font.display, color: colors.text },
  sub: { ...font.body, color: colors.textMuted, marginTop: 6 },
  body: { ...font.body, color: colors.text },
  linkRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  linkText: { ...font.body, color: colors.solanaBlue, marginLeft: 10 },
  foot: { ...font.caption, color: colors.textFaint },
});
