import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { UserMinus } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { Friend } from '@/types';

interface FriendCardProps {
  friend: Friend;
  onRemove?: () => void;
}

export function FriendCard({ friend, onRemove }: FriendCardProps) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const removeScale = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.98,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handleRemovePress = () => {
    Animated.sequence([
      Animated.timing(removeScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(removeScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onRemove) onRemove();
    });
  };

  return (
    <Animated.View 
      style={[
        styles.card,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity 
        style={styles.content} 
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Image 
          source={{ uri: friend.user.avatar || 'https://via.placeholder.com/100' }} 
          style={styles.avatar} 
        />
        <View style={styles.info}>
          <Text style={styles.name}>{friend.user.name}</Text>
          <Text style={styles.username}>@{friend.user.username}</Text>
          {friend.user.bio && (
            <Text style={styles.bio} numberOfLines={1}>{friend.user.bio}</Text>
          )}
        </View>
      </TouchableOpacity>
      {onRemove && (
        <Animated.View
          style={{
            transform: [{ scale: removeScale }],
          }}
        >
          <TouchableOpacity onPress={handleRemovePress} style={styles.removeButton}>
            <UserMinus size={20} color={Colors.error} />
          </TouchableOpacity>
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 2,
  },
  username: {
    fontSize: 14,
    color: Colors.gray.dark,
    marginBottom: 2,
  },
  bio: {
    fontSize: 13,
    color: Colors.gray.dark,
    fontStyle: 'italic',
  },
  removeButton: {
    padding: 8,
  },
});