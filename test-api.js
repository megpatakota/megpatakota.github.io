// Simple test script for API endpoints
// Run with: node test-api.js

const testAPI = async () => {
  const baseURL = 'http://localhost:3000';
  
  console.log('🧪 Testing Analytics API...\n');
  
  try {
    // Test 1: Track a view
    console.log('1. Testing view tracking...');
    const trackResponse = await fetch(`${baseURL}/api/track-view`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page: 'home',
        sessionId: 'test-session-' + Date.now(),
        userAgent: 'Test Browser',
        timestamp: new Date().toISOString()
      })
    });
    
    if (trackResponse.ok) {
      const trackData = await trackResponse.json();
      console.log('✅ View tracking successful:', trackData);
    } else {
      console.log('❌ View tracking failed:', trackResponse.status);
    }
    
    // Test 2: Get analytics
    console.log('\n2. Testing analytics retrieval...');
    const analyticsResponse = await fetch(`${baseURL}/api/get-analytics`);
    
    if (analyticsResponse.ok) {
      const analyticsData = await analyticsResponse.json();
      console.log('✅ Analytics retrieval successful:');
      console.log('   Total views:', analyticsData.totals?.totalViews || 0);
      console.log('   Total users:', analyticsData.totals?.totalUniqueUsers || 0);
      console.log('   Pages tracked:', Object.keys(analyticsData.pages || {}).length);
    } else {
      console.log('❌ Analytics retrieval failed:', analyticsResponse.status);
    }
    
    console.log('\n🎉 API testing complete!');
    
  } catch (error) {
    console.log('❌ Error testing API:', error.message);
    console.log('\n💡 Make sure Vercel dev server is running:');
    console.log('   vercel dev');
  }
};

// Run the test
testAPI();
