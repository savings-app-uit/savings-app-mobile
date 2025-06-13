import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Inter: require('../assets/fonts/SpaceMono-Regular.ttf'), // You can add more fonts here
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right', // Add smooth transition
        }}
      >
        {/* Auth screens */}
        <Stack.Screen 
          name="(auth)" 
          options={{ 
            headerShown: false,
            presentation: 'card'
          }} 
        />
        
        {/* Main app screens */}
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            headerShown: false,
            presentation: 'card'
          }} 
        />
        
        {/* 404 screen */}
        <Stack.Screen 
          name="+not-found" 
          options={{
            title: 'Oops!',
            presentation: 'modal'
          }}
        />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
