// ギャラリーのお気に入り。同じブラウザの localStorage にイラストの画像パスだけを持つ。
// React からは useSyncExternalStore で読む（サーバーと hydration 中は空の一覧）。

export const FAVORITES_KEY = "next-hp:gallery-favorites:v1";

const EMPTY: readonly string[] = Object.freeze([]);

/** 保存値を読み取る。壊れた値や想定外の形は空として扱う。 */
export function parseFavorites(raw: string | null | undefined): readonly string[] {
  if (!raw) return EMPTY;
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return EMPTY;
    const images = data.filter((value): value is string => typeof value === "string" && value.startsWith("/"));
    return [...new Set(images)];
  } catch {
    return EMPTY;
  }
}

export function toggleFavorite(list: readonly string[], image: string): readonly string[] {
  return list.includes(image) ? list.filter((saved) => saved !== image) : [...list, image];
}

const listeners = new Set<() => void>();
let cachedRaw: string | null | undefined;
let cached = EMPTY;
// 保存領域が使えない環境では、このページを開いている間だけメモリに持つ
let memory: readonly string[] | null = null;

function readRaw(): string | null | undefined {
  try {
    return window.localStorage.getItem(FAVORITES_KEY);
  } catch {
    return undefined;
  }
}

export function getFavorites(): readonly string[] {
  if (memory) return memory;
  const raw = readRaw();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cached = parseFavorites(raw);
  }
  return cached;
}

export function getServerFavorites(): readonly string[] {
  return EMPTY;
}

export function subscribeFavorites(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === FAVORITES_KEY || event.key === null) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function toggleSavedFavorite(image: string) {
  const next = toggleFavorite(getFavorites(), image);
  try {
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
    memory = null;
  } catch {
    memory = next;
  }
  listeners.forEach((listener) => listener());
}
