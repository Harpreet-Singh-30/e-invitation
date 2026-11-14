import path from 'path';
import fs from 'fs';
import { nanoid } from 'nanoid';

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
  provider: 'local' | 'supabase' | 'cloudinary';
}

export interface UploadOptions {
  buffer: Buffer;
  originalFilename?: string;
  mimeType: string;
  folder?: string;
}

const LOCAL_UPLOADS_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');

// Ensure local directory exists for fallback
if (!fs.existsSync(LOCAL_UPLOADS_DIR)) {
  fs.mkdirSync(LOCAL_UPLOADS_DIR, { recursive: true });
}

/**
 * Upload file to configured storage provider (Supabase Storage, Cloudinary, or Local Disk fallback)
 */
export async function uploadMedia(options: UploadOptions): Promise<UploadResult> {
  const { buffer, originalFilename = 'file', mimeType, folder = 'invitations' } = options;
  const ext = path.extname(originalFilename) || (mimeType === 'image/png' ? '.png' : mimeType === 'image/webp' ? '.webp' : '.jpg');
  const uniqueName = `${nanoid(16)}${ext}`;
  const storagePath = `${folder}/${uniqueName}`;

  // 1. Check for Supabase Storage (Free 1GB tier)
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
  const supabaseBucket = process.env.SUPABASE_STORAGE_BUCKET || 'invitation-assets';

  if (supabaseUrl && supabaseKey) {
    try {
      const cleanUrl = supabaseUrl.replace(/\/+$/, '');
      const uploadEndpoint = `${cleanUrl}/storage/v1/object/${supabaseBucket}/${storagePath}`;

      const res = await fetch(uploadEndpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${supabaseKey}`,
          apikey: supabaseKey,
          'Content-Type': mimeType,
          'x-upsert': 'true',
        },
        body: buffer,
      });

      if (res.ok) {
        const publicUrl = `${cleanUrl}/storage/v1/object/public/${supabaseBucket}/${storagePath}`;
        return {
          url: publicUrl,
          filename: uniqueName,
          size: buffer.length,
          mimeType,
          provider: 'supabase',
        };
      } else {
        const errText = await res.text();
        console.warn(`Supabase storage upload failed (${res.status}): ${errText}. Falling back to local disk.`);
      }
    } catch (err) {
      console.warn('Supabase storage error, falling back to local disk:', err);
    }
  }

  // 2. Check for Cloudinary (Free 25GB tier)
  const cloudinaryCloud = process.env.CLOUDINARY_CLOUD_NAME;
  const cloudinaryPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

  if (cloudinaryCloud && cloudinaryPreset) {
    try {
      const formData = new FormData();
      const blob = new Blob([buffer], { type: mimeType });
      formData.append('file', blob, originalFilename);
      formData.append('upload_preset', cloudinaryPreset);
      formData.append('folder', folder);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryCloud}/auto/upload`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json() as any;
        return {
          url: data.secure_url || data.url,
          filename: uniqueName,
          size: buffer.length,
          mimeType,
          provider: 'cloudinary',
        };
      }
    } catch (err) {
      console.warn('Cloudinary upload error, falling back to local disk:', err);
    }
  }

  // 3. Fallback: Local Disk Storage
  const localTarget = path.join(LOCAL_UPLOADS_DIR, uniqueName);
  await fs.promises.writeFile(localTarget, buffer);

  return {
    url: `/uploads/${uniqueName}`,
    filename: uniqueName,
    size: buffer.length,
    mimeType,
    provider: 'local',
  };
}

/**
 * Delete a media file from storage
 */
export async function deleteMedia(filename: string, folder = 'invitations'): Promise<boolean> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
  const supabaseBucket = process.env.SUPABASE_STORAGE_BUCKET || 'invitation-assets';

  if (supabaseUrl && supabaseKey) {
    try {
      const cleanUrl = supabaseUrl.replace(/\/+$/, '');
      const storagePath = `${folder}/${filename}`;
      const deleteEndpoint = `${cleanUrl}/storage/v1/object/${supabaseBucket}/${storagePath}`;

      await fetch(deleteEndpoint, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${supabaseKey}`,
          apikey: supabaseKey,
        },
      });
      return true;
    } catch (err) {
      console.warn('Supabase delete error:', err);
    }
  }

  // Fallback to local
  try {
    const localTarget = path.join(LOCAL_UPLOADS_DIR, filename);
    if (fs.existsSync(localTarget)) {
      await fs.promises.unlink(localTarget);
    }
    return true;
  } catch {
    return false;
  }
}
