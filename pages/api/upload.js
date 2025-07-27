import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

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
    const form = formidable({
      uploadDir: './uploads',
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
    });

    // Ensure upload directories exist
    const aimsDir = path.join(process.cwd(), 'uploads', 'aims');
    const codeDir = path.join(process.cwd(), 'uploads', 'code');

    if (!fs.existsSync(aimsDir)) fs.mkdirSync(aimsDir, { recursive: true });
    if (!fs.existsSync(codeDir)) fs.mkdirSync(codeDir, { recursive: true });

    // ⛳ FIXED: Parse form properly
    const { fields, files } = await parseForm(req, form);

    const file = files.file?.[0];
    const type = fields.type?.[0];

    if (!file || !type) {
      return res.status(400).json({ error: 'File and type are required' });
    }

    const fileName = `${Date.now()}-${file.originalFilename}`;
    const targetDir = type === 'aims' ? aimsDir : codeDir;
    const targetPath = path.join(targetDir, fileName);

    fs.renameSync(file.filepath, targetPath);

    res.status(200).json({
      success: true,
      fileId: fileName,
      fileName: file.originalFilename,
      type: type,
      size: file.size,
      path: targetPath
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'File upload failed', details: error.message });
  }
}
