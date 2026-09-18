export const DAUGHTER_PROFILE = {
  slug: 'daughter-profile',
  display_name: 'Sarah',
  age: 24,
  location: 'Chicago, IL',
  identity_type: 'daughter',
  religion: 'christianity',
  seeking_headline: 'Looking for a Mother',
  bio:
    'I grew up without a consistent maternal figure in my life and have always longed for that warm, nurturing presence. I love cooking, reading, and long walks. I\'m looking for someone to share life with — someone who checks in, listens, and cares.',
  profile_photos: [
    'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=900&q=80',
  ],
  primaryLabel: 'Adopt Sarah',
  primaryVariant: 'primary',
  aboutTitle: 'About Me',
};

export const MOTHER_PROFILE = {
  slug: 'mother-profile',
  display_name: 'Linda',
  age: 52,
  location: 'Austin, TX',
  identity_type: 'mother',
  religion: 'spiritual',
  seeking_headline: 'Looking for a Daughter or Son',
  bio:
    'My own children are grown and independent. I have so much love left to give. I\'m warm, nurturing, and fiercely loyal. I cook big meals on Sundays and always answer the phone when someone needs to talk.',
  profile_photos: [
    'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=900&q=80',
  ],
  primaryLabel: 'AYMM?',
  primaryVariant: 'purple',
  aboutTitle: 'About Me',
};

export const FAMILY_PROFILE = {
  slug: 'family-profile',
  display_name: 'The Martinez Family',
  location: 'Denver, CO',
  identity_type: 'family',
  religion: 'christianity',
  seeking_headline: 'Looking to welcome a son or daughter',
  bio:
    'We are a warm, welcoming family who loves hosting Sunday dinners and holiday gatherings. We have room in our hearts and home for someone who wants to belong.',
  profile_photos: [
    'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=900&q=80',
  ],
  primaryLabel: 'AYMM?',
  primaryVariant: 'purple',
  aboutTitle: 'Our Family',
  family_members: [
    { role: 'Father', name: 'Carlos, 54' },
    { role: 'Mother', name: 'Elena, 51' },
  ],
};

export const RECOMMEND_PROFILE = DAUGHTER_PROFILE;
