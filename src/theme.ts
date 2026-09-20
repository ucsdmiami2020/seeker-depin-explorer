export const colors = {
  bg: '#0B0B12',
  bgElevated: '#13131D',
  card: '#181826',
  cardBorder: '#26263A',
  text: '#F4F4FA',
  textMuted: '#9A9AB5',
  textFaint: '#66667F',
  solanaPurple: '#9945FF',
  solanaGreen: '#14F195',
  solanaBlue: '#19D4FF',
  warning: '#FFB84D',
  danger: '#FF5C7A',
  chip: '#1F1F30',
  chipActive: '#9945FF',
};

export const categoryColors: Record<string, [string, string]> = {
  phone: ['#9945FF', '#5A2BD9'],
  wearable: ['#14F195', '#0B9C63'],
  wireless: ['#19D4FF', '#0A7FA8'],
  mapping: ['#FFB84D', '#C77A12'],
  positioning: ['#FF6EC7', '#B0287F'],
  sensing: ['#7DF9FF', '#2A8FA8'],
  energy: ['#FFE066', '#D19A00'],
  gaming: ['#FF7A45', '#B23A0E'],
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };
export const radius = { sm: 8, md: 14, lg: 20, xl: 28 };

export const font = {
  display: { fontSize: 30, fontWeight: '800' as const, letterSpacing: -0.5 },
  title: { fontSize: 20, fontWeight: '700' as const },
  subtitle: { fontSize: 15, fontWeight: '600' as const },
  body: { fontSize: 14, fontWeight: '400' as const, lineHeight: 21 },
  caption: { fontSize: 12, fontWeight: '500' as const },
  mono: { fontFamily: 'monospace', fontSize: 13 },
};
