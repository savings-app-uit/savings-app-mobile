import { Stack } from 'expo-router';

export default function SettingLayout() {
  return (    
  <Stack
      screenOptions={{
        headerShown: false,
      }}>
        <Stack.Screen 
        name="profile" 
        options={{
          animation: 'slide_from_left'
        }}/>
    </Stack>
  );
}
