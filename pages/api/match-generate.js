import { matchAimsWithCode, generatePracticalReports } from '../../lib/aiMatcher';

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
    const { aims, codeBlocks, formatOptions } = req.body;
    
    if (!aims || !codeBlocks) {
      return res.status(400).json({ error: 'Aims and code blocks are required' });
    }

    // Match aims with code using AI algorithm
    const matchedPracticals = matchAimsWithCode(aims, codeBlocks);
    
    // Generate formatted reports
    const reports = generatePracticalReports(matchedPracticals, formatOptions);
    
    res.status(200).json({
      success: true,
      matchedPracticals: reports,
      totalMatches: reports.length,
      averageConfidence: reports.reduce((sum, p) => sum + p.confidence, 0) / reports.length
    });

  } catch (error) {
    console.error('Matching error:', error);
    res.status(500).json({ 
      error: 'Failed to match and generate reports', 
      details: error.message 
    });
  }
}