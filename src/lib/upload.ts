import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function uploadImage(file: any, folder: string = 'offers'): Promise<string | null> {
  if (!file || typeof file === 'string') return null;

  // Verify file has content
  const fileSize = typeof file.size === 'number' ? file.size : 0;
  if (fileSize === 0) return null;

  if (typeof file.arrayBuffer !== 'function') return null;

  try {
    const rawExt = file.name ? file.name.split('.').pop() || 'png' : 'png';
    const ext = rawExt.toLowerCase().replace(/[^a-z0-9]/g, '') || 'png';
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;

    // 1. Check if Vercel Blob cloud storage is available
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { put } = await import('@vercel/blob');
        const blob = await put(filename, file, { access: 'public' });
        if (blob?.url) {
          return blob.url;
        }
      } catch (blobError) {
        console.warn('Vercel Blob upload failed, falling back to local storage:', blobError);
      }
    }

    // 2. Local storage fallback in public/uploads/${folder}
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const targetDir = path.join(process.cwd(), 'public', 'uploads', folder);
    await mkdir(targetDir, { recursive: true });

    const localFileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
    const targetFilePath = path.join(targetDir, localFileName);

    await writeFile(targetFilePath, buffer);
    return `/uploads/${folder}/${localFileName}`;
  } catch (err) {
    console.error('Image upload error:', err);
    return null;
  }
}
