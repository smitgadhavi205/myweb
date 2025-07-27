export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.status(200).json({ 
    message: 'CodePractical Backend is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
}