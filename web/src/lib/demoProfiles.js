const demoProfiles = [
  {
    id: 'demo-daughter-1',
    user_email: 'demo.daughter@aymm.test',
    display_name: 'Lila',
    age: 22,
    location: 'Brooklyn, NY',
    identity_type: 'daughter',
    seeking_type: 'mother',
    seeking_types: ['mother', 'father', 'family'],
    religion: 'open_to_all',
    bio: 'Demo daughter profile for browse rail filler.',
    hobbies: 'Journaling, music, long walks',
    favorite_foods: 'Dumplings and chai',
    last_movie: 'Past Lives',
    profile_photos: [],
    is_demo: true,
  },
  {
    id: 'demo-son-1',
    user_email: 'demo.son@aymm.test',
    display_name: 'Micah',
    age: 25,
    location: 'Austin, TX',
    identity_type: 'son',
    seeking_type: 'mother',
    seeking_types: ['mother', 'father', 'family'],
    religion: 'open_to_all',
    bio: 'Demo son profile for browse rail filler.',
    hobbies: 'Sketching, basketball, cooking',
    favorite_foods: 'Tacos and ramen',
    last_movie: 'Dune',
    profile_photos: [],
    is_demo: true,
  },
  {
    id: 'demo-mother-1',
    user_email: 'demo.mother@aymm.test',
    display_name: 'Naomi',
    age: 54,
    location: 'Chicago, IL',
    identity_type: 'mother',
    seeking_type: 'daughter',
    seeking_types: ['daughter', 'son', 'family'],
    religion: 'open_to_all',
    bio: 'Demo mother profile for browse rail filler.',
    hobbies: 'Gardening, baking, reading',
    favorite_foods: 'Soup, fresh bread, tea',
    last_book: 'The Dutch House',
    profile_photos: [],
    is_demo: true,
  },
  {
    id: 'demo-father-1',
    user_email: 'demo.father@aymm.test',
    display_name: 'Elias',
    age: 57,
    location: 'Atlanta, GA',
    identity_type: 'father',
    seeking_type: 'son',
    seeking_types: ['daughter', 'son', 'family'],
    religion: 'open_to_all',
    bio: 'Demo father profile for browse rail filler.',
    hobbies: 'Woodworking, chess, jazz',
    favorite_foods: 'Barbecue and peach cobbler',
    last_movie: 'The Holdovers',
    profile_photos: [],
    is_demo: true,
  },
  {
    id: 'demo-family-1',
    user_email: 'demo.family@aymm.test',
    display_name: 'The Hart Family',
    location: 'Nashville, TN',
    identity_type: 'family',
    seeking_type: 'daughter',
    seeking_types: ['daughter', 'son', 'mother', 'father'],
    religion: 'open_to_all',
    bio: 'Demo family profile for browse rail filler.',
    family_name: 'Hart',
    sibling_count: 2,
    beds_available: 1,
    profile_photos: [],
    is_demo: true,
  },
];

export function getDemoProfilesForIdentity(identityType) {
  if (!identityType) return demoProfiles;
  return demoProfiles.filter((profile) => profile.identity_type === identityType);
}

export function mergeBrowseProfiles(matchedProfiles, identityType) {
  const demos = getDemoProfilesForIdentity(identityType);
  return [...matchedProfiles, ...demos];
}

export default demoProfiles;
