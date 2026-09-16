export function getSeekingTypes(profile) {
  if (!profile) return [];
  if (Array.isArray(profile.seeking_types) && profile.seeking_types.length > 0) {
    return profile.seeking_types;
  }
  if (profile.seeking_type) {
    return [profile.seeking_type];
  }
  return [];
}

export function profilesMatch(myProfile, otherProfile) {
  if (!myProfile || !otherProfile) return false;
  if (myProfile.user_email === otherProfile.user_email) return false;

  const mySeeking = getSeekingTypes(myProfile);
  const theirSeeking = getSeekingTypes(otherProfile);

  const iSeekThem = mySeeking.length === 0 || mySeeking.includes(otherProfile.identity_type);
  const theySeekMe = theirSeeking.length === 0 || theirSeeking.includes(myProfile.identity_type);

  return iSeekThem && theySeekMe;
}

export function distanceMiles(lat1, lon1, lat2, lon2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const earthRadiusMiles = 3958.8;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2
    + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return earthRadiusMiles * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function sortProfilesByDistance(profiles, myProfile) {
  if (!myProfile?.real_life_visits || myProfile.lat == null || myProfile.lon == null) {
    return profiles;
  }

  return [...profiles].sort((a, b) => {
    const aDistance = a.lat != null && a.lon != null
      ? distanceMiles(myProfile.lat, myProfile.lon, a.lat, a.lon)
      : Number.POSITIVE_INFINITY;
    const bDistance = b.lat != null && b.lon != null
      ? distanceMiles(myProfile.lat, myProfile.lon, b.lat, b.lon)
      : Number.POSITIVE_INFINITY;
    return aDistance - bDistance;
  });
}

export function filterMatchedProfiles(myProfile, profiles) {
  return profiles.filter((profile) => profilesMatch(myProfile, profile));
}
