import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAppStore } from '@/hooks/use-app-store';

export default function IndexScreen() {
  const { user, isLoading } = useAppStore();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace('/(tabs)/(home)');
      } else {
        router.replace('/(auth)/login');
      }
    }
  }, [user, isLoading]);

  return null;
}