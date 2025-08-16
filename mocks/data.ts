import { User, Friend, Hangout, Comment } from '@/types';

export const currentUser: User = {
  id: '1',
  name: 'Alex Chen',
  username: 'alexc',
  avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=400',
  qrCode: 'DUDE:alexc:1234567890',
  bio: 'Skater • Gamer • Pizza lover 🍕',
};

export const mockUsers: User[] = [
  currentUser,
  {
    id: '2',
    name: 'Jordan Smith',
    username: 'jsmith',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    qrCode: 'DUDE:jsmith:0987654321',
    bio: 'Basketball 🏀 Music 🎵',
  },
  {
    id: '3',
    name: 'Maya Patel',
    username: 'mayap',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    qrCode: 'DUDE:mayap:1122334455',
    bio: 'Artist 🎨 Bookworm 📚',
  },
  {
    id: '4',
    name: 'Tyler Johnson',
    username: 'tylerj',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    qrCode: 'DUDE:tylerj:5544332211',
    bio: 'Soccer ⚽ Video games 🎮',
  },
  {
    id: '5',
    name: 'Emma Wilson',
    username: 'emmaw',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    qrCode: 'DUDE:emmaw:6677889900',
    bio: 'Dance 💃 Photography 📸',
  },
];

export const mockFriends: Friend[] = [
  {
    id: 'f1',
    userId: '1',
    friendId: '2',
    user: mockUsers[1],
    addedAt: new Date('2024-01-15'),
  },
  {
    id: 'f2',
    userId: '1',
    friendId: '3',
    user: mockUsers[2],
    addedAt: new Date('2024-01-20'),
  },
  {
    id: 'f3',
    userId: '1',
    friendId: '4',
    user: mockUsers[3],
    addedAt: new Date('2024-02-01'),
  },
  {
    id: 'f4',
    userId: '1',
    friendId: '5',
    user: mockUsers[4],
    addedAt: new Date('2024-02-10'),
  },
];

export const mockHangouts: Hangout[] = [
  {
    id: 'h1',
    title: 'Movie Night 🍿',
    type: 'movie',
    description: 'Marvel marathon at my place! Bringing snacks and drinks.',
    location: "Jordan's House",
    date: '2025-01-20',
    time: '7:00 PM',
    endTime: '11:00 PM',
    hostId: '2',
    host: mockUsers[1],
    attendees: [
      {
        id: 'a1',
        userId: '1',
        user: currentUser,
        status: 'approved',
        parentApproved: true,
        joinedAt: new Date(),
      },
      {
        id: 'a2',
        userId: '3',
        user: mockUsers[2],
        status: 'approved',
        parentApproved: true,
        joinedAt: new Date(),
      },
    ],
    maxAttendees: 6,
    status: 'upcoming',
    createdAt: new Date('2025-01-10'),
  },
  {
    id: 'h2',
    title: 'Birthday Sleepover 🎉',
    type: 'sleepover',
    description: "It's my birthday weekend! Games, pizza, and fun all night.",
    location: "Maya's House",
    date: '2025-01-25',
    time: '6:00 PM',
    endTime: '10:00 AM',
    hostId: '3',
    host: mockUsers[2],
    attendees: [
      {
        id: 'a3',
        userId: '1',
        user: currentUser,
        status: 'parent_pending',
        parentApproved: false,
        joinedAt: new Date(),
      },
      {
        id: 'a4',
        userId: '5',
        user: mockUsers[4],
        status: 'approved',
        parentApproved: true,
        joinedAt: new Date(),
      },
    ],
    status: 'upcoming',
    createdAt: new Date('2025-01-12'),
  },
  {
    id: 'h3',
    title: 'Study Session 📚',
    type: 'study',
    description: 'Math test prep - bring your notes!',
    location: 'Library',
    date: '2025-01-18',
    time: '3:00 PM',
    endTime: '5:00 PM',
    hostId: '1',
    host: currentUser,
    attendees: [
      {
        id: 'a5',
        userId: '4',
        user: mockUsers[3],
        status: 'approved',
        parentApproved: true,
        joinedAt: new Date(),
      },
    ],
    maxAttendees: 4,
    status: 'upcoming',
    createdAt: new Date('2025-01-14'),
  },
];

export const mockComments: Comment[] = [
  {
    id: 'c1',
    hangoutId: 'h1',
    userId: '3',
    user: mockUsers[2],
    text: "Can't wait! I'll bring popcorn 🍿",
    createdAt: new Date('2025-01-11T10:00:00'),
  },
  {
    id: 'c2',
    hangoutId: 'h1',
    userId: '2',
    user: mockUsers[1],
    text: 'Perfect! See you all there',
    createdAt: new Date('2025-01-11T11:00:00'),
  },
];