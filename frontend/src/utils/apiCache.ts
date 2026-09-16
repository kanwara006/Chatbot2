type CacheEntry<T> = { data: T; timestamp: number }

const store = new Map<string, CacheEntry<unknown>>()
const inflight = new Map<string, Promise<unknown>>()

const DEFAULT_TTL = 60_000

/**
 * ดึงข้อมูลแบบ cache-first พร้อม stale-while-revalidate — ถ้ามีข้อมูลเดิมอยู่แล้วจะคืนค่าทันที
 * โดยไม่ต้องรอ network แล้วค่อยอัปเดตข้อมูลเบื้องหลังให้สดใหม่สำหรับครั้งถัดไป
 * ทำให้การสลับไปมาระหว่างหน้าต่างๆ ไม่ต้องรอโหลดซ้ำทุกครั้ง
 */
export function withCache<T>(key: string, fetcher: () => Promise<T>, ttl = DEFAULT_TTL): Promise<T> {
  const cached = store.get(key) as CacheEntry<T> | undefined

  if (cached) {
    if (Date.now() - cached.timestamp > ttl && !inflight.has(key)) {
      const refresh = fetcher()
        .then((data) => {
          store.set(key, { data, timestamp: Date.now() })
          return data
        })
        .finally(() => inflight.delete(key))
      inflight.set(key, refresh)
    }
    return Promise.resolve(cached.data)
  }

  if (inflight.has(key)) {
    return inflight.get(key) as Promise<T>
  }

  const request = fetcher()
    .then((data) => {
      store.set(key, { data, timestamp: Date.now() })
      return data
    })
    .finally(() => inflight.delete(key))
  inflight.set(key, request)
  return request
}

/** ล้าง cache ของ key ที่ตรงหรือขึ้นต้นด้วย prefix นี้ (เรียกหลังสร้าง/แก้ไข/ลบข้อมูล) */
export function invalidateCache(prefix: string): void {
  for (const key of store.keys()) {
    if (key === prefix || key.startsWith(`${prefix}:`)) store.delete(key)
  }
  for (const key of inflight.keys()) {
    if (key === prefix || key.startsWith(`${prefix}:`)) inflight.delete(key)
  }
}
