import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Glasses } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showIcon?: boolean;
}

export function Logo({ size = 'medium', showIcon = true }: LogoProps) {
  const sizes = {
    small: { text: 20, icon: 16 },
    medium: { text: 32, icon: 24 },
    large: { text: 48, icon: 36 },
  };

  return (
    <View style={styles.container}>
      {showIcon && (
        <Glasses 
          size={sizes[size].icon} 
          color={Colors.black} 
          strokeWidth={3}
        />
      )}
      <Text style={[styles.text, { fontSize: sizes[size].text }]}>
        DUDE
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    fontWeight: '900',
    color: Colors.black,
    letterSpacing: 1,
  },
});