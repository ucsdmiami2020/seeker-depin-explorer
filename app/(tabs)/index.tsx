import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { devices, categoryMeta } from '../../src/data/devices';
import { Category } from '../../src/data/types';
import { colors, font, radius, spacing } from '../../src/theme';
import { Chip, tap } from '../../src/components/ui';
import { DeviceCard } from '../../src/components/DeviceCard';
import { useAppState } from '../../src/state/AppState';

type Sort = 'featured' | 'newest' | 'price';
const categories = Object.keys(categoryMeta) as Category[];

function priceValue(p: string) {
  const m = p.replace(/,/g, '').match(/\$(\d+)/);
  return m ? Number(m[1]) : Number.POSITIVE_INFINITY;
}

export default function Explore() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { favorites, compare } = useAppState();
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<Category | 'all'>('all');
  const [sort, setSort] = useState<Sort>('featured');
  const [onlyFav, setOnlyFav] = useState(false);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = devices.filter((d) => {
      if (cat !== 'all' && d.category !== cat) return false;
      if (onlyFav && !favorites.includes(d.id)) return false;
      if (!q) return true;
      const hay = [d.name, d.maker, d.tagline, d.token?.symbol ?? '', d.network, ...d.highlights].join(' ').toLowerCase();
      return hay.includes(q);
    });
    if (sort === 'newest') out = [...out].sort((a, b) => b.releaseYear - a.releaseYear);
    if (sort === 'price') out = [...out].sort((a, b) => priceValue(a.price) - priceValue(b.price));
    return out;
  }, [query, cat, sort, onlyFav, favorites]);

  const header = (
    <View>
      <LinearGradient
        colors={['#9945FF', '#14F195']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.heroInner}>
          <Text style={styles.heroEyebrow}>SOLANA DEPIN HARDWARE</Text>
          <Text style={styles.heroTitle}>Explore the physical side of Solana</Text>
          <Text style={styles.heroSub}>
            Phones, rings, hotspots and dashcams that earn on-chain. {devices.length} devices across{' '}
            {categories.length} categories.
          </Text>
          <View style={styles.statRow}>
            <Stat label="Devices" value={String(devices.length)} />
            <Stat label="Networks" value={String(new Set(devices.map((d) => d.network)).size)} />
            <Stat label="Seeker-ready" value={String(devices.filter((d) => d.seekerReady).length)} />
          </View>
        </View>
      </LinearGradient>

      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <TextInput
          placeholder="Search devices, tokens, makers…"
          placeholderTextColor={colors.textFaint}
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
          returnKeyType="search"
        />
        {query ? (
          <Pressable onPress={() => setQuery('')} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        <Chip label="All" active={cat === 'all'} onPress={() => setCat('all')} icon="view-grid" />
        {categories.map((c) => (
          <Chip key={c} label={categoryMeta[c].label} icon={categoryMeta[c].icon} active={cat === c} onPress={() => setCat(c)} />
        ))}
      </ScrollView>

      <View style={styles.sortRow}>
        <View style={{ flexDirection: 'row' }}>
          {(['featured', 'newest', 'price'] as Sort[]).map((s) => (
            <Pressable
              key={s}
              onPress={() => {
                tap();
                setSort(s);
              }}
              style={[styles.sortBtn, sort === s && styles.sortBtnActive]}
            >
              <Text style={[styles.sortText, sort === s && { color: colors.text }]}>
                {s === 'featured' ? 'Featured' : s === 'newest' ? 'Newest' : 'Price'}
              </Text>
            </Pressable>
          ))}
        </View>
        <Pressable
          onPress={() => {
            tap();
            setOnlyFav((v) => !v);
          }}
          style={styles.favToggle}
        >
          <Ionicons name={onlyFav ? 'heart' : 'heart-outline'} size={16} color={onlyFav ? colors.danger : colors.textMuted} />
          <Text style={[styles.sortText, { marginLeft: 4 }, onlyFav && { color: colors.text }]}>{favorites.length}</Text>
        </Pressable>
      </View>

      {cat !== 'all' ? (
        <View style={styles.catBlurb}>
          <MaterialCommunityIcons name={categoryMeta[cat].icon as any} size={18} color={colors.solanaGreen} />
          <Text style={styles.catBlurbText}>{categoryMeta[cat].blurb}</Text>
        </View>
      ) : null}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <FlatList
        data={list}
        keyExtractor={(d) => d.id}
        renderItem={({ item }) => <DeviceCard device={item} />}
        ListHeaderComponent={header}
        contentContainerStyle={{ paddingTop: insets.top + 8, paddingHorizontal: spacing.lg, paddingBottom: 120 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="hardware-chip-outline" size={36} color={colors.textFaint} />
            <Text style={styles.emptyText}>No devices match. Try another category or clear the search.</Text>
          </View>
        }
        keyboardShouldPersistTaps="handled"
      />

      {compare.length > 0 ? (
        <Pressable
          onPress={() => {
            tap();
            router.push('/compare');
          }}
          style={[styles.compareBar, { bottom: 16 }]}
        >
          <Ionicons name="git-compare" size={18} color="#0B0B12" />
          <Text style={styles.compareText}>
            Compare {compare.length} device{compare.length > 1 ? 's' : ''}
          </Text>
          <Ionicons name="arrow-forward" size={18} color="#0B0B12" />
        </Pressable>
      ) : null}
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { borderRadius: radius.xl, padding: 2, marginBottom: spacing.lg },
  heroInner: { backgroundColor: '#0E0E18EE', borderRadius: radius.xl - 2, padding: spacing.xl },
  heroEyebrow: { ...font.caption, color: colors.solanaGreen, letterSpacing: 1.5, fontSize: 11 },
  heroTitle: { ...font.display, color: colors.text, marginTop: 8 },
  heroSub: { ...font.body, color: colors.textMuted, marginTop: 8 },
  statRow: { flexDirection: 'row', marginTop: spacing.lg, gap: 10 },
  stat: { flex: 1, backgroundColor: '#FFFFFF0D', borderRadius: radius.md, padding: 10 },
  statValue: { ...font.title, color: colors.text },
  statLabel: { ...font.caption, color: colors.textMuted, marginTop: 2 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgElevated,
    borderColor: colors.cardBorder,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    height: 46,
    marginBottom: spacing.md,
  },
  searchInput: { flex: 1, color: colors.text, marginLeft: 8, fontSize: 15 },
  chips: { paddingBottom: spacing.md },
  sortRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  sortBtn: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8 },
  sortBtnActive: { backgroundColor: colors.bgElevated },
  sortText: { ...font.caption, color: colors.textMuted, fontSize: 13 },
  favToggle: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6 },
  catBlurb: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  catBlurbText: { ...font.body, color: colors.textMuted, marginLeft: 8 },
  empty: { alignItems: 'center', paddingVertical: 48 },
  emptyText: { ...font.body, color: colors.textMuted, marginTop: 12, textAlign: 'center' },
  compareBar: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.solanaGreen,
    borderRadius: 999,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#14F195',
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  compareText: { fontWeight: '800', color: '#0B0B12', fontSize: 15 },
});
