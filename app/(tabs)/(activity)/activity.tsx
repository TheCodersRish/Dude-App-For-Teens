import React from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useAppStore } from '@/hooks/use-app-store';

export default function ActivityScreen() {
  const { hangouts, user } = useAppStore();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  // Mock activity data
  const activities = [
    {
      id: '1',
      type: 'request_pending',
      title: 'Parent approval needed',
      description: "Maya's Birthday Sleepover",
      time: '2 hours ago',
      icon: AlertCircle,
      color: Colors.pending,
    },
    {
      id: '2',
      type: 'approved',
      title: 'You joined',
      description: 'Movie Night 🍿',
      time: '1 day ago',
      icon: CheckCircle,
      color: Colors.success,
    },
    {
      id: '3',
      type: 'new_hangout',
      title: 'New hangout planned',
      description: 'Study Session 📚',
      time: '2 days ago',
      icon: Clock,
      color: Colors.primary,
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.headerTitle}>Recent Activity</Text>
          <Text style={styles.headerSubtitle}>Stay updated on your hangouts</Text>
        </Animated.View>

        {activities.length === 0 ? (
          <Animated.View 
            style={[
              styles.emptyState,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Clock size={48} color={Colors.gray.medium} />
            <Text style={styles.emptyTitle}>No activity yet</Text>
            <Text style={styles.emptyText}>
              Your hangout updates will appear here
            </Text>
          </Animated.View>
        ) : (
          <Animated.View 
            style={[
              styles.activityList,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {activities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <Animated.View
                  key={activity.id}
                  style={[
                    styles.activityItem,
                    {
                      opacity: fadeAnim,
                      transform: [
                        {
                          translateY: Animated.add(
                            slideAnim,
                            new Animated.Value(index * 8)
                          ),
                        },
                      ],
                    },
                  ]}
                >
                  <View style={[styles.iconContainer, { backgroundColor: `${activity.color}20` }]}>
                    <Icon size={20} color={activity.color} />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>{activity.title}</Text>
                    <Text style={styles.activityDescription}>{activity.description}</Text>
                    <Text style={styles.activityTime}>{activity.time}</Text>
                  </View>
                </Animated.View>
              );
            })}
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray.light,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray.light,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.black,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.gray.dark,
  },
  activityList: {
    paddingVertical: 16,
  },
  activityItem: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray.light,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 14,
    color: Colors.gray.darker,
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: Colors.gray.dark,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.gray.darker,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.gray.dark,
    textAlign: 'center',
  },
});