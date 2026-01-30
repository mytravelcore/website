# Google Cloud Storage (GCS) Image Upload Integration

This document outlines the Google Cloud Storage integration for the TravelCore platform, handling all image uploads from the admin panel exclusively through GCS.

## Architecture Overview

### Storage Provider
- **Primary**: Google Cloud Storage (GCS)
- **Secondary Database**: Supabase (stores only URLs and metadata)
- **Supabase Storage**: NOT USED

### Environment Variables Required
```
GCS_BUCKET_NAME         # GCS bucket name
GCP_PROJECT_ID          # GCP project ID
GCP_CLIENT_EMAIL        # Service account email
GCP_SERVICE_ACCOUNT_BASE64  # Base64-encoded service account JSON
```

## File Structure

### Created Files

1. **src/lib/gcs-client.ts**
   - Initializes Google Cloud Storage SDK
   - Authenticates using service account credentials
   - Provides bucket instance

2. **src/lib/gcs-upload.ts**
   - Upload utilities and helpers
   - Path generation for entities (tour | activity | destination)
   - MIME type detection

3. **src/app/api/upload-image/route.ts**
   - Next.js API route for file uploads
   - Handles FormData from client
   - Uploads to GCS and returns public URL
   - File validation (type, size)

4. **src/components/admin/image-upload.tsx**
   - React component for drag-and-drop uploads
   - Shows upload progress
   - Displays preview on success
   - Client-side validation

## Upload Flow

### 1. Admin Panel Upload
```
Admin selects image file
    ↓
ImageUpload component validates file
    ↓
POST /api/upload-image (FormData)
    ↓
API route receives file + entityType + entityId
    ↓
Uploads to GCS: /{entityType}/{entityId}/{uuid}.{ext}
    ↓
Makes file publicly accessible
    ↓
Returns { publicUrl, storagePath, fileName }
    ↓
publicUrl stored in Supabase
```

### 2. Storage Path Format
```
/{entity_type}/{entity_id}/{uuid}.{extension}

Examples:
/tour/550e8400-e29b-41d4-a716-446655440000/a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg
/destination/123e4567-e89b-12d3-a456-426614174000/f5e6d7c8-b9a0-1234-5678-9abcdef01234.png
/activity/987f6543-e21b-01c2-b345-123456789abc/12345678-90ab-cdef-ghij-klmnopqrstuv.webp
```

### 3. Public URL Format
```
https://storage.googleapis.com/{BUCKET_NAME}/{storage_path}

Example:
https://storage.googleapis.com/travelcore-images/tour/550e8400-e29b-41d4-a716-446655440000/a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg
```

## Usage Guide

### In Tour Form Modal

```tsx
import ImageUpload from '@/components/admin/image-upload';

// When editing a tour (tour exists and has ID):
{tour && (
  <ImageUpload
    entityType="tour"
    entityId={tour.id}
    onImageUpload={(result) => {
      // result.publicUrl - use this to store in database
      setValue('hero_image_url', result.publicUrl);
    }}
    label="Upload Hero Image"
    maxSize={10} // 10MB limit
  />
)}
```

### In Other Components

```tsx
import { uploadImageToGCS } from '@/lib/gcs-upload';

const handleUpload = async (file: File) => {
  try {
    const result = await uploadImageToGCS({
      file,
      entityType: 'destination',
      entityId: destinationId,
    });
    
    console.log(result.publicUrl); // Use this in your app
    console.log(result.storagePath); // Store in DB if needed
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

## Database Schema

When storing image URLs in Supabase, use these fields:

```sql
-- Tours table (example)
ALTER TABLE tours ADD COLUMN IF NOT EXISTS hero_image_url TEXT; -- Public GCS URL
ALTER TABLE tours ADD COLUMN IF NOT EXISTS gallery_image_urls TEXT[]; -- Array of GCS URLs
ALTER TABLE tours ADD COLUMN IF NOT EXISTS hero_image_storage_path TEXT; -- Internal GCS path

-- Destinations table (example)
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS image_url TEXT; -- Public GCS URL
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS image_storage_path TEXT; -- Internal GCS path
```

## Constraints & Rules

1. ✅ **Always use GCS** - Supabase Storage must NOT be used
2. ✅ **Public URLs only** - Files are made publicly accessible
3. ✅ **Store URLs in Supabase** - Only URLs and metadata in database
4. ✅ **Service account auth** - Uses decoded GCP_SERVICE_ACCOUNT_BASE64
5. ✅ **Path naming** - Follow `/{entity_type}/{entity_id}/{uuid}.{ext}` pattern
6. ❌ **Never store binary** - Binary files not stored in Supabase
7. ❌ **No hardcoded credentials** - All from environment variables

## Error Handling

The ImageUpload component handles:
- File size validation
- File type validation
- Network errors
- GCS errors
- User-friendly error messages

API route validation:
- MIME type checking
- File size limits
- Missing parameters
- GCS upload failures

## Testing

### Test Upload
```bash
curl -X POST http://localhost:3000/api/upload-image \
  -F "file=@/path/to/image.jpg" \
  -F "entityType=tour" \
  -F "entityId=test-tour-id"

# Should return:
# {
#   "publicUrl": "https://storage.googleapis.com/...",
#   "storagePath": "/tour/test-tour-id/uuid.jpg",
#   "fileName": "uuid.jpg"
# }
```

## Performance Notes

- Files are streamed directly to GCS
- No local file system usage
- Automatic CORS headers in API route
- Files made public immediately after upload
- Optimistic UI updates while uploading

## Security

- Service account authentication (not API key)
- File type validation on client and server
- Size limits enforced
- CORS headers configured properly
- Public read access only (configurable)

## Migration Guide

If migrating from Supabase Storage:

1. Export existing URLs from Supabase Storage
2. Download files from Supabase Storage
3. Upload to GCS using bulk upload script
4. Update database URLs to GCS public URLs
5. Remove from Supabase Storage

```sql
-- Update existing URLs pattern example:
UPDATE tours 
SET hero_image_url = 'https://storage.googleapis.com/bucket-name/' || hero_image_url
WHERE hero_image_url LIKE '%supabase%';
```

## Troubleshooting

### "GCP_SERVICE_ACCOUNT_BASE64 not set"
- Set environment variable in project settings
- Check base64 encoding is correct

### "Failed to upload image"
- Check file size (default 10MB max)
- Verify file MIME type (JPEG, PNG, WebP, GIF)
- Check GCS bucket name in env vars
- Verify service account has write permissions

### "URL not public"
- Component should call `makePublic()` automatically
- Check GCS bucket policies
- Verify service account has public access permissions

### Long upload times
- Normal for large files (100+ MB)
- Check network speed
- Consider file compression before upload
