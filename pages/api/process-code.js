import { extractTextFromFile, extractCodeFromText } from '../../lib/textExtractors';
import path from 'path';

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
    const { fileId } = req.body;
    
    if (!fileId) {
      return res.status(400).json({ error: 'File ID is required' });
    }

    // Construct file path
    const filePath = path.join(process.cwd(), 'uploads', 'code', fileId);
    
    // Extract text from file
    const text = await extractTextFromFile(filePath);
    
    // Extract code blocks from text
    const codeBlocks = extractCodeFromText(text);
    
    res.status(200).json({
      success: true,
      codeBlocks: codeBlocks,
      totalBlocks: codeBlocks.length,
      extractedText: text.substring(0, 500) + '...' // Preview
    });

  } catch (error) {
    console.error('Code processing error:', error);
    res.status(500).json({ 
      error: 'Failed to process code document', 
      details: error.message 
    });
  }
}