import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { legalDocs, LegalDocId, PUBLISHER } from '../../src/data/legal';
import { colors, font, spacing } from '../../src/theme';
import { Card } from '../../src/components/ui';

const VALID: LegalDocId[] = ['privacy', 'terms', 'copyright'];

export default function LegalScreen() {
  const { doc } = useLocalSearchParams<{ doc: string }>();
  const id = VALID.includes(doc as LegalDocId) ? (doc as LegalDocId) : 'privacy';
  const d = legalDocs[id];
  return (
    <>
      <Stack.Screen options={{ title: d.title }} />
      <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: spacing.lg, paddingBottom: 60 }}>
        <Text style={styles.meta}>Last updated {PUBLISHER.lastUpdated}</Text>
        {d.sections.map((s) => (
          <Card key={s.heading} style={{ marginTop: spacing.md }}>
            <Text style={styles.h}>{s.heading}</Text>
            <Text style={styles.p}>{s.body}</Text>
          </Card>
        ))}
        <View style={{ marginTop: spacing.xl }}>
          <Text style={styles.meta}>{PUBLISHER.name} · {PUBLISHER.contactEmail}</Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  meta: { ...font.caption, color: colors.textFaint },
  h: { ...font.subtitle, color: colors.text, marginBottom: 6 },
  p: { ...font.body, color: colors.textMuted },
});
