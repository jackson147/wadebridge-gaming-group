import { S3Client } from "@aws-sdk/client-s3";
import { env } from "~/env";

export const s3Client = new S3Client({
  endpoint: env.MINIO_ENDPOINT,
  region: env.MINIO_REGION || 'eu-west-1',
  credentials: {
    accessKeyId: env.MINIO_ACCESS_KEY_ID,
    secretAccessKey: env.MINIO_SECRET_ACCESS_KEY,
  },
  // Required for Minio, might not be needed for AWS S3
  forcePathStyle: true,
});