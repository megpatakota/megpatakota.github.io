import json
import os
import uuid
from datetime import datetime
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # Parse the request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            # Extract data from request
            page = data.get('page')
            session_id = data.get('sessionId')
            user_agent = data.get('userAgent', '')
            timestamp = data.get('timestamp', datetime.now().isoformat())
            
            if not page or not session_id:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Missing page or sessionId'}).encode())
                return
            
            # Generate unique view ID
            view_id = str(uuid.uuid4())
            
            # Get IP address
            ip = self.headers.get('X-Forwarded-For', '') or self.headers.get('X-Real-IP', '') or 'unknown'
            if ',' in ip:
                ip = ip.split(',')[0].strip()
            
            # Parse date
            date = datetime.fromisoformat(timestamp.replace('Z', '+00:00')).strftime('%Y-%m-%d')
            
            # Create new view record
            new_view = {
                'id': view_id,
                'page': page,
                'sessionId': session_id,
                'userAgent': user_agent,
                'ip': ip,
                'timestamp': timestamp,
                'date': date
            }
            
            # File path for storing data
            data_path = '/tmp/views.json'
            
            # Read existing views
            views = []
            if os.path.exists(data_path):
                try:
                    with open(data_path, 'r') as f:
                        views = json.load(f)
                except (json.JSONDecodeError, FileNotFoundError):
                    views = []
            
            # Add new view
            views.append(new_view)
            
            # Keep only the last 10,000 records
            if len(views) > 10000:
                views = views[-10000:]
            
            # Write back to file
            with open(data_path, 'w') as f:
                json.dump(views, f, indent=2)
            
            # Send success response
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            
            response = {
                'success': True,
                'message': 'View tracked successfully',
                'viewId': view_id
            }
            self.wfile.write(json.dumps(response).encode())
            
        except Exception as e:
            print(f"Error tracking view: {str(e)}")
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'Internal server error'}).encode())
    
    def do_OPTIONS(self):
        # Handle CORS preflight requests
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
