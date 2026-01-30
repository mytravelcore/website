import { Storage } from '@google-cloud/storage';

let storageInstance: Storage | null = null;

export function initializeGCS(): Storage {
  if (storageInstance) {
    return storageInstance;
  }

  const serviceAccountBase64 = process.env.GCP_SERVICE_ACCOUNT_BASE64;
  if (!serviceAccountBase64) {
    throw new Error('GCP_SERVICE_ACCOUNT_BASE64 environment variable is not set');
  }

  const serviceAccountJson = Buffer.from(serviceAccountBase64, 'base64').toString('utf-8');
  const serviceAccountKey = JSON.parse(serviceAccountJson);

  storageInstance = new Storage({
    projectId: serviceAccountKey.project_id,
    credentials: serviceAccountKey,
  });

  return storageInstance;
}

export function getGCSBucket() {
  const storage = initializeGCS();
  const bucketName = process.env.GCS_BUCKET_NAME;
  
  if (!bucketName) {
    throw new Error('GCS_BUCKET_NAME environment variable is not set');
  }

  return storage.bucket(bucketName);
}
