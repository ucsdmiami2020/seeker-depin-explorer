import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { colors, radius, spacing, font, categoryColors } from '../theme';
import { DeviceStatus, IconSet, Category } from '../data/types';

export function tap() {
  if (Platform.OS !== 'web') Haptics.selectionAsync().catch(() => {});
}

export function DeviceIcon({
  set,
  name,
  size = 28,
  color = colors.text,
}: {
  set: IconSet;
  name: string;
  size?: number;
  color?: string;
}) {
  if (set === 'ion') return <Ionicons name={name as any} size={size} color={color} />;
  return <MaterialCommunityIcons name={name as any} size={size} color={color} />;
}

export function GradientBadge({
  category,
  set,
  name,
  size = 56,
  iconSize = 28,
  style,
}: {
  category: Category;
  set: IconSet;
  name: string;
  size?: number;
  iconSize?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const [a, b] = categoryColors[category];
  return (
    <LinearGradient
      colors={[a, b]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[{ width: size, height: size, borderRadius: size * 0.3, alignItems: 'center', justifyContent: 'center' }, style]}
    >
      <DeviceIcon set={set} name={name} size={iconSize} color="#0B0B12" />
    </LinearGradient>
  );
}

export function Chip({
  label,
  active,
  onPress,
  icon,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
  icon?: string;
}) {
  return (
    <Pressable
      onPress={() => {
        tap();
        onPress?.();
      }}
      style={({ pressed }) => [styles.chip, active && styles.chipActive, pressed && { opacity: 0.8 }]}
    >
      {icon ? (
        <MaterialCommunityIcons
          name={icon as any}
          size={14}
          color={active ? '#fff' : colors.textMuted}
          style={{ marginRight: 6 }}
        />
      ) : null}
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

export function StatusPill({ status }: { status: DeviceStatus }) {
  const map: Record<DeviceStatus, { label: string; color: string }> = {
    shipping: { label: 'Shipping', color: colors.solanaGreen },
    preorder: { label: 'Pre-order', color: colors.solanaBlue },
    discontinued: { label: 'Discontinued', color: colors.textFaint },
  };
  const m = map[status];
  return (
    <View style={[styles.pill, { borderColor: m.color }]}>
      <View style={[styles.dot, { backgroundColor: m.color }]} />
      <Text style={[styles.pillText, { color: m.color }]}>{m.label}</Text>
    </View>
  );
}

export function TokenPill({ symbol }: { symbol: string }) {
  return (
    <View style={[styles.pill, { borderColor: colors.solanaPurple, backgroundColor: '#9945FF22' }]}>
      <Text style={[styles.pillText, { color: '#C79BFF' }]}>${symbol}</Text>
    </View>
  );
}

export function SectionTitle({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <View style={styles.sectionRow}>
      <Text style={styles.sectionTitle}>{children}</Text>
      {right}
    </View>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function SpecRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.specRow, last && { borderBottomWidth: 0 }]}>
      <Text style={styles.specLabel}>{label}</Text>
      <Text style={styles.specValue}>{value}</Text>
    </View>
  );
}

export function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.bulletRow}>
      <View style={styles.bulletDot} />
      <Text style={styles.bulletText}>{children}</Text>
    </View>
  );
}

export function IconButton({
  name,
  onPress,
  active,
  activeColor = colors.solanaGreen,
  size = 20,
  label,
}: {
  name: string;
  onPress: () => void;
  active?: boolean;
  activeColor?: string;
  size?: number;
  label?: string;
}) {
  return (
    <Pressable
      accessibilityLabel={label}
      onPress={() => {
        tap();
        onPress();
      }}
      hitSlop={8}
      style={({ pressed }) => [styles.iconBtn, active && { borderColor: activeColor, backgroundColor: activeColor + '22' }, pressed && { opacity: 0.7 }]}
    >
      <Ionicons name={name as any} size={size} color={active ? activeColor : colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.chip,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginRight: spacing.sm,
  },
  chipActive: { backgroundColor: colors.chipActive, borderColor: colors.chipActive },
  chipText: { ...font.caption, color: colors.textMuted, fontSize: 13 },
  chipTextActive: { color: '#fff' },
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
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  sectionTitle: { ...font.title, color: colors.text, fontSize: 18 },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.lg,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.cardBorder,
    gap: 12,
  },
  specLabel: { ...font.caption, color: colors.textMuted, width: 110 },
  specValue: { ...font.body, color: colors.text, flex: 1, textAlign: 'right', lineHeight: 18 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  bulletDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.solanaGreen, marginTop: 8, marginRight: 10 },
  bulletText: { ...font.body, color: colors.text, flex: 1 },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});
