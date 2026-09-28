(function () {
  'use strict';

  // Evitar que el plugin se inicialice más de una vez.
  if (window.__lunify_desktop_notifications) {
    return;
  }

  window.__lunify_desktop_notifications = true;

  const NOTIFICATION_DURATION = 5000;

  /**
   * Muestra una notificación del sistema.
   */
  function mostrarNotificacion(titulo, artista, portada) {
    if (!('Notification' in window)) {
      console.warn('[Plugin] Las notificaciones no son compatibles con este sistema.');
      return;
    }

    if (Notification.permission !== 'granted') {
      return;
    }

    const notificacion = new Notification(titulo, {
      body: artista || 'Reproduciendo ahora',
      icon: portada || undefined,
      silent: true
    });

    setTimeout(() => {
      try {
        notificacion.close();
      } catch {
        // La notificación ya puede haberse cerrado.
      }
    }, NOTIFICATION_DURATION);
  }

  /**
   * Inicializa el sistema de notificaciones.
   */
  async function inicializar() {
    if (!('Notification' in window)) {
      console.warn('[Plugin] Este sistema no admite notificaciones de escritorio.');
      return;
    }

    // Solicitar permiso únicamente cuando todavía no se haya decidido.
    if (Notification.permission === 'default') {
      try {
        await Notification.requestPermission();
      } catch (error) {
        console.warn('[Plugin] No se pudo solicitar permiso para las notificaciones:', error);
      }
    }

    const tituloEl = document.getElementById('np-title');

    if (!tituloEl) {
      console.warn('[Plugin] No se encontró el elemento del título de la canción.');
      return;
    }

    let ultimaCancion = '';

    const observer = new MutationObserver(() => {
      const titulo = tituloEl.textContent?.trim() || '';

      // Ignorar estados vacíos o sin canción.
      if (!titulo || titulo === '—' || titulo === ultimaCancion) {
        return;
      }

      ultimaCancion = titulo;

      const artistaEl = document.getElementById('np-artist');
      const portadaEl = document.getElementById('np-thumbnail');

      const artista = artistaEl?.textContent?.trim() || '';
      const portada = portadaEl?.src || '';

      mostrarNotificacion(titulo, artista, portada);
    });

    observer.observe(tituloEl, {
      childList: true,
      subtree: true,
      characterData: true
    });

    console.log('[Plugin] Notificaciones de Escritorio inicializado correctamente.');
  }

  // Esperar a que la interfaz de Lunify esté lista.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializar, { once: true });
  } else {
    inicializar();
  }
})();
