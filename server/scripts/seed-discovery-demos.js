/**
 * Seeds Phase 2 discovery personas on the live database.
 * Safe to re-run: upserts users + profiles by email.
 *
 * Usage (on host with DATABASE_URL, e.g. after deploy):
 *   npm run seed-discovery-demos
 *   npm run seed-discovery-demos -- --check preview-tester+nov24@wefoundd.com
 */
import pg from 'pg';
import { hashPassword } from '../src/password.js';

function getSeekingTypes(profile) {
  if (!profile) return [];
  if (Array.isArray(profile.seeking_types) && profile.seeking_types.length > 0) {
    return profile.seeking_types;
  }
  if (profile.seeking_type) return [profile.seeking_type];
  return [];
}

function profilesMatch(myProfile, otherProfile) {
  if (!myProfile || !otherProfile) return false;
  if (myProfile.user_email === otherProfile.user_email) return false;
  const mySeeking = getSeekingTypes(myProfile);
  const theirSeeking = getSeekingTypes(otherProfile);
  const iSeekThem = mySeeking.length === 0 || mySeeking.includes(otherProfile.identity_type);
  const theySeekMe = theirSeeking.length === 0 || theirSeeking.includes(myProfile.identity_type);
  return iSeekThem && theySeekMe;
}

const DEMO_PASSWORD = 'DemoPass123';

/** @type {Array<{ email: string, label: string, profile: Record<string, unknown> }>} */
const PHASE2_DEMOS = [
  {
    email: 'phase2.sarah+demo@aymm.app',
    label: 'Daughter (Sarah)',
    profile: {
      display_name: 'Sarah',
      age: 24,
      location: 'Chicago, IL',
      identity_type: 'daughter',
      religion: 'christianity',
      religion_private: false,
      seeking_types: ['mother', 'father'],
      seeking_type: 'mother',
      bio:
        'Phase 2 demo · I grew up without a consistent maternal figure and am looking for a warm, nurturing connection. I love cooking, reading, and long walks.',
      profile_photos: [
        'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=900&q=80',
      ],
      setup_complete: true,
      real_life_visits: false,
    },
  },
  {
    email: 'phase2.micah+demo@aymm.app',
    label: 'Son (Micah)',
    profile: {
      display_name: 'Micah',
      age: 26,
      location: 'Brooklyn, NY',
      identity_type: 'son',
      religion: 'open_to_all',
      religion_private: false,
      seeking_types: ['mother', 'father'],
      seeking_type: 'father',
      bio:
        'Phase 2 demo · Looking for mentors and family figures who show up consistently. I enjoy basketball, cooking, and community volunteering.',
      profile_photos: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80',
      ],
      setup_complete: true,
      real_life_visits: false,
    },
  },
  {
    email: 'phase2.linda+demo@aymm.app',
    label: 'Mother (Linda)',
    profile: {
      display_name: 'Linda',
      age: 52,
      location: 'Austin, TX',
      identity_type: 'mother',
      religion: 'spiritual',
      religion_private: false,
      seeking_types: ['daughter', 'son'],
      seeking_type: 'daughter',
      bio:
        'Phase 2 demo · My children are grown. I have love and time for someone who wants a steady, nurturing presence in their life.',
      profile_photos: [
        'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=900&q=80',
      ],
      setup_complete: true,
      real_life_visits: false,
    },
  },
  {
    email: 'phase2.james+demo@aymm.app',
    label: 'Father (James)',
    profile: {
      display_name: 'James',
      age: 55,
      location: 'Atlanta, GA',
      identity_type: 'father',
      religion: 'christianity',
      religion_private: false,
      seeking_types: ['daughter', 'son'],
      seeking_type: 'son',
      bio:
        'Phase 2 demo · Father of two grown kids with patience, life lessons, and time to invest in someone who wants a dad in their corner.',
      profile_photos: [
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
      ],
      setup_complete: true,
      real_life_visits: false,
    },
  },
  {
    email: 'phase2.martinez+demo@aymm.app',
    label: 'Family (Martinez)',
    profile: {
      display_name: 'The Martinez Family',
      location: 'Denver, CO',
      identity_type: 'family',
      religion: 'christianity',
      religion_private: false,
      seeking_types: ['daughter', 'son'],
      seeking_type: 'daughter',
      family_name: 'Martinez',
      bio:
        'Phase 2 demo · A welcoming family who loves Sunday dinners and holiday gatherings. Room in our hearts for someone who wants to belong.',
      profile_photos: [
        'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=900&q=80',
      ],
      setup_complete: true,
      real_life_visits: false,
    },
  },
];

const JSON_FIELDS = new Set(['seeking_types', 'profile_photos', 'seeking_for', 'seeking_sibling_reasons']);

function serializeValue(key, value) {
  if (JSON_FIELDS.has(key) && value !== undefined) {
    return JSON.stringify(value);
  }
  return value;
}

async function upsertUser(client, email, passwordHash) {
  const normalized = email.trim().toLowerCase();
  const existing = await client.query('SELECT id FROM users WHERE email = $1', [normalized]);
  if (existing.rowCount > 0) {
    await client.query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE email = $2',
      [passwordHash, normalized],
    );
    return 'updated';
  }
  await client.query(
    'INSERT INTO users (email, password_hash) VALUES ($1, $2)',
    [normalized, passwordHash],
  );
  return 'created';
}

async function upsertProfile(client, email, profile) {
  const normalized = email.trim().toLowerCase();
  const payload = { ...profile, user_email: normalized };
  const keys = Object.keys(payload).filter((key) => key !== 'user_email');
  const existing = await client.query('SELECT id FROM profiles WHERE user_email = $1', [normalized]);

  if (existing.rowCount > 0) {
    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
    const values = keys.map((key) => serializeValue(key, payload[key]));
    values.push(normalized);
    await client.query(
      `UPDATE profiles SET ${setClause}, updated_at = NOW() WHERE user_email = $${values.length}`,
      values,
    );
    return 'updated';
  }

  const insertKeys = [...keys, 'user_email'];
  const columns = insertKeys.join(', ');
  const placeholders = insertKeys.map((_, index) => `$${index + 1}`).join(', ');
  const values = keys.map((key) => serializeValue(key, payload[key]));
  values.push(normalized);
  await client.query(`INSERT INTO profiles (${columns}) VALUES (${placeholders})`, values);
  return 'created';
}

function parseArgs(argv) {
  const checkIdx = argv.indexOf('--check');
  if (checkIdx >= 0) {
    return { checkEmail: argv[checkIdx + 1]?.trim().toLowerCase() };
  }
  return {};
}

async function loadTesterProfile(client, email) {
  if (!email) return null;
  const { rows } = await client.query('SELECT * FROM profiles WHERE user_email = $1 LIMIT 1', [email]);
  if (!rows[0]) return null;
  const row = rows[0];
  for (const key of JSON_FIELDS) {
    if (row[key] && typeof row[key] === 'string') {
      row[key] = JSON.parse(row[key]);
    }
  }
  row.setup_complete = Boolean(row.setup_complete);
  return row;
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL is required');
    process.exit(1);
  }

  const { checkEmail } = parseArgs(process.argv.slice(2));
  const passwordHash = await hashPassword(DEMO_PASSWORD);
  const client = new pg.Client({ connectionString: databaseUrl });
  await client.connect();

  try {
    for (const demo of PHASE2_DEMOS) {
      const userAction = await upsertUser(client, demo.email, passwordHash);
      const profileAction = await upsertProfile(client, demo.email, demo.profile);
      console.log(`${demo.label}: user ${userAction}, profile ${profileAction} (${demo.email})`);
    }

    console.log(`\nShared password for demo logins: ${DEMO_PASSWORD}`);
    console.log('Emails:', PHASE2_DEMOS.map((d) => d.email).join(', '));

    if (checkEmail) {
      const tester = await loadTesterProfile(client, checkEmail);
      if (!tester) {
        console.warn(`\nNo profile for ${checkEmail} — complete onboarding first, then re-run --check.`);
        return;
      }
      if (!tester.setup_complete) {
        console.warn(`\n${checkEmail} profile is incomplete (setup_complete=false).`);
      }
      const demos = PHASE2_DEMOS.map((d) => ({
        user_email: d.email,
        ...d.profile,
      }));
      const matches = demos.filter((p) => profilesMatch(tester, p));
      console.log(`\nMatches for ${checkEmail} (${tester.identity_type}, seeking ${getSeekingTypes(tester).join('/') || 'any'}):`);
      if (!matches.length) {
        console.log('  (none — adjust identity_type / seeking_types on tester or add personas)');
      } else {
        matches.forEach((p) => console.log(`  • ${p.display_name} (${p.identity_type}) — ${p.user_email}`));
      }
    }
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});