import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─── Color Palette ────────────────────────────────────────────────────────────
export const palette = {
  // Brand
  flame: '#FF4500',
  flameDeep: '#D93800',
  flameSoft: '#FF6A33',
  flameGlow: 'rgba(255,69,0,0.15)',

  // Neutrals (dark theme)
  ink: '#0D0D0D',
  inkLight: '#161616',
  inkMid: '#1F1F1F',
  inkSurface: '#272727',
  inkBorder: '#333333',
  inkMuted: '#888888',
  inkSecondary: '#AAAAAA',
  snow: '#F5F5F5',
  white: '#FFFFFF',

  // Accent
  sapphire: '#2979FF',
  emerald: '#00C853',
  amber: '#FFB300',
  crimson: '#E53935',

  // Transparent
  overlay: 'rgba(0,0,0,0.55)',
  shimmer: 'rgba(255,255,255,0.06)',
} as const;

// ─── Theme ────────────────────────────────────────────────────────────────────
export const theme = {
  colors: {
    // Backgrounds
    background: palette.ink,
    surface: palette.inkLight,
    card: palette.inkMid,
    elevated: palette.inkSurface,
    border: palette.inkBorder,
    overlay: palette.overlay,

    // Brand
    primary: palette.flame,
    primaryDeep: palette.flameDeep,
    primarySoft: palette.flameSoft,
    primaryGlow: palette.flameGlow,

    // Text
    textPrimary: palette.snow,
    textSecondary: palette.inkSecondary,
    textMuted: palette.inkMuted,
    textInverse: palette.ink,

    // Status
    success: palette.emerald,
    warning: palette.amber,
    error: palette.crimson,
    info: palette.sapphire,

    // Like
    like: palette.crimson,
    likeActive: '#FF6B81',
  },

  typography: {
    // Font families (loaded via expo-font)
    fontDisplay: 'Syne_700Bold',
    fontDisplayExtra: 'Syne_800ExtraBold',
    fontBody: 'DMSans_400Regular',
    fontBodyMedium: 'DMSans_500Medium',
    fontBodyBold: 'DMSans_700Bold',
    fontMono: 'JetBrainsMono_400Regular',

    // Sizes
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    '2xl': 30,
    '3xl': 38,
    '4xl': 48,

    // Line heights
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.7,
  },

  spacing: {
    '0': 0,
    '1': 4,
    '2': 8,
    '3': 12,
    '4': 16,
    '5': 20,
    '6': 24,
    '8': 32,
    '10': 40,
    '12': 48,
    '16': 64,
  },

  radii: {
    sm: 6,
    md: 12,
    lg: 18,
    xl: 24,
    '2xl': 32,
    full: 9999,
  },

  shadows: {
    sm: {
      shadowColor: palette.ink,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 2,
    },
    md: {
      shadowColor: palette.flame,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
    glow: {
      shadowColor: palette.flame,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.35,
      shadowRadius: 12,
      elevation: 8,
    },
  },

  screen: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },

  tabBar: {
    height: 64,
  },
} as const;

export type Theme = typeof theme;
