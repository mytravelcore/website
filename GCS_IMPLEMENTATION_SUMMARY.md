# GCS Image Upload Integration - Implementation Summary

## ✅ Completed Files

### Core Libraries

1. **src/lib/gcs-client.ts**
   - Google Cloud Storage client initialization
   - Service account authentication
   - Bucket instance provider

2. **src/lib/gcs-upload.ts**
   - Upload utilities and helpers
   - Path generation for entities
   - MIME type detection
   - TypeScript interfaces

3. **src/app/api/upload-image/route.ts**
   - Next.js API route: `POST /api/upload-image`
   - FormData processing
   - File validation
   - GCS upload & public access
   - Error handling

### React Components

4. **src/components/admin/image-upload.tsx**
   - Drag-and-drop upload component
   - File validation (client-side)
   - Upload progress indication
   - Success/error states
   - Image preview

### Custom Hooks

5. **src/hooks/use-image-upload.ts**
   - React hook for image upload logic
   - Loading, error, and success states
   - Callbacks support
   - Easy integration in forms

### Demo & Documentation

6. **src/app/admin/image-upload-demo.tsx**
   - Demo component showing usage
   - Two upload examples
   - Uploaded images display
   - Copy URL functionality

7. **GCS_INTEGRATION_GUIDE.md**
   - Complete integration documentation
   - Architecture overview
   - Usage examples
   - Troubleshooting guide

### Database

8. **supabase/migrations/20240220_add_gcs_image_support.sql**
   - Adds image columns to tours table
   - Adds image columns to destinations table
   - Adds image columns to activities table
   - Column documentation

## 🔧 Environment Variables Required

Ensure these are set in your project environment:

```
GCS_BUCKET_NAME              # e.g., "travelcore-images"
GCP_PROJECT_ID               # e.g., "my-project-123"
GCP_CLIENT_EMAIL             # e.g., "service@...iam.gserviceaccount.com"
GCP_SERVICE_ACCOUNT_BASE64   # Base64-encoded service account JSON
```

## 📋 Integration Checklist

### Setup Phase
- [ ] Environment variables configured in project settings
- [ ] GCS bucket created and accessible
- [ ] Service account has write permissions to bucket
- [ ] Run migration: `20240220_add_gcs_image_support.sql`

### Testing Phase
- [ ] Test API route with cURL or Postman
- [ ] Visit demo component at `/admin/image-upload-demo` (if route added)
- [ ] Verify images appear in GCS console
- [ ] Verify public URLs are accessible

### Integration Phase
- [ ] Import ImageUpload component in tour form
- [ ] Wire up entity ID and type
- [ ] Set onImageUpload callback
- [ ] Test end-to-end upload in admin panel
- [ ] Verify images stored in Supabase

### Production Phase
- [ ] Test with real user data
- [ ] Monitor GCS storage costs
- [ ] Set up backup/archive policies
- [ ] Update documentation

## 🚀 Quick Start - Adding to Tour Form

```tsx
// In your tour form modal, after tour is created (has ID):

import ImageUpload from '@/components/admin/image-upload';

// Inside JSX:
{tour && (
  <ImageUpload
    entityType="tour"
    entityId={tour.id}
    onImageUpload={(result) => {
      setValue('hero_image_url', result.publicUrl);
    }}
    label="Upload Hero Image"
    maxSize={10}
  />
)}
```

## 💡 Usage Examples

### Simple Upload Component
```tsx
<ImageUpload
  entityType="tour"
  entityId={tourId}
  onImageUpload={(result) => console.log(result.publicUrl)}
/>
```

### Using Hook in Custom Component
```tsx
import { useImageUpload } from '@/hooks/use-image-upload';

function MyComponent() {
  const { upload, isLoading, uploadedUrl } = useImageUpload({
    entityType: 'destination',
    entityId: destId,
  });

  return (
    <button onClick={() => {
      const file = /* get file */;
      upload(file);
    }}>
      Upload
    </button>
  );
}
```

### Manual Upload with Client Function
```tsx
import { uploadImageToGCS } from '@/lib/gcs-upload';

const result = await uploadImageToGCS({
  file: imageFile,
  entityType: 'tour',
  entityId: tourId,
});

console.log(result.publicUrl); // Use this in your app
```

## 📁 File Storage Structure in GCS

Images are organized by entity type and ID:

```
bucket-name/
├── tour/
│   ├── 550e8400-e29b-41d4-a716-446655440000/
│   │   ├── a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg
│   │   ├── b2c3d4e5-f678-9012-bcde-f01234567891.png
│   │   └── ...
│   └── ...
├── destination/
│   ├── 123e4567-e89b-12d3-a456-426614174000/
│   │   ├── f5e6d7c8-b9a0-1234-5678-9abcdef01234.jpg
│   │   └── ...
│   └── ...
└── activity/
    ├── 987f6543-e21b-01c2-b345-123456789abc/
    │   ├── 12345678-90ab-cdef-ghij-klmnopqrstuv.jpg
    │   └── ...
    └── ...
```

## 🔒 Security Notes

1. **Authentication**: Service account only (not API key)
2. **Authorization**: GCP IAM policies control access
3. **Validation**: File type & size checked on client & server
4. **Public Access**: Files are publicly readable (configurable)
5. **CORS**: API route has CORS headers enabled

## 📊 API Response Format

```json
{
  "publicUrl": "https://storage.googleapis.com/bucket-name/tour/id/uuid.jpg",
  "storagePath": "/tour/id/uuid.jpg",
  "fileName": "uuid.jpg"
}
```

## ⚙️ Configuration Options

### ImageUpload Component Props
```tsx
interface ImageUploadProps {
  entityType: 'tour' | 'activity' | 'destination';
  entityId: string;
  onImageUpload: (result: UploadResult) => void;
  maxSize?: number;        // in MB, default 10
  label?: string;          // default 'Upload image'
}
```

### useImageUpload Hook Options
```tsx
interface UseImageUploadOptions {
  entityType: EntityType;
  entityId: string;
  onSuccess?: (result) => void;
  onError?: (error) => void;
}
```

## 🧪 Testing

### Manual cURL Test
```bash
curl -X POST http://localhost:3000/api/upload-image \
  -F "file=@/path/to/test.jpg" \
  -F "entityType=tour" \
  -F "entityId=test-id-123"
```

### Browser Console Test
```javascript
const formData = new FormData();
formData.append('file', imageFile);
formData.append('entityType', 'tour');
formData.append('entityId', 'test-123');

const response = await fetch('/api/upload-image', {
  method: 'POST',
  body: formData,
});

const result = await response.json();
console.log(result.publicUrl);
```

## 📦 Dependencies

All required packages are already installed:
- `@google-cloud/storage` - GCS SDK
- `uuid` - Unique file naming
- `next` - Framework

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "GCP_SERVICE_ACCOUNT_BASE64 not set" | Set environment variable in project settings |
| "File too large" | Increase maxSize prop or check GCS bucket quotas |
| "Invalid MIME type" | Only JPEG, PNG, WebP, GIF allowed |
| "403 Forbidden" | Check GCS bucket permissions for service account |
| "Slow uploads" | Normal for large files; check network |

## 📚 Additional Resources

- [Google Cloud Storage Docs](https://cloud.google.com/storage/docs)
- [GCS Node.js Client](https://cloud.google.com/nodejs/docs/reference/storage)
- [Service Account Setup](https://cloud.google.com/docs/authentication/getting-started)

## 🚀 Next Steps

1. Set up environment variables
2. Run database migration
3. Test API endpoint
4. Integrate ImageUpload component in admin forms
5. Deploy to production

---

**Created**: February 2024  
**Version**: 1.0  
**Status**: Ready for Integration
