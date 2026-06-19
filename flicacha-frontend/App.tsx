import React, { useCallback, useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts as useSyneFonts,
  Syne_700Bold,
  Syne_800ExtraBold,
} from '@expo-google-fonts/syne';
import {
  useFonts as useDmSansFonts,
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import {
  useFonts as useMonoFonts,
  JetBrainsMono_400Regular,
} from '@expo-google-fonts/jetbrains-mono';

import { RootNavigator } from '@shared/navigation/RootNavigator';
import { ErrorBoundary } from '@shared/components/layout/ErrorBoundary';
import { theme } from '@shared/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [syneLoaded] = useSyneFonts({ Syne_700Bold, Syne_800ExtraBold });
  const [dmSansLoaded] = useDmSansFonts({ DMSans_400Regular, DMSans_500Medium, DMSans_700Bold });
  const [monoLoaded] = useMonoFonts({ JetBrainsMono_400Regular });

  const fontsReady = syneLoaded && dmSansLoaded && monoLoaded;

  const onLayoutRootView = useCallback(async () => {
    if (fontsReady) {
      await SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsReady]);

  useEffect(() => {
    if (fontsReady) onLayoutRootView();
  }, [fontsReady]);

  if (!fontsReady) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={theme.colors.primary} size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <StatusBar style="light" backgroundColor={theme.colors.background} />
        <RootNavigator />
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}
