/* WANDER China 2026: offline shell and visited map tiles. */
const CACHE='wander-china-shell-v3';
const TILES='wander-china-tiles-v3';
const SHELL=['./Voyage-Chine-2026.html','./voyage-chine.webmanifest'];
self.addEventListener('install',event=>{event.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(SHELL);try{await cache.add('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js')}catch(e){}await self.skipWaiting()})())});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith('wander-china-')&&![CACHE,TILES].includes(k)).map(k=>caches.delete(k)));await self.clients.claim()})())});
self.addEventListener('fetch',event=>{const req=event.request;if(req.method!=='GET')return;const url=new URL(req.url);const shell=url.origin===self.location.origin&&url.pathname.endsWith('/Voyage-Chine-2026.html');if(shell){event.respondWith((async()=>{const cache=await caches.open(CACHE);try{const res=await fetch(req);if(res.ok)await cache.put(req,res.clone());return res}catch(e){return await cache.match('./Voyage-Chine-2026.html')||Response.error()}})());return}
if(url.hostname.endsWith('tile.openstreetmap.org')){event.respondWith((async()=>{const cache=await caches.open(TILES);const prev=await cache.match(req);if(prev)return prev;try{const res=await fetch(req);if(res.ok||res.type==='opaque'){await cache.put(req,res.clone());const keys=await cache.keys();if(keys.length>150)await cache.delete(keys[0])}return res}catch(e){return Response.error()}})());return}
if(url.hostname==='unpkg.com'&&url.pathname==='/leaflet@1.9.4/dist/leaflet.js'){event.respondWith((async()=>{const cache=await caches.open(CACHE);try{const res=await fetch(req);if(res.ok)await cache.put(req,res.clone());return res}catch(e){return await cache.match(req)||Response.error()}})());return}
});
