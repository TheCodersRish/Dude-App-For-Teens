import { Stack } from 'expo-router';
import { Colors } from '@/constants/colors';

export default function ActivityLayout() {
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
        name="activity" 
        options={{ 
          title: "Activity",
        }} 
      />
    </Stack>
  );
}