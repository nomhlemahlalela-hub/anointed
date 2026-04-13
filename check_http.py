import urllib.request
url='http://localhost:8000'
resp=urllib.request.urlopen(url, timeout=5)
html=resp.read().decode('utf-8', errors='replace')
print('OK', len(html))
print('music id present:', 'id="music"' in html)
print(html[:500])
