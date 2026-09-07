import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Device } from '../data/types';
import { colors, font, radius, spacing } from '../theme';
import { GradientBadge, IconButton, StatusPill, TokenPill, tap } from './ui';
import { useAppState } from '../state/AppState';
import { AdoptionBadge, AdoptionBars } from './AdoptionBadge';

export function DeviceCard({ device }: { device: Device }) {
  const router = useRouter();
  const { isFavorite, toggleFavorite, isCompared, toggleCompare } = useAppState();

  return (
    <Pressable
      onPress={() => {
        tap();
        router.push(`/device/${device.id}`);
      }}
      style={({ pressed }) => [styles.card, pressed && { transform: [{ scale: 0.985 }], opacity: 0.95 }]}
    >
      <View style={styles.topRow}>
        <GradientBadge category={device.category} set={device.icon.set} name={device.icon.name} />
        <View style={{ flex: 1, marginLeft: spacing.md }}>
          <Text style={styles.maker}>{device.maker}</Text>
          <Text style={styles.name} numberOfLines={2}>
            {device.name}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.price}>{device.price}</Text>
          <Text style={styles.year}>{device.releaseYear}</Text>
        </View>
      </View>

      <Text style={styles.tagline} numberOfLines={2}>
        {device.tagline}
      </Text>
      <AdoptionBars adoption={device.adoption} />

      <View style={styles.bottomRow}>
        <View style={{ flexDirection: 'row', flex: 1, flexWrap: 'wrap' }}>
          <AdoptionBadge adoption={device.adoption} />
          <StatusPill status={device.status} />
          {device.token ? <TokenPill symbol={device.token.symbol} /> : null}
        </View>
        <IconButton
          name={isCompared(device.id) ? 'git-compare' : 'git-compare-outline'}
          active={isCompared(device.id)}
          activeColor={colors.solanaBlue}
          onPress={() => toggleCompare(device.id)}
          label="Toggle compare"
        />
        <IconButton
          name={isFavorite(device.id) ? 'heart' : 'heart-outline'}
          active={isFavorite(device.id)}
          activeColor={colors.danger}
          onPress={() => toggleFavorite(device.id)}
          label="Toggle favourite"
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  topRow: { flexDirection: 'row', alignItems: 'center' },
  maker: { ...font.caption, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, fontSize: 11 },
  name: { ...font.subtitle, color: colors.text, fontSize: 16, marginTop: 2 },
  price: { ...font.subtitle, color: colors.solanaGreen },
  year: { ...font.caption, color: colors.textFaint, marginTop: 2 },
  tagline: { ...font.body, color: colors.textMuted, marginTop: spacing.md },
  bottomRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md },
});
