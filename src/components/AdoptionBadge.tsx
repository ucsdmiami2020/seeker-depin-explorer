import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { Adoption } from '../data/types';
import { FACTOR_META, FACTOR_ORDER, tierMeta } from '../lib/adoption';
import { colors, font, radius, spacing } from '../theme';
import { tap } from './ui';

/** Compact pill: "● Established 9/10". Tapping opens the methodology screen. */
export function AdoptionBadge({ adoption, compact }: { adoption: Adoption; compact?: boolean }) {
  const router = useRouter();
  const { score, label, color } = tierMeta(adoption);
  return (
    <Pressable
      accessibilityLabel={`Adoption confidence ${label}, ${score} out of 10`}
      onPress={() => {
        tap();
        router.push('/methodology');
      }}
      hitSlop={6}
      style={[styles.pill, { borderColor: color, backgroundColor: color + '1A' }]}
    >
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.pillText, { color }]}>
        {label}
        {compact ? '' : ` ${score}/10`}
      </Text>
    </Pressable>
  );
}

/** Five mini bars, one per factor — used on cards for an at-a-glance read. */
export function AdoptionBars({ adoption, height = 4 }: { adoption: Adoption; height?: number }) {
  const { color } = tierMeta(adoption);
  return (
    <View style={styles.bars} accessible accessibilityLabel="Adoption factor bars">
      {FACTOR_ORDER.map((k) => {
        const v = adoption.factors[k].value;
        return (
          <View key={k} style={[styles.barTrack, { height }]}>
            <View style={[styles.barFill, { width: `${(v / 2) * 100}%`, backgroundColor: v === 0 ? colors.textFaint : color }]} />
          </View>
        );
      })}
    </View>
  );
}

/** Full breakdown for the detail screen: score ring, factor rows with evidence, where-to-look list. */
export function AdoptionPanel({ adoption }: { adoption: Adoption }) {
  const router = useRouter();
  const { score, label, color, blurb } = tierMeta(adoption);
  return (
    <View style={styles.panel}>
      <View style={styles.head}>
        <View style={[styles.scoreRing, { borderColor: color }]}>
          <Text style={[styles.scoreNum, { color }]}>{score}</Text>
          <Text style={styles.scoreDen}>/10</Text>
        </View>
        <View style={{ flex: 1, marginLeft: spacing.md }}>
          <Text style={[styles.tier, { color }]}>{label}</Text>
          <Text style={styles.blurb}>{blurb}</Text>
        </View>
      </View>

      {FACTOR_ORDER.map((k) => {
        const f = adoption.factors[k];
        return (
          <View key={k} style={styles.factorRow}>
            <View style={styles.factorHead}>
              <Text style={styles.factorLabel}>{FACTOR_META[k].label}</Text>
              <View style={styles.pips}>
                {[0, 1].map((i) => (
                  <View key={i} style={[styles.pip, i < f.value && { backgroundColor: color, borderColor: color }]} />
                ))}
                <Text style={styles.pipText}>{f.value}/2</Text>
              </View>
            </View>
            <Text style={styles.factorNote}>{f.note}</Text>
          </View>
        );
      })}

      <Text style={styles.whereTitle}>Check for yourself</Text>
      {adoption.evidence.map((e) => (
        <View key={e} style={styles.whereRow}>
          <Ionicons name="search-outline" size={13} color={colors.textMuted} />
          <Text style={styles.whereText}>{e}</Text>
        </View>
      ))}

      <Pressable
        onPress={() => {
          tap();
          router.push('/methodology');
        }}
        style={styles.methodLink}
      >
        <Ionicons name="help-circle-outline" size={15} color={colors.solanaBlue} />
        <Text style={styles.methodText}>How this score is calculated · scored {adoption.asOf}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 3,
    marginRight: 6,
  },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 5 },
  pillText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },
  bars: { flexDirection: 'row', gap: 3, marginTop: 10 },
  barTrack: { flex: 1, backgroundColor: colors.cardBorder, borderRadius: 2, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 2 },
  panel: { backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.cardBorder, padding: spacing.lg },
  head: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  scoreRing: { width: 64, height: 64, borderRadius: 32, borderWidth: 3, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  scoreNum: { fontSize: 24, fontWeight: '800' },
  scoreDen: { ...font.caption, color: colors.textFaint, marginTop: 6 },
  tier: { ...font.subtitle, fontSize: 16 },
  blurb: { ...font.body, color: colors.textMuted, marginTop: 2, lineHeight: 18 },
  factorRow: { paddingVertical: 10, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.cardBorder },
  factorHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  factorLabel: { ...font.subtitle, color: colors.text, fontSize: 14 },
  pips: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  pip: { width: 14, height: 6, borderRadius: 3, borderWidth: 1, borderColor: colors.cardBorder, backgroundColor: colors.bgElevated },
  pipText: { ...font.caption, color: colors.textFaint, marginLeft: 4 },
  factorNote: { ...font.body, color: colors.textMuted, marginTop: 4, lineHeight: 18 },
  whereTitle: { ...font.caption, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginTop: spacing.md, marginBottom: 6 },
  whereRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 3 },
  whereText: { ...font.body, color: colors.text, marginLeft: 8, lineHeight: 18 },
  methodLink: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md },
  methodText: { ...font.caption, color: colors.solanaBlue, marginLeft: 6 },
});
