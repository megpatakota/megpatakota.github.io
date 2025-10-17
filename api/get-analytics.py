import json
import os
from datetime import datetime
from http.server import BaseHTTPRequestHandler

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            # File path for reading data
            data_path = '/tmp/views.json'
            
            # Read views data
            views = []
            if os.path.exists(data_path):
                try:
                    with open(data_path, 'r') as f:
                        views = json.load(f)
                except (json.JSONDecodeError, FileNotFoundError):
                    views = []
            
            # Process analytics
            analytics = self.process_analytics(views)
            
            # Send response
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            
            self.wfile.write(json.dumps(analytics).encode())
            
        except Exception as e:
            print(f"Error getting analytics: {str(e)}")
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'Internal server error'}).encode())
    
    def do_OPTIONS(self):
        # Handle CORS preflight requests
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def process_analytics(self, views):
        """Process raw view data into analytics"""
        page_stats = {}
        unique_users = set()
        daily_stats = {}
        
        for view in views:
            page = view['page']
            
            # Initialize page stats if not exists
            if page not in page_stats:
                page_stats[page] = {
                    'totalViews': 0,
                    'uniqueUsers': set(),
                    'firstView': view['timestamp'],
                    'lastView': view['timestamp']
                }
            
            # Update page stats
            page_stats[page]['totalViews'] += 1
            page_stats[page]['uniqueUsers'].add(view['sessionId'])
            
            # Update first and last view timestamps
            current_first = datetime.fromisoformat(page_stats[page]['firstView'].replace('Z', '+00:00'))
            current_last = datetime.fromisoformat(page_stats[page]['lastView'].replace('Z', '+00:00'))
            view_time = datetime.fromisoformat(view['timestamp'].replace('Z', '+00:00'))
            
            if view_time < current_first:
                page_stats[page]['firstView'] = view['timestamp']
            if view_time > current_last:
                page_stats[page]['lastView'] = view['timestamp']
            
            # Track unique users globally
            unique_users.add(view['sessionId'])
            
            # Update daily stats
            date = view['date']
            if date not in daily_stats:
                daily_stats[date] = {'views': 0, 'users': set()}
            daily_stats[date]['views'] += 1
            daily_stats[date]['users'].add(view['sessionId'])
        
        # Format page stats for JSON serialization
        formatted_page_stats = {}
        for page, stats in page_stats.items():
            formatted_page_stats[page] = {
                'totalViews': stats['totalViews'],
                'uniqueUsers': len(stats['uniqueUsers']),
                'firstView': stats['firstView'],
                'lastView': stats['lastView']
            }
        
        # Format daily stats for JSON serialization
        formatted_daily_stats = {}
        for date, stats in daily_stats.items():
            formatted_daily_stats[date] = {
                'views': stats['views'],
                'uniqueUsers': len(stats['users'])
            }
        
        # Calculate totals
        total_views = len(views)
        total_unique_users = len(unique_users)
        total_pages = len(page_stats)
        
        return {
            'pages': formatted_page_stats,
            'dailyStats': formatted_daily_stats,
            'totals': {
                'totalViews': total_views,
                'totalUniqueUsers': total_unique_users,
                'totalPages': total_pages
            },
            'lastUpdated': datetime.now().isoformat()
        }
