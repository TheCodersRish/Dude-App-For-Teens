import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Calendar, Clock, MapPin, Users, Send, AlertCircle } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { useAppStore, useHangoutComments } from '@/hooks/use-app-store';

export default function HangoutDetailScreen() {
  const { id } = useLocalSearchParams();
  const { hangouts, user, joinHangout, leaveHangout, addComment, requestParentApproval } = useAppStore();
  const comments = useHangoutComments(id as string);
  const [commentText, setCommentText] = useState('');

  const hangout = hangouts.find(h => h.id === id);

  if (!hangout || !user) {
    return (
      <View style={styles.container}>
        <Text>Hangout not found</Text>
      </View>
    );
  }

  const userAttendee = hangout.attendees.find(a => a.userId === user.id);
  const isHost = hangout.hostId === user.id;
  const isAttending = !!userAttendee;

  const handleJoin = () => {
    joinHangout(hangout.id);
  };

  const handleLeave = () => {
    leaveHangout(hangout.id);
  };

  const handleRequestParent = () => {
    requestParentApproval(hangout.id);
  };

  const handleSendComment = () => {
    if (commentText.trim()) {
      addComment(hangout.id, commentText);
      setCommentText('');
    }
  };

  const typeEmoji = {
    hangout: '🎉',
    sleepover: '🏠',
    party: '🎊',
    study: '📚',
    movie: '🍿',
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.emoji}>{typeEmoji[hangout.type]}</Text>
          <Text style={styles.title}>{hangout.title}</Text>
          <View style={styles.hostInfo}>
            {hangout.host.avatar && (
              <Image source={{ uri: hangout.host.avatar }} style={styles.hostAvatar} />
            )}
            <Text style={styles.hostName}>Hosted by {hangout.host.name}</Text>
          </View>
        </View>

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Calendar size={20} color={Colors.gray.darker} />
            <Text style={styles.detailText}>{hangout.date}</Text>
          </View>
          <View style={styles.detailRow}>
            <Clock size={20} color={Colors.gray.darker} />
            <Text style={styles.detailText}>
              {hangout.time} {hangout.endTime && `- ${hangout.endTime}`}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <MapPin size={20} color={Colors.gray.darker} />
            <Text style={styles.detailText}>{hangout.location}</Text>
          </View>
          <View style={styles.detailRow}>
            <Users size={20} color={Colors.gray.darker} />
            <Text style={styles.detailText}>
              {hangout.attendees.filter(a => a.status === 'approved').length + 1} going
              {hangout.maxAttendees && ` (max ${hangout.maxAttendees})`}
            </Text>
          </View>
        </View>

        {hangout.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{hangout.description}</Text>
          </View>
        )}

        {userAttendee?.status === 'parent_pending' && (
          <View style={styles.warningBox}>
            <AlertCircle size={20} color={Colors.pending} />
            <Text style={styles.warningText}>Waiting for parent approval</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Who's Coming</Text>
          <View style={styles.attendeesList}>
            <View style={styles.attendeeItem}>
              {hangout.host.avatar && (
                <Image source={{ uri: hangout.host.avatar }} style={styles.attendeeAvatar} />
              )}
              <Text style={styles.attendeeName}>{hangout.host.name} (Host)</Text>
            </View>
            {hangout.attendees.map(attendee => (
              <View key={attendee.id} style={styles.attendeeItem}>
                {attendee.user.avatar && (
                  <Image source={{ uri: attendee.user.avatar }} style={styles.attendeeAvatar} />
                )}
                <Text style={styles.attendeeName}>{attendee.user.name}</Text>
                {attendee.status === 'parent_pending' && (
                  <Text style={styles.pendingBadge}>Pending</Text>
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Comments</Text>
          {comments.length === 0 ? (
            <Text style={styles.noComments}>No comments yet</Text>
          ) : (
            comments.map(comment => (
              <View key={comment.id} style={styles.commentItem}>
                {comment.user.avatar && (
                  <Image source={{ uri: comment.user.avatar }} style={styles.commentAvatar} />
                )}
                <View style={styles.commentContent}>
                  <Text style={styles.commentName}>{comment.user.name}</Text>
                  <Text style={styles.commentText}>{comment.text}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {isHost ? (
          <Text style={styles.hostBadge}>You're hosting this hangout</Text>
        ) : isAttending ? (
          userAttendee?.status === 'parent_pending' ? (
            <Button
              title="Request Parent Approval Again"
              onPress={handleRequestParent}
              variant="outline"
            />
          ) : (
            <Button
              title="Leave Hangout"
              onPress={handleLeave}
              variant="danger"
            />
          )
        ) : (
          <Button
            title="Join Hangout"
            onPress={handleJoin}
          />
        )}

        <View style={styles.commentInput}>
          <TextInput
            style={styles.commentTextInput}
            placeholder="Add a comment..."
            placeholderTextColor={Colors.gray.dark}
            value={commentText}
            onChangeText={setCommentText}
          />
          <TouchableOpacity onPress={handleSendComment} disabled={!commentText.trim()}>
            <Send size={24} color={commentText.trim() ? Colors.primary : Colors.gray.medium} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray.light,
  },
  scrollContent: {
    paddingBottom: 140,
  },
  header: {
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.black,
    marginBottom: 12,
    textAlign: 'center',
  },
  hostInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  hostAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  hostName: {
    fontSize: 14,
    color: Colors.gray.dark,
  },
  details: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  detailText: {
    fontSize: 15,
    color: Colors.gray.darker,
  },
  section: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: Colors.gray.darker,
    lineHeight: 22,
  },
  warningBox: {
    backgroundColor: `${Colors.pending}20`,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  warningText: {
    fontSize: 14,
    color: Colors.pending,
    fontWeight: '500',
  },
  attendeesList: {
    gap: 12,
  },
  attendeeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  attendeeAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  attendeeName: {
    fontSize: 15,
    color: Colors.gray.darker,
    flex: 1,
  },
  pendingBadge: {
    fontSize: 12,
    color: Colors.pending,
    backgroundColor: `${Colors.pending}20`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  noComments: {
    fontSize: 14,
    color: Colors.gray.dark,
    fontStyle: 'italic',
  },
  commentItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  commentContent: {
    flex: 1,
  },
  commentName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 2,
  },
  commentText: {
    fontSize: 14,
    color: Colors.gray.darker,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.gray.light,
  },
  hostBadge: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  commentInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray.light,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 12,
  },
  commentTextInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.black,
    paddingVertical: 4,
  },
});