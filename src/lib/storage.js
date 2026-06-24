// src/lib/storage.js
//
// Camada fina sobre localStorage com versionamento (pra evoluir o schema
// sem quebrar instalações antigas) e fallback seguro caso o storage
// esteja indisponível (modo anônimo do iOS, por exemplo).

const STORAGE_VERSION = 1;
const KEY_PERFIL = `eng:perfil:v${STORAGE_VERSION}`;
const KEY_CHECKINS = `eng:checkins:v${STORAGE_VERSION}`;

function safeRead(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function safeWrite(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

// --- Perfil ---

export function getPerfil() {
  return safeRead(KEY_PERFIL);
}

export function savePerfil(perfil) {
  return safeWrite(KEY_PERFIL, perfil);
}

export function clearPerfil() {
  try {
    localStorage.removeItem(KEY_PERFIL);
  } catch {}
}

// --- Check-ins ---

export function getCheckIns() {
  const list = safeRead(KEY_CHECKINS);
  return Array.isArray(list) ? list : [];
}

export function saveCheckIns(list) {
  return safeWrite(KEY_CHECKINS, list);
}

export function addCheckIn(checkIn) {
  const list = getCheckIns();
  list.unshift(checkIn); // mais recente primeiro
  saveCheckIns(list);
  return list;
}

export function removeCheckIn(id) {
  const list = getCheckIns().filter((c) => c.id !== id);
  saveCheckIns(list);
  return list;
}

export function updateCheckIn(id, patch) {
  const list = getCheckIns().map((c) =>
    c.id === id ? { ...c, ...patch } : c
  );
  saveCheckIns(list);
  return list;
}

// Gera ID estável (sem dependência externa)
export function gerarId(prefix = 'ckin') {
  return `${prefix}_${Date.now().toString(36)}${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}
