import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, font, radius, spacing } from '../src/theme';
import { tap } from '../src/components/ui';

const pillars = [
  { icon: 'hardware-chip-outline' as const, title: 'Physical devices', body: 'See the hardware bringing DePIN networks into the real world.' },
  { icon: 'planet-outline' as const, title: 'Solana networks', body: 'Understand the protocols connecting devices, data, and rewards.' },
  { icon: 'analytics-outline' as const, title: 'Adoption signals', body: 'Compare practical evidence behind each project at a glance.' },
];

export default function WelcomeScreen() {
  function enterExplorer() {
    tap();
    router.replace('/(tabs)');
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View style={styles.mark}>
            <Ionicons name="pulse" size={18} color={colors.bg} />
          </View>
          <Text style={styles.eyebrow}>SEEKER DEPIN EXPLORER</Text>
        </View>

        <View style={styles.visual} accessible accessibilityLabel="Solana ecosystem network visualization">
          <LinearGradient colors={[colors.solanaPurple, '#5424B8']} style={[styles.orbit, styles.orbitLarge]} />
          <LinearGradient colors={[colors.solanaGreen, '#087E58']} style={[styles.orbit, styles.orbitSmall]} />
          <View style={[styles.node, styles.nodeTop]}>
            <Ionicons name="phone-portrait-outline" size={22} color={colors.text} />
          </View>
          <View style={[styles.node, styles.nodeRight]}>
            <MaterialCommunityIcons name="antenna" size={24} color={colors.text} />
          </View>
          <View style={[styles.node, styles.nodeBottom]}>
            <Ionicons name="globe-outline" size={23} color={colors.text} />
          </View>
          <View style={styles.core}>
            <Ionicons name="flash" size={30} color={colors.bg} />
          </View>
        </View>

        <View style={styles.intro}>
          <Text style={styles.kicker}>THE PHYSICAL SIDE OF SOLANA</Text>
          <Text style={styles.title}>Explore the networks shaping the real world.</Text>
          <Text style={styles.body}>
            A field guide to the devices, protocols, and adoption signals powering the Solana DePIN ecosystem.
          </Text>
        </View>

        <View style={styles.pillars}>
          {pillars.map((pillar) => (
            <View key={pillar.title} style={styles.pillar}>
              <View style={styles.pillarIcon}>
                <Ionicons name={pillar.icon} size={19} color={colors.solanaGreen} />
              </View>
              <View style={styles.pillarCopy}>
                <Text style={styles.pillarTitle}>{pillar.title}</Text>
                <Text style={styles.pillarBody}>{pillar.body}</Text>
              </View>
            </View>
          ))}
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Enter Explorer"
          onPress={enterExplorer}
          style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
        >
          <Text style={styles.ctaText}>Enter Explorer</Text>
          <Ionicons name="arrow-forward" size={20} color={colors.bg} />
        </Pressable>
        <Text style={styles.trust}>No account. No wallet required. Catalog data stays on your device.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.bg },
  content: { flexGrow: 1, paddingHorizontal: spacing.xl, paddingVertical: spacing.lg },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  mark: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.solanaGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyebrow: { ...font.caption, color: colors.textMuted, letterSpacing: 1.2 },
  visual: { height: 244, marginTop: spacing.lg, alignItems: 'center', justifyContent: 'center' },
  orbit: { position: 'absolute', opacity: 0.8 },
  orbitLarge: { width: 190, height: 190, borderRadius: 95, transform: [{ rotate: '28deg' }] },
  orbitSmall: { width: 130, height: 130, borderRadius: 65, transform: [{ rotate: '-24deg' }] },
  node: {
    position: 'absolute',
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeTop: { top: 10 },
  nodeRight: { right: 24, bottom: 30 },
  nodeBottom: { left: 24, bottom: 30 },
  core: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.solanaGreen,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 6,
    borderColor: '#14F19555',
  },
  intro: { alignItems: 'center' },
  kicker: { ...font.caption, color: colors.solanaGreen, letterSpacing: 1.5, textAlign: 'center' },
  title: { ...font.display, color: colors.text, textAlign: 'center', marginTop: spacing.sm, maxWidth: 420 },
  body: { ...font.body, color: colors.textMuted, textAlign: 'center', marginTop: spacing.md, maxWidth: 430 },
  pillars: { marginTop: spacing.xl, gap: spacing.md },
  pillar: { flexDirection: 'row', alignItems: 'flex-start' },
  pillarIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: '#14F19518',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  pillarCopy: { flex: 1 },
  pillarTitle: { ...font.subtitle, color: colors.text },
  pillarBody: { ...font.caption, color: colors.textMuted, lineHeight: 18, marginTop: 2 },
  cta: {
    minHeight: 52,
    marginTop: spacing.xxl,
    borderRadius: radius.md,
    backgroundColor: colors.solanaGreen,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  ctaPressed: { opacity: 0.78, transform: [{ scale: 0.99 }] },
  ctaText: { color: colors.bg, fontSize: 15, fontWeight: '800' },
  trust: { ...font.caption, color: colors.textFaint, textAlign: 'center', marginTop: spacing.md, lineHeight: 18 },
});