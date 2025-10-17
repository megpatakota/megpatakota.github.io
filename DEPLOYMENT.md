# Simple Analytics Server Deployment Guide

This guide will help you deploy your analytics system to Vercel so you can collect real visitor data.

## 🚀 Quick Setup

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy Your Project
```bash
# From your project directory
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: megpatakota-analytics (or your choice)
# - Directory: ./
# - Override settings? No
```

### 4. Set Up Custom Domain (Optional)
```bash
# Add your custom domain
vercel domains add megpatakota.co.uk

# Or configure in Vercel dashboard
```

## 📁 Project Structure

Your project now has:
```
├── api/
│   ├── track-view.js      # Receives view data
│   └── get-analytics.js   # Returns analytics data
├── data/
│   └── views.json         # Database (auto-created)
├── package.json           # Dependencies
├── vercel.json           # Vercel configuration
└── [your existing files]
```

## 🔧 How It Works

### View Tracking Flow:
1. **Visitor loads page** → JavaScript sends view data to `/api/track-view`
2. **Server stores data** → Saves to `data/views.json` file
3. **Admin dashboard** → Fetches data from `/api/get-analytics`
4. **Real-time analytics** → Shows all visitor data

### Data Storage:
- **File-based:** Uses JSON file instead of complex database
- **Automatic cleanup:** Keeps only last 10,000 records
- **Privacy-friendly:** No personal data collected
- **Fast:** No database queries needed

## 🌐 URLs After Deployment

### Your Analytics API:
- **Track views:** `https://your-project.vercel.app/api/track-view`
- **Get analytics:** `https://your-project.vercel.app/api/get-analytics`

### Your Website:
- **Main site:** `https://megpatakota.co.uk`
- **Admin dashboard:** `https://megpatakota.co.uk/admin.html`

## 🔒 Security Features

- **Password protection:** Admin dashboard requires password
- **No sensitive data:** Only page views and session IDs
- **Rate limiting:** Built into Vercel
- **HTTPS:** Automatic SSL certificates

## 📊 What You'll See

### In Admin Dashboard:
- **Real visitor counts** from all users
- **Page performance** across your entire site
- **Daily statistics** and trends
- **Unique user tracking** per page

### Data Collected:
- Page visited
- Session ID (anonymous)
- Timestamp
- User agent (browser info)
- IP address (for unique user counting)

## 🛠️ Troubleshooting

### If API calls fail:
1. Check Vercel deployment logs
2. Ensure `data/` directory exists
3. Verify API endpoints are accessible

### If no data appears:
1. Check browser console for errors
2. Verify API URLs are correct
3. Test API endpoints directly

### To update password:
1. Edit `assets/js/dashboard-config.js`
2. Redeploy to Vercel
3. Use new password in admin

## 🔄 Updates

To update your analytics system:
```bash
# Make changes to your code
git add .
git commit -m "Update analytics"
git push origin main

# Redeploy to Vercel
vercel --prod
```

## 📈 Benefits

- **Real visitor data** from all users
- **No external dependencies** (no Google Analytics)
- **Privacy-compliant** (no cookies)
- **Fast and lightweight**
- **Free hosting** on Vercel
- **Easy to maintain**

Your analytics will now show real visitor data from everyone who visits your site!
