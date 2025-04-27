import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import AuthProvider from "../components/AuthProvider";
import InitialNavigation from "../components/InitialNavigation";
import { useColorScheme } from '@/hooks/useColorScheme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
      setAppIsReady(true);
    }
  }, [fontsLoaded]);

  if (!appIsReady) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <InitialNavigation />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}