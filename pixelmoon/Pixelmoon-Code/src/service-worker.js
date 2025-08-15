// Basic service worker skeleton for offline caching
self.addEventListener('install', function(event){
  self.skipWaiting();
});
self.addEventListener('fetch', function(event){
  // fallback to network
});
