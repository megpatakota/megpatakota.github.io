import json
import os
import uuid
from datetime import datetime
from http.server import BaseHTTPRequestHandler
from urllib.parse import quote
from urllib.request import Request, urlopen

KV_URL = os.environ.get('KV_REST_API_URL')
KV_TOKEN = os.environ.get('KV_REST_API_TOKEN')

def kv_call(path):
    if not KV_URL or not KV_TOKEN:
        raise RuntimeError("KV not configured")
    req = Request(f"{KV_URL}{path}")
    req.add_header("Authorization", f"Bearer {KV_TOKEN}")
    with urlopen(req) as resp:
        return json.loads(resp.read().decode())

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_length = int(self.headers['Content-Length'])
            data = json.loads(self.rfile.read(content_length).decode('utf-8'))

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

            view = {
                'id': str(uuid.uuid4()),
                'page': page,
                'sessionId': session_id,
                'userAgent': user_agent,
                'ip': (self.headers.get('X-Forwarded-For', '') or self.headers.get('X-Real-IP', '') or 'unknown').split(',')[0].strip(),
                'timestamp': timestamp,
                'date': datetime.fromisoformat(timestamp.replace('Z', '+00:00')).strftime('%Y-%m-%d')
            }

            # Persist to KV: LPUSH + LTRIM to keep last 10k
            payload = quote(json.dumps(view))
            kv_call(f"/LPUSH/views/{payload}")
            kv_call("/LTRIM/views/0/9999")

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            self.wfile.write(json.dumps({'success': True, 'message': 'View tracked successfully', 'viewId': view['id']}).encode())

        except Exception as e:
            print(f"Error tracking view: {str(e)}")
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'Internal server error'}).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()