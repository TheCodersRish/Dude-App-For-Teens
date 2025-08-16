import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useMemo } from 'react';
import { User, Friend, Hangout, Comment, ParentRequest } from '@/types';
import { currentUser, mockUsers, mockFriends, mockHangouts, mockComments } from '@/mocks/data';

interface AppState {
  user: User | null;
  friends: Friend[];
  hangouts: Hangout[];
  comments: Record<string, Comment[]>;
  parentRequests: ParentRequest[];
  isLoading: boolean;
  
  // Actions
  login: (username: string) => Promise<void>;
  logout: () => Promise<void>;
  addFriend: (qrCode: string) => void;
  removeFriend: (friendId: string) => void;
  createHangout: (hangout: Omit<Hangout, 'id' | 'host' | 'attendees' | 'status' | 'createdAt'>) => void;
  joinHangout: (hangoutId: string) => void;
  leaveHangout: (hangoutId: string) => void;
  updateAttendeeStatus: (hangoutId: string, userId: string, status: string) => void;
  addComment: (hangoutId: string, text: string) => void;
  requestParentApproval: (hangoutId: string) => void;
}

export const [AppProvider, useAppStore] = createContextHook<AppState>(() => {
  const [user, setUser] = useState<User | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [hangouts, setHangouts] = useState<Hangout[]>([]);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [parentRequests, setParentRequests] = useState<ParentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load persisted data
  useEffect(() => {
    loadPersistedData();
  }, []);

  const loadPersistedData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        // Load mock data for demo
        setFriends(mockFriends);
        setHangouts(mockHangouts);
        
        // Group comments by hangout
        const groupedComments: Record<string, Comment[]> = {};
        mockComments.forEach(comment => {
          if (!groupedComments[comment.hangoutId]) {
            groupedComments[comment.hangoutId] = [];
          }
          groupedComments[comment.hangoutId].push(comment);
        });
        setComments(groupedComments);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string) => {
    // Simulate login - in real app would authenticate
    const loggedInUser = currentUser;
    setUser(loggedInUser);
    await AsyncStorage.setItem('user', JSON.stringify(loggedInUser));
    
    // Load user's data
    setFriends(mockFriends);
    setHangouts(mockHangouts);
    
    const groupedComments: Record<string, Comment[]> = {};
    mockComments.forEach(comment => {
      if (!groupedComments[comment.hangoutId]) {
        groupedComments[comment.hangoutId] = [];
      }
      groupedComments[comment.hangoutId].push(comment);
    });
    setComments(groupedComments);
  };

  const logout = async () => {
    setUser(null);
    setFriends([]);
    setHangouts([]);
    setComments({});
    setParentRequests([]);
    await AsyncStorage.removeItem('user');
  };

  const addFriend = (qrCode: string) => {
    // Parse QR code format: DUDE:username:id
    const parts = qrCode.split(':');
    if (parts[0] !== 'DUDE' || parts.length !== 3) {
      console.error('Invalid QR code');
      return;
    }

    const friendUser = mockUsers.find(u => u.username === parts[1]);
    if (!friendUser || !user) return;

    // Check if already friends
    if (friends.some(f => f.friendId === friendUser.id)) {
      console.log('Already friends');
      return;
    }

    const newFriend: Friend = {
      id: `f${Date.now()}`,
      userId: user.id,
      friendId: friendUser.id,
      user: friendUser,
      addedAt: new Date(),
    };

    setFriends([...friends, newFriend]);
  };

  const removeFriend = (friendId: string) => {
    setFriends(friends.filter(f => f.id !== friendId));
  };

  const createHangout = (hangoutData: Omit<Hangout, 'id' | 'host' | 'attendees' | 'status' | 'createdAt'>) => {
    if (!user) return;

    const newHangout: Hangout = {
      ...hangoutData,
      id: `h${Date.now()}`,
      host: user,
      hostId: user.id,
      attendees: [],
      status: 'upcoming',
      createdAt: new Date(),
    };

    setHangouts([newHangout, ...hangouts]);
  };

  const joinHangout = (hangoutId: string) => {
    if (!user) return;

    setHangouts(hangouts.map(h => {
      if (h.id === hangoutId) {
        const isAlreadyAttending = h.attendees.some(a => a.userId === user.id);
        if (!isAlreadyAttending) {
          return {
            ...h,
            attendees: [...h.attendees, {
              id: `a${Date.now()}`,
              userId: user.id,
              user: user,
              status: 'pending',
              parentApproved: false,
              joinedAt: new Date(),
            }],
          };
        }
      }
      return h;
    }));
  };

  const leaveHangout = (hangoutId: string) => {
    if (!user) return;

    setHangouts(hangouts.map(h => {
      if (h.id === hangoutId) {
        return {
          ...h,
          attendees: h.attendees.filter(a => a.userId !== user.id),
        };
      }
      return h;
    }));
  };

  const updateAttendeeStatus = (hangoutId: string, userId: string, status: string) => {
    setHangouts(hangouts.map(h => {
      if (h.id === hangoutId) {
        return {
          ...h,
          attendees: h.attendees.map(a => {
            if (a.userId === userId) {
              return { ...a, status: status as any };
            }
            return a;
          }),
        };
      }
      return h;
    }));
  };

  const addComment = (hangoutId: string, text: string) => {
    if (!user) return;

    const newComment: Comment = {
      id: `c${Date.now()}`,
      hangoutId,
      userId: user.id,
      user: user,
      text,
      createdAt: new Date(),
    };

    setComments({
      ...comments,
      [hangoutId]: [...(comments[hangoutId] || []), newComment],
    });
  };

  const requestParentApproval = (hangoutId: string) => {
    if (!user) return;

    const hangout = hangouts.find(h => h.id === hangoutId);
    if (!hangout) return;

    // Simulate parent request
    const request: ParentRequest = {
      id: `pr${Date.now()}`,
      hangoutId,
      hangout,
      childId: user.id,
      child: user,
      parentId: 'parent1', // Mock parent ID
      status: 'pending',
      createdAt: new Date(),
    };

    setParentRequests([...parentRequests, request]);

    // Update attendee status
    updateAttendeeStatus(hangoutId, user.id, 'parent_pending');
  };

  return {
    user,
    friends,
    hangouts,
    comments,
    parentRequests,
    isLoading,
    login,
    logout,
    addFriend,
    removeFriend,
    createHangout,
    joinHangout,
    leaveHangout,
    updateAttendeeStatus,
    addComment,
    requestParentApproval,
  };
});

// Helper hooks
export function useUpcomingHangouts() {
  const { hangouts } = useAppStore();
  return useMemo(() => 
    hangouts.filter(h => h.status === 'upcoming')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [hangouts]
  );
}

export function useMyHangouts() {
  const { hangouts, user } = useAppStore();
  return useMemo(() => {
    if (!user) return [];
    return hangouts.filter(h => 
      h.hostId === user.id || h.attendees.some(a => a.userId === user.id)
    );
  }, [hangouts, user]);
}

export function useHangoutComments(hangoutId: string) {
  const { comments } = useAppStore();
  return comments[hangoutId] || [];
}