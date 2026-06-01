/**
 * Object storage abstraction. The application only ever speaks in backend-agnostic
 * keys; each adapter owns how a key maps to a physical location and a public URL.
 *
 * Today: LocalDiskStorage (self-hosted VPS volume).
 * Tomorrow: S3Storage (Cloudflare R2 / AWS S3) — same interface, swap in the
 * composition root. Because callers store keys (never URLs), the migration is a
 * byte sync + env change, with no DB or content rewrite.
 */
export interface IStorageService {
  put(key: string, body: Buffer, contentType: string): Promise<void>
  delete(key: string): Promise<void>
  exists(key: string): Promise<boolean>
  /** Resolve a stored key to a public URL using this backend's URL scheme. */
  publicUrl(key: string): string
}
