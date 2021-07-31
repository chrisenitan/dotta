var Vone = 'dotta1.10';
var urlts = [
'logo_m.png'
];
/* service worker bit only / updated Jan 19 2020*/  

self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open(Vone).then(function(cache) {
			console.log('App Files Cached');
			return cache.addAll(urlts);
		}));
});

self.addEventListener('activate', function(e){
	e.waitUntil(
		caches.keys().then(keyList => {
			return Promise.all(keyList.map(key => {
				if (key !== Vone){
					return caches.delete(key);
				}
			}));
		}));
});


			

