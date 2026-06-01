import { promises as fs } from 'node:fs'
import path from 'node:path'
import type { IStorageService } from '@api/ports/storage.port'

/**
 * Stores objects on the local filesystem (a Docker volume on the VPS).
 *
 * `publicUrl` returns `${baseUrl}/media/<key>`. In production Nginx serves
 * `/media/*` directly from `root` with long, immutable cache headers; in dev the
 * API serves it via `express.static` (see container.ts). The `/media/` segment is
 * specific to this adapter — an S3/R2 adapter would resolve keys to its own host.
 */
export class LocalDiskStorage implements IStorageService {
  private readonly root: string
  private readonly baseUrl: string

  constructor(root: string, baseUrl: string) {
    this.root = path.resolve(root)
    this.baseUrl = baseUrl.replace(/\/$/, '')
  }

  private toPath(key: string): string {
    const full = path.resolve(this.root, key)
    // Guard against path traversal via crafted keys.
    if (full !== this.root && !full.startsWith(this.root + path.sep)) {
      throw new Error(`Invalid storage key: ${key}`)
    }
    return full
  }

  async put(key: string, body: Buffer, _contentType: string): Promise<void> {
    const full = this.toPath(key)
    await fs.mkdir(path.dirname(full), { recursive: true })
    await fs.writeFile(full, body)
  }

  async delete(key: string): Promise<void> {
    try {
      await fs.unlink(this.toPath(key))
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code !== 'ENOENT') throw err
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      await fs.access(this.toPath(key))
      return true
    } catch {
      return false
    }
  }

  publicUrl(key: string): string {
    return `${this.baseUrl}/media/${key}`
  }
}
