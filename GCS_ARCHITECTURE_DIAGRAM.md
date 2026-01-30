# GCS Image Upload - Architecture Diagram

## Upload Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    ADMIN PANEL                              │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Tour Form Modal / Any Admin Form                   │   │
│  │                                                      │   │
│  │  ┌────────────────────────────────────────────────┐ │   │
│  │  │  <ImageUpload                                 │ │   │
│  │  │    entityType="tour"                          │ │   │
│  │  │    entityId={tour.id}                         │ │   │
│  │  │    onImageUpload={(result) => {...}}          │ │   │
│  │  │  />                                           │ │   │
│  │  └────────────────────────────────────────────────┘ │   │
│  │                                                      │   │
│  │  [Drag & Drop Area] [Select File Button]           │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ FormData:
                           │ - file
                           │ - entityType
                           │ - entityId
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                 NEXT.JS API ROUTE                           │
│            /api/upload-image (POST)                         │
│                                                              │
│  1. Receive FormData                                        │
│  2. Validate file type (JPEG, PNG, WebP, GIF)              │
│  3. Validate file size (< 10MB)                            │
│  4. Extract extension from filename                        │
│  5. Generate UUID for storage                              │
│  6. Create storage path: /{type}/{id}/{uuid}.{ext}        │
│  7. Convert file to Buffer                                │
│  8. Upload to GCS                                         │
│  9. Make file public                                      │
│  10. Return public URL                                    │
│                                                              │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ POST with credentials
                           │ Buffer stream
                           ▼
┌─────────────────────────────────────────────────────────────┐
│           GOOGLE CLOUD STORAGE (GCS)                        │
│                                                              │
│  bucket-name/                                              │
│  ├── tour/                                                 │
│  │   ├── {tourId}/                                         │
│  │   │   ├── {uuid1}.jpg  ✓ PUBLIC                        │
│  │   │   ├── {uuid2}.png  ✓ PUBLIC                        │
│  │   │   └── {uuid3}.webp ✓ PUBLIC                        │
│  │   └── {tourId}/                                         │
│  ├── destination/                                          │
│  │   └── {destId}/                                         │
│  ├── activity/                                             │
│  │   └── {activityId}/                                     │
│  └──────────────────────────────────                       │
│                                                              │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ Success Response:
                           │ {
                           │   "publicUrl": "https://...",
                           │   "storagePath": "/tour/...",
                           │   "fileName": "uuid.jpg"
                           │ }
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              FORM COMPONENT (onImageUpload)                │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ result = {                                            │ │
│  │   publicUrl: "https://storage.googleapis.com/...",    │ │
│  │   storagePath: "/tour/{id}/{uuid}.jpg"               │ │
│  │ }                                                     │ │
│  │                                                       │ │
│  │ setValue('hero_image_url', result.publicUrl)         │ │
│  │        ↓                                             │ │
│  │ hero_image_url = "https://storage.googleapis..."     │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ Form submission
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  SUPABASE DATABASE                          │
│                                                              │
│  tours table:                                              │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ id  │ title  │ hero_image_url                       │ │
│  ├─────┼────────┼──────────────────────────────────────┤ │
│  │ xxx │ Tour 1 │ https://storage.googleapis.com/...   │ │
│  │ yyy │ Tour 2 │ https://storage.googleapis.com/...   │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                              │
│  ✅ Store URLs only (not binary files)                    │
│  ✅ Each URL points to public GCS file                    │
│  ✅ No Supabase Storage used                              │
│                                                              │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ Public can access
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  PUBLIC WEBSITE                             │
│                                                              │
│  <img src="https://storage.googleapis.com/..." />           │
│         ↓                                                  │
│    Display on tour page, destinations, etc.               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Component Integration Points

```
┌──────────────────────────────────┐
│   Admin Tour Form Modal          │
│  ┌────────────────────────────┐  │
│  │  Title Input               │  │
│  ├────────────────────────────┤  │
│  │  Description Input         │  │
│  ├────────────────────────────┤  │
│  │  <ImageUpload />           │  │  ← Add here
│  │  (NEW)                     │  │
│  ├────────────────────────────┤  │
│  │  Price Input               │  │
│  ├────────────────────────────┤  │
│  │  [ Save ] [ Cancel ]       │  │
│  └────────────────────────────┘  │
└──────────────────────────────────┘
```

## File Dependency Graph

```
┌─────────────────────────────────┐
│  API Endpoint                   │
│  /api/upload-image/route.ts     │
├─────────────────────────────────┤
│  Imports:                       │
│  ├─ gcs-client.ts ──────┐       │
│  ├─ gcs-upload.ts       │       │
│  └─ path, uuid          │       │
└──────────┬──────────────┘       │
           │                      │
    ┌──────▼──────┐               │
    │ gcs-client  │               │
    └──────┬──────┘               │
           │                      │
           ▼                      │
    Google Cloud Storage SDK      │
                                  │
                                  │
┌─────────────────────────────────┐
│  React Component                │
│  image-upload.tsx               │
├─────────────────────────────────┤
│  Imports:                       │
│  ├─ gcs-upload.ts ──────┐       │
│  ├─ ui/button           │       │
│  └─ lucide-react        │       │
└──────────┬──────────────┘       │
           │                      │
    ┌──────▼──────────┐           │
    │  gcs-upload.ts  │           │
    │  uploadImageToGCS()          │
    │  Calls: /api/upload-image    │
    └─────────────────┘           │
```

## Data Flow - Detailed

```
STEP 1: User Action
┌─────────────────┐
│ User selects    │
│ image file      │
└────────┬────────┘
         │
STEP 2: Validation
┌────────▼────────────────┐
│ Client checks:          │
│ ✓ File type OK?         │
│ ✓ File size < 10MB?     │
│ ✓ File exists?          │
└────────┬────────────────┘
         │
STEP 3: Prepare Upload
┌────────▼────────────────────┐
│ Create FormData:            │
│ - file: File                │
│ - entityType: 'tour'        │
│ - entityId: 'abc-123'       │
└────────┬────────────────────┘
         │
STEP 4: Send to API
┌────────▼────────────────────┐
│ POST /api/upload-image      │
│ Headers: multipart/form-data│
└────────┬────────────────────┘
         │
STEP 5: Server Validation
┌────────▼────────────────────┐
│ Server checks:              │
│ ✓ MIME type                 │
│ ✓ File size                 │
│ ✓ Parameters present        │
└────────┬────────────────────┘
         │
STEP 6: Generate Metadata
┌────────▼────────────────────────────┐
│ - UUID: a1b2c3d4-...               │
│ - Extension: .jpg                   │
│ - Path: /tour/abc-123/a1b2c3d4.jpg │
│ - MIME: image/jpeg                  │
└────────┬────────────────────────────┘
         │
STEP 7: GCS Upload
┌────────▼────────────────────┐
│ Upload to Google Cloud      │
│ Storage with credentials    │
│ Path: /tour/abc-123/...     │
└────────┬────────────────────┘
         │
STEP 8: Make Public
┌────────▼────────────────────┐
│ Run: gcsFile.makePublic()   │
│ Set public read access      │
└────────┬────────────────────┘
         │
STEP 9: Generate Public URL
┌────────▼────────────────────────┐
│ publicUrl:                      │
│ https://storage.googleapis...   │
│ /bucket/tour/abc-123/a1b2c3.jpg │
└────────┬────────────────────────┘
         │
STEP 10: Return Response
┌────────▼────────────────┐
│ JSON Response:          │
│ {                       │
│   publicUrl: "https://",│
│   storagePath: "/tour.."|
│   fileName: "a1b2c3..."│
│ }                       │
└────────┬────────────────┘
         │
STEP 11: Update Form
┌────────▼────────────────┐
│ onImageUpload(result)   │
│ setValue(field, url)    │
│ Show preview            │
│ Enable save button      │
└────────┬────────────────┘
         │
STEP 12: Save to Database
┌────────▼────────────────┐
│ Supabase.from('tours')  │
│ .update({               │
│   hero_image_url: url   │
│ })                      │
└────────────────────────┘
```

## Environment Setup Flow

```
┌──────────────────────────────┐
│  Project Settings            │
│  (Tempo Project Dashboard)   │
│                              │
│  Environment Variables:      │
│  ┌────────────────────────┐  │
│  │ GCS_BUCKET_NAME        │  │
│  │ GCP_PROJECT_ID         │  │
│  │ GCP_CLIENT_EMAIL       │  │
│  │ GCP_SERVICE_ACCOUNT... │  │
│  └────────┬───────────────┘  │
└───────────┼──────────────────┘
            │
            │ Read at runtime
            │
┌───────────▼──────────────────┐
│  src/lib/gcs-client.ts       │
│  initializeGCS()             │
│                              │
│  1. Read GCP_SERVICE_...     │
│  2. Base64 decode            │
│  3. Parse JSON               │
│  4. Create Storage client    │
│  5. Return bucket instance   │
└───────────┬──────────────────┘
            │
            │ Use in API routes
            │
┌───────────▼──────────────────┐
│  /api/upload-image           │
│  - Receive file              │
│  - Upload to bucket          │
│  - Return public URL         │
└──────────────────────────────┘
```
