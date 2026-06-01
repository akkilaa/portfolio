import multer from 'multer'

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024 // 10 MB — admin-only uploads, kept tight

/**
 * Parses a single `file` field into memory so the service can hand the buffer
 * straight to sharp. Memory storage is fine here: a single admin uploads a
 * handful of images, never concurrent large files.
 */
export const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_BYTES, files: 1 },
}).single('file')
