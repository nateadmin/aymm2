export const LETTERS_INBOX = [
  {
    id: 'letter-linda',
    name: 'Linda M.',
    role: 'Mother',
    location: 'Austin, TX',
    time: '2h',
    preview: 'Hello dear, I saw your profile and felt such a connection.',
    photo: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=200&q=80',
    unread: true,
  },
  {
    id: 'letter-martinez',
    name: 'The Martinez Family',
    role: 'Family',
    location: 'Denver, CO',
    time: '5h',
    preview: 'We wanted to reach out after seeing your story. Our family...',
    photo: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=200&q=80',
    unread: true,
  },
  {
    id: 'letter-robert',
    name: 'Robert K.',
    role: 'Father',
    location: 'Seattle, WA',
    time: '1d',
    preview: 'I read your profile three times. You remind me so much...',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    unread: false,
  },
  {
    id: 'letter-grace',
    name: 'Grace T.',
    role: 'Mother',
    location: 'Nashville, TN',
    time: '2d',
    preview: 'Your story about Sunday mornings really touched my heart...',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    unread: false,
  },
];

export const MESSAGE_REQUESTS = [
  {
    id: 'req-patricia',
    name: 'Patricia W.',
    role: 'Mother',
    location: 'Phoenix, AZ',
    message: 'I have so much love to give and your profile really moved me.',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'req-david',
    name: 'David H.',
    role: 'Father',
    location: 'Portland, OR',
    message: 'Something about your story reminded me of my younger self...',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'req-nguyen',
    name: 'The Nguyen Family',
    role: 'Family',
    location: 'Houston, TX',
    message: 'We would love to welcome someone new into our Sunday gatherings.',
    photo: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=200&q=80',
  },
];

export const OPEN_CONVERSATION = {
  name: 'Linda M.',
  role: 'Mother',
  location: 'Austin, TX',
  photo: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=200&q=80',
  messages: [
    {
      id: 'm1',
      mine: false,
      content: 'Hello dear, I saw your profile and felt such a connection. I\'ve been looking for someone like you for a long time.',
      time: '2:14 PM',
    },
    {
      id: 'm2',
      mine: true,
      content: 'Thank you so much, Linda. Your profile touched me too. I love that you cook big Sunday meals — that\'s exactly the kind of warmth I\'ve been looking for.',
      time: '2:22 PM',
    },
    {
      id: 'm3',
      mine: false,
      content: 'That means everything to hear. Would you be open to a video call sometime this week? I\'d love to hear your voice.',
      time: '2:25 PM',
    },
    {
      id: 'm4',
      mine: true,
      content: 'I\'d really like that. How about Saturday morning?',
      time: '2:28 PM',
    },
  ],
};

export const FAMILY_TABLE_LISTING = [
  {
    id: 'johnson-table',
    name: 'The Johnson Table',
    event: 'Thanksgiving 2025',
    location: 'Memphis, TN',
    zip: '38103',
    seatsLeft: 4,
    bedsAvailable: 2,
    religion: 'Christian',
    photo: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'martinez-table',
    name: 'The Martinez Table',
    event: 'Christmas Eve Dinner',
    location: 'Denver, CO',
    zip: '80202',
    seatsLeft: 2,
    bedsAvailable: 1,
    religion: 'Christianity',
    photo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
  },
];

export const JOHNSON_TABLE = {
  id: 'johnson-table',
  name: 'The Johnson Table',
  headline: 'Thanksgiving 2025 · Memphis, TN · ZIP 38103',
  photo: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
  seatsLeft: 4,
  bedsAvailable: 2,
  faith: 'Christian',
  holiday: 'Thanksgiving — Nov 27, 2025',
  food: 'Traditional Southern spread — turkey, cornbread, sweet potato pie',
  religion: 'Christian — non-denominational, welcoming all',
  about: 'The Johnson family has been hosting Thanksgiving for over 20 years. Our gatherings are warm, casual, and deeply loving. We welcome anyone who needs a seat at the table.',
  hostFamily: 'The Johnson Family',
  eventDate: 'November 27, 2025',
  guestCapacity: '12 guests total · 4 seats remaining',
  sleeping: '2 guest bedrooms + pull-out sofa',
  foodFull: 'Full Thanksgiving dinner — turkey, sides, desserts. All dietary needs accommodated.',
};

export const PREVIOUS_PHOTOS = {
  title: 'Previous Tables',
  subtitle: 'A look inside past Johnson family gatherings',
  featured: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
  photos: [
    'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=400&q=80',
  ],
};

export const EVENT_REMINDER = {
  month: 'NOVEMBER',
  day: '27',
  title: 'Event Reminder',
  subtitle: 'Your Family Table event is coming up soon!',
  event: 'Thanksgiving Dinner',
  host: 'The Johnson Family',
  date: 'Thursday, November 27, 2025',
  time: 'Arrive from 2:00 PM · Dinner at 5:00 PM',
  location: '204 Maple Ave, Memphis, TN 38103',
  seatStatus: 'Confirmed',
};
