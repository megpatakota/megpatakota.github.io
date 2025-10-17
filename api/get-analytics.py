import json
import os
from datetime import datetime
from http.server import BaseHTTPRequestHandler
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
    def do_GET(self):
        try:
            # Load last 10k views from KV
            try:
                res = kv_call("/LRANGE/views/0/9999")
                items = res.get('result', [])
                views = [json.loads(s) for s in items]
            except Exception:
                views = []

            analytics = self.process_analytics(views)

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
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def process_analytics(self, views):
        page_stats, unique_users, daily_stats = {}, set(), {}
        for view in views:
            page = view['page']
            if page not in page_stats:
                page_stats[page] = {
                    'totalViews': 0,
                    'uniqueUsers': set(),
                    'firstView': view['timestamp'],
                    'lastView': view['timestamp']
                }
            page_stats[page]['totalViews'] += 1
            page_stats[page]['uniqueUsers'].add(view['sessionId'])

            t0 = datetime.fromisoformat(page_stats[page]['firstView'].replace('Z', '+00:00'))
            t1 = datetime.fromisoformat(page_stats[page]['lastView'].replace('Z', '+00:00'))
            vt = datetime.fromisoformat(view['timestamp'].replace('Z', '+00:00'))
            if vt < t0:
                page_stats[page]['firstView'] = view['timestamp']
            if vt > t1:
                page_stats[page]['lastView'] = view['timestamp']

            unique_users.add(view['sessionId'])

            date = view['date']
            if date not in daily_stats:
                daily_stats[date] = {'views': 0, 'users': set()}
            daily_stats[date]['views'] += 1
            daily_stats[date]['users'].add(view['sessionId'])

        formatted_page_stats = {
            p: {
                'totalViews': s['totalViews'],
                'uniqueUsers': len(s['uniqueUsers']),
                'firstView': s['firstView'],
                'lastView': s['lastView']
            }
            for p, s in page_stats.items()
        }
        formatted_daily_stats = {
            d: { 'views': s['views'], 'uniqueUsers': len(s['users']) }
            for d, s in daily_stats.items()
        }
        return {
            'pages': formatted_page_stats,
            'dailyStats': formatted_daily_stats,
            'totals': {
                'totalViews': len(views),
                'totalUniqueUsers': len(unique_users),
                'totalPages': len(page_stats)
            },
            'lastUpdated': datetime.now().isoformat()
        }