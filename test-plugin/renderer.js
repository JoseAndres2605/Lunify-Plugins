// Hola Mundo — Plugin de prueba de Lunify
(function () {
  'use strict';

  const PLUGIN_NAME = 'Hola Mundo';
  const TOAST_DURATION = 3500;
  const STARTUP_DELAY = 1500;

  console.log(`[Plugin] ${PLUGIN_NAME} cargado correctamente.`);

  /**
   * Crea y muestra una notificación temporal.
   */
  function showToast(message, duration = TOAST_DURATION) {
    // Evitar múltiples notificaciones del mismo plugin.
    const existingToast = document.querySelector('.lunify-test-toast');
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement('div');

    toast.className = 'toast lunify-test-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.textContent = message;

    document.body.appendChild(toast);

    // Esperar un frame para activar la animación CSS.
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    const hideTimeout = setTimeout(() => {
      toast.classList.remove('show');

      // Esperar a que termine la animación antes de eliminarlo.
      setTimeout(() => {
        if (toast.isConnected) {
          toast.remove();
        }
      }, 400);
    }, duration);

    return {
      toast,
      hide: () => {
        clearTimeout(hideTimeout);

        toast.classList.remove('show');

        setTimeout(() => {
          if (toast.isConnected) {
            toast.remove();
          }
        }, 400);
      }
    };
  }

  /**
   * Ejecuta la demostración del plugin cuando Lunify
   * haya terminado de cargar.
   */
  function initialize() {
    console.log(`[Plugin] ${PLUGIN_NAME}: inicializando...`);

    showToast('👋 ¡Hola! El plugin de prueba está funcionando.');

    console.log(`[Plugin] ${PLUGIN_NAME}: listo.`);
  }

  // Esperar un momento para permitir que Lunify termine
  // de inicializar la interfaz principal.
  setTimeout(initialize, STARTUP_DELAY);
})();
