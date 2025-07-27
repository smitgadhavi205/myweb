/**
 * Storage Adapter for File Uploads
 * 
 * This module provides a unified interface for file storage operations,
 * supporting both local filesystem and cloud storage providers.
 * 
 * Usage:
 * 1. Configure the storage provider in your environment variables
 * 2. Import and use the appropriate storage adapter in your API routes
 */

import fs from 'fs';
import path from 'path';

/**
 * Local File System Storage Adapter
 */
class LocalFileStorage {
  constructor(options = {}) {
    this.baseDir = options.baseDir || path.join(process.cwd(), 'uploads');
    this.ensureDirectoryExists(this.baseDir);
  }

  /**
   * Ensure a directory exists
   * @param {string} dir - Directory path
   */
  ensureDirectoryExists(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  /**
   * Save a file to the local filesystem
   * @param {Object} file - File object from formidable
   * @param {string} targetDir - Target directory relative to baseDir
   * @param {string} fileName - Name to save the file as
   * @returns {Promise<Object>} - File metadata
   */
  async saveFile(file, targetDir, fileName) {
    const fullTargetDir = path.join(this.baseDir, targetDir);
    this.ensureDirectoryExists(fullTargetDir);
    
    const targetPath = path.join(fullTargetDir, fileName);
    fs.renameSync(file.filepath, targetPath);
    
    return {
      filename: fileName,
      originalName: file.originalFilename,
      size: file.size,
      type: file.mimetype,
      path: targetPath,
      url: `/uploads/${targetDir}/${fileName}` // Note: This URL may not be accessible in production
    };
  }

  /**
   * Get a file from the local filesystem
   * @param {string} filePath - Path to the file relative to baseDir
   * @returns {Promise<Object>} - File data and metadata
   */
  async getFile(filePath) {
    const fullPath = path.join(this.baseDir, filePath);
    
    if (!fs.existsSync(fullPath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    const data = fs.readFileSync(fullPath);
    const stats = fs.statSync(fullPath);
    
    return {
      data,
      size: stats.size,
      lastModified: stats.mtime
    };
  }

  /**
   * Delete a file from the local filesystem
   * @param {string} filePath - Path to the file relative to baseDir
   * @returns {Promise<boolean>} - True if successful
   */
  async deleteFile(filePath) {
    const fullPath = path.join(this.baseDir, filePath);
    
    if (!fs.existsSync(fullPath)) {
      return false;
    }
    
    fs.unlinkSync(fullPath);
    return true;
  }
}

/**
 * S3 Storage Adapter (placeholder - implement with AWS SDK)
 */
class S3Storage {
  constructor(options = {}) {
    // This is a placeholder. In a real implementation, you would:
    // 1. Import the AWS SDK
    // 2. Configure the S3 client with credentials
    // 3. Set up bucket and region information
    this.bucket = options.bucket || process.env.AWS_S3_BUCKET;
    this.region = options.region || process.env.AWS_REGION;
  }

  async saveFile(file, targetDir, fileName) {
    // Placeholder for S3 implementation
    throw new Error('S3Storage not implemented. Install AWS SDK and configure credentials.');
  }

  async getFile(filePath) {
    // Placeholder for S3 implementation
    throw new Error('S3Storage not implemented. Install AWS SDK and configure credentials.');
  }

  async deleteFile(filePath) {
    // Placeholder for S3 implementation
    throw new Error('S3Storage not implemented. Install AWS SDK and configure credentials.');
  }
}

/**
 * Google Cloud Storage Adapter (placeholder - implement with Google Cloud Storage SDK)
 */
class GCStorage {
  constructor(options = {}) {
    // This is a placeholder. In a real implementation, you would:
    // 1. Import the Google Cloud Storage SDK
    // 2. Configure the client with credentials
    // 3. Set up bucket information
    this.bucket = options.bucket || process.env.GOOGLE_CLOUD_BUCKET;
    this.projectId = options.projectId || process.env.GOOGLE_CLOUD_PROJECT_ID;
  }

  async saveFile(file, targetDir, fileName) {
    // Placeholder for Google Cloud Storage implementation
    throw new Error('GCStorage not implemented. Install Google Cloud Storage SDK and configure credentials.');
  }

  async getFile(filePath) {
    // Placeholder for Google Cloud Storage implementation
    throw new Error('GCStorage not implemented. Install Google Cloud Storage SDK and configure credentials.');
  }

  async deleteFile(filePath) {
    // Placeholder for Google Cloud Storage implementation
    throw new Error('GCStorage not implemented. Install Google Cloud Storage SDK and configure credentials.');
  }
}

/**
 * Factory function to create the appropriate storage adapter
 * @param {string} provider - Storage provider ('local', 's3', 'gcs')
 * @param {Object} options - Provider-specific options
 * @returns {Object} - Storage adapter instance
 */
function createStorageAdapter(provider = 'local', options = {}) {
  switch (provider.toLowerCase()) {
    case 's3':
      return new S3Storage(options);
    case 'gcs':
    case 'google':
      return new GCStorage(options);
    case 'local':
    default:
      return new LocalFileStorage(options);
  }
}

export {
  createStorageAdapter,
  LocalFileStorage,
  S3Storage,
  GCStorage
};