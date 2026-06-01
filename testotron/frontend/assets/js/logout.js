document.addEventListener('DOMContentLoaded', () => {
  const logoutForm = document.querySelector('form[action="/api/logout"]');
  if (!logoutForm) return;
  logoutForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      if (window.apiClient) {
        window.apiClient.clearToken && window.apiClient.clearToken();
      }
      await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    } catch (err) {
      // ignore
    }
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/auth/login';
  });
});
