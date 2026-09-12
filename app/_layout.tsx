import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Stack, type ErrorBoundaryProps } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppStateProvider } from '../src/state/AppState';
import { WalletProvider } from '../src/state/WalletProvider';
import { colors, font, spacing } from '../src/theme';

/**
 * Root error boundary. Shows a recoverable screen instead of a red box / crash,
 * and deliberately does NOT render the error message or stack to the user in release builds.
 */
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <View style={styles.errWrap}>
      <Text style={styles.errTitle}>Something went wrong</Text>
      <Text style={styles.errBody}>The screen hit an unexpected error. You can try again or restart the app.</Text>
      {__DEV__ ? <Text style={styles.errDev}>{String(error?.message ?? error)}</Text> : null}
      <Pressable onPress={retry} style={styles.errBtn}>
        <Text style={styles.errBtnText}>Try again</Text>
      </Pressable>
    </View>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppStateProvider>
        <WalletProvider>
          <StatusBar style="light" />
          <Stack
            initialRouteName="welcome"
            screenOptions={{
              headerStyle: { backgroundColor: colors.bg },
              headerTintColor: colors.text,
              headerTitleStyle: { fontWeight: '700' },
              headerShadowVisible: false,
              contentStyle: { backgroundColor: colors.bg },
            }}
          >
            <Stack.Screen name="welcome" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="device/[id]" options={{ title: '', headerTransparent: true }} />
            <Stack.Screen name="legal/[doc]" options={{ title: 'Legal' }} />
            <Stack.Screen name="methodology" options={{ title: 'Adoption confidence' }} />
            <Stack.Screen name="+not-found" options={{ title: 'Not found' }} />
          </Stack>
        </WalletProvider>
      </AppStateProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  errWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg, padding: spacing.xl },
  errTitle: { ...font.title, color: colors.text },
  errBody: { ...font.body, color: colors.textMuted, marginTop: 8, textAlign: 'center' },
  errDev: { ...font.mono, color: colors.warning, marginTop: 12, textAlign: 'center' },
  errBtn: { marginTop: spacing.xl, backgroundColor: colors.solanaGreen, borderRadius: 999, paddingHorizontal: 20, paddingVertical: 12 },
  errBtnText: { color: '#0B0B12', fontWeight: '800' },
});
