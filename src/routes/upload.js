import express from 'express';
import { uploadImageToBucket, REQUIRED_BUCKETS } from '../utils/supabaseStorage.js';

const router = express.Router();

// POST /api/upload - Upload base64 image to a Supabase Storage Bucket
router.post('/', async (req, res, next) => {
  try {
    const { fileName, base64Data, bucketName = 'patient-corner-images', folderName = '' } = req.body;

    if (!base64Data) {
      return res.status(400).json({ success: false, error: 'base64Data is required' });
    }

    let targetBucket = bucketName;
    if (targetBucket === 'patient-coner-images' || targetBucket === 'patient-corner-images') {
      targetBucket = 'patient-corner-images';
    } else if (!REQUIRED_BUCKETS.includes(targetBucket)) {
      targetBucket = 'patient-corner-images';
    }

    const result = await uploadImageToBucket(targetBucket, fileName || 'upload', base64Data, folderName);

    return res.json({
      success: true,
      url: result.url,
      path: result.path,
      bucket: result.bucket
    });
  } catch (err) {
    console.error('[API Upload Error]:', err.message);
    res.status(500).json({ success: false, error: err.message || 'Failed to upload image to Supabase storage' });
  }
});

export default router;
