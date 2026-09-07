import React from 'react';
import { Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { devices, getDevice, categoryMeta } from '../../src/data/devices';
import { getNetwork } from '../../src/data/networks';
import { categoryColors, colors, font, radius, spacing } from '../../src/theme';
import { openExternal } from '../../src/lib/links';
import { Bullet, Card, DeviceIcon, IconButton, SectionTitle, SpecRow, StatusPill, TokenPill, tap } from '../../src/components/ui';
import { DeviceCard } from '../../src/components/DeviceCard';
import { useAppState } from '../../src/state/AppState';

export default function DeviceDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const device = getDevice(String(id));
  const { isFavorite, toggleFavorite, isCompared, toggleCompare } = useAppState();

  if (!device) {
    // Reached via a stale deep link (seekerdepin://device/<unknown>) or a removed catalog entry.
    return (
      <View style={styles.missing}>
        <Stack.Screen options={{ title: 'Not found', headerTransparent: false }} />
        <Ionicons name="hardware-chip-outline" size={40} color={colors.textFaint} />
        <Text style={styles.missingTitle}>Device not found</Text>
        <Text style={styles.missingBody}>That link doesn't match anything in the catalog.</Text>
        <Pressable onPress={() => router.replace('/')} style={styles.missingBtn}>
          <Text style={styles.missingBtnText}>Back to Explore</Text>
        </Pressable>
      </View>
    );
  }

  const network = getNetwork(device.network);
  const [a, b] = categoryColors[device.category];
  const related = devices.filter((d) => d.id !== device.id && (d.network === device.network || d.category === device.category)).slice(0, 3);

  const share = () =>
    Share.share({
      message: `${device.name} by ${device.maker} — ${device.tagline}. ${device.links[0]?.url ?? ''}`,
    }).catch(() => {});

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <View style={{ flexDirection: 'row' }}>
              <IconButton name="share-outline" onPress={share} label="Share" />
              <IconButton
                name={isCompared(device.id) ? 'git-compare' : 'git-compare-outline'}
                active={isCompared(device.id)}
                activeColor={colors.solanaBlue}
                onPress={() => toggleCompare(device.id)}
                label="Compare"
              />
              <IconButton
                name={isFavorite(device.id) ? 'heart' : 'heart-outline'}
                active={isFavorite(device.id)}
                activeColor={colors.danger}
                onPress={() => toggleFavorite(device.id)}
                label="Favourite"
              />
            </View>
          ),
        }}
      />
      <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ paddingBottom: 60 }}>
        <LinearGradient colors={[a, b, colors.bg]} start={{ x: 0, y: 0 }} end={{ x: 0.6, y: 1 }} style={[styles.hero, { paddingTop: insets.top + 64 }]}>
          <View style={styles.heroIcon}>
            <DeviceIcon set={device.icon.set} name={device.icon.name} size={64} color="#fff" />
          </View>
          <Text style={styles.maker}>{device.maker.toUpperCase()}</Text>
          <Text style={styles.name}>{device.name}</Text>
          <Text style={styles.tagline}>{device.tagline}</Text>
          <View style={styles.pillRow}>
            <StatusPill status={device.status} />
            {device.token ? <TokenPill symbol={device.token.symbol} /> : null}
            <View style={styles.catPill}>
              <Text style={styles.catPillText}>{categoryMeta[device.category].label}</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={{ paddingHorizontal: spacing.lg }}>
          <View style={styles.priceCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.priceLabel}>Price</Text>
              <Text style={styles.price}>{device.price}</Text>
              {device.priceNote ? <Text style={styles.priceNote}>{device.priceNote}</Text> : null}
            </View>
            <View style={styles.vdivider} />
            <View style={{ flex: 1 }}>
              <Text style={styles.priceLabel}>Released</Text>
              <Text style={styles.price}>{device.releaseYear}</Text>
              <Text style={styles.priceNote}>{device.seekerReady ? 'Seeker-ready ✓' : 'No Seeker app yet'}</Text>
            </View>
          </View>

          <View style={styles.highlightRow}>
            {device.highlights.map((h) => (
              <View key={h} style={styles.highlight}>
                <Text style={styles.highlightText}>{h}</Text>
              </View>
            ))}
          </View>

          <SectionTitle>Overview</SectionTitle>
          <Text style={styles.body}>{device.description}</Text>
          {device.seekerNote ? (
            <View style={styles.note}>
              <Ionicons name="phone-portrait-outline" size={16} color={colors.solanaGreen} />
              <Text style={styles.noteText}>{device.seekerNote}</Text>
            </View>
          ) : null}

          <SectionTitle>Specifications</SectionTitle>
          <Card>
            {device.specs.map((s, i) => (
              <SpecRow key={s.label} label={s.label} value={s.value} last={i === device.specs.length - 1} />
            ))}
          </Card>

          <SectionTitle>How you earn</SectionTitle>
          <Card>
            {device.token ? (
              <View style={styles.tokenRow}>
                <View style={styles.tokenBadge}>
                  <Text style={styles.tokenSymbol}>${device.token.symbol}</Text>
                </View>
                <Text style={styles.tokenRole}>{device.token.role}</Text>
              </View>
            ) : null}
            {device.earn.map((e) => (
              <Bullet key={e}>{e}</Bullet>
            ))}
            <View style={styles.disclaimer}>
              <Ionicons name="information-circle-outline" size={14} color={colors.textFaint} />
              <Text style={styles.disclaimerText}>
                Rewards depend on network demand, location and token price, and are not guaranteed. This is
                informational only — not financial advice, and not an offer to sell hardware or tokens.
              </Text>
            </View>
          </Card>

          <SectionTitle>Timeline</SectionTitle>
          <Card>
            {device.milestones.map((m, i) => (
              <View key={m.date + m.title} style={styles.tlRow}>
                <View style={styles.tlLeft}>
                  <View style={[styles.tlDot, i === device.milestones.length - 1 && { backgroundColor: colors.solanaGreen }]} />
                  {i < device.milestones.length - 1 ? <View style={styles.tlLine} /> : null}
                </View>
                <View style={{ flex: 1, paddingBottom: i < device.milestones.length - 1 ? 14 : 0 }}>
                  <Text style={styles.tlDate}>{m.date}</Text>
                  <Text style={styles.tlTitle}>{m.title}</Text>
                </View>
              </View>
            ))}
          </Card>

          {network ? (
            <>
              <SectionTitle>Network</SectionTitle>
              <Pressable
                onPress={() => {
                  tap();
                  router.push('/networks');
                }}
              >
                <Card style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.netName}>{network.name}</Text>
                    <Text style={styles.netSummary}>{network.summary}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                </Card>
              </Pressable>
            </>
          ) : null}

          <SectionTitle>Links</SectionTitle>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {device.links.map((l) => (
              <Pressable key={l.url} onPress={() => openExternal(l.url)} style={styles.link}>
                <Ionicons name="open-outline" size={15} color={colors.solanaBlue} />
                <Text style={styles.linkText}>{l.label}</Text>
              </Pressable>
            ))}
          </View>

          {related.length ? (
            <>
              <SectionTitle>Related</SectionTitle>
              {related.map((d) => (
                <DeviceCard key={d.id} device={d} />
              ))}
            </>
          ) : null}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  missing: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg, padding: spacing.xl },
  missingTitle: { ...font.title, color: colors.text, marginTop: spacing.md },
  missingBody: { ...font.body, color: colors.textMuted, marginTop: 6, textAlign: 'center' },
  missingBtn: { marginTop: spacing.xl, backgroundColor: colors.solanaGreen, borderRadius: 999, paddingHorizontal: 20, paddingVertical: 12 },
  missingBtnText: { color: '#0B0B12', fontWeight: '800' },
  disclaimer: { flexDirection: 'row', alignItems: 'flex-start', marginTop: spacing.sm, paddingTop: spacing.sm, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.cardBorder },
  disclaimerText: { ...font.caption, color: colors.textFaint, marginLeft: 6, flex: 1, lineHeight: 16, fontWeight: '400' },
  hero: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  heroIcon: {
    width: 104,
    height: 104,
    borderRadius: 32,
    backgroundColor: '#FFFFFF22',
    borderWidth: 1,
    borderColor: '#FFFFFF33',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  maker: { ...font.caption, color: '#FFFFFFB3', letterSpacing: 1.5, fontSize: 11 },
  name: { ...font.display, color: '#fff', marginTop: 4 },
  tagline: { ...font.body, color: '#FFFFFFD9', marginTop: 6, fontSize: 15 },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.md },
  catPill: { borderWidth: 1, borderColor: '#FFFFFF66', borderRadius: 999, paddingHorizontal: 9, paddingVertical: 3 },
  catPillText: { fontSize: 11, fontWeight: '700', color: '#fff', letterSpacing: 0.3 },
  priceCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: -spacing.md,
  },
  vdivider: { width: 1, backgroundColor: colors.cardBorder, marginHorizontal: spacing.lg },
  priceLabel: { ...font.caption, color: colors.textMuted },
  price: { ...font.title, color: colors.solanaGreen, marginTop: 2 },
  priceNote: { ...font.caption, color: colors.textFaint, marginTop: 4, lineHeight: 16 },
  highlightRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.md },
  highlight: { backgroundColor: colors.bgElevated, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6, marginRight: 8, marginBottom: 8 },
  highlightText: { ...font.caption, color: colors.text },
  body: { ...font.body, color: colors.text, fontSize: 15, lineHeight: 23 },
  note: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#14F19514', borderRadius: radius.md, padding: 12, marginTop: spacing.md },
  noteText: { ...font.body, color: colors.text, marginLeft: 10, flex: 1 },
  tokenRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  tokenBadge: { backgroundColor: colors.solanaPurple, borderRadius: radius.sm, paddingHorizontal: 10, paddingVertical: 6, marginRight: 10 },
  tokenSymbol: { color: '#fff', fontWeight: '800' },
  tokenRole: { ...font.body, color: colors.textMuted, flex: 1 },
  tlRow: { flexDirection: 'row' },
  tlLeft: { width: 20, alignItems: 'center' },
  tlDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.solanaPurple, marginTop: 5 },
  tlLine: { flex: 1, width: 2, backgroundColor: colors.cardBorder, marginTop: 4 },
  tlDate: { ...font.caption, color: colors.textMuted },
  tlTitle: { ...font.body, color: colors.text, marginTop: 2 },
  netName: { ...font.subtitle, color: colors.text },
  netSummary: { ...font.body, color: colors.textMuted, marginTop: 2 },
  link: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#19D4FF14', borderRadius: radius.sm, paddingHorizontal: 12, paddingVertical: 8, marginRight: 8, marginBottom: 8 },
  linkText: { ...font.body, color: colors.solanaBlue, marginLeft: 6 },
});
