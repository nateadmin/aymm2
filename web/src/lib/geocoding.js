export async function geocodeZipcode(zipcode) {
  const zip = String(zipcode || '').trim();
  if (!/^\d{5}$/.test(zip)) {
    throw new Error('invalid_zipcode');
  }

  const response = await fetch(`https://api.zippopotam.us/us/${zip}`);
  if (!response.ok) {
    throw new Error('zipcode_not_found');
  }

  const data = await response.json();
  const place = data.places?.[0];
  if (!place) {
    throw new Error('zipcode_not_found');
  }

  return {
    location: `${place['place name']}, ${place['state abbreviation']}`,
    lat: Number(place.latitude),
    lon: Number(place.longitude),
    zipcode: zip,
  };
}
