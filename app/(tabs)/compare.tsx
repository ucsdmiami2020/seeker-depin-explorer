import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { devices, getDevice, categoryMeta } from '../../src/data/devices';
import { colors, font, radius, spacing } from '../../src/theme';
import { Card, GradientBadge, SectionTitle, tap } from '../../src/components/ui';
import { MAX_COMPARE, useAppState } from '../../src/state/AppState';
import { tierMeta } from '../../src/lib/adoption';

const ROWS: { label: string; get: (d: ReturnType<typeof getDevice>) => string }[] = [
  { label: 'Adoption', get: (d) => { const t = tierMeta(d!.adoption); return `${t.label} ${t.score}/10`; } },
  { label: 'Maker', get: (d) => d!.maker },
  { label: 'Category', get: (d) => categoryMeta[d!.category].label },
  { label: 'Price', get: (d) => d!.price },
  { label: 'Released', get: (d) => String(d!.releaseYear) },
  { label: 'Status', get: (d) => d!.status[0].toUpperCase() + d!.status.slice(1) },
  { label: 'Token', get: (d) => (d!.token ? `$${d!.token.symbol}` : '—') },
  { label: 'Earns by', get: (d) => d!.earn[0] },
  { label: 'Seeker app', get: (d) => (d!.seekerReady ? 'Yes' : 'No') },
];

export default function Compare() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { compare, toggleCompare, clearCompare } = useAppState();
  const selected = useMemo(() => compare.map(getDevice).filter(Boolean), [compare]);

  // Union of spec labels so devices of the same type line up.
  const specLabels = useMemo(() => {
    const seen: string[] = [];
    selected.forEach((d) => d!.specs.forEach((s) => !seen.includes(s.label) && seen.push(s.label)));
    return seen;
  }, [selected]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingHorizontal: spacing.lg, paddingBottom: 100 }}
    >
      <Text style={styles.title}>Compare</Text>
      <Text style={styles.sub}>Pick up to {MAX_COMPARE} devices from Explore, or tap below to add.</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: spacing.lg }}>
        {devices.map((d) => {
          const on = compare.includes(d.id);
          return (
            <Pressable
              key={d.id}
              onPress={() => {
                tap();
                toggleCompare(d.id);
              }}
              style={[styles.pick, on && styles.pickOn]}
            >
              <GradientBadge category={d.category} set={d.icon.set} name={d.icon.name} size={36} iconSize={18} />
              <Text style={[styles.pickText, on && { color: colors.text }]} numberOfLines={1}>
                {d.name}
              </Text>
              {on ? <Ionicons name="checkmark-circle" size={16} color={colors.solanaGreen} /> : null}
            </Pressable>
          );
        })}
      </ScrollView>

      {selected.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="git-compare-outline" size={40} color={colors.textFaint} />
          <Text style={styles.emptyText}>Nothing selected yet.</Text>
        </View>
      ) : (
        <>
          <SectionTitle
            right={
              <Pressable onPress={clearCompare} hitSlop={8}>
                <Text style={{ color: colors.danger, ...font.caption }}>Clear</Text>
              </Pressable>
            }
          >
            Overview
          </SectionTitle>
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <View style={styles.headRow}>
              <View style={styles.labelCell} />
              {selected.map((d) => (
                <Pressable key={d!.id} style={styles.cell} onPress={() => router.push(`/device/${d!.id}`)}>
                  <GradientBadge category={d!.category} set={d!.icon.set} name={d!.icon.name} size={40} iconSize={20} />
                  <Text style={styles.headName} numberOfLines={2}>
                    {d!.name}
                  </Text>
                </Pressable>
              ))}
            </View>
            {ROWS.map((r, i) => (
              <View key={r.label} style={[styles.row, i % 2 === 0 && styles.rowAlt]}>
                <Text style={[styles.labelCell, styles.labelText]}>{r.label}</Text>
                {selected.map((d) => (
                  <Text key={d!.id} style={[styles.cell, styles.cellText]}>
                    {r.get(d)}
                  </Text>
                ))}
              </View>
            ))}
          </Card>

          <SectionTitle>Specifications</SectionTitle>
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            {specLabels.map((label, i) => (
              <View key={label} style={[styles.row, i % 2 === 0 && styles.rowAlt]}>
                <Text style={[styles.labelCell, styles.labelText]}>{label}</Text>
                {selected.map((d) => {
                  const s = d!.specs.find((x) => x.label === label);
                  return (
                    <Text key={d!.id} style={[styles.cell, styles.cellText, !s && { color: colors.textFaint }]}>
                      {s ? s.value : '—'}
                    </Text>
                  );
                })}
              </View>
            ))}
          </Card>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { ...font.display, color: colors.text },
  sub: { ...font.body, color: colors.textMuted, marginTop: 6 },
  pick: {
    width: 120,
    marginRight: 10,
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: 10,
    alignItems: 'center',
    gap: 6,
  },
  pickOn: { borderColor: colors.solanaGreen },
  pickText: { ...font.caption, color: colors.textMuted, textAlign: 'center' },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { ...font.body, color: colors.textMuted, marginTop: 10 },
  headRow: { flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderBottomColor: colors.cardBorder },
  headName: { ...font.caption, color: colors.text, marginTop: 6, textAlign: 'center' },
  row: { flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 12 },
  rowAlt: { backgroundColor: '#FFFFFF05' },
  labelCell: { width: 86 },
  labelText: { ...font.caption, color: colors.textMuted },
  cell: { flex: 1, alignItems: 'center', paddingHorizontal: 4 },
  cellText: { ...font.caption, color: colors.text, textAlign: 'center', fontWeight: '500', lineHeight: 16 },
});
