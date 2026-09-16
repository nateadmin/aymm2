const STORAGE_KEY = 'aymm_reactions';

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function writeAll(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getReaction(postId) {
  return readAll()[postId] || null;
}

export function setReaction(postId, reaction) {
  const data = readAll();
  if (!reaction) {
    delete data[postId];
  } else {
    data[postId] = reaction;
  }
  writeAll(data);
}
