import { supabase } from './supabase.js';

async function createBucket() {
  const BUCKET_NAME = 'specialities-images';
  console.log(`Checking/Creating Supabase storage bucket "${BUCKET_NAME}"...`);

  if (!supabase) {
    console.error('Supabase client is not initialized. Please ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are set.');
    return;
  }

  try {
    // 1. Get existing buckets
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    if (listError) {
      console.error('Error listing storage buckets:', listError.message);
      return;
    }

    const existingBucket = buckets.find(b => b.name === BUCKET_NAME || b.id === BUCKET_NAME);
    if (existingBucket) {
      console.log(`Bucket "${BUCKET_NAME}" already exists! Public status:`, existingBucket.public);
      return;
    }

    // 2. Create public storage bucket
    const { data, error } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: 10485760, // 10MB limit
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml']
    });

    if (error) {
      console.error(`Failed to create bucket "${BUCKET_NAME}":`, error.message);
    } else {
      console.log(`Successfully created public storage bucket "${BUCKET_NAME}"!`, data);
    }
  } catch (err) {
    console.error('Unexpected error creating bucket:', err);
  }
}

createBucket();
