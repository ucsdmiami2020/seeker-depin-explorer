import React, { useState } from 'react';
import { Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, font, radius, spacing } from '../theme';
import { DeviceIcon, tap } from './ui';
import { HELP_EXTRA, TOUR } from '../data/help';
import { useHelp } from '../state/HelpProvider';

/** Floating help button, anchored above the tab bar on every tab. */
export function HelpFab() {
  const { openHelp } = useHelp();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Help and app guide"
      onPress={() => {
        tap();
        openHelp();
      }}
      style={({ pressed }) => [styles.fab, pressed && { opacity: 0.8, transform: [{ scale: 0.96 }] }]}
    >
      <Ionicons name="help" size={22} color={colors.bg} />
    </Pressable>
  );
}

function ProgressDots({ count, index }: { count: number; index: number }) {
  return (
    <View style={styles.dots}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
      ))}
    </View>
  );
}

/** Step-by-step tour shown once per launch, and replayable from the help sheet. */
function Tour() {
  const { tourOpen, closeTour } = useHelp();
  const [step, setStep] = useState(0);
  const { height } = useWindowDimensions();
  const topic = TOUR[step];
  const isLast = step === TOUR.length - 1;

  function finish() {
    tap();
    closeTour();
    setStep(0);
  }

  if (!topic) return null;

  return (
    <Modal visible={tourOpen} transparent animationType="fade" onRequestClose={finish} statusBarTranslucent>
      <View style={styles.backdrop}>
        <View style={[styles.tourCard, { maxHeight: height * 0.8 }]}>
          <LinearGradient
            colors={[colors.solanaPurple, colors.solanaBlue]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.tourIconWrap}
          >
            <DeviceIcon set={topic.icon.set} name={topic.icon.name} size={30} color="#fff" />
          </LinearGradient>

          <Text style={styles.tourStepLabel}>
            Step {step + 1} of {TOUR.length}
          </Text>
          <Text style={styles.tourTitle}>{topic.title}</Text>
          <ScrollView style={{ flexGrow: 0 }} showsVerticalScrollIndicator={false}>
            <Text style={styles.tourBody}>{topic.body}</Text>
            {topic.action ? (
              <View style={styles.actionRow}>
                <Ionicons name="arrow-forward-circle" size={16} color={colors.solanaGreen} />
                <Text style={styles.actionText}>{topic.action}</Text>
              </View>
            ) : null}
          </ScrollView>

          <ProgressDots count={TOUR.length} index={step} />

          <View style={styles.tourButtons}>
            {step > 0 ? (
              <Pressable
                onPress={() => {
                  tap();
                  setStep((s) => s - 1);
                }}
                style={({ pressed }) => [styles.ghostBtn, pressed && { opacity: 0.7 }]}
              >
                <Text style={styles.ghostBtnText}>Back</Text>
              </Pressable>
            ) : (
              <Pressable onPress={finish} style={({ pressed }) => [styles.ghostBtn, pressed && { opacity: 0.7 }]}>
                <Text style={styles.ghostBtnText}>Skip</Text>
              </Pressable>
            )}
            <Pressable
              onPress={() => {
                if (isLast) return finish();
                tap();
                setStep((s) => s + 1);
              }}
              style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.85 }]}
            >
              <Text style={styles.primaryBtnText}>{isLast ? 'Start exploring' : 'Next'}</Text>
              <Ionicons name={isLast ? 'checkmark' : 'arrow-forward'} size={17} color={colors.bg} />
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

/** Full help sheet: every tour topic plus the caveats, reachable any time from the help button. */
function HelpSheet() {
  const { helpOpen, closeHelp, openTour } = useHelp();
  const router = useRouter();
  const { height } = useWindowDimensions();

  function go(path: '/methodology' | '/legal/privacy') {
    tap();
    closeHelp();
    router.push(path);
  }

  return (
    <Modal visible={helpOpen} transparent animationType="slide" onRequestClose={closeHelp} statusBarTranslucent>
      <View style={styles.sheetBackdrop}>
        <Pressable style={{ flex: 1 }} accessibilityLabel="Close help" onPress={closeHelp} />
        <View style={[styles.sheet, { maxHeight: height * 0.88 }]}>
          <View style={styles.grabber} />
          <View style={styles.sheetHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sheetTitle}>How this app works</Text>
              <Text style={styles.sheetSub}>The physical side of Solana, explained in a minute.</Text>
            </View>
            <Pressable onPress={closeHelp} hitSlop={10} accessibilityLabel="Close">
              <Ionicons name="close" size={24} color={colors.textMuted} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxl }} showsVerticalScrollIndicator={false}>
            {[...TOUR, ...HELP_EXTRA].map((topic) => (
              <View key={topic.id} style={styles.topicRow}>
                <View style={styles.topicIcon}>
                  <DeviceIcon set={topic.icon.set} name={topic.icon.name} size={20} color={colors.solanaGreen} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.topicTitle}>{topic.title}</Text>
                  <Text style={styles.topicBody}>{topic.body}</Text>
                  {topic.action ? <Text style={styles.topicAction}>{topic.action}</Text> : null}
                </View>
              </View>
            ))}

            <Pressable
              onPress={() => {
                tap();
                openTour();
              }}
              style={({ pressed }) => [styles.replayBtn, pressed && { opacity: 0.8 }]}
            >
              <Ionicons name="play-circle-outline" size={19} color={colors.solanaGreen} />
              <Text style={styles.replayText}>Replay the guided tour</Text>
            </Pressable>

            <View style={styles.linkRow}>
              <Pressable onPress={() => go('/methodology')} style={styles.linkBtn}>
                <Text style={styles.linkText}>Scoring method</Text>
                <Ionicons name="chevron-forward" size={15} color={colors.textMuted} />
              </Pressable>
              <Pressable onPress={() => go('/legal/privacy')} style={styles.linkBtn}>
                <Text style={styles.linkText}>Privacy policy</Text>
                <Ionicons name="chevron-forward" size={15} color={colors.textMuted} />
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export function HelpCenter() {
  return (
    <>
      <Tour />
      <HelpSheet />
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: 80,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.solanaGreen,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      android: { elevation: 6 },
      default: { shadowColor: '#000', shadowOpacity: 0.35, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } },
    }),
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(5,5,10,0.82)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  tourCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.xl,
  },
  tourIconWrap: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  tourStepLabel: { ...font.caption, color: colors.textFaint, letterSpacing: 1 },
  tourTitle: { ...font.title, color: colors.text, marginTop: 4, marginBottom: spacing.sm },
  tourBody: { ...font.body, color: colors.textMuted, lineHeight: 22 },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: spacing.md },
  actionText: { ...font.caption, color: colors.solanaGreen, flex: 1 },
  dots: { flexDirection: 'row', gap: 6, marginTop: spacing.xl, marginBottom: spacing.lg },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.chip },
  dotActive: { backgroundColor: colors.solanaGreen, width: 20 },
  tourButtons: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  ghostBtn: { paddingVertical: 12, paddingHorizontal: spacing.md },
  ghostBtnText: { ...font.subtitle, color: colors.textMuted },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.solanaGreen,
    paddingVertical: 13,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
  },
  primaryBtnText: { color: colors.bg, fontWeight: '800', fontSize: 15 },
  sheetBackdrop: { flex: 1, backgroundColor: 'rgba(5,5,10,0.6)' },
  sheet: {
    backgroundColor: colors.bgElevated,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderTopWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  grabber: {
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.cardBorder,
    alignSelf: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  sheetHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, paddingVertical: spacing.md },
  sheetTitle: { ...font.title, color: colors.text },
  sheetSub: { ...font.caption, color: colors.textMuted, marginTop: 3 },
  topicRow: { flexDirection: 'row', gap: spacing.md, paddingVertical: spacing.md },
  topicIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.chip,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicTitle: { ...font.subtitle, color: colors.text, marginBottom: 3 },
  topicBody: { ...font.body, color: colors.textMuted },
  topicAction: { ...font.caption, color: colors.solanaGreen, marginTop: 6 },
  replayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: spacing.lg,
    paddingVertical: 13,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.solanaGreen,
  },
  replayText: { color: colors.solanaGreen, fontWeight: '700', fontSize: 14 },
  linkRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  linkBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radius.md,
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
  },
  linkText: { ...font.caption, color: colors.text },
});
