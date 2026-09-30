import { supabase } from './supabase.js';

export const REQUIRED_BUCKETS = [
  'hero-banners',
  'specialities-images',
  'Doctors_Imeges',
  'hospital-assets'
];

/**
 * Ensure all required Supabase Storage public buckets exist.
 */
export async function ensureBucketsExist() {
  if (!supabase) return;
  try {
    const { data: buckets, error: listErr } = await supabase.storage.listBuckets();
    if (listErr) {
      console.warn('[Supabase Storage] Warning listing buckets:', listErr.message);
      return;
    }

    const existingNames = new Set((buckets || []).map(b => b.name));

    for (const name of REQUIRED_BUCKETS) {
      if (!existingNames.has(name)) {
        console.log(`[Supabase Storage] Creating missing public bucket "${name}"...`);
        const { error: createErr } = await supabase.storage.createBucket(name, {
          public: true,
          fileSizeLimit: 20971520, // 20MB
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml']
        });
        if (createErr) {
          console.error(`[Supabase Storage] Error creating bucket "${name}":`, createErr.message);
        } else {
          console.log(`[Supabase Storage] Public bucket "${name}" created successfully!`);
        }
      }
    }
  } catch (err) {
    console.error('[Supabase Storage] Error in ensureBucketsExist:', err.message || err);
  }
}

/**
 * Upload base64 image data to a Supabase bucket and return the public URL.
 * @param {string} bucketName Name of the storage bucket
 * @param {string} fileName Original or target file name
 * @param {string} base64Data Base64 string (data:image/...;base64,... or raw base64)
 * @param {string} [folderName] Optional subfolder in bucket
 */
export async function uploadImageToBucket(bucketName, fileName, base64Data, folderName = '') {
  if (!supabase) {
    throw new Error('Supabase client is not initialized');
  }

  // 1. Ensure bucket exists
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucket = (buckets || []).find(b => b.name === bucketName);
  if (!bucket) {
    await supabase.storage.createBucket(bucketName, {
      public: true,
      fileSizeLimit: 20971520,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml']
    });
  }

  // 2. Parse Base64 buffer & Content-Type
  let contentType = 'image/webp';
  let buffer;

  const matches = base64Data.match(/^data:(.+);base64,(.+)$/);
  if (matches && matches.length === 3) {
    contentType = matches[1];
    buffer = Buffer.from(matches[2], 'base64');
  } else {
    buffer = Buffer.from(base64Data, 'base64');
  }

  // 3. Generate clean unique path
  const sanitizedName = (fileName || 'image')
    .toLowerCase()
    .trim()
    .replace(/\.[^/.]+$/, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-');

  const ext = contentType.includes('webp') ? 'webp' :
              contentType.includes('png') ? 'png' :
              contentType.includes('svg') ? 'svg' : 'jpg';

  const datePrefix = Date.now();
  const filePath = folderName
    ? `${folderName}/${sanitizedName}-${datePrefix}.${ext}`
    : `${sanitizedName}-${datePrefix}.${ext}`;

  // 4. Upload binary buffer to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase
    .storage
    .from(bucketName)
    .upload(filePath, buffer, {
      contentType,
      upsert: true
    });

  if (uploadError) {
    console.error(`[Supabase Storage Error] Upload to "${bucketName}" failed:`, uploadError);
    throw new Error(uploadError.message);
  }

  // 5. Retrieve Public Access URL
  const { data: publicUrlData } = supabase
    .storage
    .from(bucketName)
    .getPublicUrl(filePath);

  const publicUrl = publicUrlData?.publicUrl;
  console.log(`[Supabase Storage] Uploaded to bucket "${bucketName}" -> ${publicUrl}`);

  return {
    success: true,
    url: publicUrl,
    path: filePath,
    bucket: bucketName
  };
}
