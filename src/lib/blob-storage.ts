import { put, del, head } from '@vercel/blob';

export interface UploadResult {
  url: string;
  pathname: string;
  fileName: string;
}

export interface StorageError {
  message: string;
  statusCode?: number;
}

/**
 * Upload a file to Vercel Blob
 */
export async function uploadFile(
  file: File,
  folder: string = 'assets'
): Promise<UploadResult> {
  try {
    // Create a unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}-${sanitizedName}`;
    const pathname = `${folder}/${fileName}`;

    // Upload to Vercel Blob
    const blob = await put(pathname, file, {
      access: 'public',
      addRandomSuffix: false, // We're already adding timestamp
    });

    return {
      url: blob.url,
      pathname: blob.pathname,
      fileName: file.name
    };
  } catch (error) {
    console.error('Error uploading file to Vercel Blob:', error);
    throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Delete a file from Vercel Blob
 */
export async function deleteFile(url: string): Promise<void> {
  try {
    await del(url);
  } catch (error) {
    console.error('Error deleting file from Vercel Blob:', error);
    throw new Error(`Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get file info from Vercel Blob
 */
export async function getFileInfo(url: string) {
  try {
    const info = await head(url);
    return info;
  } catch (error) {
    console.error('Error getting file info from Vercel Blob:', error);
    throw new Error(`Failed to get file info: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Validate file before upload
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file size (10MB max)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 10MB' };
  }

  // Check file type
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/quicktime',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/markdown'
  ];

  if (!allowedTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: 'File type not allowed. Allowed types: PDF, JPG, PNG, GIF, WebP, MP4, MOV, DOC, DOCX, TXT, MD' 
    };
  }

  return { valid: true };
}

/**
 * Get file type category for organizing uploads
 */
export function getFileCategory(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'images';
  if (mimeType.startsWith('video/')) return 'videos';
  if (mimeType === 'application/pdf') return 'documents';
  if (mimeType.includes('word') || mimeType.includes('document')) return 'documents';
  if (mimeType.startsWith('text/')) return 'documents';
  return 'general';
}

/**
 * Extract filename from Vercel Blob URL
 */
export function extractFilenameFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    // Extract filename from pathname (e.g., /assets/images/123456-filename.jpg)
    const parts = pathname.split('/');
    return parts[parts.length - 1] || null;
  } catch (error) {
    console.error('Error extracting filename from URL:', error);
    return null;
  }
}
