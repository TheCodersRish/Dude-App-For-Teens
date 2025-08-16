import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { Calendar, Clock, MapPin, Users } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { useAppStore } from '@/hooks/use-app-store';

export default function CreateHangoutScreen() {
  const { createHangout } = useAppStore();
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'hangout' | 'sleepover' | 'party' | 'study' | 'movie'>('hangout');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [maxAttendees, setMaxAttendees] = useState('');
  
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;
  const buttonScale = React.useRef(new Animated.Value(1)).current;
  const formProgress = React.useRef(new Animated.Value(0)).current;

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

  React.useEffect(() => {
    const progress = [title, location, date, time].filter(Boolean).length / 4;
    Animated.timing(formProgress, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [title, location, date, time, formProgress]);

  const types = [
    { value: 'hangout', label: 'Hangout', emoji: '🎉' },
    { value: 'sleepover', label: 'Sleepover', emoji: '🏠' },
    { value: 'party', label: 'Party', emoji: '🎊' },
    { value: 'study', label: 'Study', emoji: '📚' },
    { value: 'movie', label: 'Movie', emoji: '🍿' },
  ];

  const handleCreate = () => {
    if (!title || !location || !date || !time) {
      return;
    }

    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      createHangout({
        title,
        type,
        description,
        location,
        date,
        time,
        hostId: '', // This will be set in the store
        maxAttendees: maxAttendees ? parseInt(maxAttendees) : undefined,
      });

      router.back();
    });
  };

  const handleTypeSelect = (selectedType: string) => {
    const typeScale = new Animated.Value(1);
    Animated.sequence([
      Animated.timing(typeScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(typeScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    setType(selectedType as any);
  };

  const progressWidth = formProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <Animated.View 
                style={[
                  styles.progressFill,
                  { width: progressWidth },
                ]}
              />
            </View>
            <Text style={styles.progressText}>Complete the details</Text>
          </View>
        </Animated.View>
        
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <Text style={styles.sectionTitle}>What&apos;s the vibe?</Text>
        </Animated.View>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.typeSelector}
          >
            {types.map((t, index) => (
              <Animated.View
                key={t.value}
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
                  style={[
                    styles.typeButton,
                    type === t.value && styles.typeButtonActive
                  ]}
                  onPress={() => handleTypeSelect(t.value)}
                >
                  <Text style={styles.typeEmoji}>{t.emoji}</Text>
                  <Text style={[
                    styles.typeLabel,
                    type === t.value && styles.typeLabelActive
                  ]}>
                    {t.label}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>

        <Animated.View 
          style={[
            styles.form,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Give it a fun name!"
              placeholderTextColor={Colors.gray.dark}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="What's the plan?"
              placeholderTextColor={Colors.gray.dark}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <MapPin size={16} color={Colors.gray.darker} /> Location
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Where are we meeting?"
              placeholderTextColor={Colors.gray.dark}
              value={location}
              onChangeText={setLocation}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>
                <Calendar size={16} color={Colors.gray.darker} /> Date
              </Text>
              <TextInput
                style={styles.input}
                placeholder="MM/DD/YYYY"
                placeholderTextColor={Colors.gray.dark}
                value={date}
                onChangeText={setDate}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>
                <Clock size={16} color={Colors.gray.darker} /> Time
              </Text>
              <TextInput
                style={styles.input}
                placeholder="7:00 PM"
                placeholderTextColor={Colors.gray.dark}
                value={time}
                onChangeText={setTime}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Users size={16} color={Colors.gray.darker} /> Max Attendees (optional)
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Leave empty for unlimited"
              placeholderTextColor={Colors.gray.dark}
              value={maxAttendees}
              onChangeText={setMaxAttendees}
              keyboardType="number-pad"
            />
          </View>
        </Animated.View>

        <Animated.View 
          style={[
            styles.footer,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: buttonScale },
              ],
            },
          ]}
        >
          <Button
            title="Create Hangout"
            onPress={handleCreate}
            size="large"
            disabled={!title || !location || !date || !time}
          />
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray.light,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.gray.light,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: Colors.gray.dark,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.black,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 12,
  },
  typeSelector: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  typeButton: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.gray.light,
  },
  typeButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}10`,
  },
  typeEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  typeLabel: {
    fontSize: 14,
    color: Colors.gray.darker,
    fontWeight: '500',
  },
  typeLabelActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  form: {
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.gray.darker,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.gray.light,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  footer: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
});