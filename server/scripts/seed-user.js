import { createUser, findUserByEmail, setUserPassword } from '../src/auth.js';
import { hashPassword } from '../src/password.js';

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];

  if (!email || !password) {
    console.error('Usage: node scripts/seed-user.js <email> <password>');
    process.exit(1);
  }

  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is required');
    process.exit(1);
  }

  const normalized = email.trim().toLowerCase();
  const passwordHash = await hashPassword(password);
  const existing = await findUserByEmail(normalized);

  if (existing) {
    await setUserPassword(normalized, passwordHash);
    console.log(`Updated password for ${normalized}`);
    return;
  }

  await createUser(normalized, passwordHash);
  console.log(`Created user ${normalized}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
