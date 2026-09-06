import React, { useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { networks } from '../../src/data/networks';
import { devices } from '../../src/data/devices';
import { colors, font, radius, spacing } from '../../src/theme';
import { Card, GradientBadge, TokenPill, tap } from '../../src/components/ui';

export default function Networks() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [open, setOpen] = useState<string | null>(null);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingHorizontal: spacing.lg, paddingBottom: 100 }}
    >
      <Text style={styles.title}>Networks</Text>
      <Text style={styles.sub}>The DePIN protocols behind each device, all settling on Solana.</Text>

      {networks.map((n) => {
        const nDevices = devices.filter((d) => d.network === n.id);
        const expanded = open === n.id;
        return (
          <Card key={n.id} style={{ marginTop: spacing.md }}>
            <Pressable
              onPress={() => {
                tap();
                setOpen(expanded ? null : n.id);
              }}
              style={styles.row}
            >
              <GradientBadge category={n.category} set={n.icon.set} name={n.icon.name} size={46} iconSize={24} />
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <Text style={styles.name}>{n.name}</Text>
                <Text style={styles.summary} numberOfLines={expanded ? undefined : 2}>
                  {n.summary}
                </Text>
              </View>
              <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={20} color={colors.textMuted} />
            </Pressable>

            <View style={styles.metaRow}>
              <TokenPill symbol={n.token} />
              <View style={styles.devCount}>
                <Ionicons name="hardware-chip-outline" size={12} color={colors.textMuted} />
                <Text style={styles.devCountText}>
                  {nDevices.length} device{nDevices.length !== 1 ? 's' : ''}
                </Text>
              </View>
            </View>

            {expanded ? (
              <View style={{ marginTop: spacing.md }}>
                <Text style={styles.body}>{n.whatItDoes}</Text>
                {nDevices.length ? (
                  <View style={{ marginTop: spacing.md }}>
                    {nDevices.map((d) => (
                      <Pressable
                        key={d.id}
                        onPress={() => router.push(`/device/${d.id}`)}
                        style={styles.devRow}
                      >
                        <Text style={styles.devName}>{d.name}</Text>
                        <Text style={styles.devPrice}>{d.price}</Text>
                        <Ionicons name="chevron-forward" size={16} color={colors.textFaint} />
                      </Pressable>
                    ))}
                  </View>
                ) : null}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.md }}>
                  {n.links.map((l) => (
                    <Pressable key={l.url} onPress={() => Linking.openURL(l.url)} style={styles.link}>
                      <Ionicons name="open-outline" size={14} color={colors.solanaBlue} />
                      <Text style={styles.linkText}>{l.label}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            ) : null}
          </Card>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { ...font.display, color: colors.text },
  sub: { ...font.body, color: colors.textMuted, marginTop: 6 },
  row: { flexDirection: 'row', alignItems: 'center' },
  name: { ...font.subtitle, color: colors.text, fontSize: 16 },
  summary: { ...font.body, color: colors.textMuted, marginTop: 2, lineHeight: 18 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md },
  devCount: { flexDirection: 'row', alignItems: 'center', marginLeft: 4 },
  devCountText: { ...font.caption, color: colors.textMuted, marginLeft: 4 },
  body: { ...font.body, color: colors.text },
  devRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.cardBorder,
  },
  devName: { ...font.body, color: colors.text, flex: 1 },
  devPrice: { ...font.caption, color: colors.solanaGreen, marginRight: 8 },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#19D4FF14',
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  linkText: { ...font.caption, color: colors.solanaBlue, marginLeft: 6 },
});
