import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme';
import { HelpCenter, HelpFab } from '../../src/components/HelpCenter';
import { useHelp } from '../../src/state/HelpProvider';

export default function TabLayout() {
  const { startTourIfFirstRun } = useHelp();

  // Runs once per launch, after the welcome screen hands over to the tabs.
  useEffect(() => {
    startTourIfFirstRun();
  }, [startTourIfFirstRun]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { backgroundColor: colors.bgElevated, borderTopColor: colors.cardBorder, height: 64, paddingBottom: 10, paddingTop: 6 },
          tabBarActiveTintColor: colors.solanaGreen,
          tabBarInactiveTintColor: colors.textFaint,
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
          sceneStyle: { backgroundColor: colors.bg },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{ title: 'Explore', tabBarIcon: ({ color, size }) => <Ionicons name="compass" size={size} color={color} /> }}
        />
        <Tabs.Screen
          name="compare"
          options={{ title: 'Compare', tabBarIcon: ({ color, size }) => <Ionicons name="git-compare" size={size} color={color} /> }}
        />
        <Tabs.Screen
          name="networks"
          options={{ title: 'Networks', tabBarIcon: ({ color, size }) => <Ionicons name="planet" size={size} color={color} /> }}
        />
        <Tabs.Screen
          name="wallet"
          options={{ title: 'Wallet', tabBarIcon: ({ color, size }) => <Ionicons name="wallet" size={size} color={color} /> }}
        />
        <Tabs.Screen
          name="security"
          options={{ title: 'Security', tabBarIcon: ({ color, size }) => <Ionicons name="shield-checkmark" size={size} color={color} /> }}
        />
        <Tabs.Screen
          name="about"
          options={{ title: 'About', tabBarIcon: ({ color, size }) => <Ionicons name="information-circle" size={size} color={color} /> }}
        />
      </Tabs>
      <HelpFab />
      <HelpCenter />
    </View>
  );
}
