import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

export const uploadToR2 = async (file: Express.Multer.File, folder: string = 'uploads') => {
  const fileName = `${Date.now()}-${file.originalname}`;
  const storageMode = process.env.STORAGE_MODE || 'r2';

  if (storageMode === 'local') {
    const uploadDir = path.join(process.cwd(), process.env.UPLOAD_DIR || 'uploads');
    const folderPath = path.join(uploadDir, folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    
    const filePath = path.join(folderPath, fileName);
    fs.writeFileSync(filePath, file.buffer);
    
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';
    // Use URL class to safely join parts if needed, but manual join is fine for now
    return `${backendUrl}/${process.env.UPLOAD_DIR || 'uploads'}/${folder}/${fileName}`;
  }

  // R2 Storage Logic
  const r2Key = `${folder}/${fileName}`;
  const bucketName = process.env.R2_BUCKET_NAME || '';

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: r2Key,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  try {
    await r2Client.send(command);
    const cdnUrl = process.env.CDN_URL || '';
    return `${cdnUrl}/${r2Key}`;
  } catch (error) {
    console.error('Error uploading to R2:', error);
    throw new Error('Failed to upload file to storage');
  }
};
