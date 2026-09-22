export const MY_PROFILE = {
  name: 'Sarah',
  age: 24,
  fullName: 'Sarah Johnson',
  role: 'Daughter',
  location: 'Chicago, IL',
  photo: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=900&q=80',
  bio:
    'I grew up without a consistent maternal figure in my life and have always longed for that warm, nurturing presence.',
  seeking: 'Mother, Father',
  faith: 'Christianity',
};

export const HOME_PROFILES = [
  {
    id: 'sarah',
    name: 'Sarah',
    age: 24,
    role: 'Daughter',
    location: 'Chicago, IL',
    photo: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'linda',
    name: 'Linda',
    age: 52,
    role: 'Mother',
    location: 'Austin, TX',
    photo: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'martinez',
    name: 'The Martinez Family',
    role: 'Family',
    location: 'Denver, CO',
    photo: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=400&q=80',
  },
];

export const QUICK_ACTIONS = [
  {
    id: 'browse',
    title: 'Browse Profiles',
    description: 'Discover family connections',
    route: '/Prototype/profile-carousel',
  },
  {
    id: 'tables',
    title: 'Family Tables',
    description: 'Join a gathering near you',
    route: '/Community/family-table-listing',
  },
  {
    id: 'letters',
    title: 'Letters',
    description: '3 unread messages',
    route: '/Community/letters-inbox',
  },
];

export const SETTINGS_SECTIONS = [
  {
    title: 'Account',
    items: ['Edit Profile', 'Change Password', 'Phone Number', 'Email Address'],
  },
  {
    title: 'Preferences',
    items: ['Notifications', 'Privacy', 'Who Can Message Me', 'Religion Preferences'],
  },
  {
    title: 'Family Tables',
    items: ['My Tables'],
  },
  {
    title: 'Support',
    items: ['Help Center', 'Report a Problem', 'About AYMM?'],
  },
  {
    title: 'Account Actions',
    items: ['Log Out'],
  },
];

export const CAROUSEL_PROFILE = {
  category: 'Daughters',
  name: 'Sophie',
  headline: 'I am a daughter seeking a mother',
  photos: [
    'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80',
  ],
  bio:
    'I grew up without a consistent maternal figure in my life and have always longed for that warm, nurturing presence. I love cooking, reading, and long walks.',
};

export const ADOPTION_APPROVED = {
  name: 'Linda',
  userPhoto: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=200&q=80',
  matchPhoto: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=200&q=80',
  message: 'You have found a new family connection. Linda has accepted your request.',
};

export const FAMILY_MATCH = {
  name: 'The Martinez Family',
  photo: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80',
  message:
    'You\'ve been welcomed into a new family. They\'re excited to connect with you.',
};

export const MESSAGE_REQUEST_DETAIL = {
  name: 'Linda M.',
  role: 'Mother',
  location: 'Austin, TX',
  tags: ['Mother', 'Spiritual'],
  photo: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=200&q=80',
  preview:
    'Hello dear, I saw your profile and felt such a deep connection. I have been looking for someone like you for a very long time. I would love the chance to talk...',
};

export const COMPATIBILITY_CHALLENGE = {
  step: 1,
  total: 3,
  percent: 33,
  label: 'Compatibility Challenge',
  question: 'When you need support, what do you usually do first?',
  options: [
    { id: 'call', label: 'Call someone I trust' },
    { id: 'alone', label: 'Think it through alone' },
    { id: 'write', label: 'Write about it' },
    { id: 'distract', label: 'Distract myself' },
  ],
};

export const RELIGION_OPTIONS = [
  'Christianity',
  'Islam',
  'Judaism',
  'Hinduism',
  'Buddhism',
  'Sikhism',
  'Baha\'i',
  'Jainism',
  'Spiritual / Non-religious',
  'Prefer not to say',
];

export const SEEKING_QS_PARENT = {
  title: 'Seeking a Parent',
  subtitle: 'A couple of questions to find the right match',
  groups: [
    {
      label: 'What are you hoping a parent figure can help with?',
      options: [
        'Birthday celebrations',
        'Life advice & guidance',
        'Emotional support',
        'A loving friendship',
        'Daily encouragement',
        'Holiday traditions',
      ],
      initial: 'Holiday traditions',
    },
    {
      label: 'How often would you like to be in contact?',
      options: [
        'Daily check-ins',
        'A few times a week',
        'Weekly',
        'Monthly',
      ],
      initial: 'Daily check-ins',
    },
  ],
};

export const SEEKING_QS_CHILD = {
  title: 'Seeking a Child',
  subtitle: 'A couple of questions to find the right match',
  groups: [
    {
      label: 'What would you most enjoy sharing with a child figure?',
      options: [
        'Birthdays & milestones',
        'Holiday gatherings',
        'Life lessons & wisdom',
        'Everyday moments',
        'Guidance & mentorship',
        'Simply being present',
      ],
      initial: 'Everyday moments',
    },
    {
      label: 'What kind of parent or family figure would you like to be?',
      options: [
        'Nurturing & caring',
        'Fun & adventurous',
        'Wise & guiding',
        'Supportive & present',
      ],
      initial: 'Nurturing & caring',
    },
  ],
};

export const SEEKING_QS_SIBLING = {
  title: 'Seeking a Sibling',
  subtitle: 'A couple of questions to find the right match',
  groups: [
    {
      label: 'What do you hope to share with a sibling figure?',
      options: [
        'Adventures & travel',
        'Family gatherings',
        'Shared hobbies',
        'Honest conversations',
        'Everyday friendship',
        'Just having each other',
      ],
      initial: 'Everyday friendship',
    },
    {
      label: 'What kind of sibling dynamic feels right?',
      options: [
        'Younger sibling (supported)',
        'Older sibling (protective)',
        'Equal peers',
      ],
      initial: 'Younger sibling (supported)',
    },
  ],
};
