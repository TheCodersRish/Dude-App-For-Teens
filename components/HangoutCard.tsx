import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { Calendar, MapPin, Users, Clock } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { Hangout } from '@/types';
import { router } from 'expo-router';

interface HangoutCardProps {
  hangout: Hangout;
  showHost?: boolean;
}

export function HangoutCard({ hangout, showHost = true }: HangoutCardProps) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const shadowAnim = React.useRef(new Animated.Value(0)).current;
  
  const typeEmoji = {
    hangout: '🎉',
    sleepover: '🏠',
    party: '🎊',
    study: '📚',
    movie: '🍿',
  };

  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shadowAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shadowAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const shadowOpacity = shadowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.1, 0.2],
  });

  const shadowRadius = shadowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [8, 12],
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const approvedCount = hangout.attendees.filter(a => a.status === 'approved').length;
  const pendingCount = hangout.attendees.filter(a => a.status === 'parent_pending').length;

  return (
    <Animated.View
      style={[
        styles.card,
        {
          transform: [{ scale: scaleAnim }],
          shadowOpacity,
          shadowRadius,
        },
      ]}
    >
      <TouchableOpacity 
        style={styles.cardContent}
        onPress={() => router.push(`/hangout/${hangout.id}`)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
      <View style={styles.header}>
        <Text style={styles.emoji}>{typeEmoji[hangout.type]}</Text>
        <View style={styles.headerText}>
          <Text style={styles.title}>{hangout.title}</Text>
          {showHost && (
            <View style={styles.hostContainer}>
              {hangout.host.avatar && (
                <Image source={{ uri: hangout.host.avatar }} style={styles.hostAvatar} />
              )}
              <Text style={styles.hostName}>by {hangout.host.name}</Text>
            </View>
          )}
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {hangout.description}
      </Text>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Calendar size={14} color={Colors.gray.dark} />
          <Text style={styles.detailText}>{formatDate(hangout.date)}</Text>
        </View>
        <View style={styles.detailItem}>
          <Clock size={14} color={Colors.gray.dark} />
          <Text style={styles.detailText}>{hangout.time}</Text>
        </View>
        <View style={styles.detailItem}>
          <MapPin size={14} color={Colors.gray.dark} />
          <Text style={styles.detailText}>{hangout.location}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.attendees}>
          <Users size={16} color={Colors.gray.dark} />
          <Text style={styles.attendeeText}>
            {approvedCount + 1} going
            {pendingCount > 0 && ` • ${pendingCount} pending`}
          </Text>
        </View>
        {hangout.maxAttendees && (
          <Text style={styles.maxAttendees}>
            Max {hangout.maxAttendees}
          </Text>
        )}
      </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  emoji: {
    fontSize: 32,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.black,
    marginBottom: 4,
  },
  hostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hostAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  hostName: {
    fontSize: 14,
    color: Colors.gray.dark,
  },
  description: {
    fontSize: 14,
    color: Colors.gray.darker,
    lineHeight: 20,
    marginBottom: 12,
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 13,
    color: Colors.gray.dark,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.gray.light,
  },
  attendees: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  attendeeText: {
    fontSize: 14,
    color: Colors.gray.darker,
    fontWeight: '500',
  },
  maxAttendees: {
    fontSize: 13,
    color: Colors.gray.dark,
    backgroundColor: Colors.gray.light,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
});