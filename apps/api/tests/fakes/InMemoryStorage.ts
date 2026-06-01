import type { IStorageService } from '../../src/ports/storage.port'

/**
 * In-memory stand-in for a real storage backend. Behaves like the disk/S3
 * adapters but keeps bytes in a Map; `objects` is exposed so tests can assert on
 * what was actually stored (e.g. that EXIF was stripped from the saved image).
 */
export class InMemoryStorage implements IStorageService {
  readonly objects = new Map<string, Buffer>()

  async put(key: string, body: Buffer, _contentType: string): Promise<void> {
    this.objects.set(key, Buffer.from(body))
  }

  async delete(key: string): Promise<void> {
    this.objects.delete(key)
  }

  async exists(key: string): Promise<boolean> {
    return this.objects.has(key)
  }

  publicUrl(key: string): string {
    return `https://test.media/${key}`
  }
}
