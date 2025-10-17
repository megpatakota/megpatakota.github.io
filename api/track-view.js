// Vercel API endpoint: /api/track-view
// This endpoint receives view data and stores it in a JSON file

import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { page, sessionId, userAgent, timestamp } = req.body;

    // Validate required fields
    if (!page || !sessionId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get client IP (for unique user tracking)
    const clientIP = req.headers['x-forwarded-for'] || 
                    req.headers['x-real-ip'] || 
                    req.connection.remoteAddress || 
                    'unknown';

    // Create view record
    const viewRecord = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      page,
      sessionId,
      userAgent: userAgent || 'unknown',
      ip: clientIP,
      timestamp: timestamp || new Date().toISOString(),
      date: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
    };

    // Read existing data
    const dataPath = path.join(process.cwd(), 'data', 'views.json');
    let views = [];

    try {
      if (fs.existsSync(dataPath)) {
        const fileContent = fs.readFileSync(dataPath, 'utf8');
        views = JSON.parse(fileContent);
      }
    } catch (error) {
      console.error('Error reading views file:', error);
      views = [];
    }

    // Add new view
    views.push(viewRecord);

    // Keep only last 10,000 records to prevent file from getting too large
    if (views.length > 10000) {
      views = views.slice(-10000);
    }

    // Write back to file
    try {
      // Ensure data directory exists
      const dataDir = path.dirname(dataPath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      fs.writeFileSync(dataPath, JSON.stringify(views, null, 2));
    } catch (error) {
      console.error('Error writing views file:', error);
      return res.status(500).json({ error: 'Failed to save view data' });
    }

    // Return success
    res.status(200).json({ 
      success: true, 
      message: 'View tracked successfully',
      viewId: viewRecord.id
    });

  } catch (error) {
    console.error('Error tracking view:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
