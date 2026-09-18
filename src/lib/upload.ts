import { writeFile } from 'fs/promises';
import path from 'path';

export async function uploadImage(file: any): Promise<string | null> {
  if (!file || typeof file === 'string' || !file.arrayBuffer || typeof file.size !== 'number' || file.size === 0) return null;
  
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const ext = file.name ? file.name.split('.').pop() || 'png' : 'png';
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
    const filepath = path.join(process.cwd(), 'public/uploads', filename);
    
    await writeFile(filepath, buffer);
    return `/uploads/${filename}`;
  } catch (err) {
    console.error('Image upload error:', err);
    return null;
  }
}
