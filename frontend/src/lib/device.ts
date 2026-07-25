const STORAGE_KEY = import.meta.env.VITE_DEVICE_STORAGE_KEY;

function createId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `d_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function getDeviceId(): string {
  if (!STORAGE_KEY) {
    console.warn(
      'VITE_DEVICE_STORAGE_KEY não definida — device id não será persistido',
    );
    return createId();
  }

  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing && /^[a-zA-Z0-9_-]{8,80}$/.test(existing)) {
      return existing;
    }
    const id = createId();
    localStorage.setItem(STORAGE_KEY, id);
    return id;
  } catch {
    return createId();
  }
}
