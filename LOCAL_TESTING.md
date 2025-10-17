# Local Testing Guide

## 🧪 Testing Your Analytics System Locally

### 1. Install Dependencies
```bash
# Install Vercel CLI for local development
npm install -g vercel

# Install local dependencies (if any)
npm install
```

### 2. Start Local Development Server
```bash
# Start Vercel dev server
vercel dev

# This will:
# - Start local server (usually on http://localhost:3000)
# - Serve your static files
# - Run your API functions locally
```

### 3. Test Your API Endpoints

#### Test View Tracking:
```bash
# Test the track-view endpoint
curl -X POST http://localhost:3000/api/track-view \
  -H "Content-Type: application/json" \
  -d '{
    "page": "home",
    "sessionId": "test-session-123",
    "userAgent": "Mozilla/5.0 (test browser)",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }'
```

#### Test Analytics Retrieval:
```bash
# Test the get-analytics endpoint
curl http://localhost:3000/api/get-analytics
```

### 4. Test in Browser

1. **Open your site:** `http://localhost:3000`
2. **Visit different pages** to generate view data
3. **Check admin dashboard:** `http://localhost:3000/admin.html`
4. **Verify data appears** in the dashboard

### 5. Check Data Storage

The analytics data will be stored in:
```
data/views.json
```

You can check this file to see the raw data being collected.

## 🔧 Troubleshooting

### If API calls fail:
1. **Check Vercel dev logs** in terminal
2. **Ensure data directory exists:** `mkdir -p data`
3. **Check file permissions** on data directory

### If no data appears:
1. **Open browser console** and check for errors
2. **Verify API endpoints** are accessible
3. **Check network tab** for failed requests

### Common Issues:

#### "Cannot find module" errors:
```bash
# Make sure you're in the project directory
cd /Users/megpatakota/Desktop/git_projects/megpatakota.github.io

# Restart Vercel dev
vercel dev
```

#### Permission errors:
```bash
# Fix data directory permissions
chmod 755 data/
```

## 📊 Expected Behavior

### Local Testing:
- **View tracking** should work immediately
- **Data storage** in `data/views.json`
- **Admin dashboard** should show local data
- **API endpoints** should return JSON responses

### Production Deployment:
- **Same functionality** as local
- **Persistent data** across deployments
- **Real visitor tracking** from all users

## 🚀 Next Steps

Once local testing works:
1. **Deploy to Vercel:** `vercel --prod`
2. **Update your site** to use production API
3. **Monitor analytics** in admin dashboard

## 📝 Testing Checklist

- [ ] Vercel dev server starts without errors
- [ ] API endpoints respond correctly
- [ ] View tracking works on page load
- [ ] Admin dashboard shows data
- [ ] Data persists in `data/views.json`
- [ ] No console errors in browser
