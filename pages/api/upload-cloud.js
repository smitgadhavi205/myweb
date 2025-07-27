import formidable from 'formidable';
import { createStorageAdapter } from '../../lib/storage';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper to convert callback to promise
const parseForm = (req, form) => {
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Initialize the storage adapter
    // In production, you can change this to 's3' or 'gcs' and provide appropriate options
    const storageProvider = process.env.STORAGE_PROVIDER || 'local';
    const storage = createStorageAdapter(storageProvider, {
      // Provider-specific options can be passed here
      baseDir: process.env.UPLOAD_DIR, // For local storage
      bucket: process.env.STORAGE_BUCKET, // For cloud storage
      region: process.env.AWS_REGION, // For S3
    });

    const form = formidable({
      uploadDir: './uploads', // Temporary upload directory
      keepExtensions: true,
      maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // Default: 10MB
    });

    // Parse the form
    const { fields, files } = await parseForm(req, form);

    const file = files.file?.[0];
    const type = fields.type?.[0];

    if (!file || !type) {
      return res.status(400).json({ error: 'File and type are required' });
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({
        error: `Invalid file type: ${file.mimetype}. Only PDF and Word documents are allowed.`
      });
    }

    // Generate a unique filename
    const fileName = `${Date.now()}-${file.originalFilename}`;
    
    // Determine the target directory based on the file type
    const targetDir = type === 'aims' ? 'aims' : 'code';

    // Save the file using the storage adapter
    const savedFile = await storage.saveFile(file, targetDir, fileName);

    res.status(200).json({
      success: true,
      fileId: fileName,
      fileName: file.originalFilename,
      type: type,
      size: file.size,
      path: savedFile.path,
      url: savedFile.url // Cloud storage providers will return a public URL
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'File upload failed', details: error.message });
  }
}