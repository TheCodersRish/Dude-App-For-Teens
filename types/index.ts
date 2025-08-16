export interface User {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  qrCode: string;
  isParent?: boolean;
  parentId?: string;
  bio?: string;
}

export interface Friend {
  id: string;
  userId: string;
  friendId: string;
  user: User;
  addedAt: Date;
}

export interface Hangout {
  id: string;
  title: string;
  type: 'hangout' | 'sleepover' | 'party' | 'study' | 'movie';
  description: string;
  location: string;
  date: string;
  time: string;
  endTime?: string;
  hostId: string;
  host: User;
  attendees: Attendee[];
  maxAttendees?: number;
  coverImage?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: Date;
}

export interface Attendee {
  id: string;
  userId: string;
  user: User;
  status: 'pending' | 'approved' | 'declined' | 'parent_pending';
  parentApproved?: boolean;
  joinedAt: Date;
}

export interface Comment {
  id: string;
  hangoutId: string;
  userId: string;
  user: User;
  text: string;
  createdAt: Date;
}

export interface ParentRequest {
  id: string;
  hangoutId: string;
  hangout: Hangout;
  childId: string;
  child: User;
  parentId: string;
  status: 'pending' | 'approved' | 'declined';
  message?: string;
  respondedAt?: Date;
  createdAt: Date;
}