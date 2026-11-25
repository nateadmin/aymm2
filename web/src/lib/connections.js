import { CHILD_IDENTITIES } from './constants';

export function getConnectionTypeForProfile(profile) {
  if (!profile) return 'aymm';
  if (CHILD_IDENTITIES.includes(profile.identity_type)) return 'adopt';
  if (profile.identity_type === 'family') return 'aymf';
  return 'aymm';
}

export function getPrimaryActionLabel(viewerProfile, targetProfile) {
  const type = getConnectionTypeForProfile(targetProfile);
  if (type === 'adopt') return 'Adopt';
  return 'AYMM?';
}

export function normalizeParticipantEmail(email) {
  return String(email || '').trim().toLowerCase();
}

export function emailsMatch(emailA, emailB) {
  return normalizeParticipantEmail(emailA) === normalizeParticipantEmail(emailB);
}

export function isConnected(connections, emailA, emailB) {
  return connections.some(
    (connection) =>
      connection.status === 'accepted'
      && (
        (emailsMatch(connection.from_email, emailA) && emailsMatch(connection.to_email, emailB))
        || (emailsMatch(connection.from_email, emailB) && emailsMatch(connection.to_email, emailA))
      ),
  );
}

export function findPendingConnection(connections, fromEmail, toEmail) {
  return connections.find(
    (connection) =>
      connection.status === 'pending'
      && connection.from_email === fromEmail
      && connection.to_email === toEmail,
  );
}

export function findMutualPending(connections, emailA, emailB) {
  return connections.find(
    (connection) =>
      connection.status === 'pending'
      && connection.from_email === emailB
      && connection.to_email === emailA,
  );
}
