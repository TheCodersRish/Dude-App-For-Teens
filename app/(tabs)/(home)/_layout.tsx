import { Stack } from 'expo-router';
import { Colors } from '@/constants/colors';

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.white,
        },
        headerTintColor: Colors.black,
        headerTitleStyle: {
          fontWeight: '700',
        },
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          title: "DUDE",
          headerTitleStyle: {
            fontWeight: '900',
            fontSize: 24,
            letterSpacing: 1,
          },
        }} 
      />
    </Stack>
  );
}