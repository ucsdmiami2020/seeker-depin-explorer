import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Link, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, spacing } from '../src/theme';

/** Catches any unknown route, including malformed deep links. Never echoes the bad path back. */
export default function NotFound() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not found' }} />
      <View style={styles.wrap}>
        <Ionicons name="compass-outline" size={44} color={colors.textFaint} />
        <Text style={styles.title}>Nothing here</Text>
        <Text style={styles.body}>That screen doesn't exist in this version of the app.</Text>
        <Link href="/" replace asChild>
          <Pressable style={styles.btn}>
            <Text style={styles.btnText}>Back to Explore</Text>
          </Pressable>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg, padding: spacing.xl },
  title: { ...font.title, color: colors.text, marginTop: spacing.md },
  body: { ...font.body, color: colors.textMuted, marginTop: 6, textAlign: 'center' },
  btn: { marginTop: spacing.xl, backgroundColor: colors.solanaGreen, borderRadius: 999, paddingHorizontal: 20, paddingVertical: 12 },
  btnText: { color: '#0B0B12', fontWeight: '800' },
});
