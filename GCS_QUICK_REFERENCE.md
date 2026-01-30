# GCS Image Upload - Quick Reference

## 📌 For Admins / Project Setup

### 1. Environment Variables
```
GCS_BUCKET_NAME
GCP_PROJECT_ID
GCP_CLIENT_EMAIL
GCP_SERVICE_ACCOUNT_BASE64
```

### 2. Database Migration
```bash
# Run the migration to add image columns
npm run migrate -- supabase/migrations/20240220_add_gcs_image_support.sql
```

### 3. Test Upload
Visit `/admin/image-upload-demo` or test with:
```bash
curl -X POST http://localhost:3000/api/upload-image \
  -F "file=@image.jpg" \
  -F "entityType=tour" \
  -F "entityId=demo-tour-123"
```

---

## 💻 For Developers - Using in Components

### Option 1: Simple Component (Easiest)
```tsx
import ImageUpload from '@/components/admin/image-upload';

<ImageUpload
  entityType="tour"
  entityId={tourId}
  onImageUpload={(result) => {
    // result.publicUrl - ready to store in DB
    setValue('hero_image_url', result.publicUrl);
  }}
  label="Upload Tour Image"
/>
```

### Option 2: Using Hook (More Control)
```tsx
import { useImageUpload } from '@/hooks/use-image-upload';

const { upload, isLoading, error, uploadedUrl } = useImageUpload({
  entityType: 'tour',
  entityId: tourId,
  onSuccess: (result) => console.log('Done!', result.publicUrl),
});

// Then call:
await upload(fileFromInput);

// Display result:
{uploadedUrl && <img src={uploadedUrl} />}
```

### Option 3: Direct Function (Advanced)
```tsx
import { uploadImageToGCS } from '@/lib/gcs-upload';

const result = await uploadImageToGCS({
  file,
  entityType: 'destination',
  entityId: destId,
});

// result.publicUrl is ready to use
```

---

## 🎯 Integration Points

### In Tour Form (tour-form-modal.tsx)
```tsx
// After imports add:
import ImageUpload from '@/components/admin/image-upload';

// In JSX (only show when tour exists and has ID):
{tour && (
  <ImageUpload
    entityType="tour"
    entityId={tour.id}
    onImageUpload={(result) => setValue('hero_image_url', result.publicUrl)}
    label="Upload Hero Image"
  />
)}
```

### In Destination Form
```tsx
<ImageUpload
  entityType="destination"
  entityId={destinationId}
  onImageUpload={(result) => setImageUrl(result.publicUrl)}
/>
```

### In Activity Form
```tsx
<ImageUpload
  entityType="activity"
  entityId={activityId}
  onImageUpload={(result) => updateGalleryUrls(result.publicUrl)}
/>
```

---

## 📂 What Gets Stored

### In GCS (Binary Files)
```
/tour/{tourId}/{uuid}.jpg
/destination/{destId}/{uuid}.png
/activity/{activityId}/{uuid}.webp
```

### In Supabase (URLs Only)
```json
{
  "hero_image_url": "https://storage.googleapis.com/...",
  "gallery_image_urls": ["https://storage.googleapis.com/...", "..."],
  "hero_image_storage_path": "/tour/{id}/{uuid}.jpg"
}
```

---

## ✅ Validation

**Automatic checks:**
- File type: JPEG, PNG, WebP, GIF only
- File size: Default 10MB max (configurable)
- Client-side: Instant feedback
- Server-side: Double validation

---

## 🔗 Useful Files

| File | Purpose |
|------|---------|
| `src/lib/gcs-client.ts` | GCS initialization |
| `src/lib/gcs-upload.ts` | Upload helpers |
| `src/app/api/upload-image/route.ts` | Upload endpoint |
| `src/components/admin/image-upload.tsx` | UI component |
| `src/hooks/use-image-upload.ts` | React hook |
| `GCS_INTEGRATION_GUIDE.md` | Full documentation |
| `GCS_IMPLEMENTATION_SUMMARY.md` | Implementation details |

---

## 🚨 Common Mistakes

❌ **Don't:**
- Use Supabase Storage (use GCS instead)
- Store binary files in Supabase (URLs only)
- Hardcode credentials (use env vars)
- Forget entity ID (upload won't work)

✅ **Do:**
- Use environment variables
- Set entity type & ID before uploading
- Handle error states
- Show upload progress

---

## 📊 API Endpoint

### POST /api/upload-image

**Request:**
```
FormData:
  - file: File
  - entityType: 'tour' | 'activity' | 'destination'
  - entityId: string (UUID or ID)
```

**Response (200):**
```json
{
  "publicUrl": "https://storage.googleapis.com/...",
  "storagePath": "/tour/id/uuid.jpg",
  "fileName": "uuid.jpg"
}
```

**Error (400/500):**
```json
{
  "message": "Error description",
  "error": "Technical details"
}
```

---

## 🧪 Test Checklist

- [ ] Files upload successfully to GCS
- [ ] Public URLs are accessible
- [ ] Files appear in correct folder structure
- [ ] Metadata (MIME type) preserved
- [ ] Error handling works
- [ ] File validation works
- [ ] Large files handle correctly
- [ ] Invalid files rejected

---

## 📈 Performance Tips

1. **Optimize images before upload**
   - Compress JPEG/PNG
   - Use WebP where possible
   - Resize large images

2. **Show progress**
   - Component handles this automatically
   - Consider adding progress bar for UX

3. **Batch uploads**
   - Use Promise.all() for multiple files
   - Monitor bandwidth

---

## 🆘 Getting Help

1. Check **GCS_INTEGRATION_GUIDE.md** for detailed docs
2. Check **GCS_IMPLEMENTATION_SUMMARY.md** for architecture
3. Review component props/types in code
4. Test with demo component at `/admin/image-upload-demo`

---

**Version**: 1.0  
**Last Updated**: February 2024  
**Status**: Production Ready
