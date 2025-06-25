import { TabBarVisibilityProvider } from '@/contexts/TabBarVisibilityContext';
import { TransactionProvider } from '@/contexts/TransactionContext';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) return null;

  return (
    <TransactionProvider>
      <TabBarVisibilityProvider>
        <ThemeProvider value={DefaultTheme}>
          <Stack>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(setting)" options={{ headerShown: false }} />
            <Stack.Screen name="EditTransaction" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </TabBarVisibilityProvider>
    </TransactionProvider>
  );
}
