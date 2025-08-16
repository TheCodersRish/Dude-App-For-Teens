import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { Logo } from '@/components/Logo';
import { useAppStore } from '@/hooks/use-app-store';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const { login } = useAppStore();

  const handleLogin = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Please enter a username');
      return;
    }

    try {
      await login(username.trim());
      router.replace('/(tabs)/(home)');
    } catch (error) {
      Alert.alert('Error', 'Failed to login');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Logo size="large" />
        
        <Text style={styles.title}>Welcome to DUDE</Text>
        <Text style={styles.subtitle}>
          Connect with friends and plan amazing hangouts
        </Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Enter your username"
            placeholderTextColor={Colors.gray.dark}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />
          
          <Button
            title="Get Started"
            onPress={handleLogin}
            size="large"
            disabled={!username.trim()}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray.light,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.black,
    marginTop: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray.darker,
    textAlign: 'center',
    marginBottom: 48,
  },
  form: {
    width: '100%',
    gap: 20,
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.gray.light,
  },
});