if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then(registration => {
      console.log("Service Worker başarıyla kaydedildi.");
      checkCacheProgress();
    })
    .catch(err => {
      document.getElementById("status").textContent = "Service Worker kaydedilemedi.";
    });
}

function updateProgressBar(progress) {
  const progressBar = document.getElementById("progress-bar");
  const statusText = document.getElementById("status");
  progressBar.style.width = `${progress}%`;
  if (progress === 100) {
    statusText.textContent = "Yükleme tamamlandı!";
  } else {
    statusText.textContent = `Dosyalar yükleniyor... (${progress}%)`;
  }
}

function checkCacheProgress() {
  const urlsToCache = [
    "/",
    "/index.html",
    "/style.css",
    "/app.js",
    "/manifest.json",
    "/icon-192.png"
  ];

  let loaded = 0;
  const total = urlsToCache.length;
  const statusText = document.getElementById("status");

  caches.open("pwa-cache-v1").then(cache => {
    urlsToCache.forEach(url => {
      cache.match(url).then(response => {
        if (response) {
          loaded++;
          const progress = Math.round((loaded / total) * 100);
          updateProgressBar(progress);
        } else {
          statusText.textContent += `Hata: ${url} önbellekte bulunamadı.\n`;
        }
      }).catch(err => {
        statusText.textContent += `Hata: ${url} kontrol edilirken bir sorun oluştu.\n`;
      });
    });
  }).catch(err => {
    statusText.textContent = "Hata: Önbellek açılamadı.";
  });
}