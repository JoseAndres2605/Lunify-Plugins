(function () {
  'use strict';

  if (window.__snowify_song_downloader) return;
  window.__snowify_song_downloader = true;

  function createButton() {
    const btn = document.createElement('button');
    btn.id = 'sdl-btn';
    btn.className = 'icon-btn sdl-btn';
    btn.title = 'Download song';
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 9h-4V3H9v6H5l7 7 7-7zm-15 9v2h14v-2H4z"/>
    </svg>`;
    return btn;
  }

  function getTrackData() {
    const bar = document.getElementById('now-playing-bar');
    if (!bar) return null;
    const url = bar.dataset.trackUrl;
    const title = bar.dataset.trackTitle;
    const artist = bar.dataset.trackArtist;
    if (!url) return null;
    return { url, title, artist };
  }

  function setLoading(btn, loading) {
    btn.disabled = loading;
    btn.classList.toggle('sdl-loading', loading);
    btn.innerHTML = loading
      ? `<svg class="sdl-spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
           <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
         </svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
           <path d="M19 9h-4V3H9v6H5l7 7 7-7zm-15 9v2h14v-2H4z"/>
         </svg>`;
  }

  function init() {
    const npTrackInfo = document.querySelector('.np-track-info');
    if (!npTrackInfo) return;

    const btn = createButton();

    btn.addEventListener('click', async () => {
      const track = getTrackData();
      if (!track) return;

      setLoading(btn, true);
      try {
        const result = await window.snowify.saveSong(track.url, track.title, track.artist);
        if (result?.error) {
          console.error('[song-downloader] Save failed:', result.error);
        }
      } catch (e) {
        console.error('[song-downloader] Unexpected error:', e);
      } finally {
        setLoading(btn, false);
      }
    });
    
    const likeBtn = document.getElementById('np-like');
    if (likeBtn) {
      likeBtn.insertAdjacentElement('afterend', btn);
    } else {
      npTrackInfo.appendChild(btn);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
