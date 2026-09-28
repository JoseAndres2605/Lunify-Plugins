(function () {
  'use strict';

  // Evitar que el plugin se cargue más de una vez.
  if (window.__lunify_song_downloader) {
    return;
  }

  window.__lunify_song_downloader = true;

  /**
   * Crea el botón de descarga que aparecerá en la barra
   * de reproducción actual.
   */
  function createButton() {
    const btn = document.createElement('button');

    btn.id = 'sdl-btn';
    btn.className = 'icon-btn sdl-btn';
    btn.type = 'button';
    btn.title = 'Descargar canción';
    btn.setAttribute('aria-label', 'Descargar canción');

    btn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M19 9h-4V3H9v6H5l7 7 7-7zm-15 9v2h14v-2H4z"/>
      </svg>
    `;

    return btn;
  }

  /**
   * Obtiene la información de la canción que se está reproduciendo.
   */
  function getTrackData() {
    const bar = document.getElementById('now-playing-bar');

    if (!bar) {
      return null;
    }

    const url = bar.dataset.trackUrl;
    const title = bar.dataset.trackTitle || 'Canción';
    const artist = bar.dataset.trackArtist || 'Artista desconocido';

    if (!url) {
      return null;
    }

    return {
      url,
      title,
      artist
    };
  }

  /**
   * Cambia el estado visual del botón mientras se descarga
   * la canción.
   */
  function setLoading(btn, loading) {
    btn.disabled = loading;
    btn.classList.toggle('sdl-loading', loading);

    btn.title = loading
      ? 'Descargando canción...'
      : 'Descargar canción';

    btn.setAttribute(
      'aria-label',
      loading
        ? 'Descargando canción...'
        : 'Descargar canción'
    );

    btn.innerHTML = loading
      ? `
        <svg
          class="sdl-spinner"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
        </svg>
      `
      : `
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M19 9h-4V3H9v6H5l7 7 7-7zm-15 9v2h14v-2H4z"/>
        </svg>
      `;
  }

  /**
   * Muestra un mensaje utilizando el sistema de notificaciones
   * de Lunify si está disponible.
   */
  function showMessage(message) {
    const toast = document.getElementById('toast');

    if (toast) {
      toast.textContent = message;
      toast.classList.add('show');

      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);

      return;
    }

    console.log(`[Descargador de Canciones] ${message}`);
  }

  /**
   * Inicializa el plugin y añade el botón a la barra
   * de reproducción.
   */
  function init() {
    const npTrackInfo = document.querySelector('.np-track-info');

    if (!npTrackInfo) {
      console.warn(
        '[Descargador de Canciones] No se encontró la barra de reproducción.'
      );
      return;
    }

    // Evitar crear el botón más de una vez.
    if (document.getElementById('sdl-btn')) {
      return;
    }

    const btn = createButton();

    btn.addEventListener('click', async () => {
      if (btn.disabled) {
        return;
      }

      const track = getTrackData();

      if (!track) {
        showMessage('No hay ninguna canción disponible para descargar.');
        return;
      }

      // Verificar que el puente de Lunify esté disponible.
      if (
        !window.snowify ||
        typeof window.snowify.saveSong !== 'function'
      ) {
        console.error(
          '[Descargador de Canciones] La función de descarga no está disponible.'
        );

        showMessage('La descarga no está disponible en este momento.');
        return;
      }

      setLoading(btn, true);

      try {
        const result = await window.snowify.saveSong(
          track.url,
          track.title,
          track.artist
        );

        if (result?.error) {
          console.error(
            '[Descargador de Canciones] Error al guardar la canción:',
            result.error
          );

          showMessage('No se pudo descargar la canción.');
          return;
        }

        showMessage('Descarga iniciada correctamente.');
      } catch (error) {
        console.error(
          '[Descargador de Canciones] Error inesperado:',
          error
        );

        showMessage('Ocurrió un error durante la descarga.');
      } finally {
        setLoading(btn, false);
      }
    });

    // Colocar el botón después del botón de "Me gusta".
    const likeBtn = document.getElementById('np-like');

    if (likeBtn) {
      likeBtn.insertAdjacentElement('afterend', btn);
    } else {
      npTrackInfo.appendChild(btn);
    }

    console.log(
      '[Descargador de Canciones] Plugin inicializado correctamente.'
    );
  }

  // Esperar a que el DOM esté disponible.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
