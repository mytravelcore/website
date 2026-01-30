import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { getGCSBucket } from '@/lib/gcs-client';
import { getMimeType } from '@/lib/gcs-upload';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const entityType = formData.get('entityType') as string;
    const entityId = formData.get('entityId') as string;

    if (!file) {
      return NextResponse.json(
        { message: 'No file provided' },
        { status: 400 }
      );
    }

    if (!entityType || !entityId) {
      return NextResponse.json(
        { message: 'Missing entityType or entityId' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedMimes.includes(file.type)) {
      return NextResponse.json(
        { message: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF' },
        { status: 400 }
      );
    }

    // Get file extension
    const fileExtension = path.extname(file.name).toLowerCase();
    const fileName = `${uuidv4()}${fileExtension}`;
    const storagePath = `/${entityType}/${entityId}/${fileName}`;

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to GCS
    const bucket = getGCSBucket();
    const gcsFile = bucket.file(storagePath);

    await gcsFile.save(buffer, {
      metadata: {
        contentType: file.type,
      },
    });

    // Make file public
    await gcsFile.makePublic();

    // Generate public URL
    const bucketName = process.env.GCS_BUCKET_NAME;
    const projectId = process.env.GCP_PROJECT_ID;
    const publicUrl = `https://storage.googleapis.com/${bucketName}${storagePath}`;

    return NextResponse.json(
      {
        publicUrl,
        storagePath,
        fileName,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error uploading image to GCS:', error);
    return NextResponse.json(
      { message: 'Failed to upload image', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
