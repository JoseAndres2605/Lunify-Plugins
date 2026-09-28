// Hello World — Snowify Test Plugin
(function() {
  console.log('[Plugin] Hello World loaded!');

  // Show a toast after a short delay to let the app finish initializing
  setTimeout(() => {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = '👋 Hello from the Test Plugin!';
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  }, 2000);
})();
