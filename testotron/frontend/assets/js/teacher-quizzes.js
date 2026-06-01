// Only runs on the teacher quizzes page (checks for the action buttons)
document.addEventListener('DOMContentLoaded', () => {
  // Publish / close buttons (added dynamically if needed in the future)
  document.addEventListener('click', async (e) => {
    const publishBtn = e.target.closest('[data-action="publish"]');
    if (publishBtn) {
      const code = publishBtn.dataset.code;
      if (!confirm('¿Publicar cuestionario?')) return;
      const res = await fetch(`/api/tests/${code}/publish`, { method: 'POST' });
      if (res.ok) location.reload();
      else alert('No se pudo publicar');
    }

    const closeBtn = e.target.closest('[data-action="close"]');
    if (closeBtn) {
      const code = closeBtn.dataset.code;
      if (!confirm('¿Cerrar cuestionario? Los estudiantes no podrán seguir enviando respuestas.')) return;
      const res = await fetch(`/api/tests/${code}/close`, { method: 'POST' });
      if (res.ok) location.reload();
      else alert('No se pudo cerrar');
    }
  });
});
