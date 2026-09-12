import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, font, radius, spacing } from '../../src/theme';
import { Card, Chip, SectionTitle, tap } from '../../src/components/ui';
import { useWallet } from '../../src/state/WalletProvider';
import { formatAmount, shortAddress, type Cluster } from '../../src/lib/solana';
import { UNTRACKED_NETWORK_IDS } from '../../src/data/tokens';
import { networks } from '../../src/data/networks';
import { devices } from '../../src/data/devices';

const CLUSTERS: { id: Cluster; label: string }[] = [
  { id: 'mainnet-beta', label: 'Mainnet' },
  { id: 'devnet', label: 'Devnet' },
];

function networkName(id: string) {
  return networks.find((n) => n.id === id)?.name ?? id;
}

export default function Wallet() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    available,
    cluster,
    account,
    sol,
    holdings,
    busy,
    error,
    proof,
    connect,
    disconnect,
    refresh,
    signOwnershipProof,
    selectCluster,
  } = useWallet();

  const depin = holdings.filter((h) => h.token);
  const other = holdings.filter((h) => !h.token);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingHorizontal: spacing.lg, paddingBottom: 100 }}
    >
      <Text style={styles.title}>Wallet</Text>
      <Text style={styles.sub}>Connect to see which DePIN networks you already hold.</Text>

      {!available ? (
        <Card style={{ marginTop: spacing.lg }}>
          <View style={styles.row}>
            <Ionicons name="phone-portrait-outline" size={18} color={colors.warning} />
            <Text style={styles.rowText}>Android only</Text>
          </View>
          <Text style={styles.body}>
            Mobile Wallet Adapter connects this app to a wallet app on the same device, so it needs the Android build.
            Install the APK on a Seeker or any Android phone with Phantom, Solflare or Backpack.
          </Text>
        </Card>
      ) : null}

      <View style={styles.clusterRow}>
        {CLUSTERS.map((c) => (
          <Chip key={c.id} label={c.label} active={cluster === c.id} onPress={() => selectCluster(c.id)} />
        ))}
      </View>

      {account ? (
        <Card style={{ marginTop: spacing.md }}>
          <View style={styles.accountRow}>
            <View style={styles.avatar}>
              <Ionicons name="wallet" size={20} color={colors.bg} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.address}>{shortAddress(account.address, 6, 6)}</Text>
              <Text style={styles.caption}>{account.label ?? 'Connected wallet'}</Text>
            </View>
            <Pressable
              onPress={() => {
                tap();
                refresh();
              }}
              hitSlop={8}
              accessibilityLabel="Refresh balances"
            >
              <Ionicons name="refresh" size={20} color={colors.textMuted} />
            </Pressable>
          </View>
          <View style={styles.balanceRow}>
            <Text style={styles.balance}>{sol === null ? '—' : formatAmount(sol)}</Text>
            <Text style={styles.balanceUnit}>SOL</Text>
            {busy ? <ActivityIndicator size="small" color={colors.solanaGreen} style={{ marginLeft: spacing.sm }} /> : null}
          </View>
        </Card>
      ) : (
        <Pressable
          accessibilityRole="button"
          disabled={busy || !available}
          onPress={() => {
            tap();
            connect();
          }}
          style={({ pressed }) => [styles.cta, (pressed || busy || !available) && { opacity: 0.7 }]}
        >
          {busy ? (
            <ActivityIndicator size="small" color={colors.bg} />
          ) : (
            <Ionicons name="wallet-outline" size={20} color={colors.bg} />
          )}
          <Text style={styles.ctaText}>{busy ? 'Connecting…' : 'Connect wallet'}</Text>
        </Pressable>
      )}

      {error ? (
        <Card style={{ marginTop: spacing.md, borderColor: colors.danger }}>
          <Text style={styles.error}>{error}</Text>
        </Card>
      ) : null}

      {account ? (
        <>
          <SectionTitle>Your DePIN holdings</SectionTitle>
          <Card>
            {depin.length === 0 ? (
              <Text style={styles.body}>
                No tracked DePIN tokens on {cluster === 'devnet' ? 'devnet' : 'mainnet'} for this address. Balances come
                straight from the chain, so they update as soon as rewards land.
              </Text>
            ) : (
              depin.map((h, i) => {
                const token = h.token!;
                const related = devices.filter((d) => d.network === token.networkId);
                return (
                  <Pressable
                    key={h.mint}
                    onPress={() => {
                      const first = related[0];
                      if (!first) return;
                      tap();
                      router.push(`/device/${first.id}`);
                    }}
                    style={[styles.holding, i === depin.length - 1 && { borderBottomWidth: 0 }]}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.holdingSymbol}>${token.symbol}</Text>
                      <Text style={styles.caption}>
                        {networkName(token.networkId)} · {related.length} device{related.length === 1 ? '' : 's'}
                      </Text>
                    </View>
                    <Text style={styles.holdingAmount}>{formatAmount(h.amount)}</Text>
                  </Pressable>
                );
              })
            )}
          </Card>

          {other.length > 0 ? (
            <>
              <SectionTitle>Other tokens</SectionTitle>
              <Card>
                <Text style={styles.body}>
                  {other.length} other SPL token{other.length === 1 ? '' : 's'} in this wallet. Only mints verified
                  against the networks in this catalog are named here.
                </Text>
              </Card>
            </>
          ) : null}

          <SectionTitle>Prove you run a node</SectionTitle>
          <Card>
            <Text style={styles.body}>
              Sign a short statement with your wallet to prove you control this address. It is an off-chain message —
              no transaction, no fee, and nothing leaves your device except the signature you choose to share.
            </Text>
            <Pressable
              disabled={busy}
              onPress={() => {
                tap();
                signOwnershipProof();
              }}
              style={({ pressed }) => [styles.secondary, pressed && { opacity: 0.7 }]}
            >
              <Ionicons name="create-outline" size={18} color={colors.solanaGreen} />
              <Text style={styles.secondaryText}>Sign ownership proof</Text>
            </Pressable>
            {proof ? (
              <View style={styles.proof}>
                <Text style={styles.caption}>Signature</Text>
                <Text style={styles.mono}>{proof.signature.slice(0, 44)}…</Text>
              </View>
            ) : null}
          </Card>

          <Pressable
            onPress={() => {
              tap();
              disconnect();
            }}
            style={styles.disconnect}
          >
            <Ionicons name="log-out-outline" size={18} color={colors.danger} />
            <Text style={styles.disconnectText}>Disconnect</Text>
          </Pressable>
        </>
      ) : null}

      <SectionTitle>Not tracked yet</SectionTitle>
      <Card>
        <Text style={styles.body}>
          {UNTRACKED_NETWORK_IDS.map(networkName).join(', ')} have no verified SPL mint we could match with confidence,
          so their balances are not shown. They are listed here rather than shown as a zero balance.
        </Text>
      </Card>

      <Text style={styles.foot}>
        The app never sees your seed phrase or private keys — signing happens inside your wallet app. Balances are
        public on-chain data, read over HTTPS.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { ...font.display, color: colors.text },
  sub: { ...font.body, color: colors.textMuted, marginTop: 6 },
  body: { ...font.body, color: colors.textMuted },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  rowText: { ...font.subtitle, color: colors.text },
  clusterRow: { flexDirection: 'row', marginTop: spacing.lg },
  accountRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.solanaGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  address: { ...font.subtitle, color: colors.text },
  caption: { ...font.caption, color: colors.textFaint },
  balanceRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: spacing.lg },
  balance: { ...font.display, color: colors.text },
  balanceUnit: { ...font.subtitle, color: colors.textMuted, marginLeft: 6 },
  cta: {
    minHeight: 52,
    marginTop: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.solanaGreen,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  ctaText: { color: colors.bg, fontSize: 15, fontWeight: '800' },
  error: { ...font.body, color: colors.danger },
  holding: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.cardBorder,
  },
  holdingSymbol: { ...font.subtitle, color: colors.text },
  holdingAmount: { ...font.title, color: colors.solanaGreen, fontSize: 17 },
  secondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
    paddingVertical: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.solanaGreen,
  },
  secondaryText: { color: colors.solanaGreen, fontWeight: '700', fontSize: 14 },
  proof: { marginTop: spacing.md },
  mono: { ...font.mono, color: colors.textMuted, marginTop: 2 },
  disconnect: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: spacing.xl },
  disconnectText: { color: colors.danger, fontWeight: '700', fontSize: 14 },
  foot: { ...font.caption, color: colors.textFaint, marginTop: spacing.xxl, lineHeight: 18 },
});
