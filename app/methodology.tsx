import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import { devices } from '../src/data/devices';
import { FACTOR_META, FACTOR_ORDER, TIER_META, scoreOf, tierOf } from '../src/lib/adoption';
import type { AdoptionFactorKey, AdoptionTier } from '../src/data/types';
import { colors, font, radius, spacing } from '../src/theme';
import { Bullet, Card, SectionTitle } from '../src/components/ui';

const RUBRIC: Record<AdoptionFactorKey, [string, string, string]> = {
  tenure: ['Under 1 year shipping', '1–3 years', '3+ years'],
  installed: ['Unknown or under 5k units', '5k–50k units / nodes', '50k+ units / nodes'],
  reviews: ['None, or vendor-only', 'A handful of independent reviews', 'Many independent + long-term reviews'],
  community: ['Little discussion', 'Active but small (Discord, X, small subreddit)', 'Large multi-year communities'],
  trackRecord: ['Token / rewards not live or unproven', 'Paying under 2 years, some volatility', 'Paid reliably for years, survived a downturn'],
};

const TIERS: AdoptionTier[] = ['established', 'growing', 'early', 'new'];
const RANGES: Record<AdoptionTier, string> = { established: '8–10', growing: '5–7', early: '2–4', new: '0–1' };

export default function Methodology() {
  const counts = TIERS.map((t) => ({ t, n: devices.filter((d) => tierOf(scoreOf(d.adoption)) === t).length }));
  return (
    <>
      <Stack.Screen options={{ title: 'Adoption confidence' }} />
      <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: spacing.lg, paddingBottom: 60 }}>
        <Text style={styles.lead}>
          The score answers one question: how much independent, time-tested evidence exists about this device? It is
          not a quality rating. A brand-new product with a great spec sheet scores low until real users have written
          about it for a while.
        </Text>

        <SectionTitle>Tiers</SectionTitle>
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          {counts.map(({ t, n }, i) => (
            <View key={t} style={[styles.tierRow, i > 0 && styles.divider]}>
              <View style={[styles.dot, { backgroundColor: TIER_META[t].color }]} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.tierLabel, { color: TIER_META[t].color }]}>
                  {TIER_META[t].label} <Text style={styles.range}>· {RANGES[t]} points</Text>
                </Text>
                <Text style={styles.tierBlurb}>{TIER_META[t].blurb}</Text>
              </View>
              <Text style={styles.count}>{n}</Text>
            </View>
          ))}
        </Card>

        <SectionTitle>Five factors, 0–2 points each</SectionTitle>
        {FACTOR_ORDER.map((k) => (
          <Card key={k} style={{ marginBottom: spacing.md }}>
            <Text style={styles.factor}>{FACTOR_META[k].label}</Text>
            {RUBRIC[k].map((txt, v) => (
              <View key={v} style={styles.rubricRow}>
                <Text style={styles.rubricPts}>{v}</Text>
                <Text style={styles.rubricTxt}>{txt}</Text>
              </View>
            ))}
          </Card>
        ))}

        <SectionTitle>What we looked at</SectionTitle>
        <Card>
          <Bullet>Reddit — dedicated subreddits (r/HeliumNetwork, r/hivemapper, r/solanamobile, r/WeatherXM) and threads in adjacent hobbyist communities.</Bullet>
          <Bullet>YouTube — independent unboxings, "30 days / 1 year later" reviews and earnings logs, not vendor channels.</Bullet>
          <Bullet>X and Discord — sustained discussion from owners, not launch-week hype.</Bullet>
          <Bullet>Tech press — CoinDesk, Tom's Guide, Trusted Reviews, Blockworks and similar hands-on coverage.</Bullet>
          <Bullet>Vendor and analyst disclosures — unit counts, subscriber numbers and revenue from Messari, StepData, DePIN Scan and the projects themselves.</Bullet>
        </Card>

        <SectionTitle>Caveats</SectionTitle>
        <Card>
          <Bullet>Scores are a snapshot (each device shows its "scored" month) and are edited by hand — they do not update live.</Bullet>
          <Bullet>Installed-base figures are mostly self-reported by vendors.</Bullet>
          <Bullet>A high score means well-documented, not good value. A low score means unproven, not bad.</Bullet>
          <Bullet>Every device lists where to look so you can check the evidence yourself.</Bullet>
        </Card>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  lead: { ...font.body, color: colors.text, fontSize: 15, lineHeight: 23 },
  tierRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.md },
  divider: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.cardBorder },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 12 },
  tierLabel: { ...font.subtitle, fontSize: 15 },
  range: { ...font.caption, color: colors.textFaint },
  tierBlurb: { ...font.body, color: colors.textMuted, marginTop: 2, lineHeight: 18 },
  count: { ...font.title, color: colors.text, marginLeft: 12, minWidth: 28, textAlign: 'right' },
  factor: { ...font.subtitle, color: colors.text, marginBottom: 8 },
  rubricRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 3 },
  rubricPts: { width: 22, height: 22, borderRadius: radius.sm, backgroundColor: colors.bgElevated, color: colors.solanaGreen, textAlign: 'center', lineHeight: 22, fontWeight: '800', fontSize: 12, marginRight: 10, overflow: 'hidden' },
  rubricTxt: { ...font.body, color: colors.textMuted, flex: 1, lineHeight: 20 },
});
