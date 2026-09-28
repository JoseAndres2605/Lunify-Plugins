(function () {
  'use strict';

  if (window.__snowify_desktop_notifications) return;
  window.__snowify_desktop_notifications = true;

  function fireNotification(title, artist, iconSrc) {
    if (Notification.permission !== 'granted') return;
    const n = new Notification(title, {
      body: artist || '',
      icon: iconSrc || undefined,
      silent: true,
    });
    setTimeout(() => n.close(), 5000);
  }

  function init() {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const titleEl = document.getElementById('np-title');
    if (!titleEl) return;

    let lastTitle = '';

    const observer = new MutationObserver(() => {
      const title = titleEl.textContent.trim();
      if (!title || title === '—' || title === lastTitle) return;
      lastTitle = title;
      const artist = document.getElementById('np-artist')?.textContent.trim() || '';
      const thumb = document.getElementById('np-thumbnail')?.src || '';
      fireNotification(title, artist, thumb);
    });

    observer.observe(titleEl, { childList: true, subtree: true, characterData: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
