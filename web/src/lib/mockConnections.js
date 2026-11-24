const STORAGE_KEY = 'aymm_mock_connections';
let memoryConnections = [];

function loadConnections() {
  if (memoryConnections.length) return memoryConnections;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      memoryConnections = JSON.parse(raw);
      return memoryConnections;
    }
  } catch {
    // ignore
  }
  return [];
}

function saveConnections(rows) {
  memoryConnections = rows;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
  } catch {
    // ignore
  }
}

export function clearMockConnections() {
  memoryConnections = [];
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function listMockConnections(filters = {}) {
  const rows = loadConnections();
  return rows.filter((row) => Object.entries(filters).every(
    ([key, value]) => row[key] === value,
  ));
}

export function createMockConnection(data) {
  const rows = loadConnections();
  const row = {
    id: `mock-conn-${Date.now()}-${rows.length}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: 'pending',
    ...data,
  };
  rows.push(row);
  saveConnections(rows);
  return row;
}

export function updateMockConnection(id, patch) {
  const rows = loadConnections();
  const index = rows.findIndex((row) => row.id === id);
  if (index < 0) return null;
  rows[index] = { ...rows[index], ...patch, updated_at: new Date().toISOString() };
  saveConnections(rows);
  return rows[index];
}

export function deleteMockConnection(id) {
  const rows = loadConnections().filter((row) => row.id !== id);
  saveConnections(rows);
}