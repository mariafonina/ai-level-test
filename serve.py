#!/usr/bin/env python3
"""Simple HTTPS server for TG Web App test."""
import http.server
import ssl
import os

PORT = 8443
DIR = os.path.dirname(os.path.abspath(__file__))
os.chdir(DIR)

handler = http.server.SimpleHTTPRequestHandler
httpd = http.server.HTTPServer(('0.0.0.0', PORT), handler)

# TG Web Apps require HTTPS - use self-signed for now
# For production, use proper cert
print(f"Serving on port {PORT}")
httpd.serve_forever()
