import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, radius, spacing } from '../../src/theme';
import { Card, DeviceIcon, SectionTitle, tap } from '../../src/components/ui';
import { openExternal } from '../../src/lib/links';
import { GROUPS, LIMITS, POSTURE, REVIEW, THREAT_MODEL, type ControlState } from '../../src/data/security';

const STATE_META: Record<ControlState, { label: string; color: string }> = {
  enforced: { label: 'Enforced', color: colors.solanaGreen },
  accepted: { label: 'Accepted risk', color: colors.warning },
  planned: { label: 'Planned', color: colors.solanaBlue },
};

function StatePill({ state }: { state: ControlState }) {
  const meta = STATE_META[state];
  return (
    <View style={[styles.pill, { borderColor: meta.color }]}>
      <View style={[styles.pillDot, { backgroundColor: meta.color }]} />
      <Text style={[styles.pillText, { color: meta.color }]}>{meta.label}</Text>
    </View>
  );
}

export default function Security() {
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState<string | null>(GROUPS[0]?.id ?? null);

  const enforced = GROUPS.flatMap((g) => g.controls).filter((c) => c.state === 'enforced').length;
  const accepted = GROUPS.flatMap((g) => g.controls).filter((c) => c.state === 'accepted').length;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingHorizontal: spacing.lg, paddingBottom: 110 }}
    >
      <Text style={styles.title}>Security</Text>
      <Text style={styles.sub}>
        How this app is built, what it deliberately cannot do, and what is knowingly accepted.
      </Text>

      <Card style={{ marginTop: spacing.lg }}>
        <View style={styles.reviewRow}>
          <Ionicons name="shield-checkmark" size={20} color={colors.solanaGreen} />
          <Text style={styles.reviewText}>
            Reviewed {REVIEW.date} against {REVIEW.standard}
          </Text>
        </View>
        <Text style={styles.reviewMeta}>
          {REVIEW.version} · {enforced} controls enforced · {accepted} risks accepted
        </Text>
      </Card>

      <View style={styles.postureGrid}>
        {POSTURE.map((p) => (
          <View key={p.label} style={styles.postureCard}>
            <Text style={styles.postureValue}>{p.value}</Text>
            <Text style={styles.postureLabel}>{p.label}</Text>
            <Text style={styles.postureNote}>{p.note}</Text>
          </View>
        ))}
      </View>

      <SectionTitle>Controls</SectionTitle>
      {GROUPS.map((group) => {
        const expanded = open === group.id;
        return (
          <Card key={group.id} style={{ marginBottom: spacing.md }}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${group.title}, ${expanded ? 'collapse' : 'expand'}`}
              onPress={() => {
                tap();
                setOpen(expanded ? null : group.id);
              }}
              style={styles.groupHeader}
            >
              <View style={styles.groupIcon}>
                <DeviceIcon set={group.icon.set} name={group.icon.name} size={19} color={colors.solanaGreen} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.groupTitle}>{group.title}</Text>
                <Text style={styles.groupSummary}>{group.summary}</Text>
              </View>
              <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textFaint} />
            </Pressable>

            {expanded
              ? group.controls.map((c, i) => (
                  <View key={c.title} style={[styles.control, i === group.controls.length - 1 && { borderBottomWidth: 0 }]}>
                    <View style={styles.controlHead}>
                      <Text style={styles.controlTitle}>{c.title}</Text>
                      <StatePill state={c.state} />
                    </View>
                    <Text style={styles.controlDetail}>{c.detail}</Text>
                    {c.where ? <Text style={styles.controlWhere}>{c.where}</Text> : null}
                  </View>
                ))
              : null}
          </Card>
        );
      })}

      <SectionTitle>Threat model</SectionTitle>
      <Card>
        <Text style={styles.tmHeading}>Defended against</Text>
        {THREAT_MODEL.inScope.map((t) => (
          <View key={t} style={styles.tmRow}>
            <Ionicons name="shield-half-outline" size={15} color={colors.solanaGreen} style={{ marginTop: 3 }} />
            <Text style={styles.tmText}>{t}</Text>
          </View>
        ))}
        <Text style={[styles.tmHeading, { marginTop: spacing.lg }]}>Out of scope</Text>
        {THREAT_MODEL.outOfScope.map((t) => (
          <View key={t} style={styles.tmRow}>
            <Ionicons name="remove-circle-outline" size={15} color={colors.textFaint} style={{ marginTop: 3 }} />
            <Text style={styles.tmText}>{t}</Text>
          </View>
        ))}
      </Card>

      <SectionTitle>What this review does not cover</SectionTitle>
      <Card>
        {LIMITS.map((l) => (
          <View key={l} style={styles.tmRow}>
            <Ionicons name="alert-circle-outline" size={15} color={colors.warning} style={{ marginTop: 3 }} />
            <Text style={styles.tmText}>{l}</Text>
          </View>
        ))}
      </Card>

      <SectionTitle>Verify it yourself</SectionTitle>
      <Card>
        <Text style={styles.body}>
          Every claim here maps to code you can read. The repository is public, and the full review with findings
          and remediations lives in SECURITY-REVIEW.md.
        </Text>
        <Pressable
          onPress={() => {
            tap();
            openExternal(REVIEW.repo);
          }}
          style={({ pressed }) => [styles.repoBtn, pressed && { opacity: 0.8 }]}
          accessibilityRole="link"
        >
          <Ionicons name="logo-github" size={18} color={colors.bg} />
          <Text style={styles.repoText}>Read the source</Text>
        </Pressable>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { ...font.display, color: colors.text },
  sub: { ...font.body, color: colors.textMuted, marginTop: 6 },
  body: { ...font.body, color: colors.textMuted },
  reviewRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  reviewText: { ...font.subtitle, color: colors.text, flex: 1 },
  reviewMeta: { ...font.caption, color: colors.textFaint, marginTop: 6 },
  postureGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.lg },
  postureCard: {
    flexGrow: 1,
    flexBasis: '45%',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  postureValue: { ...font.title, color: colors.solanaGreen, fontSize: 22 },
  postureLabel: { ...font.caption, color: colors.text, marginTop: 4, fontWeight: '700' },
  postureNote: { ...font.caption, color: colors.textFaint, marginTop: 4, lineHeight: 16 },
  groupHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  groupIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.chip,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupTitle: { ...font.subtitle, color: colors.text },
  groupSummary: { ...font.caption, color: colors.textMuted, marginTop: 2 },
  control: {
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.cardBorder,
  },
  controlHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: 6 },
  controlTitle: { ...font.body, color: colors.text, fontWeight: '700', flex: 1 },
  controlDetail: { ...font.caption, color: colors.textMuted, lineHeight: 19 },
  controlWhere: { ...font.mono, color: colors.textFaint, fontSize: 11, marginTop: 6 },
  pill: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
  pillDot: { width: 5, height: 5, borderRadius: 3, marginRight: 5 },
  pillText: { fontSize: 10, fontWeight: '700' },
  tmHeading: { ...font.caption, color: colors.text, fontWeight: '700', letterSpacing: 0.6, marginBottom: spacing.sm },
  tmRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm },
  tmText: { ...font.caption, color: colors.textMuted, flex: 1, lineHeight: 18 },
  repoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
    paddingVertical: 12,
    borderRadius: radius.md,
    backgroundColor: colors.solanaGreen,
  },
  repoText: { color: colors.bg, fontWeight: '800', fontSize: 14 },
});
