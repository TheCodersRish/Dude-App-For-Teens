import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, Animated } from 'react-native';
import { QrCode, LogOut, Settings, Shield, Edit2 } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useAppStore, useMyHangouts } from '@/hooks/use-app-store';
import QRCode from 'react-native-qrcode-svg';

export default function ProfileScreen() {
  const { user, logout } = useAppStore();
  const myHangouts = useMyHangouts();
  const [showQR, setShowQR] = useState(false);
  
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;
  const qrAnim = React.useRef(new Animated.Value(0)).current;
  const avatarScale = React.useRef(new Animated.Value(0.8)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(avatarScale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, avatarScale]);

  React.useEffect(() => {
    if (showQR) {
      Animated.spring(qrAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(qrAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [showQR, qrAnim]);

  if (!user) return null;

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/');
          }
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Animated.View
          style={{
            transform: [{ scale: avatarScale }],
          }}
        >
          <Image 
            source={{ uri: user.avatar || 'https://via.placeholder.com/150' }} 
            style={styles.avatar}
          />
        </Animated.View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.username}>@{user.username}</Text>
        {user.bio && <Text style={styles.bio}>{user.bio}</Text>}
      </Animated.View>

      <Animated.View 
        style={[
          styles.stats,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{myHangouts.length}</Text>
          <Text style={styles.statLabel}>Hangouts</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>4</Text>
          <Text style={styles.statLabel}>Friends</Text>
        </View>
      </Animated.View>

      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <TouchableOpacity 
          style={styles.qrButton}
          onPress={() => setShowQR(!showQR)}
          activeOpacity={0.8}
        >
          <QrCode size={20} color={Colors.white} />
          <Text style={styles.qrButtonText}>
            {showQR ? 'Hide' : 'Show'} My Friend Code
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {showQR && (
        <Animated.View 
          style={[
            styles.qrContainer,
            {
              opacity: qrAnim,
              transform: [
                { scale: qrAnim },
                { translateY: Animated.multiply(qrAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }), 1) },
              ],
            },
          ]}
        >
          <View style={styles.qrCode}>
            <QRCode
              value={user.qrCode}
              size={200}
              color={Colors.black}
              backgroundColor={Colors.white}
            />
          </View>
          <Text style={styles.qrText}>Let friends scan this to add you!</Text>
        </Animated.View>
      )}

      <Animated.View 
        style={[
          styles.menu,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {[
          { icon: Edit2, text: 'Edit Profile', color: Colors.gray.darker },
          { icon: Shield, text: 'Parent Controls', color: Colors.gray.darker },
          { icon: Settings, text: 'Settings', color: Colors.gray.darker },
          { icon: LogOut, text: 'Logout', color: Colors.error, onPress: handleLogout, isLast: true },
        ].map((item, index) => {
          const Icon = item.icon;
          return (
            <Animated.View
              key={item.text}
              style={{
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: Animated.add(
                      slideAnim,
                      new Animated.Value(index * 5)
                    ),
                  },
                ],
              }}
            >
              <TouchableOpacity 
                style={[styles.menuItem, item.isLast && styles.logoutItem]} 
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <Icon size={20} color={item.color} />
                <Text style={[styles.menuText, item.color === Colors.error && styles.logoutText]}>
                  {item.text}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray.light,
  },
  header: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    paddingVertical: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.black,
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: Colors.gray.dark,
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: Colors.gray.darker,
    paddingHorizontal: 40,
    textAlign: 'center',
    marginTop: 4,
  },
  stats: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.black,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.gray.dark,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.gray.light,
    marginHorizontal: 20,
  },
  qrButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 14,
    borderRadius: 12,
    gap: 8,
  },
  qrButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  qrContainer: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  qrCode: {
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  qrText: {
    marginTop: 16,
    fontSize: 14,
    color: Colors.gray.dark,
  },
  menu: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray.light,
    gap: 12,
  },
  menuText: {
    fontSize: 16,
    color: Colors.gray.darker,
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: Colors.error,
  },
});