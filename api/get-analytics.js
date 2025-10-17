// Vercel API endpoint: /api/get-analytics
// This endpoint returns analytics data for the admin dashboard

import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Read views data
    const dataPath = path.join(process.cwd(), 'data', 'views.json');
    let views = [];

    try {
      if (fs.existsSync(dataPath)) {
        const fileContent = fs.readFileSync(dataPath, 'utf8');
        views = JSON.parse(fileContent);
      }
    } catch (error) {
      console.error('Error reading views file:', error);
      return res.status(500).json({ error: 'Failed to read analytics data' });
    }

    // Process analytics data
    const analytics = processAnalytics(views);

    res.status(200).json(analytics);

  } catch (error) {
    console.error('Error getting analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

function processAnalytics(views) {
  // Group by page
  const pageStats = {};
  const uniqueUsers = new Set();
  const dailyStats = {};

  views.forEach(view => {
    const page = view.page;
    
    // Initialize page stats
    if (!pageStats[page]) {
      pageStats[page] = {
        totalViews: 0,
        uniqueUsers: new Set(),
        firstView: view.timestamp,
        lastView: view.timestamp
      };
    }

    // Update page stats
    pageStats[page].totalViews++;
    pageStats[page].uniqueUsers.add(view.sessionId);
    
    // Update first and last view timestamps
    const currentFirst = new Date(pageStats[page].firstView);
    const currentLast = new Date(pageStats[page].lastView);
    const viewTime = new Date(view.timestamp);
    
    if (viewTime < currentFirst) {
      pageStats[page].firstView = view.timestamp;
    }
    if (viewTime > currentLast) {
      pageStats[page].lastView = view.timestamp;
    }

    // Track unique users globally
    uniqueUsers.add(view.sessionId);

    // Daily stats
    const date = view.date;
    if (!dailyStats[date]) {
      dailyStats[date] = { views: 0, users: new Set() };
    }
    dailyStats[date].views++;
    dailyStats[date].users.add(view.sessionId);
  });

  // Convert Sets to counts and format data
  const formattedPageStats = {};
  Object.keys(pageStats).forEach(page => {
    formattedPageStats[page] = {
      totalViews: pageStats[page].totalViews,
      uniqueUsers: pageStats[page].uniqueUsers.size,
      firstView: pageStats[page].firstView,
      lastView: pageStats[page].lastView
    };
  });

  // Format daily stats
  const formattedDailyStats = {};
  Object.keys(dailyStats).forEach(date => {
    formattedDailyStats[date] = {
      views: dailyStats[date].views,
      uniqueUsers: dailyStats[date].users.size
    };
  });

  // Calculate totals
  const totalViews = views.length;
  const totalUniqueUsers = uniqueUsers.size;

  return {
    pages: formattedPageStats,
    dailyStats: formattedDailyStats,
    totals: {
      totalViews,
      totalUniqueUsers,
      totalPages: Object.keys(pageStats).length
    },
    lastUpdated: new Date().toISOString()
  };
}
